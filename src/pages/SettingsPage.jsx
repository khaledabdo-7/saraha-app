import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  User, 
  Lock, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Shield, 
  Save,
  KeyRound
} from 'lucide-react';
import { motion } from 'framer-motion';

export const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // Profile fields
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);

  // Avatar upload
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);
    try {
      const res = await api.put('/user/update-profile', { displayName });
      updateUser({ displayName: res.data?.user?.displayName || displayName });
      setProfileMsg({ text: 'تم تحديث البيانات بنجاح!', type: 'success' });
    } catch (err) {
      setProfileMsg({ text: err.response?.data?.message || 'فشل تحديث البيانات.', type: 'error' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMsg(null);
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await api.patch('/user/update-password', {
        oldPassword,
        newPassword,
        refreshToken,
      });
      setPasswordMsg({ text: 'تم تغيير كلمة المرور بنجاح!', type: 'success' });
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordMsg({ text: err.response?.data?.message || 'فشل تغيير كلمة المرور.', type: 'error' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    const formData = new FormData();
    formData.append('profile', file);

    try {
      await api.patch('/user/upload-cloud-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('تم تحديث الصورة الشخصية بنجاح!');
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || 'فشل رفع الصورة الشخصية.');
    } finally {
      setUploadLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#112D4E] dark:text-[#BBE1FA]">
          إعدادات الحساب والبروفايل
        </h1>
        <p className="text-xs sm:text-sm text-[#112D4E]/70 dark:text-[#BBE1FA]/70 mt-1">
          قم بتعديل بياناتك الشخصية وحماية حسابك
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Avatar & Summary Card */}
        <div className="rounded-3xl p-6 text-center space-y-4 border border-[#DBE2EF] dark:border-[#0F4C75] bg-[#DBE2EF]/40 dark:bg-[#0F4C75]/30">
          <div className="relative w-28 h-28 mx-auto">
            <div className="w-full h-full rounded-3xl overflow-hidden flex items-center justify-center text-white text-3xl font-black shadow-lg bg-gradient-to-tr from-[#3F72AF] to-[#3282B8]">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                user.username?.charAt(0).toUpperCase()
              )}
            </div>

            {/* Upload Button */}
            <label 
              className="absolute -bottom-2 -right-2 p-2.5 rounded-2xl cursor-pointer text-white shadow-lg bg-[#3F72AF] hover:scale-110 transition-transform"
              title="تغيير الصورة الشخصية"
            >
              <Camera className="w-4 h-4" />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarUpload} 
                className="hidden" 
                disabled={uploadLoading} 
              />
            </label>
          </div>

          <div>
            <h3 className="font-bold text-lg text-[#112D4E] dark:text-[#BBE1FA]">
              {user.displayName || user.username}
            </h3>
            <p className="text-xs font-semibold text-[#3F72AF] dark:text-[#3282B8]">
              @{user.username}
            </p>
          </div>

          <p className="text-xs text-[#112D4E]/60 dark:text-[#BBE1FA]/60 pt-2 border-t border-[#3F72AF]/10 dark:border-[#BBE1FA]/10">
            {uploadLoading ? 'جاري رفع الصورة...' : 'اضغط على الكاميرا لرفع صورة جديدة'}
          </p>
        </div>

        {/* Forms column */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Edit Profile Form */}
          <div className="rounded-3xl p-6 sm:p-8 border border-[#DBE2EF] dark:border-[#0F4C75] bg-[#DBE2EF]/40 dark:bg-[#0F4C75]/30 space-y-5">
            <h3 className="text-lg font-bold flex items-center gap-2 text-[#112D4E] dark:text-[#BBE1FA]">
              <User className="w-5 h-5 text-[#3F72AF] dark:text-[#3282B8]" />
              البيانات الشخصية
            </h3>

            {profileMsg && (
              <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                profileMsg.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40' 
                  : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40'
              }`}>
                {profileMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1.5 text-[#112D4E] dark:text-[#BBE1FA]">
                  اسم العرض (الاسم الظاهر للزوار)
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="خالد عبدالله"
                  className="w-full px-4 py-3 rounded-2xl text-sm border outline-none bg-white/70 dark:bg-[#1B262C]/70 border-[#DBE2EF] dark:border-[#0F4C75] text-[#112D4E] dark:text-[#BBE1FA]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 text-[#112D4E] dark:text-[#BBE1FA]">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full px-4 py-3 rounded-2xl text-sm border outline-none bg-gray-100 dark:bg-gray-800/60 border-transparent text-gray-500 cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="px-6 py-3 rounded-2xl font-bold text-xs text-white shadow-md transition-all hover:scale-105 bg-gradient-to-r from-[#3F72AF] to-[#3282B8] disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {profileLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="rounded-3xl p-6 sm:p-8 border border-[#DBE2EF] dark:border-[#0F4C75] bg-[#DBE2EF]/40 dark:bg-[#0F4C75]/30 space-y-5">
            <h3 className="text-lg font-bold flex items-center gap-2 text-[#112D4E] dark:text-[#BBE1FA]">
              <Lock className="w-5 h-5 text-[#3F72AF] dark:text-[#3282B8]" />
              تغيير كلمة المرور
            </h3>

            {passwordMsg && (
              <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                passwordMsg.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40' 
                  : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40'
              }`}>
                {passwordMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1.5 text-[#112D4E] dark:text-[#BBE1FA]">
                  كلمة المرور الحالية
                </label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-2xl text-sm border outline-none bg-white/70 dark:bg-[#1B262C]/70 border-[#DBE2EF] dark:border-[#0F4C75] text-[#112D4E] dark:text-[#BBE1FA]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 text-[#112D4E] dark:text-[#BBE1FA]">
                  كلمة المرور الجديدة
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-2xl text-sm border outline-none bg-white/70 dark:bg-[#1B262C]/70 border-[#DBE2EF] dark:border-[#0F4C75] text-[#112D4E] dark:text-[#BBE1FA]"
                />
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="px-6 py-3 rounded-2xl font-bold text-xs text-white shadow-md transition-all hover:scale-105 bg-gradient-to-r from-[#3F72AF] to-[#3282B8] disabled:opacity-50 flex items-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                {passwordLoading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
