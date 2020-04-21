import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'redaxios';
import { Spin, Empty, Row, Col, Card, Button, notification } from 'antd';
import moment from 'moment';
import ShowOrders from '../ShowOrders';

const Subscriptions = () => {
    const { state } = useLocation();
    const { push } = useHistory();

    const [subscriptions, setSubscriptions] = React.useState(() => null);
    const [showOrders, setShowOrders] = React.useState(false);
    const [selectedSubscription, setSelectedSubscription] = React.useState(
        null
    );
    const [orderData, setOrderData] = React.useState([]);

    const fetchSubscriptions = React.useCallback(async () => {
        const response = await axios.post(
            'http://localhost:5000/subscriptions',
            {
                data: state.subscriptions,
            }
        );
        if (response.data.length > 0) {
            setSubscriptions(() => ({
                subscriptions: JSON.parse(response.data),
            }));
        }
    }, [state.subscriptions]);

    React.useEffect(() => {
        fetchSubscriptions();
    }, [fetchSubscriptions]);

    const toggleShowOrders = React.useCallback((data) => {
        const da = data.orders.map((d, index) => {
            return {
                key: index,
                dd: moment(data.startDate.toString(), 'YYYY-MM-DD').format(
                    'Do MMMM YYYY'
                ),
                isPlaced: d.isPlaced.toString(),
                _id: d._id,
            };
        });
        setShowOrders(() => true);
        setSelectedSubscription(() => data);
        setOrderData(() => da);
    }, []);

    const togglePause = async (data) => {
        try {
            const toggleState = data.isPaused ? 'resume' : 'pause';
            const res = await axios.get(
                `http://localhost:5000/subscriptions/${data._id}/toggle/${toggleState}`
            );
            if (res.data) {
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            }
        } catch (error) {
            notification.open({
                message: 'Error',
                duration: 1500,
            });
        }
    };

    const showSubs = () => {
        return subscriptions.subscriptions.map((data) => {
            const date = moment(data.startDate.toString(), 'YYYY-MM-DD').format(
                'Do MMMM YYYY'
            );
            return (
                <Col key={data._id} span={8}>
                    <Card
                        title={data.productTitle}
                        bordered={false}
                        style={{ width: 450 }}>
                        <p>Subscription ID : #{data._id}</p>
                        <p>Shopify Order Number : {data.shopifyOrderNumber}</p>
                        <p>Shopify Order ID : {data.shopifyOrderId}</p>
                        <p>Start Date : {date}</p>
                        <p>Addons : {data.addOns}</p>
                        <p>
                            Receipt URL :{' '}
                            <a
                                href={data.receiptOrderStatusUrl}
                                target='_blank'
                                rel='noopener noreferrer'>
                                Click here
                            </a>
                        </p>
                        <p>
                            <Button
                                type='primary'
                                onClick={() => toggleShowOrders(data)}>
                                Show orders
                            </Button>
                            <Button
                                type='danger'
                                style={{ marginLeft: '1rem' }}
                                onClick={() => togglePause(data)}>
                                {data.isPaused ? 'Resume' : 'Pause'}
                            </Button>
                        </p>
                    </Card>
                </Col>
            );
        });
    };

    if (state === undefined || state === null || state === {}) {
        alert(`You will be redirected!`);
        return push('/');
    }
    if (subscriptions === null) return <Spin size='large' />;
    return subscriptions.subscriptions.length === 0 ? (
        <Empty />
    ) : (
        <>
            <Row gutter={16}>{showSubs()}</Row>
            {showOrders ? (
                <ShowOrders
                    data={orderData}
                    setShowOrders={setShowOrders}
                    orders={selectedSubscription.orders}
                    subId={selectedSubscription._id}
                />
            ) : null}
        </>
    );
};

export default Subscriptions;
