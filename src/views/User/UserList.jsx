import React from "react";

import { Table, Button, Tooltip } from "antd";
import TableColumnFilter from "components/TableColumnFilter.jsx";
import FilterIcon from "components/FilterIcon.jsx";
import CreateUserModal from "views/User/CreateUserModal.jsx";
import EditUserModal from "views/User/EditUserModal.jsx";
import LoadingIcon from "components/LoadingIcon.jsx";
import ToastActions from "actions/ToastActions";

import Locale, { Locale as LocaleComponent } from "locale/LocaleFactory";
import ArrayService from "services/utils/ArrayService";
import StringService from "services/utils/StringService";
import FilterService from "services/utils/FilterService";
//import SecurityService from "services/SecurityService";
//import Resource from "constants/Resource";
//import Access from "constants/AccessLevel";

import UserActions from "actions/UserActions";
import UserStore from "stores/UserStore";

// Sorting Methods
function sortNameColumn(u1, u2) {
  const s1 = u1.first_name + u1.last_name;
  const s2 = u2.first_name + u2.last_name;
  return StringService.compareCaseInsensitive(s1, s2);
}

/**
 * The list of the host users.
 */
export default class UserList extends React.Component {
  userListener;
  table;

  constructor() {
    super();
    const users = UserStore.getUsers();

    this.state = {
      loading: !users.length,
      users,

      filteredUsers: [],

      filterGlobal: "",
      filters: {
        name: []
      },

      createUserVisible: false,
      editUserVisible: false,
      userToEdit: null,
    };
  }

  componentDidMount() {
    this.userListener = UserStore.addListener(this.receiveUsers);
    this.loadUsers();
    this.updateFilters();
    // Here we set the default sorted column
    // Temporary solution waiting for AntD to propose a native way to do it.
    /*const column = this.table.findColumn("reference");
    this.table.toggleSortOrder("descend", column);*/
  }

  componentWillUnmount() {
    this.userListener.remove();
  }

  loadUsers = () => {
    this.setState({
      loading: true
    });
    UserActions.reload().then(() => {
      this.setState({
        loading: false,
      });
    });
    this.UserListener = UserStore.addListener(this.receiveUsers);
  };

  receiveUsers = () => {
    const users = UserStore.getUsers();
    this.setState(
      {
        users
      },
      this.updateFilters
    );
  };

  // Filters
  updateFilters = () => {
    const { users } = this.state;
    const filteredUsers = users.filter(this.userMatchFilters);
    this.setState({ filteredUsers });
  };

  userMatchFilters = u => {
    const { filters } = this.state;
    return (
      FilterService.matchFilter(filters.user, u.id) &&
      this.matchGlobalSearch(u)
    );
  };


  searchGlobal = e => {
    this.state.filterGlobal = e.target.value.toLowerCase();
    this.updateFilters();
  };

  matchGlobalSearch = (user) => {
    const { filterGlobal } = this.state;
    return (
      user.first_name.toLowerCase().indexOf(filterGlobal) > -1 ||
      user.last_name.toLowerCase().indexOf(filterGlobal) > -1
    );
  };

  handleFilterChange = (name, values) => {
    this.state.filters[name] = values;
    this.updateFilters();
  };

  getUsers = () => (this.state.users || []).sort(sortNameColumn);

  showCreateUserModal = () => {
    this.setState({
      createUserVisible: true
    });
  };
  hideCreateUserModal = () => {
    this.setState({
      createUserVisible: false
    });
  };

  editUser = (user) => {
    this.setState({
      editUserVisible: true,
      userToEdit: user
    });
  };

  hideEditUserModal = () => {
    this.setState({
      editUserVisible: false,
      userToEdit: null
    });
  };

  handleError = err => {
    this.setState({
      loading: false
    });
    try {
      const resp = JSON.parse(err.response);
      ToastActions.createToastError(resp.message);
    } catch (e) {
      ToastActions.createToastError("Une erreur est survenue");
    }
  };

  render() {
    const { userToEdit, loading, filteredUsers } = this.state;
    
    return (
      <div className="user-list">
        {!loading && (
          //SecurityService.isGranted(Resource.USER, Access.CREATE) && (
            <Button
              type="primary"
              icon="plus"
              onClick={this.showCreateUserModal}
              style={{marginBottom: "10px"}}
            >
              <LocaleComponent transKey="user.add" />
            </Button>
        )}
        {this.renderUserTable()}

        {!loading && (
          <div
            className="actions-row"
            style={{
              marginTop:
                !filteredUsers || filteredUsers.length === 0
                  ? "10px"
                  : "-50px"
            }}
          >
          </div>
        )}

        <CreateUserModal
          onCancel={this.hideCreateUserModal}
          visible={this.state.createUserVisible}
        />
        <EditUserModal
          user={userToEdit}
          onCancel={this.hideEditUserModal}
          visible={this.state.editUserVisible}
        />
      </div>
    );
  }

  renderUserTable() {
    const { filters, filteredUsers, loading } = this.state;
    const columns = [
      {
        title: Locale.trans("user.name"),
        key: "name",
        sorter: sortNameColumn,
        //filterIcon: <FilterIcon active={filters.name.length > 0} />, // @TODO: Debug and remove comment 
        render: this.renderUserNameCell,
        filterDropdown: (
          <TableColumnFilter
            name="name"
            selectedValues={filters.user}
            values={this.getUsers().map(u => ({
              text: `${u.first_name} ${u.last_name}`,
              value: u.id
            }))}
            onChange={this.handleFilterChange}
          />
        )
      },
      {
        title: null,
        key: "actions",
        width: "50px",
        render: this.rendActionsCell
      }
    ];

    return (
      <Table
        dataSource={filteredUsers}
        rowKey="id"
        columns={columns}
        locale={Locale.Table}
        ref={r => {
          this.table = r;
        }}
        loading={loading && { indicator: <LoadingIcon /> }}
      />
    );
  }

  renderUserNameCell = user => `${user.first_name} ${user.last_name}`;

  rendActionsCell = (user) => (
    <React.Fragment>
      <div className="actions-row">
        <Tooltip title={Locale.trans("edit")}>
          <Button
            type="primary"
            shape="circle"
            icon="edit"
            onClick={e => {
              this.editUser(user);
              e.stopPropagation();
              e.preventDefault();
              return false;
            }}
          />
        </Tooltip>
        {/*<Tooltip title={Locale.trans("delete")}>
          <Button
            type="danger"
            shape="circle"
            icon="delete"
            onClick={e => {
              UserActions.delete(user.id)
              .then(() => {
                  this.setState({
                      fields: {},
                      loading: false,
                  });
                  ToastActions.createToastSuccess(Locale.trans('user.delete.success', {name: user.name}));
                  this.props.onCancel();
              })
              .catch(this.handleError);
              return false;
            }}
          />
          </Tooltip>*/}
      </div>
    </React.Fragment>
  );
}
