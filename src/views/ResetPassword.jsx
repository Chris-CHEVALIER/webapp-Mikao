import React from "react";
import { Row, Col } from "antd";

import ResetPasswordForm from "components/forms/ResetPasswordForm.jsx";
import PasswordService from "services/PasswordService";
import ToastActions from "actions/ToastActions";

function getUrlParameter(search, name) {
  // eslint-disable-next-line
  const n = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp(`[\\?&]${n}=([^&#]*)`);
  const results = regex.exec(search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

export default class ResetPassword extends React.Component {
  constructor(props) {
    super();
    this.state = {
      loading: false,
      fields: {},
      email: getUrlParameter(props.location.search, "email"),
      validationCode: getUrlParameter(props.location.search, "validation-code")
    };
  }

  resetPassword = ({ plainPassword }) => {
    const { email, validationCode } = this.state;
    this.setState({
      loading: true
    });
    PasswordService.patchPassword({
      email,
      validationCode,
      plainPassword
    })
      .then(() => {
        this.props.history.push("/login");
      })
      .catch(this.handleError);
    // TODO
  };

  handleError = err => {
    this.setState({
      loading: false
    });
    try {
      const resp = JSON.parse(err.response);
      ToastActions.createToastError(resp.message);
    } catch (e) {
      ToastActions.createToastError("Une erreur est survenue");
    }
  };

  handleFormChange = changedFields => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields }
    }));
  };

  render() {
    return (
      <Row
        type="flex"
        align="middle"
        justify="center"
        className="login-page"
        style={{ backgroundImage: 'url("images/login-background.jpg")' }}
      >
        <Col xs={14} sm={8} md={6} lg={4} xl={4}>
          <img
            src="images/logo.png"
            style={{ width: "100%", paddingBottom: "1rem" }}
            alt="logo"
          />
          <h2>Modifier mon mot de passe</h2>
          <ResetPasswordForm
            onChange={this.handleFormChange}
            fields={this.state.fields}
            onSubmit={this.resetPassword}
            loading={this.state.loading}
          />
        </Col>
      </Row>
    );
  }
}
