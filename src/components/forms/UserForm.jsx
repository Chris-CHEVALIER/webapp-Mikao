import React from "react";
import { Form, Button, Row, Col } from "antd";
import Locale from "locale/LocaleFactory";
import FormBase from "components/forms/FormBase.jsx";
import FormItem from "components/forms/FormItems";
//import AvatarUpload from "components/AvatarUpload.jsx";

//import ToastActions from "actions/ToastActions";
//import TokenContainer from "services/TokenContainer";
//import BaseUrlConstants from "constants/BaseUrlConstants";

class UserForm extends FormBase {
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.isFormSubmited(true);
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err && this.props.onSubmit) {
        const user = this.getEntityFromValues(values);
        this.props.onSubmit(user);
      }
    });
  };

  getEntityFromValues = values => {
    const entity = {};
    const keys = Object.keys(values);
    const ignoredKeys = [];

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (!k.endsWith("_ids") && k !== "passwordConfirm") {
        if (k.endsWith("_id")) {
          const tK = k.replace("_id", "");
          entity[tK] = values[k];
          ignoredKeys.push(tK);
        } else if (ignoredKeys.indexOf(k) === -1) {
          entity[k] = values[k];
        }
      }
    }

    return entity;
  };

  checkPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
      callback("Les mots de passe ne sont pas identiques!");
    } else {
      callback();
    }
  };

  render() {
    const isEditing = !!this.props.user;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row>
          {/*isEditing && <Col span={8}>{this.renderAvatarField()}</Col>*/}
          <Col span={isEditing ? 16 : 24}>
            <FormItem.Input
              id="first_name"
              required
              label={Locale.trans("user.firstName")}
              form={this.props.form}
              validateStatus={this.getValidateStatus("first_name")}
              help={this.getHelp("first_name")}
              hasFeedback
            />
            <FormItem.Input
              id="last_name"
              required
              label={Locale.trans("user.lastName")}
              form={this.props.form}
              validateStatus={this.getValidateStatus("last_name")}
              help={this.getHelp("last_name")}
              hasFeedback
            />
          </Col>
        </Row>
        {/*<FormItem.Input
          id="email"
          label={Locale.trans("user.email")}
          form={this.props.form}
        />
        <FormItem.Input
          id="phoneNumber"
          label={Locale.trans("user.phoneNumber")}
          form={this.props.form}
        />

        <FormItem.TextArea
          id="address"
          autosize={{ minRows: 1, maxRows: 10 }}
          label={Locale.trans("user.address")}
          form={this.props.form}
        />
        <FormItem.Input
          id="cp"
          label={Locale.trans("user.postalCode")}
          form={this.props.form}
        />
        <FormItem.Input
          id="town"
          label={Locale.trans("user.city")}
          form={this.props.form}
        />*/}

        <FormItem.Input
          id="username"
          required
          label={Locale.trans("user.username")}
          form={this.props.form}
        />
        {!isEditing && (
          <React.Fragment>
            <FormItem.Input
              id="password"
              type="password"
              required
              label={Locale.trans("user.password")}
              form={this.props.form}
              validateStatus={this.getValidateStatus("password")}
              help={this.getHelp("password")}
              hasFeedback
            />
            <FormItem.Input
              id="passwordConfirm"
              type="password"
              required
              label={Locale.trans("user.passwordConfirm")}
              rules={[
                {
                  validator: this.checkPassword
                }
              ]}
              form={this.props.form}
              validateStatus={this.getValidateStatus("passwordConfirm")}
              help={this.getHelp("passwordConfirm")}
              hasFeedback
            />
          </React.Fragment>
        )}

        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          loading={this.props.loading}
        >
          {Locale.trans("save")}
        </Button>
      </Form>
    );
  }

  renderRoleField() {
    const { roles } = this.props;
    const { getFieldValue } = this.props.form;
    return (
      <FormItem.Select
        id="role_id"
        required
        showSearch
        allowClear
        label={Locale.trans("user.role")}
        initialValue={
          getFieldValue("role") ? getFieldValue("role").id.toString() : null
        }
        options={roles.map(c => ({ value: c.id, label: c.name }))}
        form={this.props.form}
        validateStatus={this.getValidateStatus("role_id")}
        help={this.getHelp("role_id")}
        hasFeedback
      />
    );
  }

  /*renderAvatarField() {
    const { user } = this.props;
    if (!user || !user.id) {
      return null;
    }

    const token = TokenContainer.get().replace(/\+/g, "%2B");
    const url = `${BaseUrlConstants.BASE_URL}users/${
      user.id
    }/profile-picture?X-Auth-Token=${token}`;

    return (
      <AvatarUpload
        imageUrl={url}
        action={url}
        onSuccess={() => {
          ToastActions.createToast("Photo mise à jour", null, "success");
        }}
        onError={() => {
          ToastActions.createToastError(
            "Le téléchargement de la photo a échoué."
          );
        }}
      />
    );
  }*/
}

export default Form.create({
  onFieldsChange(props, changedFields) {
    if (props.onChange) {
      props.onChange(changedFields);
    }
  },
  mapPropsToFields(props) {
    const { fields } = props;
    if (!fields) {
      return {};
    }
    const kFields = Object.keys(fields);
    const map = {};
    for (let i = 0; i < kFields.length; i++) {
      const k = kFields[i];
      map[k] = Form.createFormField({
        ...fields[k],
        value: fields[k].value
      });
    }
    return map;
  }
})(UserForm);
