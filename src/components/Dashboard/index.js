import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './Dashboard.css';

import ShowCustomers from '../ShowCustomers';
import { NavLink, useLocation } from 'react-router-dom';
import Subscriptions from '../Subscriptions';

const { Header, Content, Footer, Sider } = Layout;

function Dashboard() {
    const { pathname } = useLocation();
    return (
        <Layout>
            <Sider breakpoint='lg' collapsedWidth='0'>
                <div className='logo'>LOGO</div>
                <Menu theme='dark' mode='inline' defaultSelectedKeys={['4']}>
                    <Menu.Item key='1'>
                        <UserOutlined />
                        <NavLink to='/'>
                            {' '}
                            <span className='nav-text'>Customers</span>{' '}
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key='2'>
                        <UserOutlined />
                        <NavLink to='/subscriptions'>
                            {' '}
                            <span className='nav-text'>Subscriptions</span>{' '}
                        </NavLink>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header
                    className='site-layout-sub-header-background'
                    style={{ padding: 0, textAlign: 'center' }}>
                    <span style={{ fontSize: '22px' }}>XYZ Corp</span>
                </Header>
                <Content style={{ margin: '24px 16px 0' }}>
                    <div style={{ padding: 24, minHeight: '83vh' }}>
                        {pathname === '/' ? (
                            <ShowCustomers />
                        ) : (
                            <Subscriptions />
                        )}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    XYZ Corp &copy; 2020
                </Footer>
            </Layout>
        </Layout>
    );
}

export default Dashboard;
