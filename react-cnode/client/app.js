import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './App.jsx'

const root = document.getElementById('root')

const render = Component => {
	// React Hot Loader 使用 AppContainer
	ReactDOM.render(
		<AppContainer>
			<Component />
		</AppContainer>,
		root
	)
}
// 将组件挂载到指定节点
render(App)

// 不刷新页面只更新组件！！！
if(module.hot) {
	module.hot.accept('./App.jsx',() => {
		const NextApp = require('./App.jsx').default
		// 重新渲染
		render(NextApp)
	})
}

// 将组件挂载到指定节点
// ReactDOM.render(<App />, document.getElementById('root'))
