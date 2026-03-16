import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, Row, Col, Typography, Spin, Tag, Button, Modal, Radio, Space, message } from 'antd';
import useHttp from '../hooks/useHttp';
import { fetchMovieById, createBooking } from '../lib/apis';
import UserContext from '../context/user-context';
import { loadStripe } from '@stripe/stripe-js';

const { Title, Text } = Typography;

// TODO: replace with your real Stripe publishable key from the Dashboard
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const ShowMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error, sendRequest } = useHttp(fetchMovieById, true);
  const { user, isAuthenticated } = useContext(UserContext);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTheatreId, setSelectedTheatreId] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const {
    data: bookingData,
    isLoading: bookingLoading,
    error: bookingError,
    sendRequest: bookingRequest,
  } = useHttp(createBooking, false);

  useEffect(() => {
    if (id) {
      sendRequest(id);
    }
  }, [id]);

  useEffect(() => {
    if (bookingError) {
      message.error(bookingError);
    }
  }, [bookingError]);

  useEffect(() => {
    if (!bookingLoading && bookingData?.success) {
      const booking = bookingData.payload;
      message.success('Booking created, redirecting to checkout...');
      setIsBookingModalOpen(false);
      setSelectedSeats([]);
      setSelectedTheatreId(null);

      const amount = Number(booking.totalPrice);
      navigate(
        `/checkout?bookingId=${encodeURIComponent(
          booking._id
        )}&amount=${encodeURIComponent(amount)}`
      );
    }
  }, [bookingData, bookingLoading, navigate]);

  const movie = data?.payload;

  const theatres = useMemo(() => {
    if (!movie || !Array.isArray(movie.theatres)) return [];
    return movie.theatres.map((t) =>
      typeof t === 'object' ? t : { _id: t, name: `Theatre ${t}` }
    );
  }, [movie]);

  const hasTheatres = theatres.length > 0;

  const seatRows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seatCols = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const PRICE_PER_SEAT = 200;

  const toggleSeatSelection = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  const openBookingModal = () => {
    if (!isAuthenticated) {
      message.info('Please login to book tickets');
      navigate('/login');
      return;
    }
    if (!hasTheatres) {
      message.info('No theatres are available for this movie yet.');
      return;
    }
    setIsBookingModalOpen(true);
  };

  const handleBooking = () => {
    if (!selectedTheatreId) {
      message.warning('Please select a theatre.');
      return;
    }
    if (selectedSeats.length === 0) {
      message.warning('Please select at least one seat.');
      return;
    }

    const totalPrice = String(selectedSeats.length * PRICE_PER_SEAT);

    bookingRequest({
      totalPrice,
      theatreId: selectedTheatreId,
      movieId: movie._id,
      seats: selectedSeats,
    });
  };

  return (
    <div
      style={{
        padding: '24px 16px 48px',
        maxWidth: 1200,
        margin: '0 auto',
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <Button onClick={() => navigate(-1)}>Back</Button>
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

      {movie && !isLoading && (
        <Card
          style={{
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <Row gutter={[32, 24]}>
            <Col xs={24} md={9}>
              <div
                style={{
                  aspectRatio: '2/3',
                  overflow: 'hidden',
                  background: '#1a1a1a',
                  borderRadius: 8,
                }}
              >
                <img
                  alt={movie.title}
                  src={movie.posterUrl}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            </Col>

            <Col xs={24} md={15}>
              <div style={{ marginBottom: 12 }}>
                <Title level={2} style={{ marginBottom: 4 }}>
                  {movie.title}
                </Title>
                {movie.runtime && (
                  <Text type="secondary">
                    {movie.runtime} min
                  </Text>
                )}
              </div>

              {movie.description && (
                <div style={{ marginBottom: 24 }}>
                  <Title level={5} style={{ marginBottom: 8 }}>
                    About the movie
                  </Title>
                  <Text>{movie.description}</Text>
                </div>
              )}

              {Array.isArray(movie.cast) && movie.cast.length > 0 && (
                <div>
                  <Title level={5} style={{ marginBottom: 12 }}>
                    Cast
                  </Title>
                  <Row gutter={[16, 16]}>
                    {movie.cast.map((member) => (
                      <Col key={member._id} xs={12} sm={8} md={6}>
                        <div
                          style={{
                            textAlign: 'center',
                          }}
                        >
                          <div
                            style={{
                              width: 96,
                              height: 96,
                              margin: '0 auto 8px',
                              borderRadius: '50%',
                              overflow: 'hidden',
                              background: '#1a1a1a',
                            }}
                          >
                            <img
                              alt={member.name}
                              src={member.profilePicture}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          </div>
                          <div style={{ fontWeight: 500 }}>{member.name}</div>
                          {member.alias && (
                            <Tag
                              color="default"
                              style={{
                                marginTop: 4,
                                fontSize: 11,
                              }}
                            >
                              as {member.alias}
                            </Tag>
                          )}
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
              <div style={{ marginTop: 24 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                  }}
                >
                  <Title level={4} style={{ margin: 0 }}>
                    Theatres
                  </Title>
                  {hasTheatres && (
                    <Button type="primary" onClick={openBookingModal}>
                      Book Ticket
                    </Button>
                  )}
                </div>

                {!hasTheatres && (
                  <Text type="secondary">No theatres are playing this movie yet.</Text>
                )}

                {hasTheatres && (
                  <div>
                    {theatres.map((theatre) => (
                      <Card
                        key={theatre._id}
                        size="small"
                        style={{ marginBottom: 8 }}
                        bodyStyle={{ padding: 8 }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 500 }}>{theatre.name}</div>
                            {theatre.address && (
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {theatre.address}
                              </Text>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Card>
      )}

      <Modal
        open={isBookingModalOpen}
        title="Book Tickets"
        onCancel={() => {
          if (!bookingLoading) {
            setIsBookingModalOpen(false);
          }
        }}
        onOk={handleBooking}
        okText={bookingLoading ? 'Booking...' : 'Book'}
        okButtonProps={{ loading: bookingLoading }}
        destroyOnClose
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Title level={5} style={{ marginBottom: 8 }}>
              Select Theatre
            </Title>
            <Radio.Group
              value={selectedTheatreId}
              onChange={(e) => setSelectedTheatreId(e.target.value)}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {theatres.map((theatre) => (
                  <Radio key={theatre._id} value={theatre._id}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{theatre.name}</div>
                      {theatre.address && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {theatre.address}
                        </Text>
                      )}
                    </div>
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </div>

          {selectedTheatreId && (
            <div>
              <Title level={5} style={{ marginBottom: 8 }}>
                Select Seats
              </Title>
              <div
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: '#fafafa',
                  border: '1px solid #f0f0f0',
                }}
              >
                <div
                  style={{
                    textAlign: 'center',
                    marginBottom: 12,
                    fontSize: 12,
                    color: '#999',
                  }}
                >
                  Screen this side
                </div>
                {seatRows.map((row) => (
                  <div
                    key={row}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 6,
                      gap: 8,
                    }}
                  >
                    <div style={{ width: 20, textAlign: 'center', fontWeight: 500 }}>
                      {row}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {seatCols.map((col) => {
                        const seatId = `${row}${col}`;
                        const isSelected = selectedSeats.includes(seatId);
                        return (
                          <Button
                            key={seatId}
                            size="small"
                            type={isSelected ? 'primary' : 'default'}
                            onClick={() => toggleSeatSelection(seatId)}
                          >
                            {col}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                <Text>
                  Selected Seats:{' '}
                  {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                </Text>
                <Text strong>
                  Total: ₹{selectedSeats.length * PRICE_PER_SEAT}
                </Text>
              </div>
            </div>
          )}
        </Space>
      </Modal>
    </div>
  );
};

export default ShowMovie;

