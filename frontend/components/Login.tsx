// components/Login.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../store/authApi';
import { setUser } from '../store/user';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const user = await login({ userName, password }).unwrap();
      const userData = {
        id: user.user.id,
        username: user.user.username,
        email: user.user.email || null, // 处理 email 为 undefined 的情况
      };
      dispatch(setUser(userData));
    } catch (err) {
      console.error('Failed to login:', err);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin} disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  );
};

export default Login;
