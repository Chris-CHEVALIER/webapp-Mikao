import React from 'react';
import { Form, Input, Icon, Button } from 'antd';
import { Link } from 'react-router-dom';
import Locale from 'locale/LocaleFactory';
import FormBase from 'components/forms/FormBase.jsx';

class LoginForm extends FormBase {
    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.isFormSubmited(true);
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err && this.props.onLogin) {
                const { userName, password } = values;
                this.props.onLogin(userName, password, false);
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Item
                    validateStatus={this.getValidateStatus('userName')}
                    help={this.getHelp('userName')}
                    hasFeedback
                >
                    {getFieldDecorator('userName', {
                        rules: [
                            {
                                required: true,
                                message: Locale.trans('login.username.error.required'),
                            },
                        ],
                    })(<Input
                        addonBefore={<Icon type="user" />}
                        placeholder={Locale.trans('login.username')}
                    />)}
                </Form.Item>
                <Form.Item
                    validateStatus={this.getValidateStatus('password')}
                    help={this.getHelp('password')}
                    hasFeedback
                >
                    {getFieldDecorator('password', {
                        rules: [
                            {
                                required: true,
                                message: Locale.trans('login.password.error.required'),
                            },
                        ],
                    })(<Input
                        addonBefore={<Icon type="lock"/>}
                        type="password"
                        placeholder={Locale.trans('login.password')}
                    />)}
                </Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    loading={this.props.loading}
                >
                    {Locale.trans('login.logIn.button')}
                </Button>
                <Link to="/reset-password-request" className="reset-password">J&apos;ai oublié mon mot de passe</Link>
            </Form>
        );
    }
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
                value: fields[k].value,
            });
        }
        return map;
    },
})(LoginForm);
