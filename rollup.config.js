/* eslint-disable semi */
import path from 'node:path'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

const target = process.env.TARGET

const esbuildMinifer = (options) => {
  const { renderChunk } = esbuild(options)
  return { name: 'esbuild-minifer', renderChunk }
}
const esbuildPlugin = esbuild({ target: 'esnext' })

const iifeName = {
  'web-sdk': 'EagleTracker',
  utils: 'EagleTrackerUtils',
  vue3: 'EagleTrackerVue3',
}

const iifeGlobals = {
  '@eagle-tracker/core': 'EagleTracker',
  '@eagle-tracker/utils': 'EagleTrackerUtils',
}

//
const externals = ['@eagle-tracker/utils', '@eagle-tracker/core']

function createConfig (target) {
  const packageRoot = path.resolve(`packages/${target}`)
  const input = `${packageRoot}/index.ts`
  const output = [
    {
      file: `${packageRoot}/dist/index.mjs`,
      format: 'es',
    },
    {
      file: `${packageRoot}/dist/index.cjs`,
      format: 'cjs',
    },
  ]

  const config = [{
    // 打包cjs和mjs
    input,
    output,
    plugins: [
      commonjs(),
      nodeResolve(),
      json(),
      esbuildPlugin,
    ],
    external: [...externals],
  }, {
    // 打包iife格式
    input,
    output: [
      {
        file: `${packageRoot}/dist/index.iife.js`,
        format: 'iife',
        name: iifeName[target],
        extend: true,
        globals: iifeGlobals,
      },
      {
        file: `${packageRoot}/dist/index.iife.min.js`,
        format: 'iife',
        name: iifeName[target],
        extend: true,
        globals: iifeGlobals,
        plugins: [esbuildMinifer({ minify: true })],
      },
    ],
    plugins: [
      commonjs(),
      nodeResolve(),
      json(),
      esbuildPlugin,
    ],
  }, {
    // 打包声明文件
    input,
    output: {
      file: `${packageRoot}/dist/index.d.ts`,
      format: 'es',
    },
    plugins: [dts()],
  }]

  return config
}

export default createConfig(target)
