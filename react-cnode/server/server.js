const express = require('express')
const ReactSSR = require('react-dom/server')
const fs = require('fs')
const path = require('path')
const serverEntry = require('../dist/server-entry').default

// 读取生成后的模板
const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8')

const app = new express()

// 设置服务端静态资源目录
app.use('/public', express.static(path.join(__dirname, '../dist')))

// 获取浏览器发来的请求
app.get('*', function(req, res) {
	// 使用ReactSSR将serverEntry渲染
	const appString = ReactSSR.renderToString(serverEntry)
	// 将后端渲染的内容替换掉模板内容
	template.replace('<app></app>', appString)
	// 直出HTML
	res.send(template.replace('<app></app>', appString))
})

app.listen(3333, function() {
	console.log('server is listening on 3333')
})