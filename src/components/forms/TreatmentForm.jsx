import React from 'react';
import { Form, Button } from 'antd';
import Locale from 'locale/LocaleFactory';
import FormBase from 'components/forms/FormBase.jsx';
import FormItem from 'components/forms/FormItems';

class TreatmentForm extends FormBase {
    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.isFormSubmited(true);
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err && this.props.onSubmit) {
                const treatment = this.getEntityFromValues(values);
                this.props.onSubmit(treatment);
            }
        });
    };

    getEntityFromValues = (values) => {
        const entity = {};
        const keys = Object.keys(values);
        const ignoredKeys = [];

        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            if (!k.endsWith('_ids') && k !== 'passwordConfirm') {
                if (k.endsWith('_id')) {
                    const tK = k.replace('_id', '');
                    entity[tK] = values[k];
                    ignoredKeys.push(tK);
                } else if (ignoredKeys.indexOf(k) === -1) {
                    entity[k] = values[k];
                }
            }
        }

        return entity;
    };
    
    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem.Input
                    id="name"
                    required
                    label={Locale.trans('treatment.name')}
                    form={this.props.form}
                    validateStatus={this.getValidateStatus('name')}
                    help={this.getHelp('name')}
                    hasFeedback
                />

                <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    loading={this.props.loading}
                >
                    {Locale.trans('save')}
                </Button>
            </Form>
        );
    }
}

export default Form.create({
    onFieldsChange(props, changedFields) {
        if (props.onChange) {
            props.onChange(changedFields);
        }
    },
    mapPropsToFields(props) {
        const { fields } = props;
        if (!fields) {
            return {};
        }
        const kFields = Object.keys(fields);
        const map = {};
        for (let i = 0; i < kFields.length; i++) {
            const k = kFields[i];
            map[k] = Form.createFormField({
                ...fields[k],
                value: fields[k].value,
            });
        }
        return map;
    },
})(TreatmentForm);
