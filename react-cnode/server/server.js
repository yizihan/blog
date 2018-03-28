const express = require('express')
const ReactSSR = require('react-dom/server')
const serverEntry = require('../dist/server-entry').default

const app = new express()

// 获取浏览器发来的请求
app.get('*', function(req, res) {
	// 使用ReactSSR将serverEntry渲染
	const appString = ReactSSR.renderToString(serverEntry)
	// 直出HTML
	res.send(appString)
})

app.listen(3333, function() {
	console.log('server is listening on 3333')
})