import React from 'react';
import FormItemBase from 'components/form-items/FormItemBase.jsx';
import { Form, Input } from 'antd';

export default class InputFormItem extends FormItemBase {
    render() {
        const { id, initialValue, readOnly } = this.props;
        // Form.Item extra props
        const { label, labelCol, wrapperCol, extra, validateStatus, help } = this.props;
        // Input props
        const {
            type,
            placeholder,
            disabled,
            prefix,
            suffix,
            addonBefore,
            addonAfter,
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
                    <Input
                      placeholder={placeholder}
                      disabled={disabled}
                      readOnly={readOnly}
                      type={type}
                      prefix={prefix}
                      suffix={suffix}
                      addonBefore={addonBefore}
                      addonAfter={addonAfter}
                      maxLength={maxLength}
                      onChange={onChange}
                      ref={n => (this.input = n)}
                    />,
                )}
            </Form.Item>
        );
    }
}
