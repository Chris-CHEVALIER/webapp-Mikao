import React from 'react';
import Locale from 'locale/LocaleFactory';
import FormItemBase from 'components/form-items/FormItemBase.jsx';
import { Form, Radio } from 'antd';

export default class RadioGroupFormItem extends FormItemBase {

    render(){
        const RadioGroup = Radio.Group;

        const {id, initialValue, options, readOnly, onChange} = this.props;
        // Form.Item extra props
        const {label, labelCol, wrapperCol, extra} = this.props;
        // Select props
        const {tags, multiple, combobox, allowClear, placeholder, showSearch} = this.props;

        return (
                <Form.Item
                    validateStatus={this.getValidateStatus(id)}
                    help={this.getHelp(id)}
                    labelCol={labelCol} wrapperCol={wrapperCol} extra={extra}
                >
                    {this.getFieldDecorator(id, {
                        initialValue: initialValue,
                        rules: this.getRules(),
                    })(
                        <RadioGroup
                            onChange={onChange}
                            options={options}
                        />
                    )}
                </Form.Item>
            );
    }

}
