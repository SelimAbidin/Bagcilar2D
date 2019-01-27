const {join} = require('path')

module.exports = {
    mode:'development',
    entry: {
        Bagcilar:'./src/js/Bagcilar2D.js'
    },
    
    output: {
        libraryTarget: 'umd',
        path: join(__dirname, 'build'),
        library: "Bagcilar",
        filename: 'bagcilar.js'
    },

    devServer: {
        contentBase: __dirname,
        publicPath:'/build/',
        compress: true,
        port: 6080
    }
}