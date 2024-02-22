import React, { useEffect } from 'react';
import { getAccessToken } from "../storage/index.ts";
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react'

const Home = () => {
  let navigate = useNavigate();

  useEffect(() => {
    const token = getAccessToken();

    if (token) {
      navigate('/events');
    }
  }, [navigate]);

  const auth = async () => {
    const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    const form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);

    const params = {
      client_id: process.env.REACT_APP_CLIENT_ID,
      redirect_uri: `${process.env.REACT_APP_URL}/login`,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
    };

    // Add form parameters as hidden input values.
    for (let p in params) {
      const input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', p);
      input.setAttribute('value', params[p]);
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <Button colorScheme='blue' onClick={auth}>
      Login
    </Button>
  );
};

export default Home;
