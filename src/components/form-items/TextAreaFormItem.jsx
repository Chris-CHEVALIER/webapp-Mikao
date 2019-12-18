import React from 'react';
import ReactDOM from 'react-dom';
import Locale from 'locale/LocaleFactory';
import FormItemBase from 'components/form-items/FormItemBase.jsx';
import { Form, Input } from 'antd';

export default class InputFormItem extends FormItemBase {
    render() {
        const { id, initialValue, readOnly } = this.props;
        // Form.Item extra props
        const { label, labelCol, wrapperCol, extra, validateStatus, help } = this.props;
        // Input props
        const {
            placeholder,
            autosize,
            disabled,
            maxLength,
            onChange,
        } = this.props;

        return (
            <Form.Item
              validateStatus={validateStatus || this.getValidateStatus(id)}
              help={help || this.getHelp(id)}
              hasFeedback
              label={label}
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              extra={extra}
            >
                {this.getFieldDecorator(id, {
                    initialValue,
                    rules: this.getRules(),
                })(
                    <Input.TextArea
                      placeholder={placeholder}
                      autosize={autosize}
                      disabled={disabled}
                      readOnly={readOnly}
                      maxLength={maxLength}
                      onChange={onChange}
                      ref={n => (this.input = n)}
                    />,
                )}
            </Form.Item>
        );
    }
}
