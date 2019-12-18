import React from 'react';
import Locale from 'locale/LocaleFactory';
import FormItemBase from 'components/form-items/FormItemBase.jsx';
import { Form, TimePicker } from 'antd';

import moment from 'moment';
import DateConstants from '../../constants/DateConstants';

export default class TimePickerFormItem extends FormItemBase {
    render() {
        const { id, initialValue } = this.props;
        // Form.Item extra props
        const { label, labelCol, wrapperCol, extra } = this.props;
        // Input props
        const { placeholder, onChange, disabledMinutes } = this.props;

        const format = DateConstants.API_TIME_FORMAT;

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
                    initialValue: initialValue ? moment(initialValue, format) : null,
                    rules: this.getRules(),
                })(
                    <TimePicker
                      onChange={onChange}
                      placeholder={placeholder}
                      format={format}
                      disabledMinutes={disabledMinutes}
                      hideDisabledOptions
                      locale={Locale.TimePicker}
                    />,
                )}
            </Form.Item>
        );
    }
}
