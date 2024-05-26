// components/hoc/AuthWrapper.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useGetAuthDataQuery } from '../../store/authApi';
import { RootState } from '../../store';
import { logout } from '../../store/auth';
import { getValidAuthTokens } from '../../lib/cookies';

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { token } = getValidAuthTokens();
  const userEmail = useSelector((state: RootState) => state.auth.userEmail);

  const { error, isLoading } = useGetAuthDataQuery(
    { token: token || '' },
    { skip: !!userEmail || !token }
  );

  useEffect(() => {
    if (!token) {
      dispatch(logout());
      router.push('/');
    }
  }, [token, router, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthWrapper;
