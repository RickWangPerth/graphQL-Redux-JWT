// components/Home.tsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useGetAuthDataQuery } from '../store/authApi';
import Login from '../components/Login';
import Register from '../components/Register';

const Home = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const { data: user, error, isLoading } = useGetAuthDataQuery({ token: token ?? '' }, { skip: !token });

  useEffect(() => {
    if (user) {
      console.log('User data:', user);
    }
    if (error) {
      console.error('Failed to fetch user data:', error);
    }
  }, [user, error]);

  return (
    <div>
      <h1>Home Page</h1>
      {isLoading && <p>Loading...</p>}
      {user && <p>Welcome, {user.username}</p>}
      {!user && !isLoading && (
        <>
          <Login />
          <Register />
        </>
      )}
    </div>
  );
};

export default Home;
