import React, { useContext } from 'react';
import { Layout as AntLayout, Typography, Space, Avatar, Dropdown } from 'antd';
import { Link } from 'react-router';
import UserContext from '../context/user-context';

const { Header, Content, Footer } = AntLayout;
const { Text } = Typography;

const Layout = (props) => {
  const { user, isAuthenticated, logout } = useContext(UserContext);

  const profileMenuItems = [
    {
      key: 'username',
      label: user?.username,
      disabled: true,
    },
    {
      key: 'email',
      label: user?.email,
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'my-bookings',
      label: <Link to="/bookings">My Bookings</Link>,
    },
    ...(user?.role === 'PARTNER'
      ? [
          {
            key: 'create-theatre',
            label: <Link to="/theatres/new">Create Theatre</Link>,
          },
          { type: 'divider' },
        ]
      : []),
    {
      key: 'logout',
      label: 'Logout',
      onClick: logout,
    },
  ];

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          <Text strong style={{ fontSize: 20 }}>
            Book My Show
          </Text>
        </Link>
        <Space style={{ marginLeft: 'auto' }} size="middle">
          <Link to="/" style={{ color: 'inherit' }}>
            Movies
          </Link>
          {isAuthenticated && user?.role === 'PARTNER' && (
            <Link to="/theatres" style={{ color: 'inherit' }}>
              Theatres
            </Link>
          )}
          {isAuthenticated ? (
            <Dropdown menu={{ items: profileMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: '#1890ff' }}>
                  {user?.username?.[0]?.toUpperCase()}
                </Avatar>
                <Text>{user?.username}</Text>
              </Space>
            </Dropdown>
          ) : (
            <>
              <Link to="/login" style={{ color: 'inherit' }}>
                Login
              </Link>
              <Link to="/signup" style={{ color: 'inherit' }}>
                Sign Up
              </Link>
            </>
          )}
        </Space>
      </Header>
      <Content style={{ padding: '0 24px', flex: 1 }}>
        {props.children}
      </Content>
      <Footer
        style={{
          textAlign: 'center',
          background: '#fafafa',
          borderTop: '1px solid #f0f0f0',
        }}
      >
        <Text type="secondary">
          © {new Date().getFullYear()} Book My Show. All rights reserved.
        </Text>
      </Footer>
    </AntLayout>
  );
};

export default Layout;
