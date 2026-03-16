import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Card, Typography, Spin, Button, Result } from 'antd';
import useHttp from '../hooks/useHttp';
import { verifyPayment } from '../lib/apis';

const { Title, Text } = Typography;

const PaymentReturn = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get('session_id');

  const {
    data,
    isLoading,
    error,
    sendRequest,
  } = useHttp(verifyPayment, false);

  useEffect(() => {
    if (sessionId) {
      sendRequest({ sessionId });
    }
  }, [sessionId]);

  const handleGoHome = () => {
    navigate('/');
  };

  const isSuccess =
    data?.success && data?.payload?.stripeSession?.paymentStatus === 'paid';

  return (
    <div
      style={{
        padding: '24px 16px 48px',
        maxWidth: 600,
        margin: '0 auto',
      }}
    >
      <Card>
        {isLoading && (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text>Finalizing your booking...</Text>
            </div>
          </div>
        )}

        {!isLoading && (error || !data?.success) && (
          <Result
            status="error"
            title="Payment verification failed"
            subTitle={error || 'We could not verify the payment status.'}
            extra={[
              <Button type="primary" key="home" onClick={handleGoHome}>
                Go to Home
              </Button>,
            ]}
          />
        )}

        {!isLoading && !error && data?.success && (
          <Result
            status={isSuccess ? 'success' : 'warning'}
            title={isSuccess ? 'Payment successful' : 'Payment not completed'}
            subTitle={
              isSuccess
                ? 'Your booking has been confirmed.'
                : 'Your payment was not completed. If this was a mistake, please try booking again.'
            }
            extra={[
              <Button type="primary" key="home" onClick={handleGoHome}>
                Go to Home
              </Button>,
            ]}
          >
            {isSuccess && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>Details</Title>
                {data.payload?.booking && (
                  <div style={{ marginBottom: 8 }}>
                    <Text>Booking ID: {data.payload.booking._id}</Text>
                  </div>
                )}
                {data.payload?.payment && (
                  <div style={{ marginBottom: 8 }}>
                    <Text>Transaction ID: {data.payload.payment.txnId}</Text>
                    <br />
                    <Text>Amount Paid: ₹{data.payload.payment.amount}</Text>
                  </div>
                )}
              </div>
            )}
          </Result>
        )}
      </Card>
    </div>
  );
};

export default PaymentReturn;

