import { useDispatch } from 'react-redux';
import { logout } from '../store/auth';
import { useRouter } from 'next/router';

const LogoutPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default LogoutPage;
