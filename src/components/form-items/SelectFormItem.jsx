import React from 'react';
import FormItemBase from 'components/form-items/FormItemBase.jsx';
import { Form } from 'antd';
import { Select } from 'components/FormFields';

export default class SelectFormItem extends FormItemBase {

    render(){
        const {id, initialValue, options, readOnly, onChange} = this.props;
        // Form.Item extra props
        const {label, labelCol, wrapperCol, extra} = this.props;
        // Select props
        const {tags, multiple, combobox, allowClear, placeholder, showSearch} = this.props;

        let mode;
        if(tags) {
            mode = 'tags';
        } else if(multiple) {
            mode = 'multiple'
        } else if(combobox) {
            mode = 'combobox';
        }

        return (
                <Form.Item
                    validateStatus={this.getValidateStatus(id)}
                    help={this.getHelp(id)}
                    hasFeedback
                    label={label} labelCol={labelCol} wrapperCol={wrapperCol} extra={extra}
                >
                    {this.getFieldDecorator(id, {
                        initialValue: initialValue,
                        rules: this.getRules(),
                    })(
                        <Select
                            mode={mode}
                            allowClear={allowClear}
                            showSearch={showSearch}
                            readOnly={readOnly}
                            placeholder={placeholder}
                            onChange={onChange}
                            options={options} />
                    )}
                </Form.Item>
            );
    }

}
