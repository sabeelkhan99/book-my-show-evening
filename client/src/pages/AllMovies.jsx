import React, { useEffect } from 'react';
import { fetchMovies } from '../lib/apis';
import useHttp from '../hooks/useHttp';
import { Row, Col, Spin } from 'antd';
import MovieCard from '../components/MovieCard';

const AllMovies = () => {
  const { isLoading, data, error, sendRequest } = useHttp(fetchMovies, true);

  useEffect(() => {
    sendRequest();
  }, []);

  return (
    <div
      style={{
        padding: '24px 0',
        maxWidth: 1280,
        margin: '0 auto',
      }}
    >
      {isLoading && (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <Spin size="large" />
        </div>
      )}
      {data && (
        <Row gutter={[16, 24]}>
          {data.payload.map((movie) => (
            <Col key={movie._id} xs={24} sm={12} md={8} lg={6}>
              <MovieCard movie={movie} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default AllMovies;
