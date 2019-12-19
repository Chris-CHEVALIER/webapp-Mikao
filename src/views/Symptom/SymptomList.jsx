import React from "react";

import { Table, Button, Tooltip } from "antd";
import TableColumnFilter from "components/TableColumnFilter.jsx";
import FilterIcon from "components/FilterIcon.jsx";
import CreateSymptomModal from "views/Symptom/CreateSymptomModal.jsx";
import EditSymptomModal from "views/Symptom/EditSymptomModal.jsx";
import LoadingIcon from "components/LoadingIcon.jsx";
import ToastActions from "actions/ToastActions";

import Locale, { Locale as LocaleComponent } from "locale/LocaleFactory";
import ArrayService from "services/utils/ArrayService";
import StringService from "services/utils/StringService";
import FilterService from "services/utils/FilterService";
//import SecurityService from "services/SecurityService";
//import Resource from "constants/Resource";
//import Access from "constants/AccessLevel";

import SymptomActions from "actions/SymptomActions";
import SymptomStore from "stores/SymptomStore";

// Sorting Methods
function sortNameColumn(c1, c2) {
  return StringService.compareCaseInsensitive(c1.name, c2.name);
}

/**
 * The list of the host symptoms.
 */
export default class SymptomList extends React.Component {
  symptomListener;
  table;

  constructor() {
    super();
    const symptoms = SymptomStore.getSymptoms();

    this.state = {
      loading: !symptoms.length,
      symptoms,

      filteredSymptoms: [],

      filterGlobal: "",
      filters: {
        name: []
      },

      createSymptomVisible: false,
      editSymptomVisible: false,
      symptomToEdit: null,
    };
  }

  componentDidMount() {
    this.symptomListener = SymptomStore.addListener(this.receiveSymptoms);
    this.loadSymptoms();
    this.updateFilters();
    // Here we set the default sorted column
    // Temporary solution waiting for AntD to propose a native way to do it.
    /*const column = this.table.findColumn("reference");
    this.table.toggleSortOrder("descend", column);*/
  }

  componentWillUnmount() {
    this.symptomListener.remove();
  }

  loadSymptoms = () => {
    this.setState({
      loading: true
    });
    SymptomActions.reload().then(() => {
      this.setState({
        loading: false,
      });
    });
    this.SymptomListener = SymptomStore.addListener(this.receiveSymptoms);
  };

  receiveSymptoms = () => {
    const symptoms = SymptomStore.getSymptoms();
    this.setState(
      {
        symptoms
      },
      this.updateFilters
    );
  };

  // Filters
  updateFilters = () => {
    const { symptoms } = this.state;
    const filteredSymptoms = symptoms.filter(this.symptomMatchFilters);
    this.setState({ filteredSymptoms });
  };

  symptomMatchFilters = (s) => {
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

  matchGlobalSearch = (symptom) => {
    const { filterGlobal } = this.state;
    return symptom.name.toLowerCase().indexOf(filterGlobal) > -1;
  };

  handleFilterChange = (name, values) => {
    this.state.filters[name] = values;
    this.updateFilters();
  };

  getSymptomNames = () => ArrayService.unique(this.state.symptoms.map(s => s.name));

  showCreateSymptomModal = () => {
    this.setState({
      createSymptomVisible: true
    });
  };
  hideCreateSymptomModal = () => {
    this.setState({
      createSymptomVisible: false
    });
  };

  editSymptom = (symptom) => {
    this.setState({
      editSymptomVisible: true,
      symptomToEdit: symptom
    });
  };

  hideEditSymptomModal = () => {
    this.setState({
      editSymptomVisible: false,
      symptomToEdit: null
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
    const { symptomToEdit, loading, filteredSymptoms } = this.state;
    return (
      <div className="symptom-list">
        {!loading && (
          //SecurityService.isGranted(Resource.TREATMENT, Access.CREATE) && (
            <Button
              type="primary"
              icon="plus"
              onClick={this.showCreateSymptomModal}
              style={{marginBottom: "10px"}}
            >
              <LocaleComponent transKey="symptom.add" />
            </Button>
        )}
        {this.renderSymptomTable()}

        {!loading && (
          <div
            className="actions-row"
            style={{
              marginTop:
                !filteredSymptoms || filteredSymptoms.length === 0
                  ? "10px"
                  : "-50px"
            }}
          >
          </div>
        )}

        <CreateSymptomModal
          onCancel={this.hideCreateSymptomModal}
          visible={this.state.createSymptomVisible}
        />
        <EditSymptomModal
          symptom={symptomToEdit}
          onCancel={this.hideEditSymptomModal}
          visible={this.state.editSymptomVisible}
        />
      </div>
    );
  }

  renderSymptomTable() {
    const { filters, filteredSymptoms, loading } = this.state;
    const columns = [
      {
        title: Locale.trans("symptom.name"),
        key: "name",
        sorter: sortNameColumn,
        //filterIcon: <FilterIcon active={filters.name.length > 0} />, // @TODO: Debug and remove comment 
        render: this.renderSymptomNameCell,
        filterDropdown: (
          <TableColumnFilter
            name="name"
            selectedValues={filters.name}
            values={this.getSymptomNames().map(r => ({ text: r, value: r }))}
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
        dataSource={filteredSymptoms}
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

  renderSymptomNameCell = (symptom) => symptom.name;

  rendActionsCell = (symptom) => (
    <React.Fragment>
      <div className="actions-row">
        <Tooltip title={Locale.trans("edit")}>
          <Button
            type="primary"
            shape="circle"
            icon="edit"
            onClick={e => {
              this.editSymptom(symptom);
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
              SymptomActions.delete(symptom.id)
              .then(() => {
                  this.setState({
                      fields: {},
                      loading: false,
                  });
                  ToastActions.createToastSuccess(Locale.trans('symptom.delete.success', {name: symptom.name}));
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
