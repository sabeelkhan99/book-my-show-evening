import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, Typography, Spin, Alert, Descriptions, Button, Space, Select, message } from 'antd';
import useHttp from '../hooks/useHttp';
import { fetchTheatreById, fetchMovies, addMovieToTheatre } from '../lib/apis';
import UserContext from '../context/user-context';

const { Title, Text } = Typography;

const TheatreDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useContext(UserContext);
    const [selectedMovieId, setSelectedMovieId] = useState(null);

    const { data, isLoading, error, sendRequest } = useHttp(fetchTheatreById, true);

    const {
        data: moviesData,
        isLoading: moviesLoading,
        error: moviesError,
        sendRequest: fetchMoviesRequest,
    } = useHttp(fetchMovies, true);

    const {
        data: addMovieData,
        isLoading: addMovieLoading,
        error: addMovieError,
        sendRequest: addMovieRequest,
    } = useHttp(addMovieToTheatre, false);

    useEffect(() => {
        if (id && isAuthenticated && user?.role === 'PARTNER') {
            sendRequest(id);
        }
    }, [id, isAuthenticated, user]);

    useEffect(() => {
        if (isAuthenticated && user?.role === 'PARTNER') {
            fetchMoviesRequest();
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        if (addMovieError) {
            message.error(addMovieError);
        }
    }, [addMovieError]);

    useEffect(() => {
        if (!addMovieLoading && addMovieData?.success) {
            message.success('Movie added to theatre successfully');
            setSelectedMovieId(null);
            sendRequest(id);
        }
    }, [addMovieData, id]);

    const addMovieToTheatreHandler = async () => {
        if (!selectedMovieId) return;
        addMovieRequest({ movieId: selectedMovieId, theatreId: id });
    };

    const theatre = data?.payload;
    const movies = moviesData?.payload || [];

    const existingMovieIds = useMemo(() => {
        return new Set(
            (theatre?.movies || [])
                .map((m) => (typeof m === 'object' ? m?._id : m))
                .filter(Boolean)
        );
    }, [theatre?.movies]);

    const moviesToAdd = movies.filter((m) => !existingMovieIds.has(m._id));

    console.log(moviesToAdd);

    useEffect(() => {
        if (selectedMovieId && existingMovieIds.has(selectedMovieId)) {
            setSelectedMovieId(null);
        }
    }, [selectedMovieId, existingMovieIds]);

    if (!isAuthenticated || user?.role !== 'PARTNER') {
        return (
            <div
                style={{
                    padding: '48px 24px',
                    maxWidth: 800,
                    margin: '0 auto',
                    minHeight: 'calc(100vh - 134px)',
                }}
            >
                <Card>
                    <Title level={3}>Theatre Details</Title>
                    <Text type="danger">You are not authorized to view this page.</Text>
                </Card>
            </div>
        );
    }

    return (
        <div
            style={{
                padding: '32px 0',
                maxWidth: 800,
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
                <Space style={{ width: '100%', marginBottom: 16, justifyContent: 'space-between' }}>
                    <Title level={3} style={{ margin: 0 }}>
                        Theatre Details
                    </Title>
                    <Button onClick={() => navigate('/theatres')}>Back to Theatres</Button>
                </Space>

                {isLoading && (
                    <div style={{ textAlign: 'center', padding: 48 }}>
                        <Spin size="large" />
                    </div>
                )}

                {!isLoading && error && (
                    <Alert
                        message={error}
                        type="error"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}

                {!isLoading && !error && theatre && (
                    <>
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="Name">{theatre.name}</Descriptions.Item>
                            <Descriptions.Item label="Address">{theatre.address}</Descriptions.Item>
                            <Descriptions.Item label="Capacity">{theatre.capacity}</Descriptions.Item>
                            <Descriptions.Item label="Owner">
                                {theatre.user?.username || theatre.user?.email || 'N/A'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Created At">
                                {theatre.createdAt ? new Date(theatre.createdAt).toLocaleString() : 'N/A'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Updated At">
                                {theatre.updatedAt ? new Date(theatre.updatedAt).toLocaleString() : 'N/A'}
                            </Descriptions.Item>
                        </Descriptions>

                        <div style={{ marginTop: 24 }}>
                            <Title level={4} style={{ marginBottom: 8 }}>
                                Add Movie to this Theatre
                            </Title>

                            {moviesError && (
                                <Alert
                                    message={moviesError}
                                    type="error"
                                    showIcon
                                    style={{ marginBottom: 12 }}
                                />
                            )}

                            <Space align="start">
                                <Select
                                    showSearch
                                    placeholder="Select a movie"
                                    style={{ minWidth: 260 }}
                                    loading={moviesLoading}
                                    value={selectedMovieId}
                                    onChange={setSelectedMovieId}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    disabled={!moviesLoading && moviesToAdd.length === 0}
                                >
                                    {moviesToAdd.map((movie) => (
                                        <Select.Option key={movie._id} value={movie._id}>
                                            {movie.title}
                                        </Select.Option>
                                    ))}
                                </Select>

                                <Button
                                    type="primary"
                                    disabled={!selectedMovieId}
                                    loading={addMovieLoading}
                                    onClick={addMovieToTheatreHandler}
                                >
                                    Add Movie
                                </Button>
                            </Space>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

export default TheatreDetails;

