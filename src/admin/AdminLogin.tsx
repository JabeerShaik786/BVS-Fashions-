import React, { useState } from 'react';
import { adminApi } from './adminApi';
import { Lock, Mail, ArrowRight, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToStore }) => {
  const [email, setEmail] = useState('admin@bvsfashions.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await adminApi.login(email.trim(), password);
      onLoginSuccess();
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Back to public store */}
        <button
          onClick={onBackToStore}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#702C38] hover:text-[#561E28] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Website</span>
        </button>

        {/* Wordmark */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-9 h-9 rounded bg-[#702C38] border border-[#D4B16A] flex items-center justify-center text-[#F7F0E5] font-serif font-bold text-base shadow-sm">
            BVS
          </div>
          <span className="font-serif text-2xl font-bold tracking-[0.18em] text-[#702C38]">
            BVS FASHIONS
          </span>
        </div>
        <p className="text-xs uppercase tracking-[0.25em] text-[#74685E] font-medium">
          Management Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-[#EADBCA] sm:rounded-2xl sm:px-10">
          
          <div className="mb-6 pb-4 border-b border-[#EADBCA] text-center">
            <h2 className="font-serif text-xl font-bold text-[#282522]">
              Administrator Sign In
            </h2>
            <p className="text-xs text-[#74685E] mt-1">
              Manage your traditional clothing catalogue, inventory, and publishing.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#282522] mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bvsfashions.com"
                  className="w-full bg-[#FAF6EE]/50 border border-[#EADBCA] rounded-md px-3.5 py-2.5 pl-10 text-xs text-[#282522] placeholder-gray-400 focus:outline-none focus:border-[#702C38] focus:ring-1 focus:ring-[#702C38]"
                />
                <Mail className="w-4 h-4 text-[#74685E] absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#282522] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FAF6EE]/50 border border-[#EADBCA] rounded-md px-3.5 py-2.5 pl-10 text-xs text-[#282522] placeholder-gray-400 focus:outline-none focus:border-[#702C38] focus:ring-1 focus:ring-[#702C38]"
                />
                <Lock className="w-4 h-4 text-[#74685E] absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#702C38] hover:bg-[#561E28] disabled:opacity-60 text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Demo Credential Note */}
          <div className="mt-6 pt-5 border-t border-[#EADBCA] bg-[#FAF6EE]/60 -mx-6 -mb-8 p-4 rounded-b-2xl text-[11px] text-[#74685E]">
            <div className="flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4B16A] shrink-0 mt-0.5" />
              <div>
                <strong>Default Local Admin Credentials:</strong>
                <p className="mt-0.5">Email: <code className="bg-white px-1 py-0.5 rounded border border-[#EADBCA]">admin@bvsfashions.com</code></p>
                <p>Password: <code className="bg-white px-1 py-0.5 rounded border border-[#EADBCA]">admin123</code></p>
                <p className="mt-1 text-[10px] text-gray-500">
                  When live Supabase Auth credentials are configured in <code className="bg-white px-1">.env</code>, authentication verifies securely against your Supabase project.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
