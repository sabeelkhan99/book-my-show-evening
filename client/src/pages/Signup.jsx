import React from 'react';
import { Form, Input, Button, Card, Typography, Alert, Radio } from 'antd';
import { Link } from 'react-router';
import useHttp from '../hooks/useHttp';
import { registerUser } from '../lib/apis';
import { Navigate } from 'react-router';

const { Title, Text } = Typography;

const Signup = () => {
    const [form] = Form.useForm();
    const {data, isLoading, error, sendRequest} =  useHttp(registerUser, false)

    const onFinish = async (values) => {
        sendRequest(values);
    };

    if(!isLoading && data) {
        return <Navigate to="/login" />
    }

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
                    Sign Up
                </Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                    Create your Book My Show account
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
                        name="username"
                        label="Username"
                        rules={[
                            { required: true, message: 'Please choose a username' },
                            { min: 3, message: 'Username must be at least 3 characters' },
                            { max: 20, message: 'Username must be at most 20 characters' },
                        ]}
                    >
                        <Input placeholder="Choose a username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            { required: true, message: 'Please enter a password' },
                            { min: 6, message: 'Password must be at least 6 characters' },
                        ]}
                    >
                        <Input.Password placeholder="Create a password" />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Role"
                        initialValue="USER"
                        rules={[
                            { required: true, message: 'Please select a role' },
                        ]}
                    >
                        <Radio.Group>
                            <Radio.Button value="USER">User</Radio.Button>
                            <Radio.Button value="PARTNER">Partner</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 16, marginTop: 24 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            Sign Up
                        </Button>
                    </Form.Item>
                    <Text type="secondary">
                        Already have an account? <Link to="/login">Login</Link>
                    </Text>
                </Form>
            </Card>
        </div>
    );
};

export default Signup;
