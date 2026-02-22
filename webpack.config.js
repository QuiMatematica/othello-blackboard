const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {

    const isProduction = argv.mode === 'production';

    return {
        entry: './src/js/othello.js',

        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'js/othello.js',
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
                    {from: 'src/css', to: 'css/.' },
                    {from: 'src/icons', to: 'icons/.' },
                    {from: 'src/images', to: 'images/.' }
                ]
            })
        ],

        devtool: isProduction ? false : 'source-map',

        mode: isProduction ? 'production' : 'development',
    };
};