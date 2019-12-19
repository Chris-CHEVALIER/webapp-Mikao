import React from 'react';
import { Modal } from 'antd';

import SymptomForm from 'components/forms/SymptomForm.jsx';

import ToastActions from 'actions/ToastActions';

import TreatmentStore from 'stores/TreatmentStore';

import SymptomActions from 'actions/SymptomActions';
import TreatmentActions from 'actions/TreatmentActions';
import Locale, {Locale as LocaleComponent} from 'locale/LocaleFactory';

/**
 * The modal to create a new symptom.
 */
export default class CreateSymptomModal extends React.Component {
    treatmentListener;

    constructor() {
        super();
        this.state = {
            loading: false,
            fields: {},
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

    handleFormChange = (changedFields) => {
        this.setState(({ fields }) => ({
            fields: { ...fields, ...changedFields },
        }));
    };

    handleSubmit = (symptom) => {
        this.setState({
            loading: true,
        });
        SymptomActions.create(symptom)
            .then((newSymptom) => {
                this.setState({
                    fields: {},
                    loading: false,
                });
                ToastActions.createToastSuccess(Locale.trans('symptom.add.success', {name: newSymptom.name}));
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
        const { visible, onCancel } = this.props;
        const { fields, loading, treatments } = this.state;
        return (
            <Modal
                title={<LocaleComponent transKey="symptom.add" />}
                visible={visible}
                onCancel={onCancel}
                footer={null}
            >
                <SymptomForm
                    treatments={treatments}
                    onChange={this.handleFormChange}
                    fields={fields}
                    onSubmit={this.handleSubmit}
                    loading={loading}
                />
            </Modal>
        );
    }
}
