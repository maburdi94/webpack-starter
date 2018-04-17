'use strict';

import webpack from 'webpack';
import path from 'path';

import HappyPack from 'happypack';
const THREAD_POOL = HappyPack.ThreadPool({ size: 5 });

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';

import ExtractTextPlugin from 'extract-text-webpack-plugin';
const extractCSS = new ExtractTextPlugin('stylesheets/styles.css');



const config: webpack.Configuration = {
    context: __dirname,
    mode: process.env.NODE_ENV,
    entry: {
        polyfills: './app/polyfills.ts',
        main: './app/index.ts'
    },
    cache: true,
    output: {
        filename: 'js/[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [


            // sources
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'happypack/loader?id=ts'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'happypack/loader?id=js'
            },



            // templates
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    minimize: true
                }
            },



            // assets
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: extractCSS.extract({
                    fallback: 'style-loader',
                    use: 'happypack/loader?id=css'
                })
            }
        ]
    },
    devServer: {
        contentBase: './dist'
   },
    resolve: {
        extensions: [ '.ts', '.js' ]
    },
    optimization: {
      minimize: true
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HappyPack({
            id: 'js',
            threadPool: THREAD_POOL,
            loaders: [
                'babel-loader'
            ]
        }),
        new HappyPack({
            id: 'css',
            threadPool: THREAD_POOL,
            loaders: [
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1,
                    }
                },
                'postcss-loader'
            ]
        }),
        new HappyPack({
            id: 'ts',
            threadPool: THREAD_POOL,
            loaders: [
                'babel-loader',
                {
                    loader: 'ts-loader',
                    options: {
                        happyPackMode: true
                    }
                }
            ]
        }),
        new ForkTsCheckerWebpackPlugin({
            checkSyntacticErrors: true
        }),
        extractCSS,
        new HtmlWebpackPlugin({
            title: "My Portfolio",
            template: './app/index.html',
            chunksSortMode: 'manual',
            chunks: [
                'polyfills',
                'main'
            ],
            meta: {
                viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
            }
        })
    ]
};

export default config;