import React from "react";

import { Table, Button, Tooltip } from "antd";
import TableColumnFilter from "components/TableColumnFilter.jsx";
import FilterIcon from "components/FilterIcon.jsx";
//import CreateSymptomModal from "views/Symptom/CreateSymptomModal.jsx";
//import EditSymptomModal from "views/Symptom/EditSymptomModal.jsx";
import LoadingIcon from "components/LoadingIcon.jsx";
import ToastActions from "actions/ToastActions";

import Locale, { Locale as LocaleComponent } from "locale/LocaleFactory";
import ArrayService from "services/utils/ArrayService";
import StringService from "services/utils/StringService";
import FilterService from "services/utils/FilterService";
import SecurityService from "services/SecurityService";
import Resource from "constants/Resource";
import Access from "constants/AccessLevel";

import SymptomActions from "actions/SymptomActions";
import SymptomStore from "stores/SymptomStore";

// Sorting Methods
function sortNameColumn(c1, c2) {
  return StringService.compareCaseInsensitive(c1.name, c2.name);
}

/**
 * The list of the host skills.
 */
export default class SkillList extends React.Component {
  skillListener;
  archivedSkillListener;
  table;

  constructor() {
    super();
    const skills = SkillStore.getSkills();

    this.state = {
      loading: !skills.length,
      skills,

      filteredSkills: [],

      filterGlobal: "",
      filters: {
        name: []
      },

      createSkillVisible: false,
      editSkillVisible: false,
      skillToEdit: null,
      archivedVisible: false,
      selectedRowKeys: [],
    };
  }

  componentDidMount() {
    this.skillListener = SkillStore.addListener(this.receiveSkills);
    this.archivedSkillListener = SkillStore.addListener(this.receiveArchivedSkills);
    this.loadSkills();
    this.updateFilters();
    // Here we set the default sorted column
    // Temporary solution waiting for AntD to propose a native way to do it.
    /*const column = this.table.findColumn("reference");
    this.table.toggleSortOrder("descend", column);*/
  }

  componentWillUnmount() {
    this.skillListener.remove();
    this.archivedSkillListener.remove();
  }

  loadSkills = () => {
    this.setState({
      loading: true
    });
    SkillActions.reload().then(() => {
      this.setState({
        loading: false,
        archivedVisible: false,
        selectedRowKeys : [],
      });
    });
    this.SkillListener = SkillStore.addListener(this.receiveSkills);
  };

  loadArchivedSkills = () => {
    this.setState({
      loading: true,
    });
    SkillActions.reloadArchived().then(() => {
      this.setState({
        loading: false,
        archivedVisible: true,
        selectedRowKeys : [],
      });
    });
    this.archivedSkillListener = SkillStore.addListener(this.receiveArchivedSkills);
  };

  receiveSkills = () => {
    const skills = SkillStore.getSkills();
    this.setState(
      {
        skills
      },
      this.updateFilters
    );
  };

  receiveArchivedSkills = () => {
    this.setState(
      {
        skills: SkillStore.getArchivedSkills()
      },
      this.updateFilters
    );
  };

  // Filters
  updateFilters = () => {
    const { skills } = this.state;
    const filteredSkills = skills.filter(this.skillMatchFilters);
    this.setState({ filteredSkills });
  };

  skillMatchFilters = (s) => {
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

  matchGlobalSearch = (skill) => {
    const { filterGlobal } = this.state;
    return skill.name.toLowerCase().indexOf(filterGlobal) > -1;
  };

  handleFilterChange = (name, values) => {
    this.state.filters[name] = values;
    this.updateFilters();
  };

  getSkillNames = () => ArrayService.unique(this.state.skills.map(s => s.name));

  showCreateSkillModal = () => {
    this.setState({
      createSkillVisible: true
    });
  };
  hideCreateSkillModal = () => {
    this.setState({
      createSkillVisible: false
    });
  };

  editSkill = (skill) => {
    this.setState({
      editSkillVisible: true,
      skillToEdit: skill
    });
  };

  hideEditSkillModal = () => {
    this.setState({
      editSkillVisible: false,
      skillToEdit: null
    });
  };

  archiving = (skill, toasVisible) => {
    const { archivedVisible } = this.state;
    if (!skill) return;
    this.setState({
      loading: true
    });
    return new Promise((resolve, reject) => {
      SkillActions.archiving(skill.id).then(newSkill => {
        resolve(newSkill);
        this.setState({
          loading: false
        });
        if(toasVisible) {
          ToastActions.createToastSuccess(
            archivedVisible ? `Compétence " ${skill.name} " rétablit` : `Compétence "${skill.name} " archivé` 
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
      const skill = archivedVisible ? SkillStore.getArchivedById(r) : SkillStore.getById(r);
      this.archiving(skill, false);
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
    const { skillToEdit, loading, filteredSkills, archivedVisible, selectedRowKeys } = this.state;
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div className="skill-list">
        {!loading &&
          SecurityService.isGranted(Resource.SKILL, Access.CREATE) && (
            <Button
              type="primary"
              icon="plus"
              onClick={this.showCreateSkillModal}
            >
              <LocaleComponent transKey="skill.add" />
            </Button>
        )}
        {!loading &&
          <Button
            type="danger"
            style={{color: !archivedVisible && "#f04134", marginBottom: "1%", float: "right"}}
            ghost={!archivedVisible}
            icon={archivedVisible ? "eye" : "eye-invisible"}
            onClick={() => {archivedVisible ? this.loadSkills() : this.loadArchivedSkills()} }
          >
              {archivedVisible ? Locale.trans("archive.unarchived") : Locale.trans("archive.archived")}  
          </Button>
        }
        {this.renderSkillTable()}

        {!loading && (
          <div
            className="actions-row"
            style={{
              marginTop:
                !filteredSkills || filteredSkills.length === 0
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

        <CreateSkillModal
          onCancel={this.hideCreateSkillModal}
          visible={this.state.createSkillVisible}
        />
        <EditSkillModal
          skill={skillToEdit}
          onCancel={this.hideEditSkillModal}
          visible={this.state.editSkillVisible}
        />
      </div>
    );
  }

  renderSkillTable() {
    const { filters, filteredSkills, selectedRowKeys, loading } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const columns = [
      {
        title: Locale.trans("skill.name"),
        key: "name",
        sorter: sortNameColumn,
        filterIcon: <FilterIcon active={filters.name.length > 0} />,
        render: this.renderSkillNameCell,
        filterDropdown: (
          <TableColumnFilter
            name="name"
            selectedValues={filters.name}
            values={this.getSkillNames().map(r => ({ text: r, value: r }))}
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
        dataSource={filteredSkills}
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

  renderSkillNameCell = (skill) => skill.name;

  rendActionsCell = (skill) => (
    <React.Fragment>
      <div className="actions-row">
        {this.state.archivedVisible ? (
          <Tooltip title={Locale.trans("archive.unarchive")}>
            <Button
              shape="circle"
              icon="eye"
              onClick={() => this.archiving(skill, true)}
            />
          </Tooltip>
        ) : (
          <Tooltip title={Locale.trans("archive.action")}>
            <Button
              shape="circle"
              icon="eye-invisible"
              onClick={() => this.archiving(skill, true)}
            />
          </Tooltip>
        )}
        <Tooltip title={Locale.trans("edit")}>
          <Button
            type="primary"
            shape="circle"
            icon="edit"
            onClick={e => {
              this.editSkill(skill);
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
