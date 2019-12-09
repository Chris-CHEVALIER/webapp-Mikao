import React from 'react';

import LoginStore from 'stores/LoginStore';
import { Route, Redirect } from 'react-router-dom';

export default class PrivateRoute extends React.Component {
    componentDidMount() {
        this.loginListener = LoginStore.addListener(this.receiveLogin);
    }
    componentWillUnmount() {
        this.loginListener.remove();
    }
    receiveLogin = () => {
        this.forceUpdate();
    };
    render() {
        const { component: Component, ...rest } = this.props;
        return (
            <Route
                {...rest}
                render={props =>
                    (LoginStore.isLoggedIn() ? (
                        <Component {...props} />
                    ) : (
                        <Redirect
                            to={{
                                pathname: '/login',
                                state: { from: this.props.location },
                            }}
                        />
                    ))
                }
            />
        );
    }
}
