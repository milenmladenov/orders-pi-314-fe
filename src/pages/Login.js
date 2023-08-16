import React, { Component } from 'react'
import { NavLink, Navigate } from 'react-router-dom'
import {  Form, Grid, Segment, Message } from 'semantic-ui-react'
import AuthContext from '../components/context/AuthContext'
import { orderApi } from '../components/misc/OrderApi'
import { parseJwt, handleLogError } from '../components/misc/Helpers'
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min'
import { Link } from 'react-router-dom'
import Logo from '../assets/img/logo-white-frame.png'

import { Label, Input,Button} from '@windmill/react-ui'

class Login extends Component {
  static contextType = AuthContext

  state = {
    username: '',
    password: '',
    isLoggedIn: false,
    isError: false
  }

  componentDidMount() {
    const Auth = this.context
    const isLoggedIn = Auth.userIsAuthenticated()
    this.setState({ isLoggedIn })
  }

  handleInputChange = (e, {name, value}) => {
    this.setState({ [name]: value })
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { username, password } = this.state
    if (!(username && password)) {
      this.setState({ isError: true })
      return
    }

    orderApi.authenticate(username, password)
      .then(response => {
        const { accessToken } = response.data
        const data = parseJwt(accessToken)
        const user = { data, accessToken }
        localStorage.setItem('accessToken', accessToken);
        const Auth = this.context
        Auth.userLogin(user)

        this.setState({
          username: '',
          password: '',
          isLoggedIn: true,
          isError: false
        })
      })
      .catch(error => {
        handleLogError(error)
        this.setState({ isError: true })
      })
  }

  render() {
    const { isLoggedIn, isError } = this.state
    if (isLoggedIn) {
      return <Redirect to={'/app'} />
    } else {
      return (
        <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
          <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-1 w-auto md:h-auto md:w-1/2 ml-4">
                <img
                  aria-hidden="true"
                  className="object-contain h-full  w-full dark:hidden"
                  src={Logo}
                  alt="Logo"
                />
              </div>
            <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
              <div className="w-full">
                <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                  Вход
                </h1>
                <Label>
                  <span>Потребителско име</span>
                  <Input
                    className="mt-1"
                    type="email"
                    placeholder="Потребителско име"
                    name="username"
                    value={this.state.username}
                    onChange={(e) => this.handleInputChange(e, { name: 'username', value: e.target.value })}
                    />
                </Label>

                <Label className="mt-4">
                  <span>Парола</span>
                  <Input
                    className="mt-1"
                    type="password"
                    placeholder="***************"
                    name="password"
                    value={this.state.password}
                    onChange={(e) => this.handleInputChange(e, { name: 'password', value: e.target.value })}
                    />
                </Label>

                <Button
                  className="mt-4"
                  block
                  tag={Link} // Assuming you are using react-router-dom's Link component
                  to="/app"
                  onClick={this.handleSubmit}
                >
                  Вход
                </Button>
                <br></br>

                {isError && (
                  
            <><div style={{padding :10  }} className = "w-full "><span style={{ color: 'red' }} ><b>Грешно потребителско име или парола</b></span></div></>
        )}
                <hr className="my-8" />

                

                <p className="mt-4">
                  <Link
                    className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                    to="/forgot-password"
                  >
                    Забравена парола?
                  </Link>
                </p>
                <p className="mt-1">
                  <Link
                    className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                    to="/create-account"
                  >
                    Не сте се регистрирали?
                  </Link>
                </p>
              </div>
            </main>
          </div>
        </div>
      </div>
      )
    }
  }
}

export default Login