import React from 'react';
import { Card, Form, Input, InputNumber, Button, Typography, Alert } from 'antd';
import { useNavigate } from 'react-router';
import useHttp from '../hooks/useHttp';
import { createTheatre } from '../lib/apis';

const { Title, Text } = Typography;

const CreateTheatre = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { data, isLoading, error, sendRequest } = useHttp(createTheatre, false);

  const onFinish = async (values) => {
    await sendRequest(values);
  };

  if (data && data.success) {
    // On successful creation, navigate back to home (movies list)
    navigate('/');
  }

  return (
    <div
      style={{
        padding: '48px 24px',
        maxWidth: 500,
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
        <Title level={3} style={{ marginBottom: 8, fontWeight: 600 }}>
          Create Theatre
        </Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
          Add a new theatre to manage your shows.
        </Text>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            style={{ marginBottom: 24 }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          size="large"
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label="Theatre Name"
            rules={[{ required: true, message: 'Please enter theatre name' }]}
          >
            <Input placeholder="Enter theatre name" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please enter theatre address' }]}
          >
            <Input.TextArea
              placeholder="Enter theatre address"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>

          <Form.Item
            name="capacity"
            label="Capacity"
            rules={[
              { required: true, message: 'Please enter seating capacity' },
            ]}
          >
            <InputNumber
              min={1}
              style={{ width: '100%' }}
              placeholder="Enter total seats"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
              disabled={isLoading}
            >
              Create Theatre
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateTheatre;

