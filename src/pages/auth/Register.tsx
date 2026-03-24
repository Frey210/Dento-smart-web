import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Card } from '../../components/Card';
import { Mail, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { register } from '../../services/authService';

export function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const passwordChecks = [
    { label: 'At least 8 characters', ok: password.length >= 8 },
    { label: 'Contains an uppercase letter (A-Z)', ok: /[A-Z]/.test(password) },
    { label: 'Contains a lowercase letter (a-z)', ok: /[a-z]/.test(password) },
    { label: 'Contains a number (0-9)', ok: /\d/.test(password) },
  ];
  const isPasswordValid = passwordChecks.every((item) => item.ok);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!isPasswordValid) {
      setError('Password does not meet all requirements.');
      return;
    }
    try {
      await register(name, email, password);
      navigate('/dashboard/live-monitoring');
    } catch (err) {
      setError('Registration failed. Try again.');
    }
  };

  return (
    <div>
      <h3 className="text-xl font-medium mb-4 text-gray-900">Create a new account</h3>
      <Card className="p-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-blue focus:ring-medical-blue sm:text-sm p-2.5 border bg-white"
              placeholder="Dr. Jane Smith"
            />
          </div>
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
            <div className="mt-3 space-y-1">
              {passwordChecks.map((item) => (
                <div key={item.label} className="flex items-center text-xs">
                  {item.ok ? (
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="mr-2 h-4 w-4 text-gray-300" />
                  )}
                  <span className={item.ok ? 'text-green-700' : 'text-gray-500'}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
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

          {error ? <div className="text-sm text-red-600">{error}</div> : null}

          <button
            type="submit"
            className="flex w-full justify-center rounded-md border border-transparent bg-medical-blue py-2.5 px-4 mt-8 text-sm font-medium text-white shadow-sm hover:bg-medical-blue-dark"
          >
            Create Account
          </button>
        </form>
      </Card>
      <div className="mt-6 flex items-center justify-center">
        <span className="text-sm text-gray-600">Already have an account? </span>
        <Link to="/login" className="ml-1 text-sm font-medium text-medical-blue hover:text-medical-blue-dark">
          Sign In
        </Link>
      </div>
    </div>
  );
}
