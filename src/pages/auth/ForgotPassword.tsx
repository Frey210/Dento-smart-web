import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Card } from '../../components/Card';
import { Mail, ArrowLeft } from 'lucide-react';
import { forgotPassword } from '../../services/authService';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await forgotPassword(email);
    setMessage('If the email exists, a reset token was generated.');
    if (result.reset_token) {
      setResetToken(result.reset_token);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-medium mb-4 text-gray-900">Reset your password</h3>
      <p className="text-sm text-gray-600 mb-6">
        Enter your email address and we will send you a link to reset your password.
      </p>

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

          {message ? <div className="text-sm text-gray-700">{message}</div> : null}
          {resetToken ? (
            <div className="text-xs text-gray-500">
              Dev reset token: <span className="font-mono">{resetToken}</span>
            </div>
          ) : null}

          <button
            type="submit"
            className="flex w-full justify-center rounded-md border border-transparent bg-medical-blue py-2.5 px-4 mt-8 text-sm font-medium text-white shadow-sm hover:bg-medical-blue-dark"
          >
            Send Reset Link
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
