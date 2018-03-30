import React from 'react'
import { Link } from 'react-router-dom'
import Route from '../config/router'

export default class App extends React.Component {
  componentDidMount() {
    // do something here
  }
  render() {
    return [
      <div>
        <Link to="/" >首页</Link>
        <Link to="/detail" >详情页</Link>
      </div>,
      <Route />,
    ]
  }
}
