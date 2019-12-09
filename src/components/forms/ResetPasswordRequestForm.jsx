import React from 'react';
import { Form, Input, Button } from 'antd';
import Locale from 'locale/LocaleFactory';
import FormBase from 'components/forms/FormBase.jsx';

class ResetPasswordRequestForm extends FormBase {
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

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Item
                    validateStatus={this.getValidateStatus('email')}
                    help={this.getHelp('email')}
                    hasFeedback
                >
                    {getFieldDecorator('email', {
                        rules: [
                            {
                                required: true,
                                message: Locale.trans('user.email.error.required'),
                            },
                        ],
                    })(<Input placeholder={Locale.trans('user.email')} />)}
                </Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    loading={this.props.loading}
                >
                    {Locale.trans('send')}
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
})(ResetPasswordRequestForm);
