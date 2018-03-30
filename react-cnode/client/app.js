import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader' // eslint-disable-line
import App from './views/App'

const root = document.getElementById('root')

const render = (Component) => {
  // React Hot Loader 使用 AppContainer
  ReactDOM.render(
    <AppContainer>
      <BrowserRouter>
        <Component />
      </BrowserRouter>
    </AppContainer>,
    root,
  )
}
// 将组件挂载到指定节点
render(App)

// 不刷新页面只更新组件！！！
if (module.hot) {
  module.hot.accept('./views/App', () => {
    const NextApp = require('./views/App').default // eslint-disable-line
    // 重新渲染
    render(NextApp)
  })
}

// 将组件挂载到指定节点
// ReactDOM.render(<App />, document.getElementById('root'))
