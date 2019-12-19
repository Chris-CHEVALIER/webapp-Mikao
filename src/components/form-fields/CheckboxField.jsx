import React from 'react';
import { Checkbox } from 'antd';

/**
 * Functionnal component that wrap the Ant Design Checkbox component.
 */
export default class CheckboxField extends React.Component {
    render() {
        const {label, checked, readOnly, ...other} = this.props;
        return <Checkbox disabled={readOnly} checked={checked} {...other}>{label}</Checkbox>;
    }
}