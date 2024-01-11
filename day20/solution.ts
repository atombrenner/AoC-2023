type Pulse = 0 | 1

const low: Pulse = 0
const high: Pulse = 1
interface PulseSent {
  pulse: Pulse
  from: Module
  to: Module
}

abstract class Module {
  readonly name: string
  readonly outputs: Module[] = []
  readonly inputs: Module[] = []

  constructor(name: string) {
    this.name = name
  }
  addOutput(output: Module) {
    this.outputs.push(output)
  }

  addInput(input: Module) {
    this.inputs.push(input)
  }

  init() {
    Object.freeze(this.inputs)
    Object.freeze(this.outputs)
  }

  abstract onPulse(pulse: PulseSent): PulseSent[]

  protected checkPulse({ from, to, pulse }: PulseSent) {
    // console.log(`${from.name} ${pulse ? 'high' : 'low'}-> ${to.name}`)
    if (to !== this) throw Error('invalid pulse sent')
  }

  toString() {
    const fmt = (modules: Module[]) => modules.map(({ name }) => name).join(', ')
    return `${this.name}: (${fmt(this.inputs.toSorted())}) -> (${fmt(this.outputs)})`
  }
}

class FlipFlop extends Module {
  private on: Pulse = low
  init() {
    super.init()
    this.on = low
  }
  onPulse(pulse: PulseSent) {
    this.checkPulse(pulse)
    if (pulse.pulse === high) return []
    this.on ^= 1
    return this.outputs.map((to) => ({ from: this, to, pulse: this.on }))
  }
}

class Conjunction extends Module {
  private readonly lastPulse: Map<Module, Pulse> = new Map()
  init() {
    super.init()
    for (const input of this.inputs) {
      this.lastPulse.set(input, low)
    }
  }
  onPulse(pulse: PulseSent) {
    this.checkPulse(pulse)
    this.lastPulse.set(pulse.from, pulse.pulse)
    const nextPulse = Array.from(this.lastPulse.values()).every((pulse) => pulse === high)
      ? low
      : high
    return this.outputs.map((to) => ({ from: this, to, pulse: nextPulse }))
  }
}

class Broadcaster extends Module {
  onPulse(pulse: PulseSent) {
    this.checkPulse(pulse)
    return this.outputs.map((to) => ({ pulse: pulse.pulse, from: this, to }))
  }
}

class Button extends Module {
  onPulse(pulse: PulseSent): never {
    this.checkPulse(pulse)
    throw Error('button cannot receive a pulse')
  }
}

class Output extends Module {
  onPulse(pulse: PulseSent) {
    this.checkPulse(pulse)
    //console.log(`${this.name} received ${pulse.pulse ? 'high' : 'low'}`)
    return []
  }
}

export function parseInput(input: string) {
  const lines = input.split('\n')
  const modules: Record<string, Module> = {
    button: new Button('button'), // for starting the machinery
  }
  const moduleWithDestinations: [Module, string][] = []
  for (const line of lines) {
    const [module, destinations] = line.split(' -> ')
    const instance = makeModule(module)
    modules[instance.name] = instance
    moduleWithDestinations.push([instance, destinations])
  }
  moduleWithDestinations.push([modules['button'], 'broadcaster'])
  for (const [module, destinations] of moduleWithDestinations) {
    for (const output of destinations
      .split(', ')
      .map((name) => modules[name] ?? new Output(name))) {
      if (!output) throw Error(`undefined module in ${destinations}`)
      module.addOutput(output)
      output.addInput(module)
    }
  }
  for (const module of Object.values(modules)) {
    module.init()
  }
  return modules
}

function makeModule(module: string): Module {
  if (module === 'broadcaster') return new Broadcaster(module)
  if (module.startsWith('%')) return new FlipFlop(module.substring(1))
  if (module.startsWith('&')) return new Conjunction(module.substring(1))
  throw Error('unknown module type')
}

export function pushButton(modules: Record<string, Module>) {
  const buttonPulse = { pulse: low, from: modules.button, to: modules.broadcaster }
  const pulses: PulseSent[] = [buttonPulse]

  const count = [0, 0]
  for (let pulse; (pulse = pulses.shift()); ) {
    count[pulse.pulse] += 1
    pulses.push(...pulse.to.onPulse(pulse))
  }
  return count
}
