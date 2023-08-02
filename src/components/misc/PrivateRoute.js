import React from 'react'
import { Redirect } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function PrivateRoute({ children }) {
  const { userIsAuthenticated } = useAuth()
  return userIsAuthenticated() ? children : <Redirect to="/login" />
}

export default PrivateRoute