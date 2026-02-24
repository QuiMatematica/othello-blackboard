import path from 'path';
import { fileURLToPath } from 'url';
import CopyPlugin from 'copy-webpack-plugin';
import {WebpackManifestPlugin} from 'webpack-manifest-plugin';

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
                use: ['style-loader', 'css-loader'],
            },
        ],
    },

    plugins: [
        new CopyPlugin({
            patterns: [
                {from: 'src/index.php', to: 'index.php'},
                {from: 'src/manifest.json', to: 'manifest.json'},
                {from: 'src/offline.html', to: 'offline.html'},
                {from: 'src/service-worker.js', to: 'service-worker.js'},
                {from: 'src/css', to: 'css/.'},
                {from: 'src/icons', to: 'icons/.'},
                {from: 'src/images', to: 'images/.'}
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