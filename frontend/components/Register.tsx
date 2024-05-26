// components/Register.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '../store/authApi';
import { setUser } from '../store/user';

const Register = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();

  const handleRegister = async () => {
    try {
      const user = await register({ userName, password, email }).unwrap();
      const userData = {
        id: user.user.id,
        username: user.user.username,
        email: user.user.email || null, // 处理 email 为 undefined 的情况
      };
      dispatch(setUser(userData));
    } catch (err) {
      console.error('Failed to register:', err);
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
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button onClick={handleRegister} disabled={isLoading}>
        {isLoading ? 'Registering...' : 'Register'}
      </button>
    </div>
  );
};

export default Register;
