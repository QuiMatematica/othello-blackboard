import path from 'path';
import { fileURLToPath } from 'url';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import {WebpackManifestPlugin} from 'webpack-manifest-plugin';
import TerserPlugin from 'terser-webpack-plugin';

//const isProduction = argv.mode === 'production';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {

    entry: './src/js/othello.js',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/othello.[contenthash].js',
        clean: true
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
                { from: 'src/.htaccess', to: '.htaccess', toType: 'file' },  // 👈 aggiunto toType
                {from: 'src/index.php', to: 'index.php'},
                {from: 'src/manifest.json', to: 'manifest.json'},
                {from: 'src/offline.html', to: 'offline.html'},
                {from: 'src/service-worker.js', to: 'service-worker.js'},
                {from: 'src/coi-serviceworker.js', to: 'coi-serviceworker.js'},
                {from: 'src/sensei.js', to: 'sensei.js'},
                {from: 'src/sensei_api.js', to: 'sensei_api.js'},
                {from: 'src/sensei_wasm_generated.data', to: 'sensei_wasm_generated.data'},
                {from: 'src/sensei_wasm_generated.js', to: 'sensei_wasm_generated.js'},
                {from: 'src/sensei_wasm_generated.wasm', to: 'sensei_wasm_generated.wasm'},
                {from: 'src/icons', to: 'icons/.'},
                {from: 'src/images', to: 'images/.'},
            ]
        }),
        new WebpackManifestPlugin({
            fileName: 'assets.php',   // 👈 generiamo un PHP
            publicPath: null,          // 👈 IMPORTANTISSIMO
            serialize: manifest => manifest,  // 👈 evita JSON.stringify

            generate(seed, files) {
                const manifest = files.reduce((acc, file) => {
                    // prendiamo solo i bundle iniziali JS
                    if (file.isInitial && file.path.endsWith('.js')) {
                        acc[file.name] = file.path;
                    }
                    if (file.isInitial && file.path.endsWith('.css')) {
                        acc[file.name] = file.path;
                    }
                    return acc;
                }, {});

                // convertiamo in sintassi PHP
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