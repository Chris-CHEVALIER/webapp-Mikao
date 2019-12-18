import React from 'react';
import FormItemBase from 'components/form-items/FormItemBase.jsx';
import { Form, InputNumber } from 'antd';

export default class InputNumberFormItem extends FormItemBase {
    render() {
        const { id, initialValue, readOnly } = this.props;
        // Form.Item extra props
        const { label, labelCol, wrapperCol, extra } = this.props;
        // Input props
        const {
            min,
            max,
            step,
            precision,
            formatter,
            parser,
            disabled,
            onChange,
        } = this.props;

        return (
            <Form.Item
              validateStatus={this.getValidateStatus(id)}
              help={this.getHelp(id)}
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
                    <InputNumber
                      min={min}
                      max={max}
                      step={step}
                      precision={precision}
                      formatter={formatter}
                      parser={parser}
                      disabled={disabled}
                      readOnly={readOnly}
                      onChange={onChange}
                    />,
                )}
            </Form.Item>
        );
    }
}
