import React from "react";
import { Row, Col } from "antd";

import ResetPasswordRequestForm from "components/forms/ResetPasswordRequestForm.jsx";
import PasswordService from "services/PasswordService";
import ToastActions from "actions/ToastActions";

export default class ResetPasswordRequest extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      fields: {},
      successMsgVisible: false
    };
  }

  handleSubmit = ({ email }) => {
    this.setState({
      loading: true,
      successMsgVisible: false
    });
    PasswordService.postPasswordRequest({
      email
    })
      .then(() => {
        this.setState({
          loading: false,
          successMsgVisible: true
        });
        setTimeout(() => {
          this.props.history.push("/login");
        }, 4000);
      })
      .catch(this.handleError);
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
          <h2>Mot de passe oublié</h2>
          {this.renderSuccessMesage()}
          <ResetPasswordRequestForm
            onChange={this.handleFormChange}
            fields={this.state.fields}
            onSubmit={this.handleSubmit}
            loading={this.state.loading}
          />
        </Col>
      </Row>
    );
  }

  renderSuccessMesage() {
    if (!this.state.successMsgVisible) {
      return null;
    }
    return (
      <div className="success-msg">
        Un email vous a été envoyé pour modifier votre mot de passe.
      </div>
    );
  }
}
