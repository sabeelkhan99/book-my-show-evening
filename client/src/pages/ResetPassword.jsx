import React, { useMemo } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router';
import useHttp from '../hooks/useHttp';
import { resetPassword } from '../lib/apis';

const { Title, Text } = Typography;

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

const ResetPassword = () => {
  const [form] = Form.useForm();
  const query = useQuery();
  const navigate = useNavigate();

  const token = query.get('token');

  const { isLoading, error, sendRequest } = useHttp(resetPassword);

  const onFinish = async (values) => {
    if (!token) {
      message.error('Reset token is missing or invalid.');
      return;
    }

    await sendRequest({ email: values.email, token, password: values.password });

    if (!error) {
      message.success('Your password has been reset successfully. Please log in with your new password.');
      navigate('/login');
    } else {
      message.error(error);
    }
  };

  return (
    <div
      style={{
        padding: '48px 24px',
        maxWidth: 400,
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
          Reset Password
        </Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
          Enter your email and new password below.
        </Text>

        {!token && (
          <Text type="danger" style={{ display: 'block', marginBottom: 16 }}>
            The reset link is invalid or missing a token.
          </Text>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          size="large"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter your new password' },
              { min: 6, message: 'Password should be at least 6 characters' },
            ]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 16, marginTop: 24 }}>
            <Button type="primary" htmlType="submit" block loading={isLoading} disabled={!token}>
              Reset password
            </Button>
          </Form.Item>

          <Text type="secondary">
            Remembered your password? <Link to="/login">Back to login</Link>
          </Text>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPassword;

