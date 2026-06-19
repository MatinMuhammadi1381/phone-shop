import { spawn } from 'node:child_process'
import { openSync } from 'node:fs'
import { writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const out = openSync(join(tmpdir(), 'phone-shop-dev.out.log'), 'a')
const err = openSync(join(tmpdir(), 'phone-shop-dev.err.log'), 'a')

const child = spawn(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'dev'],
  {
    cwd: 'C:\\Users\\localuser\\Desktop\\new\\phone-shop',
    detached: true,
    stdio: ['ignore', out, err],
  }
)

child.unref()
writeFileSync(join(tmpdir(), 'phone-shop-dev.pid'), String(child.pid ?? ''))
