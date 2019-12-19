import React from 'react';
import Locale from 'locale/LocaleFactory';
import { DatePicker } from 'antd';

import moment from 'moment';
import DateConstants from '../../constants/DateConstants';

const defaultStyle = { width: '100%' };

/**
 * Functionnal component that wrap the Ant Design DatePicker component.
 * The value property must be a string formatted with the API format.
 */
export default class DatePickerField extends React.Component {
    render() {
        const { placeholder, value, readOnly, style, ...other } = this.props;

        const date = value ? moment(value, DateConstants.API_DATE_FORMAT) : null;

        Locale.initMoment();
        return (
            <DatePicker
              placeholder={placeholder}
              style={{ ...defaultStyle, ...style }}
              value={date}
              format={DateConstants.DISPLAY_DATE_FORMAT}
              locale={Locale.DatePicker}
              disabled={readOnly}
              {...other}
            />
        );
    }
}
