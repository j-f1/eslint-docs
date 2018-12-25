import { parse } from './flags'

const checkArgs = (args: string[]) => expect(parse(args)).toMatchSnapshot()
const dropArgs = (parsed: ReturnType<typeof parse>) => {
  delete parsed.args
  return parsed
}

describe('parse()', () => {
  it('returns the full object', () => {
    checkArgs([])
  })

  it('supports `check`', () => {
    checkArgs(['check'])
  })

  it('supports --ext .foo', () => {
    checkArgs(['--ext', '.ts'])
  })
  it('supports --ext=.foo', () => {
    checkArgs(['--ext=.ts'])
  })

  it('supports --ext foo', () => {
    checkArgs(['--ext', 'ts'])
  })
  it('supports --ext=foo', () => {
    checkArgs(['--ext=ts'])
  })

  it('supports both --ext and check', () => {
    checkArgs(['--ext', 'js', 'check'])
    expect(dropArgs(parse(['--ext', 'js', 'check']))).toEqual(
      dropArgs(parse(['check', '--ext', 'js']))
    )
  })
  it('supports both --ext=foo and check', () => {
    checkArgs(['--ext=js', 'check'])
    expect(dropArgs(parse(['--ext=js', 'check']))).toEqual(
      dropArgs(parse(['check', '--ext=js']))
    )
  })

  it('ignores --ext at the end of the args', () => {
    checkArgs(['--ext'])
    checkArgs(['check', '--ext'])
  })

  it('supports --no-diffs', () => {
    checkArgs(['--no-diffs'])
  })
})
