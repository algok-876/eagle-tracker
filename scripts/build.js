/* eslint-disable semi */
import minimist from 'minimist'
import { existsSync, rmSync } from 'node:fs'
import path from 'node:path'
import { execa } from 'execa'

const args = minimist(process.argv.slice(2))
// 需要打包的package
const targets = args._

async function build (target) {
  const pkgDir = path.resolve(`packages/${target}`)
  // 删除dist目录
  if (existsSync(`${pkgDir}/dist`)) {
    rmSync(`${pkgDir}/dist`, {
      recursive: true,
    })
  }
  await execa('rollup', [
    '-c',
    '--environment',
    `TARGET:${target}`,
  ], { stdio: 'inherit' })
}

function buildAll () {
  const resolvedTargets = targets.length === 0
    ? ['utils', 'web-sdk', 'vue3'] : targets
  resolvedTargets.forEach(async (name) => {
    await build(name)
  })
}

buildAll()
