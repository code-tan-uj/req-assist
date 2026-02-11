import type { Metadata } from 'next';
import LoginForm from './components/LoginForm';

export const metadata: Metadata = {
  title: 'Login | Req-Assist',
  description: 'Sign in to your Req-Assist workspace to access AI-powered research tools',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <LoginForm />
    </div>
  );
}