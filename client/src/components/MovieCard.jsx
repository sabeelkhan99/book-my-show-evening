import React from 'react';
import { Card } from 'antd';
import { useNavigate } from 'react-router';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { _id, title, posterUrl, genre } = movie;

  return (
    <Card
      hoverable
      onClick={() => navigate(`/movies/${_id}`)}
      cover={
        <div
          style={{
            aspectRatio: '2/3',
            overflow: 'hidden',
            background: '#1a1a1a',
          }}
        >
          <img
            alt={title}
            src={posterUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      }
      styles={{
        body: { padding: '12px 0 0' },
      }}
      style={{
        borderRadius: 8,
        overflow: 'hidden',
        maxWidth: 280,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          fontWeight: 600,
          fontSize: 'clamp(14px, 2.5vw, 16px)',
          lineHeight: 1.3,
        }}
      >
        {title}
      </div>
      {genre && (
        <div
          style={{
            marginTop: 4,
            fontSize: 'clamp(11px, 2vw, 12px)',
            color: 'rgba(0,0,0,0.55)',
          }}
        >
          {genre}
        </div>
      )}
    </Card>
  );
};

export default MovieCard;
