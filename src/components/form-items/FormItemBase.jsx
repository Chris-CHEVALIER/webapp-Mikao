import React from 'react';
import Locale from 'locale/LocaleFactory';

export default class FormItemBase extends React.Component {
    hasErrors() {
        const { getFieldsError } = this.props.form;
        const fieldsError = getFieldsError();
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

    getValidateStatus(name) {
        const { getFieldError, isFieldTouched } = this.props.form;
        if (!isFieldTouched(name)) {
            return '';
        }
        return getFieldError(name) ? 'error' : 'success';
    }

    getHelp(name) {
        const { getFieldError, isFieldTouched } = this.props.form;
        return (isFieldTouched(name) && getFieldError(name)) || '';
    }

    getFieldDecorator(id, options) {
        return this.props.form.getFieldDecorator(id, options);
    }

    getRules() {
        let allRules = [];

        const { required, rules } = this.props;
        if (required) {
            allRules.push({ required: true, message: Locale.trans('error.required') });
        }

        if (rules) {
            allRules = allRules.concat(rules);
        }

        return allRules;
    }
}
