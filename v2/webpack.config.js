import path from "path";
import { fileURLToPath } from "url";

import {EsbuildPlugin} from 'esbuild-loader'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    entry: './assets/js/pokelink.js',
    mode: 'production',
    devtool: false,
    experiments: {
        futureDefaults: true,
        outputModule: true,
    },
    output: {
        path: path.resolve(__dirname, 'assets/dist'),
        filename: 'pokelink.js',
        library: {
            type: 'module'
        },
        libraryTarget: 'module',
        module: true,
        chunkFormat: 'module'
    },
    optimization: {
        minimizer: [new EsbuildPlugin({
            keepNames: true,
        })]
    }
}