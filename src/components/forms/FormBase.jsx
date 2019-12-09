import React from 'react';

export default class FormBase extends React.Component {
    customErrors;

    constructor() {
        super();
        this.customErrors = {};
        this._isFormSubmited = false;
    }

    isFormSubmited = (value) => {
        if (value === true || value === false) {
            this._isFormSubmited = value;
        }
        return this._isFormSubmited;
    };

    setCustomFieldsError(customErrors) {
        Object.assign(this.customErrors, customErrors);
        this.forceUpdate();
    }

    hasErrors() {
        const fieldsError = this.getErrors();
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

    getErrors() {
        return Object.assign({}, this.props.form.getFieldsError(), this.customErrors);
    }

    getFieldError(name) {
        return this.getErrors()[name];
    }

    getValidateStatus(name) {
        const { isFieldTouched } = this.props.form;
        if (!this.isFormSubmited() && !isFieldTouched(name)) {
            return '';
        }
        return this.getFieldError(name) ? 'error' : 'success';
    }

    getHelp(name) {
        const { isFieldTouched } = this.props.form;
        return ((this.isFormSubmited() || isFieldTouched(name)) && this.getFieldError(name)) || '';
    }
}
