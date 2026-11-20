import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    age: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('كلمة المرور وتأكيد كلمة المرور غير متطابقين.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmedPassword: formData.confirmPassword,
        phone: formData.phone.trim(),
        age: Number(formData.age) || 20,
      };

      await register(payload);
      setSuccess('تم إنشاء الحساب بنجاح! تم إرسال رابط التأكيد إلى بريدك الإلكتروني.');
      setTimeout(() => {
        navigate('/login');
      }, 3500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'فشل إنشاء الحساب، يرجى مراجعة البيانات المدخلة.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg rounded-3xl p-8 sm:p-10 shadow-xl border border-[#DBE2EF] dark:border-[#0F4C75] bg-[#DBE2EF]/50 dark:bg-[#0F4C75]/40 backdrop-blur-xl"
      >
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#112D4E] dark:text-[#BBE1FA]">
            إنشاء حساب جديد ✨
          </h2>
          <p className="text-sm text-[#112D4E]/70 dark:text-[#BBE1FA]/70">
            انضم الآن وابدأ في استقبال الرسائل والآراء السرية
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
        {success && (
          <div className="mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p>{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username */}
          <div>
            <label className="block text-xs font-bold mb-1.5 text-[#112D4E] dark:text-[#BBE1FA]">
              اسم المستخدم (Username بالإنجليزية)
            </label>
            <div className="relative">
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="khaled_abdo"
                className="w-full px-4 py-3 pr-11 rounded-2xl text-sm border outline-none bg-white/70 dark:bg-[#1B262C]/70 border-[#DBE2EF] dark:border-[#0F4C75] text-[#112D4E] dark:text-[#BBE1FA] focus:ring-2 focus:ring-[#3F72AF]"
              />
              <User className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3F72AF] dark:text-[#3282B8]" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold mb-1.5 text-[#112D4E] dark:text-[#BBE1FA]">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="example@mail.com"
                className="w-full px-4 py-3 pr-11 rounded-2xl text-sm border outline-none bg-white/70 dark:bg-[#1B262C]/70 border-[#DBE2EF] dark:border-[#0F4C75] text-[#112D4E] dark:text-[#BBE1FA] focus:ring-2 focus:ring-[#3F72AF]"
              />
              <Mail className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3F72AF] dark:text-[#3282B8]" />
            </div>
          </div>

          {/* Passwords in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5 text-[#112D4E] dark:text-[#BBE1FA]">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-2xl text-sm border outline-none bg-white/70 dark:bg-[#1B262C]/70 border-[#DBE2EF] dark:border-[#0F4C75] text-[#112D4E] dark:text-[#BBE1FA] focus:ring-2 focus:ring-[#3F72AF]"
                />
                <Lock className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3F72AF] dark:text-[#3282B8]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5 text-[#112D4E] dark:text-[#BBE1FA]">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-2xl text-sm border outline-none bg-white/70 dark:bg-[#1B262C]/70 border-[#DBE2EF] dark:border-[#0F4C75] text-[#112D4E] dark:text-[#BBE1FA] focus:ring-2 focus:ring-[#3F72AF]"
                />
                <Lock className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3F72AF] dark:text-[#3282B8]" />
              </div>
            </div>
          </div>

          {/* Phone & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5 text-[#112D4E] dark:text-[#BBE1FA]">
                رقم الهاتف (مصر)
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01012345678"
                  className="w-full px-4 py-3 pr-11 rounded-2xl text-sm border outline-none bg-white/70 dark:bg-[#1B262C]/70 border-[#DBE2EF] dark:border-[#0F4C75] text-[#112D4E] dark:text-[#BBE1FA] focus:ring-2 focus:ring-[#3F72AF]"
                />
                <Phone className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3F72AF] dark:text-[#3282B8]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5 text-[#112D4E] dark:text-[#BBE1FA]">
                العمر
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="22"
                  className="w-full px-4 py-3 pr-11 rounded-2xl text-sm border outline-none bg-white/70 dark:bg-[#1B262C]/70 border-[#DBE2EF] dark:border-[#0F4C75] text-[#112D4E] dark:text-[#BBE1FA] focus:ring-2 focus:ring-[#3F72AF]"
                />
                <Calendar className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3F72AF] dark:text-[#3282B8]" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 rounded-2xl font-bold text-white shadow-lg transition-all hover:opacity-95 hover:scale-[1.02] bg-gradient-to-r from-[#3F72AF] to-[#3282B8] disabled:opacity-50"
          >
            {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب جديد'}
          </button>
        </form>

        {/* Footer Switch */}
        <div className="mt-8 pt-6 border-t border-[#112D4E]/10 dark:border-[#BBE1FA]/10 text-center text-sm">
          <span className="text-[#112D4E]/70 dark:text-[#BBE1FA]/70">لديك حساب بالفعل؟ </span>
          <Link
            to="/login"
            className="font-bold text-[#3F72AF] dark:text-[#3282B8] hover:underline"
          >
            سجل دخولك الآن
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
