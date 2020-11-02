import babel from "rollup-plugin-babel";
import serve from "rollup-plugin-serve";
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';

export default {
    input: './src/main.js',
    output: {
        file: 'dist/zcamera/index.js',
        name: 'ZCamera',
        format: 'umd',
        sourcemap: true,
        minify: false
    },
    plugins: [
        json(),
        babel({
            exclude: 'node_modules/**'
        }),
        serve({
            open: true,
            openPage: '/public/index.html',
            port: 3000,
            contentBase: ''
        }),
        replace({
            ENVIRONMENT: JSON.stringify('development')
        })
    ]
}
