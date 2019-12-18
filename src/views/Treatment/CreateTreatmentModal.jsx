import React from 'react';
import { Modal } from 'antd';

import TreatmentForm from 'components/forms/TreatmentForm.jsx';

import ToastActions from 'actions/ToastActions';

import TreatmentActions from 'actions/TreatmentActions';
import Locale, {Locale as LocaleComponent} from 'locale/LocaleFactory';

/**
 * The modal to create a new treatment.
 */
export default class CreateTreatmentModal extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            fields: {},
        };
    }

    handleFormChange = (changedFields) => {
        this.setState(({ fields }) => ({
            fields: { ...fields, ...changedFields },
        }));
    };

    handleSubmit = (treatment) => {
        this.setState({
            loading: true,
        });
        TreatmentActions.create(treatment)
            .then((newTreatment) => {
                this.setState({
                    fields: {},
                    loading: false,
                });
                ToastActions.createToastSuccess(Locale.trans('treatment.add.success', {name: newTreatment.name}));
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
        const { fields, loading } = this.state;
        return (
            <Modal
                title={<LocaleComponent transKey="treatment.add" />}
                visible={visible}
                onCancel={onCancel}
                footer={null}
            >
                <TreatmentForm
                    onChange={this.handleFormChange}
                    fields={fields}
                    onSubmit={this.handleSubmit}
                    loading={loading}
                />
            </Modal>
        );
    }
}
