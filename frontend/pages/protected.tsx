// pages/protected.tsx
import AuthWrapper from '../components/hoc/AuthWrapper';

const ProtectedPage = () => {
  return (
    <AuthWrapper>
      <div>This is a protected page.</div>
    </AuthWrapper>
  );
};

export default ProtectedPage;
