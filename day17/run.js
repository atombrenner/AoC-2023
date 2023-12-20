"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
// - find a path with minimal heat loss
var lines = (0, fs_1.readFileSync)('day17/input.txt', 'utf-8').split('\n');
var heatmap = lines.map(function (line) { return line.split('').map(Number); });
var height = heatmap.length;
var width = heatmap[0].length;
var maxMomentum = 3;
// instead of preparing all tiles in advance, we have
// a list of tiles filled during discovery
// and remove them once they are visited
// with the additional steps info it could be that an array of tiles gets to large,
// like width * height * 3 * 4  which would be actualy ok  as it grows only by a factor of 7
// I believe some tiles are never visited => not true, only a minimal number (2) is not visited in normal case
// The number of unvisited tiles is roughly constant and much smaller than then all tiles
// the tile with the smallest heatloss will always be removed
// => list of unvisited tiles with heatloss < Infinity (= touched)
// => list is always sorted (either binary search for optimal insert or just sort the array)
// => smallest heat loss is last, so we can efficiently pop() the last element
// => finding an element for updating can be done by the gobal tiles map (same instance, but two indices)
var tiles = new Map();
var getTileKey = function (tile) { return [tile.x, tile.y, tile.dir, tile.momentum].join(','); };
var getTileInfo = function (tile) {
    var key = getTileKey(tile);
    var info = tiles.get(key);
    if (!info) {
        info = { addr: tile, heatloss: Infinity, visited: false };
        tiles.set(key, info);
    }
    return info;
};
var smallestUnvisited = [];
function findUnvisitedTileWithSmallestHeatloss() {
    var heatloss = Infinity;
    var smallestTile = undefined;
    for (var _i = 0, _a = tiles.values(); _i < _a.length; _i++) {
        var info = _a[_i];
        if (!info.visited && info.heatloss < heatloss) {
            heatloss = info.heatloss;
            smallestTile = info;
        }
    }
    return smallestTile;
}
var newTileAddr = function (x, y, dir, oldDir, momentum) { return ({ x: x, y: y, momentum: dir === oldDir ? momentum + 1 : 1, dir: dir }); };
function getNeighbours(_a) {
    var x = _a.x, y = _a.y, momentum = _a.momentum, dir = _a.dir;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(x > 0 && dir !== 'right' && !(dir === 'left' && momentum === 3))) return [3 /*break*/, 2];
                return [4 /*yield*/, newTileAddr(x - 1, y, 'left', dir, momentum)];
            case 1:
                _b.sent();
                _b.label = 2;
            case 2:
                if (!(x < width - 1 && dir !== 'left' && !(dir === 'right' && momentum === 3))) return [3 /*break*/, 4];
                return [4 /*yield*/, newTileAddr(x + 1, y, 'right', dir, momentum)];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                if (!(y > 0 && dir !== 'down' && !(dir === 'up' && momentum === 3))) return [3 /*break*/, 6];
                return [4 /*yield*/, newTileAddr(x, y - 1, 'up', dir, momentum)];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6:
                if (!(y < height - 1 && dir !== 'up' && !(dir === 'down' && momentum === 3))) return [3 /*break*/, 8];
                return [4 /*yield*/, newTileAddr(x, y + 1, 'down', dir, momentum)];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}
function findPath() {
    var stopX = width - 1;
    var stopY = height - 1;
    var start = getTileInfo({ x: 0, y: 0, dir: 'right', momentum: 0 });
    start.heatloss = 0;
    smallestUnvisited.push(start);
    while (true) {
        smallestUnvisited.sort(function (a, b) { return b.heatloss - a.heatloss; });
        var current = smallestUnvisited.pop();
        if (!current)
            return;
        current.visited = true;
        if (current.addr.x === stopX && current.addr.y === stopY)
            return current;
        if (tiles.size % 1000 === 0) {
            console.log(tiles.size);
        }
        for (var _i = 0, _a = getNeighbours(current.addr); _i < _a.length; _i++) {
            var addr = _a[_i];
            var neighbour = getTileInfo(addr);
            if (neighbour.visited)
                continue;
            var heatloss = current.heatloss + heatmap[addr.y][addr.x];
            if (heatloss < neighbour.heatloss) {
                if (neighbour.heatloss === Infinity) {
                    // move to list of potential next tiles
                    smallestUnvisited.push(neighbour);
                }
                neighbour.heatloss = heatloss;
                neighbour.previous = current;
            }
        }
    }
}
function backtracePath(endTile) {
    var tile = endTile;
    while (tile) {
        heatmap[tile.addr.y][tile.addr.x] = 0;
        tile = tile.previous;
    }
}
console.profile();
var found = findPath();
console.profileEnd();
if (!found)
    throw new Error('no path found');
backtracePath(found);
heatmap.forEach(function (row) { return console.log(row.join('')); });
console.log('minimum heatloss', found.heatloss);
