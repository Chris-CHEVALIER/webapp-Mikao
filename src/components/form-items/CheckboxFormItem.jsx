import React from 'react';
import FormItemBase from 'components/form-items/FormItemBase.jsx';
import { Form, Checkbox } from 'antd';

export default class CheckboxFormItem extends FormItemBase {
    render() {
        const { id, label, initialValue, readOnly, className } = this.props;
        // Form.Item extra props
        const { labelCol, wrapperCol, extra } = this.props;

        return (
            <Form.Item
              validateStatus={this.getValidateStatus(id)}
              help={this.getHelp(id)}
              labelCol={labelCol}
              wrapperCol={wrapperCol}
              extra={extra}
              className={className}
            >
                {this.getFieldDecorator(id, {
                    initialValue,
                    valuePropName: 'checked',
                    rules: this.getRules(),
                })(
                    <Checkbox disabled={readOnly}>
                        {label}
                    </Checkbox>,
                )}
            </Form.Item>
        );
    }
}
