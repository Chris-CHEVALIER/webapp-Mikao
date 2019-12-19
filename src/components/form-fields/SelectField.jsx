import React from 'react';
import Locale from 'locale/LocaleFactory';
import { Select } from 'antd';

const defaultStyle = {width: '100%'};
/**
 * Functionnal component that wrap the Ant Design Select component.
 */
export default class SelectField extends React.Component {
    render() {
        const {options, readOnly, showSearch, style, value, ...other} = this.props;

        // By default we enable the search function
        const shouldShowSearch = showSearch !== false;

        const optionFilterProp = shouldShowSearch ? "children" : null;
        const filterOption = shouldShowSearch ? (input, option) => (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0) : null;

        var formattedValue;
        if (!value) {
            formattedValue = null;
        } else {
            formattedValue = value.constructor === Array ? value : value.toString();
        }

        return  <Select
                    style={ {...defaultStyle, ...style } }
                    value={ formattedValue }
                    filterOption={filterOption}
                    showSearch={shouldShowSearch} optionFilterProp={optionFilterProp} notFoundContent={Locale.trans('notFound')}
                    disabled={readOnly}
                    {...other}>
                    {options.map(o => <Select.Option key={o.value} value={o.value.toString()}>{o.label}</Select.Option>)}
                </Select>;
    }
}
