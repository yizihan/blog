const axios = require('axios')
const path = require('path')
const webpack = require('webpack')
const proxy = require('http-proxy-middleware')
const MemoryFs = require('memory-fs')
const ReactDomServer = require('react-dom/server')
const serverConfig = require('../../build/webpack.config.server.js')

// 在开发环境下，webpack把文件放在内存中，
// 通过发起请求读取template
const getTemplate = function () {
	return new Promise((resolve, reject) => {
		axios.get('http://localhost:9000/public/index.html')
				 .then(res => {
				 	resolve(res.data)
				 })
				 .catch(reject)
	})
}

// 通过 module 的构造方法，创建一个Module
const Module = module.constructor
let serverBundle
const mfs = new MemoryFs
// webpack监听entry里面包含的文件的变换
const serverCompiler = webpack(serverConfig)
// 将文件写入到内存中 加快打包速度
serverCompiler.outputFileSystem = mfs
// 监听打包过程 触发 webpack 执行器，返回一个 Watching 实例。 
serverCompiler.watch({}, (err, stats) => {
	if (err) { throw err }
	// 以 JSON 对象形式返回编译信息
	stats = stats.toJson()
	// 输出错误
	stats.errors.forEach(err => console.error(err))
	// 输出警告
	stats.warnings.forEach(warn => console.warn(warn))
	// 服务端渲染的bundle文件
	const bundlePath = path.join(
		serverConfig.output.path,
		serverConfig.output.filename
	)
	// 从内存中读取到内容 String
	const bundle = mfs.readFileSync(bundlePath, 'utf-8')

	const m = new Module()
	// 用 module 的实例去解析 bundle 字符串，生成新的模块
	m._compile(bundle, 'server-entry.js')	// 动态编译时，指定文件名
	serverBundle = m.exports.default
})

module.exports = function(app) {
	// 将所有'/public'请求，代理到 dev:client
	app.use('/public', proxy({
		target: 'http://localhost:9000'
	}))

	app.get('*', function (req, res) {
		getTemplate().then(template => {
			// 从内存中读取到的内容 返回一段HTML字符串
			const content = ReactDomServer.renderToString(serverBundle)
			// 将字符串插入到指定位置
			res.send(template.replace('<!-- app -->', content))
		})
	})
}