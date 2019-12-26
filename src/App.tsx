import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import frFR from 'antd/lib/locale-provider/fr_FR';
import { ConfigProvider as AppLocaleProvider} from './locale/LocaleFactory';

import LoginActions from './actions/LoginActions';

import Layout from './views/Layout.jsx';
import Login from './views/Login.jsx';
import ResetPassword from './views/ResetPassword.jsx';
import ResetPasswordRequest from './views/ResetPasswordRequest.jsx';

import ProtectedRoute from './components/ProtectedRoute.jsx';

const routes = (
    <ConfigProvider locale={frFR}>
        <AppLocaleProvider>
            <Router>
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/reset-password" component={ResetPassword} />
                    <Route exact path="/reset-password-request" component={ResetPasswordRequest} />
                    <ProtectedRoute path="/" component={Layout} />
                </Switch>
            </Router>
        </AppLocaleProvider>
    </ConfigProvider>
);

LoginActions.loginUserIfRemembered();

export default routes;