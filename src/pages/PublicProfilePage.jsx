import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import confetti from 'canvas-confetti';
import { 
  Send, 
  Sparkles, 
  EyeOff, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  UserCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

export const PublicProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [sendError, setSendError] = useState('');

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        const res = await api.get(`/user/public-profile/${username}`);
        setProfile(res.data?.userProfile);
      } catch (err) {
        console.error('Fetch public profile error:', err);
        setError('المستخدم غير موجود أو تم تعطيل حسابه مؤقتاً.');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchPublicProfile();
    }
  }, [username]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setSending(true);
    setSendError('');

    try {
      await api.post('/message/send-message', {
        title: messageText.trim(),
        ownerId: profile._id,
      });

      // Blast celebratory confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setSentSuccess(true);
      setMessageText('');
    } catch (err) {
      console.error('Send message error:', err);
      setSendError(err.response?.data?.message || 'فشل إرسال الرسالة، يرجى المحاولة لاحقاً.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#3F72AF] border-t-transparent animate-spin" />
        <p className="text-sm font-semibold text-[#112D4E]/70 dark:text-[#BBE1FA]/70">جاري تحميل بروفايل الصراحة...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-rose-100 dark:bg-rose-950/40 text-rose-600">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-[#112D4E] dark:text-[#BBE1FA]">عذراً، هذا الحساب غير موجود!</h2>
        <p className="text-sm text-[#112D4E]/70 dark:text-[#BBE1FA]/70 max-w-sm">
          تأكد من كتابة الرابط أو اسم المستخدم بشكل صحيح.
        </p>
        <Link
          to="/"
          className="mt-4 px-6 py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#3F72AF] to-[#3282B8]"
        >
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#DBE2EF] dark:border-[#0F4C75] bg-[#DBE2EF]/60 dark:bg-[#0F4C75]/40 backdrop-blur-xl"
      >
        {/* Target User Info Header */}
        <div className="text-center space-y-3 pb-6 border-b border-[#3F72AF]/10 dark:border-[#BBE1FA]/10">
          <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-white text-2xl font-black shadow-lg bg-gradient-to-tr from-[#3F72AF] to-[#3282B8]">
            {profile.profilePicture ? (
              <img 
                src={profile.profilePicture} 
                alt={profile.username} 
                className="w-full h-full object-cover rounded-3xl"
              />
            ) : (
              profile.username?.charAt(0).toUpperCase() || 'U'
            )}
          </div>

          <div>
            <h1 className="text-2xl font-black text-[#112D4E] dark:text-[#BBE1FA]">
              {profile.displayName || profile.username}
            </h1>
            <p className="text-xs font-semibold text-[#3F72AF] dark:text-[#3282B8] mt-0.5">
              @{profile.username}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-[#112D4E]/70 dark:text-[#BBE1FA]/70 max-w-md mx-auto">
            أرسل رسالة سرية مجهولة أو نصيحة صادقة. هويتك مشفرة ومجهولة تماماً ولن يتمكن أحد من معرفتها! 🔒
          </p>
        </div>

        {/* Content State: Form or Success */}
        {!sentSuccess ? (
          <form onSubmit={handleSendMessage} className="space-y-5 pt-6">
            
            {sendError && (
              <div className="p-4 rounded-2xl flex items-center gap-3 text-sm bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{sendError}</p>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#112D4E] dark:text-[#BBE1FA]">
                  اكتب رسالتك السرية هنا...
                </label>
                <span className="text-xs font-semibold text-[#112D4E]/60 dark:text-[#BBE1FA]/60">
                  {messageText.length} / 500
                </span>
              </div>

              <textarea
                rows={5}
                required
                maxLength={500}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="اكتب بصراحة وبدون تردد، رسالتك سرية تماماً..."
                className="w-full p-4 rounded-2xl text-sm border outline-none resize-none transition-all bg-white/70 dark:bg-[#1B262C]/70 border-[#DBE2EF] dark:border-[#0F4C75] text-[#112D4E] dark:text-[#BBE1FA] focus:ring-2 focus:ring-[#3F72AF]"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-[#112D4E]/60 dark:text-[#BBE1FA]/60 px-1">
              <span className="flex items-center gap-1.5">
                <EyeOff className="w-3.5 h-3.5 text-[#3F72AF] dark:text-[#3282B8]" />
                لا يمكن معرفة هوية المرسل
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#3F72AF] dark:text-[#3282B8]" />
                تشفير آمن
              </span>
            </div>

            <button
              type="submit"
              disabled={sending || !messageText.trim()}
              className="w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all hover:scale-[1.02] bg-gradient-to-r from-[#3F72AF] to-[#3282B8] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 transform -scale-x-100" />
              {sending ? 'جاري الإرسال بسرية...' : 'إرسال الرسالة الآن'}
            </button>
          </form>
        ) : (
          /* Sent Success State */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10 space-y-5"
          >
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-[#112D4E] dark:text-[#BBE1FA]">
                وصلت رسالتك بسرية تامة! 🎉
              </h3>
              <p className="text-sm text-[#112D4E]/70 dark:text-[#BBE1FA]/70 max-w-sm mx-auto">
                تم تسليم الرسالة إلى صندوق {profile.displayName || profile.username} بأمان كامل.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setSentSuccess(false)}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-bold border transition-colors border-[#DBE2EF] dark:border-[#0F4C75] text-[#112D4E] dark:text-[#BBE1FA] hover:bg-[#DBE2EF] dark:hover:bg-[#0F4C75]"
              >
                إرسال رسالة أخرى
              </button>

              <Link
                to="/register"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-bold text-white transition-all shadow-md bg-gradient-to-r from-[#3F72AF] to-[#3282B8]"
              >
                أنشئ حسابك الخاص الآن
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
