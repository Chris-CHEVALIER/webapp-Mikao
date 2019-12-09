import React from 'react';
import { Form, Input, Button } from 'antd';
import Locale from 'locale/LocaleFactory';
import FormBase from 'components/forms/FormBase.jsx';

class ResetPasswordForm extends FormBase {
    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.isFormSubmited(true);
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err && this.props.onSubmit) {
                this.props.onSubmit(values);
            }
        });
    };

    checkPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('plainPassword')) {
            callback('Les mots de passe ne sont pas identiques!');
        } else {
            callback();
        }
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Item
                    validateStatus={this.getValidateStatus('plainPassword')}
                    help={this.getHelp('plainPassword')}
                    hasFeedback
                >
                    {getFieldDecorator('plainPassword', {
                        rules: [
                            {
                                required: true,
                                message: Locale.trans('user.password.error.required'),
                            },
                        ],
                    })(<Input type="password" placeholder={Locale.trans('user.password')} />)}
                </Form.Item>
                <Form.Item
                    validateStatus={this.getValidateStatus('passwordConfirm')}
                    help={this.getHelp('passwordConfirm')}
                    hasFeedback
                >
                    {getFieldDecorator('passwordConfirm', {
                        rules: [
                            {
                                validator: this.checkPassword,
                            },
                        ],
                    })(<Input
                        type="password"
                        placeholder={Locale.trans('user.passwordConfirm')}
                    />)}
                </Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    loading={this.props.loading}
                >
                    {Locale.trans('edit')}
                </Button>
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
})(ResetPasswordForm);
