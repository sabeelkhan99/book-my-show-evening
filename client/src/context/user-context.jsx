import React, { createContext, useState } from 'react'
import useHttp from '../hooks/useHttp';
import { loginUser } from '../lib/apis';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { fetchProfile } from '../lib/apis';
import { message } from 'antd';

const UserContext = createContext({
    user: null,
    isAuthenticated: false,
    login: () => { },
    logout: () => { }
});

export const UserContextProvider = (props) => {

    const {data, isLoading, error, sendRequest: loginRequestHandler} = useHttp(loginUser, false);
    const {data: profileData, isLoading: profileIsLoading, error: profileError, sendRequest: profileRequestHandler} = useHttp(fetchProfile, false);

    const [user, setUser] = useState(null);
    const navigate = useNavigate();
   
    const login = async (values) => {
        await loginRequestHandler(values);
    }

    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error]);

    // case 1: when user undergoes login via form
    useEffect(() => {
        if (!profileIsLoading && profileData) {
            setUser(profileData.payload);
        }
    }, [profileData, profileIsLoading]);

    useEffect(() => {
        if (!isLoading && data) {
            localStorage.setItem('token', data.payload.token);
            profileRequestHandler();
            navigate('/');
        }
    }, [data, isLoading]);

    //case 2: when token is already available in the local storage, in this case we need to fetch the profile and update the context
    useEffect(() => {
        profileRequestHandler();
    }, []);

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    }

    const contextValue = {
        user: user,
        isAuthenticated: user ? true: false ,
        login: login,
        logout: logout
    }

    return (
        <UserContext.Provider value = {contextValue}>
            { props.children }
    </UserContext.Provider >
  )
}

export default UserContext