import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Card } from '../../components/Card';
import { Mail, ShieldCheck } from 'lucide-react';
import { login } from '../../services/authService';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/dashboard/live-monitoring');
    } catch (err) {
      setError('Login failed. Check your credentials.');
    }
  };

  return (
    <div>
      <h3 className="text-xl font-medium mb-4 text-gray-900">Sign in to your account</h3>
      <Card className="p-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email address</label>
            <div className="relative mt-1 border border-gray-300 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="block w-full rounded-md border-transparent focus:border-medical-blue focus:ring-medical-blue sm:text-sm p-2.5 pl-10"
                placeholder="jane@clinic.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1 border border-gray-300 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <ShieldCheck className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="block w-full rounded-md border-transparent focus:border-medical-blue focus:ring-medical-blue sm:text-sm p-2.5 pl-10"
                placeholder="********"
              />
            </div>
          </div>
          {error ? <div className="text-sm text-red-600">{error}</div> : null}
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-medical-blue hover:text-medical-blue-dark"
              >
                Forgot your password?
              </Link>
            </div>
          </div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md border border-transparent bg-medical-blue py-2.5 px-4 mt-6 text-sm font-medium text-white shadow-sm hover:bg-medical-blue-dark"
          >
            Sign in
          </button>
        </form>
      </Card>
      <div className="mt-6 flex items-center justify-center">
        <span className="text-sm text-gray-600">Don't have an account? </span>
        <Link to="/register" className="ml-1 text-sm font-medium text-medical-blue hover:text-medical-blue-dark">
          Create a new account
        </Link>
      </div>
    </div>
  );
}
