import React from 'react';
import { Input, Checkbox } from 'antd';
import List from 'react-virtualized/dist/commonjs/List';

export default class TableColumnFilter extends React.Component {
    constructor(props) {
        super();
        this.state = {
            searchText: '',
            selectedValues: props.selectedValues || [],
        };
    }

    triggerChange = () => {
        this.list.forceUpdateGrid();
        if (this.props.onChange) {
            this.props.onChange(this.props.name, this.state.selectedValues);
        }
    };

    onInputChange = (e) => {
        const searchText = e.target.value;
        const searchTextUpper = searchText.toUpperCase();
        let selectedValues;
        if (searchText.length === 0) {
            selectedValues = [];
        } else {
            selectedValues = this.props.values
                .filter(v => v.text.toUpperCase().indexOf(searchTextUpper) !== -1)
                .map(v => v.value);
        }

        this.setState(
            {
                searchText,
                selectedValues,
            },
            this.triggerChange,
        );
    };

    selectValue = (value) => {
        const { selectedValues } = this.state;
        if (selectedValues.indexOf(value) === -1) {
            selectedValues.push(value);
            this.setState(
                {
                    selectedValues,
                },
                this.triggerChange,
            );
        }
    };

    deselectValue = (value) => {
        const { selectedValues } = this.state;
        const i = selectedValues.indexOf(value);
        if (i !== -1) {
            selectedValues.splice(i, 1);
            this.setState(
                {
                    selectedValues,
                },
                this.triggerChange,
            );
        }
    };

    render() {
        const { values } = this.props;
        const { searchText } = this.state;
        return (
            <div className="table-column-filter-dropdown">
                <Input placeholder="Rechercher" value={searchText} onChange={this.onInputChange} />
                <List
                    ref={(r) => {
                        this.list = r;
                    }}
                    height={300}
                    overscanRowCount={4}
                    rowCount={values.length}
                    rowHeight={30}
                    rowRenderer={this.renderRow}
                    width={250}
                />
            </div>
        );
    }

    renderRow = ({ index, key, style }) => {
        const { values } = this.props;
        const { selectedValues } = this.state;
        const value = values.sort((v1,v2) => v1.text > v2.text ? 1 : -1)[index];
        if (!value) {
            return null;
        }

        return (
            <div key={key} className="list-row" style={style}>
                <Checkbox
                    checked={selectedValues.indexOf(value.value) !== -1}
                    onChange={(e) => {
                        if (e.target.checked) {
                            this.selectValue(value.value);
                        } else {
                            this.deselectValue(value.value);
                        }
                    }}
                >
                    {value.text}
                </Checkbox>
            </div>
        );
    };
}
