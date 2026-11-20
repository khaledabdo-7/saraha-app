import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowLeft, AlertCircle, Sparkles, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password States
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: send OTP, 2: reset
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'فشل تسجيل الدخول، تأكد من صحة البريد الإلكتروني وكلمة المرور.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setForgotMessage('');
    setLoading(true);
    try {
      await api.patch('/auth/forget-password', { email });
      setForgotMessage('تم إرسال رمز التحقق OTP إلى بريدك الإلكتروني بنجاح.');
      setForgotStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'فشل إرسال كود التحقق، تأكد من الإيميل.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.patch('/auth/reset-password', { email, otp, newPassword });
      alert('تم تحديث كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول.');
      setIsForgotPassword(false);
      setForgotStep(1);
    } catch (err) {
      setError(err.response?.data?.message || 'فشل إعادة تعيين كلمة المرور، تأكد من صحة الكود.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-3xl p-8 sm:p-10 shadow-xl border border-[#DBE2EF] dark:border-[#0F4C75] bg-[#DBE2EF]/50 dark:bg-[#0F4C75]/40 backdrop-blur-xl"
      >
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#112D4E] dark:text-[#BBE1FA]">
            {isForgotPassword ? 'استعادة كلمة المرور' : 'مرحباً بك مجدداً 👋'}
          </h2>
          <p className="text-sm text-[#112D4E]/70 dark:text-[#BBE1FA]/70">
            {isForgotPassword 
              ? 'أدخل بريدك الإلكتروني لاستلام كود التحقق' 
              : 'سجل دخولك لتصفح الرسائل السرية الجديدة'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Success Alert */}
        {forgotMessage && (
          <div className="mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
            <Sparkles className="w-5 h-5 flex-shrink-0" />
            <p>{forgotMessage}</p>
          </div>
        )}

        {/* Normal Login Form */}
        {!isForgotPassword ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold mb-2 text-[#112D4E] dark:text-[#BBE1FA]">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                  className="w-full px-4 py-3.5 pr-11 rounded-2xl text-sm border transition-all outline-none bg-white/70 dark:bg-[#1B262C]/70 border-[#DBE2EF] dark:border-[#0F4C75] text-[#112D4E] dark:text-[#BBE1FA] focus:ring-2 focus:ring-[#3F72AF]"
                />
                <Mail className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3F72AF] dark:text-[#3282B8]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#112D4E] dark:text-[#BBE1FA]">
                  كلمة المرور
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-xs font-bold text-[#3F72AF] dark:text-[#3282B8] hover:underline"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 pr-11 rounded-2xl text-sm border transition-all outline-none bg-white/70 dark:bg-[#1B262C]/70 border-[#DBE2EF] dark:border-[#0F4C75] text-[#112D4E] dark:text-[#BBE1FA] focus:ring-2 focus:ring-[#3F72AF]"
                />
                <Lock className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3F72AF] dark:text-[#3282B8]" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all hover:opacity-95 hover:scale-[1.02] bg-gradient-to-r from-[#3F72AF] to-[#3282B8] disabled:opacity-50"
            >
              {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
            </button>
          </form>
        ) : (
          /* Forgot Password Flow */
          <div className="space-y-5">
            {forgotStep === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-2 text-[#112D4E] dark:text-[#BBE1FA]">
                    البريد الإلكتروني المسجل
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                    className="w-full px-4 py-3.5 rounded-2xl text-sm border outline-none bg-white/70 dark:bg-[#1B262C]/70 border-[#DBE2EF] dark:border-[#0F4C75] text-[#112D4E] dark:text-[#BBE1FA]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-[#3F72AF] to-[#3282B8]"
                >
                  {loading ? 'جاري الإرسال...' : 'إرسال رمز التحقق OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-2 text-[#112D4E] dark:text-[#BBE1FA]">
                    رمز التحقق (OTP)
                  </label>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full px-4 py-3.5 rounded-2xl text-sm border outline-none bg-white/70 dark:bg-[#1B262C]/70 border-[#DBE2EF] dark:border-[#0F4C75] text-[#112D4E] dark:text-[#BBE1FA]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 text-[#112D4E] dark:text-[#BBE1FA]">
                    كلمة المرور الجديدة
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 rounded-2xl text-sm border outline-none bg-white/70 dark:bg-[#1B262C]/70 border-[#DBE2EF] dark:border-[#0F4C75] text-[#112D4E] dark:text-[#BBE1FA]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-[#3F72AF] to-[#3282B8]"
                >
                  {loading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
                </button>
              </form>
            )}

            <button
              onClick={() => {
                setIsForgotPassword(false);
                setForgotStep(1);
                setError('');
              }}
              className="w-full text-center text-xs font-bold text-[#112D4E]/70 dark:text-[#BBE1FA]/70 hover:underline pt-2"
            >
              العودة لتسجيل الدخول
            </button>
          </div>
        )}

        {/* Footer Switch */}
        <div className="mt-8 pt-6 border-t border-[#112D4E]/10 dark:border-[#BBE1FA]/10 text-center text-sm">
          <span className="text-[#112D4E]/70 dark:text-[#BBE1FA]/70">ليس لديك حساب؟ </span>
          <Link
            to="/register"
            className="font-bold text-[#3F72AF] dark:text-[#3282B8] hover:underline"
          >
            أنشئ حساباً جديداً
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
