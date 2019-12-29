import React from "react";
import { Row, Col } from "antd";
import { Redirect } from "react-router-dom";

import CustomProperties from "react-custom-properties";

import LoginForm from "components/forms/LoginForm.jsx";
import AuthService from "services/AuthService";
import ToastActions from "actions/ToastActions";
import LoginStore from "stores/LoginStore";

export default class Login extends React.Component {
  loginListener;
  constructor() {
    super();
    this.state = {
      loading: false,
      fields: {},
      redirectToReferrer: false,
    };
  }

  componentDidMount() {
    this.loginListener = LoginStore.addListener(this.receiveLogin);
  }
  componentWillUnmount() {
    this.loginListener.remove();
  }

  receiveLogin = () => {
    if (LoginStore.isLoggedIn()) {
      this.setState({
        redirectToReferrer: true
      });
    }
  };

  login = (username, password) => {
    this.setState({
      loading: true
    });
    AuthService.login(username, password)
      .then(() => {
        this.setState({
          loading: false,
          redirectToReferrer: true
        });
      }).catch(this.handleError);
  };

  handleError = err => {
    this.setState({
      loading: false
    });
    ToastActions.createToastError("Une erreur s'est produite");
  };

  handleFormChange = changedFields => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields }
    }));
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;
    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <CustomProperties global>
        <Row
          type="flex"
          style={{ backgroundImage: 'url("images/login-background.jpg")' }}
          align="middle"
          justify="center"
          className="login-page"
        >
          <Col xs={14} sm={8} md={6} lg={4} xl={4}>
            <img
              src="images/logo.png" // @TODO: Update logo image to "images" folder
              style={{ width: "100%", paddingBottom: "1rem" }}
              alt="logo"
            />
            <LoginForm
              onChange={this.handleFormChange}
              fields={this.state.fields}
              onLogin={this.login}
              loading={this.state.loading}
            />
          </Col>
        </Row>
      </CustomProperties>
    );
  }
}
