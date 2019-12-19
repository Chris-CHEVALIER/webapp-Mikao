import React from 'react';
import { Form, Button } from 'antd';
import Locale from 'locale/LocaleFactory';
import FormBase from 'components/forms/FormBase.jsx';
import FormItem from 'components/forms/FormItems';
import StringService from "services/utils/StringService";

function cmpTreatmentsByName(s1, s2) {
    return StringService.compareCaseInsensitive(s1.name, s2.name);
}

class SymptomForm extends FormBase {
    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.isFormSubmited(true);
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err && this.props.onSubmit) {
                const symptom = this.getEntityFromValues(values);
                symptom.treatments = values.treatment_ids;
                this.props.onSubmit(symptom);
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
                    label={Locale.trans('symptom.name')}
                    form={this.props.form}
                    validateStatus={this.getValidateStatus('name')}
                    help={this.getHelp('name')}
                    hasFeedback
                />
                <FormItem.TextArea
                    id="description"
                    required
                    label={Locale.trans('symptom.description')}
                    form={this.props.form}
                    validateStatus={this.getValidateStatus('description')}
                    help={this.getHelp('description')}
                    hasFeedback
                />
                {this.renderTreatmentsField()}
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

    renderTreatmentsField() {
        const { treatments, readOnly } = this.props;
        if (!treatments || treatments.length === 0) return null;
        const { getFieldValue } = this.props.form;
        const initialValue = (getFieldValue("treatments") || []).map(s =>
          s.toString()
        );
        const options = treatments.sort(cmpTreatmentsByName).map(s => ({
            value: s.id,
            label: s.name
        }));
        return (
          <FormItem.Select
            id="treatment_ids"
            multiple
            label={Locale.trans("symptom.treatments")}
            initialValue={initialValue}
            options={options}
            form={this.props.form}
            readOnly={readOnly}
          />
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
})(SymptomForm);
