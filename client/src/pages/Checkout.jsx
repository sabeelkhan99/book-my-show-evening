import React, { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Card, Typography, Button, Result } from 'antd';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { createPayment } from '../lib/apis';

const { Title, Text } = Typography;

// Initialize Stripe once at module scope
const stripePromise = loadStripe(
  'pk_test_51JuxF0SGX1daegGAyeFXMeI2X0m7Oq9dPFjR9kiiaTsZX4PwQGv2DtdcABKm8tP5W0Dodit2R8JsgytxVBJeDv8800sLcUDZMe'
);

const useQuery = () => {
  const location = useLocation();
  return useMemo(() => new URLSearchParams(location.search), [location.search]);
};

const Checkout = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [paymentError, setPaymentError] = useState(null);

  const bookingId = query.get('bookingId');
  const amountParam = query.get('amount');

  const amount = amountParam ? Number(amountParam) : null;

  const fetchClientSecret = useCallback(async () => {
    if (!bookingId || !amount) {
      throw new Error('Missing booking information for checkout.');
    }

    setPaymentError(null);

    try {
      const res = await createPayment({
        amount,
        bookingId,
        method: 'CARD',
      });

      const payload = res?.payload;
      if (!payload?.clientSecret) {
        const errMsg = res?.message || 'Unable to start payment: missing client secret.';
        setPaymentError(errMsg);
        throw new Error(errMsg);
      }

      return payload.clientSecret;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Unable to start payment.';
      setPaymentError(errMsg);
      throw err;
    }
  }, [amount, bookingId]);

  if (!bookingId || !amount) {
    return (
      <div
        style={{
          padding: '24px 16px 48px',
          maxWidth: 600,
          margin: '0 auto',
        }}
      >
        <Card>
          <Result
            status="error"
            title="Missing booking details"
            subTitle="We couldn't find booking information needed for checkout."
            extra={
              <Button type="primary" onClick={() => navigate('/')}>
                Go to Home
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  const options = { fetchClientSecret };

  return (
    <div
      style={{
        padding: '24px 16px 48px',
        maxWidth: 800,
        margin: '0 auto',
      }}
    >
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Title level={3} style={{ marginBottom: 4 }}>
            Complete your payment
          </Title>
          <Text type="secondary">
            Booking ID: {bookingId} • Amount: ₹{amount}
          </Text>
        </div>

        {paymentError && (
          <div style={{ marginBottom: 16 }}>
            <Result
              status="error"
              title="Unable to start payment"
              subTitle={paymentError}
            />
          </div>
        )}

        <div id="checkout">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </Card>
    </div>
  );
};

export default Checkout;

