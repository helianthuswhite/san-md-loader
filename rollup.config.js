// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import autoExternal from 'rollup-plugin-auto-external';
import {eslint} from 'rollup-plugin-eslint';
import path from 'path';

export default {
    input: 'index.js',
    output: {
        file: path.resolve(__dirname, './dist/san-md-loader.js'),
        format: 'commonjs',
        name: 'san-md-loader'
    },
    plugins: [
        resolve(),
        commonjs(),
        autoExternal(),
        eslint({
            exclude: 'node_modules/**'
        }),
        babel({
            exclude: 'node_modules/**' // 只编译我们的源代码
        })
    ]
};
