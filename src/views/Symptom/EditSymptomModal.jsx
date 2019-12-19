import React from 'react';
import { Modal } from 'antd';

import SymptomForm from 'components/forms/SymptomForm.jsx';

import ToastActions from 'actions/ToastActions';

import TreatmentStore from 'stores/TreatmentStore';

import SymptomActions from 'actions/SymptomActions';
import TreatmentActions from 'actions/TreatmentActions';
import Locale, { Locale as LocaleComponent } from 'locale/LocaleFactory';

/**
 * The modal to edit a symptom.
 */
export default class EditSymptomModal extends React.Component {
    treatmentListener;

    constructor(props) {
        super();
        this.state = {
            loading: false,
            fields: this.getFieldsFromEntity(props.symptom),
            treatments: TreatmentStore.getTreatments(),
        };
    }

    componentDidMount() {
        this.treatmentListener = TreatmentStore.addListener(this.receiveTreatments);
        TreatmentActions.reload();
    }

    componentWillUnmount() {
        this.treatmentListener.remove();
    }

    receiveTreatments = () => {
        this.setState({
            treatments: TreatmentStore.getTreatments(),
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.visible && !this.props.visible) {
            this.setState({
                fields: this.getFieldsFromEntity(nextProps.symptom),
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

    handleSubmit = (symptom) => {
        if (!this.props.symptom) {
            return;
        }
        const symptomId = this.props.symptom.id;

        this.setState({
            loading: true,
        });
        SymptomActions.edit(symptomId, symptom)
            .then((newSymptom) => {
                this.setState({
                    fields: {},
                    loading: false,
                });
                ToastActions.createToastSuccess(Locale.trans('symptom.update.success', {name: newSymptom.name}));
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
        const { symptom, visible, onCancel } = this.props;
        const { fields, loading, treatments } = this.state;
        
        return (
            <Modal
                title={<LocaleComponent transKey="symptom.update" />}
                visible={symptom && visible}
                onCancel={onCancel}
                footer={null}
            >
                <SymptomForm
                    treatments={treatments}
                    symptom={symptom}
                    onChange={this.handleFormChange}
                    fields={fields}
                    onSubmit={this.handleSubmit}
                    loading={loading}
                />
            </Modal>
        );
    }
}
