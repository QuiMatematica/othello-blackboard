import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { fileURLToPath } from 'url';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import TerserPlugin from 'terser-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hash calcolato una volta sola: usato sia nel nome del .wasm
// sia per aggiornare il riferimento dentro il .js generato da Emscripten.
const wasmContent = fs.readFileSync(path.resolve(__dirname, 'src/sensei_wasm_generated.wasm'));
const wasmHash = crypto.createHash('md5').update(wasmContent).digest('hex');
const wasmHashedName = `sensei_wasm_generated.${wasmHash}.wasm`;

export default {

    entry: './src/js/othello.js',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'othello.[contenthash].js',
        clean: true,
        // 👇 necessario per externalsType: 'module'
        library: {
            type: 'module',
        },
    },

    // 👇 dice a webpack di non bundlare sensei_wasm_generated.js
    //    e di lasciare l'import così com'è nell'output
    externals: {
        './sensei_wasm_generated.js': './sensei_wasm_generated.js',
    },

    externalsType: 'module',

    // 👇 necessario per emettere un bundle in formato ESM
    experiments: {
        outputModule: true,
    },

    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },

    optimization: {
        minimizer: [
            new TerserPlugin({
                exclude: /sensei_wasm_generated\.js/,
            }),
        ],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/othello.[contenthash].css'
        }),
        new CopyPlugin({
            patterns: [
                { from: 'src/.htaccess', to: '.htaccess', toType: 'file' },
                { from: 'src/index.php', to: 'index.php' },
                { from: 'src/manifest.json', to: 'manifest.json' },
                { from: 'src/offline.html', to: 'offline.html' },
                { from: 'src/service-worker.js', to: 'service-worker.js' },
                { from: 'src/coi-serviceworker.js', to: 'coi-serviceworker.js' },
                { from: 'src/sensei_api.js', to: 'sensei_api.js' },
                { from: 'src/sensei_wasm_generated.data', to: 'sensei_wasm_generated.data' },
                {
                    // 👇 Riscrive nel .js il riferimento al .wasm con il nome hashato,
                    //    usando lo stesso hash calcolato sopra.
                    from: 'src/sensei_wasm_generated.js',
                    to: 'sensei_wasm_generated.js',
                    transform(content) {
                        return content.toString().replaceAll('sensei_wasm_generated.wasm', wasmHashedName);
                    },
                },
                {
                    // 👇 Copia il .wasm con lo stesso nome hashato usato nel .js.
                    from: 'src/sensei_wasm_generated.wasm',
                    to: wasmHashedName,
                },
                { from: 'src/icons', to: 'icons/.' },
                { from: 'src/images', to: 'images/.' },
            ]
        }),
        new WebpackManifestPlugin({
            fileName: 'assets.php',
            publicPath: null,
            serialize: manifest => manifest,
            generate(seed, files) {
                const manifest = files.reduce((acc, file) => {
                    if (file.isInitial && file.path.endsWith('.js')) acc[file.name] = file.path;
                    if (file.isInitial && file.path.endsWith('.css')) acc[file.name] = file.path;
                    return acc;
                }, {});
                const phpArray = Object.entries(manifest)
                    .map(([key, value]) => `    '${key}' => '${value}',`)
                    .join('\n');
                return `<?php return [${phpArray}];`;
            }
        })
    ],

    devtool: false,
    mode: 'production',

};
