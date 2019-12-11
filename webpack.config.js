const path = require('path');
const mdContainer = require('markdown-it-container');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const port = process.env.PORT || 4001;
const publicPath = `http://localhost:${port}/`;

exports = module.exports = {
    module: {
        rules: [
            {
                test: /\.md$/,
                use: [
                    {
                        loader: 'san-md-loader',
                        options: {
                            plugins: [
                                [mdContainer, 'demo', {
                                    validate: params => /^demo\s+(.*)$/.test(params.trim()),
                                    render: (tokens, idx) => {
                                        var m = tokens[idx].info.trim().match(/^demo\s+(.*)$/);
                                        if (tokens[idx].nesting === 1) {
                                            // opening tag
                                            return `<details><summary>${m[1]}</summary>\n`;
                                        } else {
                                            // closing tag
                                            return '</details>\n';
                                        }
                                    }
                                }]
                            ]
                        }
                    }
                ]
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
