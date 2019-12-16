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
import SecurityService from "services/SecurityService";
import Resource from "constants/Resource";
import Access from "constants/AccessLevel";

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
  archivedTreatmentListener;
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
      archivedVisible: false,
      selectedRowKeys: [],
    };
  }

  componentDidMount() {
    this.treatmentListener = TreatmentStore.addListener(this.receiveTreatments);
    this.archivedTreatmentListener = TreatmentStore.addListener(this.receiveArchivedTreatments);
    this.loadTreatments();
    this.updateFilters();
    // Here we set the default sorted column
    // Temporary solution waiting for AntD to propose a native way to do it.
    /*const column = this.table.findColumn("reference");
    this.table.toggleSortOrder("descend", column);*/
  }

  componentWillUnmount() {
    this.treatmentListener.remove();
    this.archivedTreatmentListener.remove();
  }

  loadTreatments = () => {
    this.setState({
      loading: true
    });
    TreatmentActions.reload().then(() => {
      this.setState({
        loading: false,
        archivedVisible: false,
        selectedRowKeys : [],
      });
    });
    this.TreatmentListener = TreatmentStore.addListener(this.receiveTreatments);
  };

  loadArchivedTreatments = () => {
    this.setState({
      loading: true,
    });
    TreatmentActions.reloadArchived().then(() => {
      this.setState({
        loading: false,
        archivedVisible: true,
        selectedRowKeys : [],
      });
    });
    this.archivedTreatmentListener = TreatmentStore.addListener(this.receiveArchivedTreatments);
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

  receiveArchivedTreatments = () => {
    this.setState(
      {
        treatments: TreatmentStore.getArchivedTreatments()
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

  archiving = (treatment, toasVisible) => {
    const { archivedVisible } = this.state;
    if (!treatment) return;
    this.setState({
      loading: true
    });
    return new Promise((resolve, reject) => {
      TreatmentActions.archiving(treatment.id).then(newTreatment => {
        resolve(newTreatment);
        this.setState({
          loading: false
        });
        if(toasVisible) {
          ToastActions.createToastSuccess(
            archivedVisible ? `Compétence " ${treatment.name} " rétablit` : `Compétence "${treatment.name} " archivé` 
          );
        }
      }).catch(this.handleError);
    })
  };

  archiveSelected = () => {
    const { selectedRowKeys, archivedVisible } = this.state;
    const promises = selectedRowKeys.map(r => {
      this.setState({
        loading: true
      });
      const treatment = archivedVisible ? TreatmentStore.getArchivedById(r) : TreatmentStore.getById(r);
      this.archiving(treatment, false);
    });
    return Promise.all(promises).then(() => {
      ToastActions.createToastSuccess(
        archivedVisible ? "Compétences rétablis" : "Compétences archivés" 
      );
    });
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
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
    const { treatmentToEdit, loading, filteredTreatments, archivedVisible, selectedRowKeys } = this.state;
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div className="treatment-list">
        {!loading &&
          SecurityService.isGranted(Resource.TREATMENT, Access.CREATE) && (
            <Button
              type="primary"
              icon="plus"
              onClick={this.showCreateTreatmentModal}
            >
              <LocaleComponent transKey="treatment.add" />
            </Button>
        )}
        {!loading &&
          <Button
            type="danger"
            style={{color: !archivedVisible && "#f04134", marginBottom: "1%", float: "right"}}
            ghost={!archivedVisible}
            icon={archivedVisible ? "eye" : "eye-invisible"}
            onClick={() => {archivedVisible ? this.loadTreatments() : this.loadArchivedTreatments()} }
          >
              {archivedVisible ? Locale.trans("archive.unarchived") : Locale.trans("archive.archived")}  
          </Button>
        }
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
            {selectedRowKeys.length > 0 && (
              <Button icon={archivedVisible ? "eye" : "eye-invisible"} type="danger" onClick={this.archiveSelected} disabled={!hasSelected} loading={loading}>
                {archivedVisible ? `Rétablir ${selectedRowKeys.length} compétence(s)` : `Archiver ${selectedRowKeys.length} compétence(s)`}
              </Button>
            )}
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
    const { filters, filteredTreatments, selectedRowKeys, loading } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const columns = [
      {
        title: Locale.trans("treatment.name"),
        key: "name",
        sorter: sortNameColumn,
        filterIcon: <FilterIcon active={filters.name.length > 0} />,
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
        rowSelection={rowSelection}
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
        {this.state.archivedVisible ? (
          <Tooltip title={Locale.trans("archive.unarchive")}>
            <Button
              shape="circle"
              icon="eye"
              onClick={() => this.archiving(treatment, true)}
            />
          </Tooltip>
        ) : (
          <Tooltip title={Locale.trans("archive.action")}>
            <Button
              shape="circle"
              icon="eye-invisible"
              onClick={() => this.archiving(treatment, true)}
            />
          </Tooltip>
        )}
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
      </div>
    </React.Fragment>
  );
}
