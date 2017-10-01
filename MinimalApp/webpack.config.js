"use strict"
{
    // Требуется для формирования полного output пути
    let path = require('path');

    // Плагин для очистки выходной папки (bundle) перед созданием новой
    const CleanWebpackPlugin = require('clean-webpack-plugin');

    // Путь к выходной папке
    const bundleFolder = "wwwroot/bundle/";

    module.exports = {
        // Точка входа в приложение
        entry: "./Scripts/main.jsx",

        // Выходной файл
        output: {
            filename: 'script.js',
            path: path.resolve(__dirname, bundleFolder)
        },
        module: {
            rules: [
                {
                    test: /\.ts?$/,
                    loader: "ts-loader",
                    exclude: /node_modules/,
                },
                {
                    test: /\.jsx?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        presets: ['es2015', "react"]
                    }
                }
            ]
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js", ".jsx",".css"]
        },
        plugins: [
            new CleanWebpackPlugin([bundleFolder])
        ],
        // Включаем генерацию отладочной информации внутри выходного файла
        // (Нужно для работы отладки клиентских скриптов)
        devtool: "inline-source-map"
    };
}