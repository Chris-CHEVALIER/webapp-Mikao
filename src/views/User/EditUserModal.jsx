import React from 'react';
import { Modal } from 'antd';

import UserForm from 'components/forms/UserForm.jsx';

import ToastActions from 'actions/ToastActions';

import UserActions from 'actions/UserActions';
import Locale, { Locale as LocaleComponent } from 'locale/LocaleFactory';

/**
 * The modal to edit a user.
 */
export default class EditUserModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
            loading: false,
            fields: this.getFieldsFromEntity(props.user),
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.visible && !this.props.visible) {
            this.setState({
                fields: this.getFieldsFromEntity(nextProps.user),
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

    handleSubmit = (user) => {
        if (!this.props.user) {
            return;
        }
        const userId = this.props.user.id;

        this.setState({
            loading: true,
        });
        UserActions.edit(userId, user)
            .then((newUser) => {
                this.setState({
                    fields: {},
                    loading: false,
                });
                ToastActions.createToastSuccess(
                    `Utilisateur "${newUser.first_name} ${newUser.last_name}" modifié`
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
        const { user, visible, onCancel } = this.props;
        const { fields, loading } = this.state;
        return (
            <Modal
                title={<LocaleComponent transKey="user.update" />}
                visible={user && visible}
                onCancel={onCancel}
                footer={null}
            >
                <UserForm
                    user={user}
                    onChange={this.handleFormChange}
                    fields={fields}
                    onSubmit={this.handleSubmit}
                    loading={loading}
                />
            </Modal>
        );
    }
}
