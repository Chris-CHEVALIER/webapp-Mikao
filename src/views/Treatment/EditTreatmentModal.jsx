import React from 'react';
import { Modal } from 'antd';

import TreatmentForm from 'components/forms/TreatmentForm.jsx';

import ToastActions from 'actions/ToastActions';

import TreatmentActions from 'actions/TreatmentActions';
import Locale, { Locale as LocaleComponent } from 'locale/LocaleFactory';

/**
 * The modal to edit a treatment.
 */
export default class EditTreatmentModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
            loading: false,
            fields: this.getFieldsFromEntity(props.treatment),
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.visible && !this.props.visible) {
            this.setState({
                fields: this.getFieldsFromEntity(nextProps.treatment),
            });
        }
    }

    getFieldsFromEntity = (entity) => {
        if (!entity) {
            return {};
        }
        const fields = {};
        const keys = Object.keys(entity);
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            fields[k] = { value: entity[k] };
        }
        return fields;
    };

    handleFormChange = (changedFields) => {
        this.setState(({ fields }) => ({
            fields: { ...fields, ...changedFields },
        }));
    };

    handleSubmit = (treatment) => {
        if (!this.props.treatment) {
            return;
        }
        const treatmentId = this.props.treatment.id;

        this.setState({
            loading: true,
        });
        TreatmentActions.edit(treatmentId, treatment)
            .then((newTreatment) => {
                this.setState({
                    fields: {},
                    loading: false,
                });
                ToastActions.createToastSuccess(Locale.trans('treatment.update.success', {name: newTreatment.name}));
                this.props.onCancel();
            })
            .catch(this.handleError);
    };

    handleError = (err) => {
        this.setState({
            loading: false,
        });
        try {
            const resp = JSON.parse(err.response);
            ToastActions.createToastError(resp.message);
        } catch (e) {
            ToastActions.createToastError('Une erreur est survenue');
        }
    };

    render() {
        const { treatment, visible, onCancel } = this.props;
        const { fields, loading } = this.state;
        return (
            <Modal
                title={<LocaleComponent transKey="treatment.update" />}
                visible={treatment && visible}
                onCancel={onCancel}
                footer={null}
            >
                <TreatmentForm
                    treatment={treatment}
                    onChange={this.handleFormChange}
                    fields={fields}
                    onSubmit={this.handleSubmit}
                    loading={loading}
                />
            </Modal>
        );
    }
}
