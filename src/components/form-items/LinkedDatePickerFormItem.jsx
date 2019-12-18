import React from 'react';
import Locale from 'locale/LocaleFactory';
import FormItemBase from 'components/form-items/FormItemBase.jsx';
import { DatePicker } from 'components/FormFields';
import { Form } from 'antd';

import moment from 'moment';
import DateConstants from '../../constants/DateConstants';

export default class LinkedDatePickerFormItem extends FormItemBase {

    render(){
        const {id, initialValue, readOnly} = this.props;
        // Form.Item extra props
        const {label, labelCol, wrapperCol, extra} = this.props;
        // Input props
        const { placeholder } = this.props;

        const { onOpenChange, open, onChange, disabledDate} = this.props;

        return (
                <Form.Item
                    validateStatus={this.getValidateStatus(id)}
                    help={this.getHelp(id)}
                    hasFeedback
                    label={label} labelCol={labelCol} wrapperCol={wrapperCol} extra={extra}
                >
                    {this.getFieldDecorator(id, {
                        initialValue: initialValue ? moment(initialValue, DateConstants.API_DATE_FORMAT) : null,
                        rules: this.getRules(),
                    })(

                        <DatePicker
                            placeholder={placeholder}
                            readOnly={readOnly}
                            onOpenChange={onOpenChange}
                            onChange={onChange}
                            disabledDate={disabledDate}
                        />
                    )}
                </Form.Item>
            );
    }

}
