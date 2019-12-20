import React from 'react';
import { Modal } from 'antd';

import UserForm from 'components/forms/UserForm.jsx';

import ToastActions from 'actions/ToastActions';

import UserActions from 'actions/UserActions';
import Locale, {Locale as LocaleComponent} from 'locale/LocaleFactory';

/**
 * The modal to create a new user.
 */
export default class CreateUserModal extends React.Component {
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

    handleSubmit = (user) => {
        this.setState({
            loading: true,
        });
        UserActions.create(user)
            .then((newUser) => {
                this.setState({
                    fields: {},
                    loading: false,
                });
                ToastActions.createToastSuccess(
                    `Utilisateur "${newUser.first_name} ${newUser.last_name}" créé`
                );
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
                title={<LocaleComponent transKey="user.add" />}
                visible={visible}
                onCancel={onCancel}
                footer={null}
            >
                <UserForm
                    onChange={this.handleFormChange}
                    fields={fields}
                    onSubmit={this.handleSubmit}
                    loading={loading}
                />
            </Modal>
        );
    }
}
