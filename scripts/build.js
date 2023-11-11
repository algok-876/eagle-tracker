/* eslint-disable */
import minimist from 'minimist'
import { existsSync, rmSync } from 'node:fs'
import path from 'node:path'
import { execa } from 'execa'

const args = minimist(process.argv.slice(2))
// 需要打包的package
const targets = args._.length === 0 ? ['utils', 'web-sdk', 'vue3'] : args._

// 获取watch选项配置
function getWatchOptions (args) {
  // 是否在bundle发生变化时重新构建
  const isWatch = Boolean(args.watch)

  // 重新构建的延迟
  const watchBuildDelay = args.buildDelay

  const watchOptions = []

  if (isWatch) {
    watchOptions.push('--watch')
    if (watchBuildDelay) {
      watchOptions.push(...['--watch.buildDelay', watchBuildDelay, '--watch.exclude', './packages/**/node_modules/**'])
    }
  }
  return watchOptions
}

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
    ...getWatchOptions(args),
    '--environment',
    `TARGET:${target}`,
  ], { stdio: 'inherit' })
}

async function buildAll () {
  for (let target of targets) {
    await build(target)
  }
}

buildAll()
