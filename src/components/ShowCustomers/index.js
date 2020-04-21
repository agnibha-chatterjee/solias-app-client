import React from 'react';
import { Table, Input, Button } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import reqwest from 'reqwest';
import { withRouter } from 'react-router-dom';

class ShowCustomers extends React.Component {
    state = {
        data: [],
        pagination: {},
        loading: false,
        searchText: '',
        searchedColumn: '',
    };

    componentDidMount() {
        this.fetch();
    }

    getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={(node) => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        this.handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type='primary'
                    onClick={() =>
                        this.handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    icon={<SearchOutlined />}
                    size='small'
                    style={{ width: 90, marginRight: 8 }}>
                    Search
                </Button>
                <Button
                    onClick={() => this.handleReset(clearFilters)}
                    size='small'
                    style={{ width: 90 }}>
                    Reset
                </Button>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{ color: filtered ? '#1890ff' : undefined }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: (text) =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text.toString()}
                />
            ) : (
                text
            ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.fetch({
            results: pagination.pageSize,
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
        });
    };

    fetch = (params = {}) => {
        this.setState({ loading: true });
        reqwest({
            url: 'http://localhost:5000/customers',
            method: 'get',
            data: {
                results: 10,
                ...params,
            },
            type: 'json',
        }).then((data) => {
            const pagination = { ...this.state.pagination };
            // Read total count from server
            // pagination.total = data.totalCount;
            const tableData = data.map((customer, index) => {
                return {
                    key: index,
                    name: `${customer.firstName} ${customer.lastName}`,
                    sc: customer['subscriptions'].length,
                    ...customer,
                };
            });
            pagination.total = 5;
            this.setState({
                loading: false,
                data: tableData,
                pagination,
            });
        });
    };

    render() {
        const { history } = this.props;
        const columns = [
            {
                title: 'ID',
                dataIndex: '_id',
                width: '20%',
                ...this.getColumnSearchProps('_id'),
            },
            {
                title: 'Name',
                dataIndex: 'name',
                width: '20%',
                ...this.getColumnSearchProps('name'),
            },
            {
                title: 'Email',
                dataIndex: 'email',
                width: '20%',
                ...this.getColumnSearchProps('email'),
            },
            {
                title: 'Subscription count',
                dataIndex: 'sc',
                width: '20%',
            },
            {
                title: 'Action',
                key: 'action',
                render: () => (
                    <Button type='primary'>View subscriptions</Button>
                ),
                width: '20%',
            },
        ];

        return (
            <Table
                columns={columns}
                rowKey={(record) => record._id}
                dataSource={this.state.data}
                pagination={this.state.pagination}
                loading={this.state.loading}
                onChange={this.handleTableChange}
                onRow={(record) => {
                    return {
                        onClick: () => {
                            return history.push('/subscriptions', record);
                        },
                    };
                }}
            />
        );
    }
}

export default withRouter(ShowCustomers);
