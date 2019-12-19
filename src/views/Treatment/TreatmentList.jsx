import React from "react";

import { Table, Button, Tooltip } from "antd";
import TableColumnFilter from "components/TableColumnFilter.jsx";
import FilterIcon from "components/FilterIcon.jsx";
import CreateTreatmentModal from "views/Treatment/CreateTreatmentModal.jsx";
import EditTreatmentModal from "views/Treatment/EditTreatmentModal.jsx";
import LoadingIcon from "components/LoadingIcon.jsx";
import ToastActions from "actions/ToastActions";

import Locale, { Locale as LocaleComponent } from "locale/LocaleFactory";
import ArrayService from "services/utils/ArrayService";
import StringService from "services/utils/StringService";
import FilterService from "services/utils/FilterService";
//import SecurityService from "services/SecurityService";
//import Resource from "constants/Resource";
//import Access from "constants/AccessLevel";

import TreatmentActions from "actions/TreatmentActions";
import TreatmentStore from "stores/TreatmentStore";

// Sorting Methods
function sortNameColumn(c1, c2) {
  return StringService.compareCaseInsensitive(c1.name, c2.name);
}

/**
 * The list of the host treatments.
 */
export default class TreatmentList extends React.Component {
  treatmentListener;
  table;

  constructor() {
    super();
    const treatments = TreatmentStore.getTreatments();

    this.state = {
      loading: !treatments.length,
      treatments,

      filteredTreatments: [],

      filterGlobal: "",
      filters: {
        name: []
      },

      createTreatmentVisible: false,
      editTreatmentVisible: false,
      treatmentToEdit: null,
    };
  }

  componentDidMount() {
    this.treatmentListener = TreatmentStore.addListener(this.receiveTreatments);
    this.loadTreatments();
    this.updateFilters();
    // Here we set the default sorted column
    // Temporary solution waiting for AntD to propose a native way to do it.
    /*const column = this.table.findColumn("reference");
    this.table.toggleSortOrder("descend", column);*/
  }

  componentWillUnmount() {
    this.treatmentListener.remove();
  }

  loadTreatments = () => {
    this.setState({
      loading: true
    });
    TreatmentActions.reload().then(() => {
      this.setState({
        loading: false,
      });
    });
    this.TreatmentListener = TreatmentStore.addListener(this.receiveTreatments);
  };

  receiveTreatments = () => {
    const treatments = TreatmentStore.getTreatments();
    this.setState(
      {
        treatments
      },
      this.updateFilters
    );
  };

  // Filters
  updateFilters = () => {
    const { treatments } = this.state;
    const filteredTreatments = treatments.filter(this.treatmentMatchFilters);
    this.setState({ filteredTreatments });
  };

  treatmentMatchFilters = (s) => {
    const { filters } = this.state;
    return (
      FilterService.matchFilter(filters.name, s.name) &&
      this.matchGlobalSearch(s)
    );
  };

  searchGlobal = e => {
    this.state.filterGlobal = e.target.value.toLowerCase();
    this.updateFilters();
  };

  matchGlobalSearch = (treatment) => {
    const { filterGlobal } = this.state;
    return treatment.name.toLowerCase().indexOf(filterGlobal) > -1;
  };

  handleFilterChange = (name, values) => {
    this.state.filters[name] = values;
    this.updateFilters();
  };

  getTreatmentNames = () => ArrayService.unique(this.state.treatments.map(s => s.name));

  showCreateTreatmentModal = () => {
    this.setState({
      createTreatmentVisible: true
    });
  };
  hideCreateTreatmentModal = () => {
    this.setState({
      createTreatmentVisible: false
    });
  };

  editTreatment = (treatment) => {
    this.setState({
      editTreatmentVisible: true,
      treatmentToEdit: treatment
    });
  };

  hideEditTreatmentModal = () => {
    this.setState({
      editTreatmentVisible: false,
      treatmentToEdit: null
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
    const { treatmentToEdit, loading, filteredTreatments } = this.state;
    return (
      <div className="treatment-list">
        {!loading && (
          //SecurityService.isGranted(Resource.TREATMENT, Access.CREATE) && (
            <Button
              type="primary"
              icon="plus"
              onClick={this.showCreateTreatmentModal}
              style={{marginBottom: "10px"}}
            >
              <LocaleComponent transKey="treatment.add" />
            </Button>
        )}
        {this.renderTreatmentTable()}

        {!loading && (
          <div
            className="actions-row"
            style={{
              marginTop:
                !filteredTreatments || filteredTreatments.length === 0
                  ? "10px"
                  : "-50px"
            }}
          >
          </div>
        )}

        <CreateTreatmentModal
          onCancel={this.hideCreateTreatmentModal}
          visible={this.state.createTreatmentVisible}
        />
        <EditTreatmentModal
          treatment={treatmentToEdit}
          onCancel={this.hideEditTreatmentModal}
          visible={this.state.editTreatmentVisible}
        />
      </div>
    );
  }

  renderTreatmentTable() {
    const { filters, filteredTreatments, loading } = this.state;
    const columns = [
      {
        title: Locale.trans("treatment.name"),
        key: "name",
        sorter: sortNameColumn,
        //filterIcon: <FilterIcon active={filters.name.length > 0} />, // @TODO: Debug and remove comment 
        render: this.renderTreatmentNameCell,
        filterDropdown: (
          <TableColumnFilter
            name="name"
            selectedValues={filters.name}
            values={this.getTreatmentNames().map(r => ({ text: r, value: r }))}
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
        dataSource={filteredTreatments}
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

  renderTreatmentNameCell = (treatment) => treatment.name;

  rendActionsCell = (treatment) => (
    <React.Fragment>
      <div className="actions-row">
        <Tooltip title={Locale.trans("edit")}>
          <Button
            type="primary"
            shape="circle"
            icon="edit"
            onClick={e => {
              this.editTreatment(treatment);
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
              TreatmentActions.delete(treatment.id)
              .then(() => {
                  this.setState({
                      fields: {},
                      loading: false,
                  });
                  ToastActions.createToastSuccess(Locale.trans('treatment.delete.success', {name: treatment.name}));
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
