import React, { useEffect, useContext } from 'react';
import { Card, Table, Typography, Button, Spin, Alert, Space } from 'antd';
import { Link, useNavigate } from 'react-router';
import useHttp from '../hooks/useHttp';
import { fetchTheatres } from '../lib/apis';
import UserContext from '../context/user-context';

const { Title, Text } = Typography;

const Theatres = () => {
  const { user, isAuthenticated } = useContext(UserContext);
  const { data, isLoading, error, sendRequest } = useHttp(fetchTheatres, true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'PARTNER') {
      sendRequest();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== 'PARTNER') {
    return (
      <div
        style={{
          padding: '48px 24px',
          maxWidth: 800,
          margin: '0 auto',
          minHeight: 'calc(100vh - 134px)',
        }}
      >
        <Card>
          <Title level={3}>Theatres</Title>
          <Text type="danger">You are not authorized to view this page.</Text>
        </Card>
      </div>
    );
  }

  const theatres = data?.payload || [];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
    },
    {
      title: 'Owner',
      dataIndex: ['user', 'username'],
      key: 'owner',
      render: (_, record) => record.user?.username || record.user?.email || 'N/A',
    },
  ];

  return (
    <div
      style={{
        padding: '32px 0',
        maxWidth: 1000,
        margin: '0 auto',
        minHeight: 'calc(100vh - 134px)',
      }}
    >
      <Card
        style={{
          borderRadius: 8,
          border: '1px solid #f0f0f0',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        <Space
          style={{ width: '100%', marginBottom: 16, justifyContent: 'space-between' }}
          align="center"
        >
          <Title level={3} style={{ margin: 0 }}>
            Theatres
          </Title>
          <Button type="primary">
            <Link to="/theatres/new" style={{ color: 'inherit' }}>
              Create Theatre
            </Link>
          </Button>
        </Space>

        {isLoading && (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <Spin size="large" />
          </div>
        )}

        {!isLoading && error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {!isLoading && !error && (
          <>
            {theatres.length === 0 ? (
              <Text type="secondary">No theatres found.</Text>
            ) : (
              <Table
                dataSource={theatres.map((t) => ({ ...t, key: t._id }))}
                columns={columns}
                pagination={{ pageSize: 10 }}
                onRow={(record) => ({
                  onClick: () => {
                    navigate(`/theatres/${record._id}`);
                  },
                  style: { cursor: 'pointer' },
                })}
              />
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default Theatres;

