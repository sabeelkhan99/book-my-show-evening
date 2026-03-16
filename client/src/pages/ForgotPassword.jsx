import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { Link } from 'react-router';
import useHttp from '../hooks/useHttp';
import { forgotPassword } from '../lib/apis';

const { Title, Text } = Typography;

const ForgotPassword = () => {
    const [form] = Form.useForm();

    const { isLoading, error, sendRequest } = useHttp(forgotPassword);

    const onFinish = async (values) => {
        console.log(values);
        await sendRequest({ email: values.email });

        if (!error) {
            message.success('If this email is registered, a reset link has been sent.');
            form.resetFields();
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
                    Forgot Password
                </Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                    Enter your email address and we&apos;ll send you a link to reset your password.
                </Text>
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

                    <Form.Item style={{ marginBottom: 16, marginTop: 24 }}>
                        <Button type="primary" htmlType="submit" block loading={isLoading}>
                            Send reset password link
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

export default ForgotPassword;

