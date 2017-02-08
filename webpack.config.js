var path = require('path')
var webpack = require('webpack')
var ROOT = path.resolve(__dirname)
var glob = require('glob');
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var extractCSS = new ExtractTextPlugin('css/[name].css')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CleanPlugin = require('clean-webpack-plugin') //webpack插件，用于清除目录文件

var pages = getEntry('./src/pages/**/*.html');
var entries = getEntry('./src/pages/**/*.js');
var chunks = Object.keys(entries);

module.exports = {
    entry: entries,
    output: {
        path: ROOT + "/dist",
        filename: "js/[name].js",
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: extractCSS.extract("style-loader", "css-loader")
        }, {
            test: /\.html$/,
            loader: "html?attrs=img:src img:data-src"
        },{
            test: /\.(png|jpe?g|gif)$/,
            loader: 'url?limit=8192&name=images/[hash:8].[ext]'
        }]
    },
    resolve: {
        //设置require或import的时候可以不需要带后缀
        extensions: ['', '.js', '.css'],
        alias: {
            common: "../../common",
            vue: 'vue/dist/vue.min',
            jquery: 'jquery/dist/jquery.min'
        }
    },
    plugins: [
        extractCSS,
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            chunks: chunks,
            minChunks: chunks.length
        }),
        new webpack.ProvidePlugin({ //加载公共插件
            $: 'jquery',
            jQuery: "jquery",
            "window.jQuery": "jquery",
            Vue: 'vue',
            axios: 'axios'
        })
    ]
}
for (var basename in pages) {
    // 配置生成的html文件，定义路径等
    var conf = {
        filename: basename + '.html',
        template: pages[basename], // 模板路径
        inject: true, // js插入位置
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        chunksSortMode: 'dependency'
    };

    if (basename in module.exports.entry) {
        conf.chunks = ['vendor', basename];
        conf.hash = true;
    }

    module.exports.plugins.push(new HtmlWebpackPlugin(conf));
}

if (process.env.NODE_ENV === 'production') {
    //    生产环境
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new CleanPlugin(['./dist'])
  ])
}

function getEntry(globPath) {
    var entries = {},
        basename, tmp, pathname;

    glob.sync(globPath).forEach(function (entry) {
        basename = path.basename(entry, path.extname(entry));
        tmp = entry.split('/').splice(-3);
        //        pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出js和html的路径
        entries[basename] = entry;
    });
    return entries;
}