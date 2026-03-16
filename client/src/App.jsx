import React from 'react';
import Layout from './components/Layout';
import { Route, Routes } from 'react-router';
import AllMovies from './pages/AllMovies';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ShowMovie from './pages/ShowMovie';
import CreateTheatre from './pages/CreateTheatre';
import Theatres from './pages/Theatres';
import TheatreDetails from './pages/TheatreDetails';
import Checkout from './pages/Checkout';
import PaymentReturn from './pages/PaymentReturn';
import MyBookings from './pages/MyBookings';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<AllMovies />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/movies/:id" element={<ShowMovie />} />
        <Route path="/theatres" element={<Theatres />} />
        <Route path="/theatres/:id" element={<TheatreDetails />} />
        <Route path="/theatres/new" element={<CreateTheatre />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payments/return" element={<PaymentReturn />} />
      </Routes>
    </Layout>
  );
};

export default App;
