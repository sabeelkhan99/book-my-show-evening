import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, Row, Col, Typography, Spin, Tag, Button, Empty } from 'antd';
import useHttp from '../hooks/useHttp';
import { fetchBookings } from '../lib/apis';
import UserContext from '../context/user-context';

const { Title, Text } = Typography;

const MyBookings = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = React.useContext(UserContext);
  const { data, isLoading, error, sendRequest } = useHttp(fetchBookings, true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    sendRequest();
  }, [isAuthenticated, navigate]);

  const bookings = data?.payload ?? [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'green';
      case 'PENDING':
        return 'orange';
      case 'CANCELLED':
        return 'red';
      default:
        return 'default';
    }
  };

  return (
    <div
      style={{
        padding: '24px 0 48px',
        maxWidth: 900,
        margin: '0 auto',
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>My Bookings</Title>
        <Text type="secondary">View all your ticket bookings</Text>
      </div>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <Spin size="large" />
        </div>
      )}

      {error && !isLoading && (
        <Card>
          <Text type="danger">{error}</Text>
        </Card>
      )}

      {!isLoading && !error && bookings.length === 0 && (
        <Card>
          <Empty
            description="You have no bookings yet"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={() => navigate('/')}>
              Browse Movies
            </Button>
          </Empty>
        </Card>
      )}

      {!isLoading && !error && bookings.length > 0 && (
        <Row gutter={[16, 16]}>
          {bookings.map((booking) => (
            <Col key={booking._id} xs={24}>
              <Card
                hoverable
                onClick={() => booking.movie && navigate(`/movies/${booking.movie._id}`)}
                style={{ cursor: booking.movie ? 'pointer' : 'default' }}
              >
                <Row gutter={[24, 16]} align="middle">
                  <Col xs={24} md={6}>
                    {booking.movie?.posterUrl && (
                      <div
                        style={{
                          aspectRatio: '2/3',
                          borderRadius: 8,
                          overflow: 'hidden',
                          background: '#f0f0f0',
                        }}
                      >
                        <img
                          src={booking.movie.posterUrl}
                          alt={booking.movie.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                    )}
                  </Col>
                  <Col xs={24} md={18}>
                    <div style={{ marginBottom: 8 }}>
                      <Title level={4} style={{ margin: 0 }}>
                        {booking.movie?.title ?? 'Movie'}
                      </Title>
                      {booking.theatre?.name && (
                        <Text type="secondary">{booking.theatre.name}</Text>
                      )}
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <Text>Seats: {booking.seats?.join(', ') ?? '-'}</Text>
                      <br />
                      <Text>Total: ₹{booking.totalPrice ?? '-'}</Text>
                    </div>
                    <Tag color={getStatusColor(booking.status)}>
                      {booking.status}
                    </Tag>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default MyBookings;
