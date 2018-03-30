const express = require('express')
const ReactSSR = require('react-dom/server')
const fs = require('fs')
const path = require('path')


// 开发环境
const isDev = process.env.NODE_ENV === 'development'

const app = new express()

// 线上环境
if(!isDev) {
	const serverEntry = require('../dist/server-entry').default
	// 读取生成后的模板
	const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8')

	// 设置服务端静态资源目录
	// 请求路径中包含'/public'，将请求指向'/dist'
	app.use('/public', express.static(path.join(__dirname, '../dist')))

	// 获取浏览器发来的请求
	app.get('*', function(req, res) {
		// 使用ReactSSR将serverEntry渲染
		const appString = ReactSSR.renderToString(serverEntry)
		// 将后端渲染的内容替换掉模板内容
		// template.replace('<app></app>', appString)
		// 直出HTML
		res.send(template.replace('<!-- app -->', appString))
	})
} else {
	// 开发环境下
	// 1.设置将 serverBundle 写在内存中
	// 2.使用 axios 去请求 template
	// 3.使用 serverCompiler.watch 监控 serverBundle 变化
	// 3.使用 react-dom 实时渲染 serverBundle
	// 4.将 serverBundle 插入到模板中
	// 5.监听请求，返回模板
	const devStatic = require('./util/dev-static')
	devStatic(app)
}

app.listen(3333, function() {
	console.log('server is listening on 3333')
})
