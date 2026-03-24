import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Card } from '../../components/Card';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { resetPassword } from '../../services/authService';

export function ResetPassword() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    await resetPassword(token, password);
    setMessage('Password updated successfully. You can sign in now.');
  };

  return (
    <div>
      <h3 className="text-xl font-medium mb-4 text-gray-900">Set new password</h3>
      <p className="text-sm text-gray-600 mb-6">Please choose a strong password for your account.</p>

      <Card className="p-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reset Token</label>
            <input
              type="text"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-blue focus:ring-medical-blue sm:text-sm p-2.5 border bg-white"
              placeholder="paste reset token"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <div className="relative mt-1 border border-gray-300 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <ShieldCheck className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="block w-full rounded-md border-transparent focus:border-medical-blue focus:ring-medical-blue sm:text-sm p-2.5 pl-10"
                placeholder="********"
              />
            </div>
          </div>

          {message ? <div className="text-sm text-gray-700">{message}</div> : null}

          <button
            type="submit"
            className="flex w-full justify-center rounded-md border border-transparent bg-medical-blue py-2.5 px-4 mt-8 text-sm font-medium text-white shadow-sm hover:bg-medical-blue-dark"
          >
            Update Password
          </button>
        </form>
      </Card>

      <div className="mt-6 flex items-center justify-center">
        <Link to="/login" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>
      </div>
    </div>
  );
}
