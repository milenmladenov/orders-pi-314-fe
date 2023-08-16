import React, { lazy } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import AccessibleNavigationAnnouncer from "./components/AccessibleNavigationAnnouncer";
import PrivateRoute from './components/misc/PrivateRoute';
import { AuthProvider } from './components/context/AuthContext';

const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/CreateAccount"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Logout = lazy(()=> import("./components/LogoutModal"))

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <AccessibleNavigationAnnouncer />
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/create-account" component={SignUp} />
            <Route path="/forgot-password" component={ForgotPassword} />


            {/* Place new routes over this */}
            <PrivateRoute path="/app">
              <Layout />
            </PrivateRoute>
            {/* If you have an index page, you can remove this Redirect */}
            <Redirect exact from="/" to="/login" />
          </Switch>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
