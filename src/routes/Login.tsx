import React, { useCallback, useEffect } from 'react';
import { setAccessToken } from "../storage/index.ts";
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@chakra-ui/react'

const Login = () => {
  let navigate = useNavigate();

  const login = useCallback(async (code?: string) => {
    try {
      if (!code) {
        throw new Error('No code');
      }
      const data = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login?` + new URLSearchParams({ code }));
      const { accessToken, error } = await data.json();
      if (error) {
        throw new Error(error);
      }
      setAccessToken(accessToken);
      navigate('/events');
    } catch (e) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    login(code);
  }, [login]);

  return (
    <CircularProgress isIndeterminate color='green.300' size='120px' />
  );
};

export default Login;
