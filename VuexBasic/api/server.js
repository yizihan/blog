const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const router = express.Router()

app.use(bodyParser.json())
app.use((request, response, next) => {

	// Server 没有允许跨域请求
	// No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:3000' is therefore not allowed access.
	// Server 设置接受的请求源
	response.header('Access-Control-Allow-Origin', 'http://localhost:3000')

	// “预检请求”发现服务器没有设置允许发送数据
	// Request header field Content-Type is not allowed by Access-Control-Allow-Headers in preflight response.		
	// Server 设置接受请求源发来的数据
	response.header('Access-Control-Allow-Headers', 'Content-Type')

	// “预检请求”发现服务器没有设置允许DELETE方法
	// Method DELETE is not allowed by Access-Control-Allow-Methods in preflight response.
	// Server 设置接受请求发送的方法
	response.header('Access-Control-Allow-Methods', 'POST, PUT, PATCH, DELETE, GET, OPTIONS')
	next()
})

let count = [10, 20, 30]

router.route('/count')
			// 获取数据返回给前端
			.get((request, response) => {
				response.send({
					count
				})
			})
			// 提交数据给数据库
			.post((request, response) => {
				count.push(Number(request.body.number))
				response.status(201).send({
					message: 'ok'
				})
			})
			// 从数据库中删除数据
			.delete((request, response) => {
				count.pop()
				response.status(200).send({
					message: 'ok'
				})
			})

app.use('/api', router)

app.listen(8899, () => {
	console.log(8899)
})