const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const port = process.env.PORT || 4001;
const publicPath = `http://localhost:${port}/`;

exports = module.exports = {
    module: {
        rules: [
            {
                test: /\.md$/,
                use: [
                    // {loader: 'raw-loader'},
                    {loader: 'san-md-loader'}
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },

    resolve: {
        extensions: ['.jsx', '.js', '.json']
    },

    resolveLoader: {
        modules: [
            'node_modules',
            path.resolve(__dirname, './dist')
        ]
    },

    devtool: 'source-map',

    entry: {
        startup: [
            `webpack-dev-server/client?http://localhost:${port}/`,
            path.resolve(__dirname, './public/startup.js')
        ]
    },

    output: {
        filename: '[name].js',
        libraryTarget: 'umd',
        publicPath
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './public/index.html')
        })
    ],

    devServer: {
        port,
        publicPath,
        noInfo: true,
        stats: 'errors-only',
        inline: true,
        hot: true,
        contentBase: path.join(process.cwd()),
        watchOptions: {
            aggregateTimeout: 300,
            ignored: /node_modules/,
            poll: 100
        }
    }
};
