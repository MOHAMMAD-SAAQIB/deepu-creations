import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ShieldCheck, AlertTriangle, ArrowRight, ArrowLeft, KeyRound } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const AdminLoginPage: React.FC = () => {
  const { verifyAdminPasscode, adminLoginError, isAdminAuthenticated } = useAdmin();
  const [passcode, setPasscode] = useState('');
  const navigate = useNavigate();

  // If already authenticated, redirect to /admin dashboard
  React.useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin');
    }
  }, [isAdminAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verifyAdminPasscode(passcode);
    if (success) {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#321923] text-[#FAF6F0] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-[#392923] p-8 sm:p-10 rounded-3xl border border-[#6E3947] shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#522734] border border-[#F0C9CB]/20 flex items-center justify-center mx-auto text-[#F0C9CB] shadow-md">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold tracking-wide text-[#FAF6F0]">
            Atelier Administration
          </h1>
          <p className="text-xs text-[#D99AA3]">
            Dedicated management portal for Deepu Creations catalog, orders, and business parameters.
          </p>
        </div>

        {/* Technical setup & authorization notice */}
        <div className="p-4 rounded-2xl bg-[#220F16] border border-[#6E3947] text-[11px] text-[#F0C9CB]/90 space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-[#F2D2BE]">
            <KeyRound className="w-4 h-4 text-[#D99AA3]" />
            <span>Staging Administrative Boundary</span>
          </div>
          <p className="leading-relaxed">
            In a production environment, this route is guarded by server-side HTTP-only session cookies and role-based access control (RBAC).
          </p>
          <p className="text-[#FAF6F0]">
            For current staging development, use the authorized key: <code className="bg-[#522734] px-1.5 py-0.5 rounded text-[#F0C9CB] font-mono">deepu2026</code>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#F0C9CB] block mb-1.5">
              Administrative Passcode:
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter admin passcode"
              className="w-full px-4 py-3 rounded-xl bg-[#220F16] border border-[#6E3947] text-sm text-[#FAF6F0] focus:ring-2 focus:ring-[#D99AA3] focus:outline-none placeholder:text-[#6E3947]"
              autoFocus
            />
            {adminLoginError && (
              <p className="text-[#F0C9CB] text-xs mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{adminLoginError}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-[#6E3947] hover:bg-[#522734] text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Authenticate & Enter</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#D99AA3] hover:text-[#F0C9CB] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Customer Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
