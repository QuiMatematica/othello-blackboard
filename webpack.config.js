const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {

    const isProduction = argv.mode === 'production';

    return {
        entry: './src/board.js',

        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'board.js',
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
                    {from: 'src/board.php', to: 'board.php'}
                ]
            })
        ],

        devtool: isProduction ? false : 'source-map',

        mode: isProduction ? 'production' : 'development',
    };
};