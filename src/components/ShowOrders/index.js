import React from 'react';
import { Table, Input, Button, Modal, DatePicker, notification } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'redaxios';
import moment from 'moment';

class ShowOrders extends React.Component {
    state = {
        searchText: '',
        searchedColumn: '',
        selectedEvent: {},
        visible: false,
        date: '',
    };

    dateFormat = 'YYYY/MM/DD';

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = async (e) => {
        try {
            const { selectedEvent } = this.state;
            const modifiedDate = moment(this.state.date).format('YYYY/MM/D');
            const date = modifiedDate
                .split('/')
                .reduce((accum, item) => accum + item, '');
            const res = await axios.get(
                `http://localhost:5000/order/${this.props.subId}/${
                    selectedEvent._id
                }/${parseInt(date)}`
            );
            console.log(res.data);
        } catch (error) {
            notification.open({
                message: 'Error',
                duration: 1500,
            });
        }
    };

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    };

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

    render() {
        const columns = [
            {
                title: ' ID',
                dataIndex: '_id',
                width: '20%',
                ...this.getColumnSearchProps('_id'),
            },
            {
                title: 'Shopify Order ID',
                dataIndex: 'shopifyId',
                width: '20%',
                ...this.getColumnSearchProps('_id'),
            },
            {
                title: 'Shopify Order Number',
                dataIndex: 'ordNum',
                width: '20%',
                ...this.getColumnSearchProps('ordnum'),
            },

            {
                title: 'Placed',
                dataIndex: 'isPlaced',
                width: '20%',
            },
            {
                title: 'Delivery Date',
                dataIndex: 'dd',
                width: '20%',
                ...this.getColumnSearchProps('dd'),
            },
        ];
        return (
            <div style={{ marginTop: '3rem' }}>
                <Button
                    type='danger'
                    onClick={() => this.props.setShowOrders(() => false)}>
                    Hide
                </Button>
                <span style={{ float: 'right' }}>
                    Click on one of the orders to edit it's delivery date
                </span>
                <Table
                    columns={columns}
                    dataSource={this.props.data}
                    onRow={(record) => {
                        return {
                            onClick: () => {
                                const { _id } = record;
                                const order = this.props.orders.filter(
                                    (o) => o._id === _id
                                );
                                if (
                                    order[0] === undefined ||
                                    order[0] === null
                                ) {
                                    return alert('This order doesnt exist!');
                                }
                                this.setState(() => ({
                                    selectedEvent: record,
                                    date: moment(
                                        order[0].deliveryDate.toString(),
                                        'YYYY-MM-DD'
                                    ),
                                }));
                                setTimeout(() => {
                                    this.showModal();
                                }, 100);
                            },
                        };
                    }}
                />
                <Modal
                    title='Select a delivery date'
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}>
                    {this.state.date !== '' ? (
                        <>
                            <h5>Pick a delivery date</h5>
                            <DatePicker
                                value={this.state.date}
                                format={this.dateFormat}
                                onChange={(date) => this.setState({ date })}
                            />
                        </>
                    ) : (
                        <div>Loading...</div>
                    )}
                </Modal>
            </div>
        );
    }
}

export default ShowOrders;
