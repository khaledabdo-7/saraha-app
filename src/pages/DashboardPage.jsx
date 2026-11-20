import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ShareLinkBanner } from '../components/dashboard/ShareLinkBanner';
import { MessageCard } from '../components/dashboard/MessageCard';
import { 
  Inbox, 
  RotateCw, 
  Search, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [alertMsg, setAlertMsg] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const fetchMessages = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await api.get('/message/my-messages');
      setMessages(res.data?.messages || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const handleDeleteMessage = async (messageId) => {
    try {
      await api.delete(`/message/${messageId}`);
      setMessages(prev => prev.filter(m => m._id !== messageId));
      showAlert('تم حذف الرسالة بنجاح', 'success');
    } catch (err) {
      console.error('Delete message error:', err);
      showAlert('فشل حذف الرسالة، حاول مرة أخرى', 'error');
    }
  };

  const showAlert = (text, type = 'success') => {
    setAlertMsg({ text, type });
    setTimeout(() => setAlertMsg(null), 3000);
  };

  const filteredMessages = messages.filter(m => 
    m.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#3F72AF] border-t-transparent animate-spin" />
        <p className="text-sm font-semibold text-[#112D4E]/70 dark:text-[#BBE1FA]/70">جاري تحميل رسائلك السرية...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {alertMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-bold text-sm ${
              alertMsg.type === 'success' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-rose-600 text-white'
            }`}
          >
            {alertMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{alertMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Personal Link Banner */}
      {user && <ShareLinkBanner username={user.username} />}

      {/* Inbox Header & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
        
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-[#112D4E] dark:text-[#BBE1FA]">
              صندوق الرسائل الواردة
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#3F72AF] text-white">
              {messages.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#112D4E]/70 dark:text-[#BBE1FA]/70 mt-1">
            جميع الرسائل مشفرة ولا يمكن لأحد رؤيتها غيرك
          </p>
        </div>

        {/* Search & Refresh Buttons */}
        <div className="w-full sm:w-auto flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث في الرسائل..."
              className="w-full px-4 py-2.5 pr-10 rounded-2xl text-xs sm:text-sm border outline-none bg-white/70 dark:bg-[#1B262C]/70 border-[#DBE2EF] dark:border-[#0F4C75] text-[#112D4E] dark:text-[#BBE1FA] focus:ring-2 focus:ring-[#3F72AF]"
            />
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3F72AF] dark:text-[#3282B8]" />
          </div>

          <button
            onClick={() => fetchMessages(true)}
            disabled={refreshing}
            className="p-2.5 rounded-2xl border transition-all text-[#112D4E] dark:text-[#BBE1FA] bg-[#DBE2EF]/60 hover:bg-[#DBE2EF] dark:bg-[#0F4C75]/40 dark:hover:bg-[#0F4C75] border-[#DBE2EF] dark:border-[#0F4C75] disabled:opacity-50"
            title="تحديث الرسائل"
          >
            <RotateCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#3F72AF]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Messages Grid */}
      {filteredMessages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredMessages.map((msg) => (
              <MessageCard
                key={msg._id}
                message={msg}
                onDelete={handleDeleteMessage}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* Empty Inbox State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 px-4 rounded-3xl border border-dashed border-[#DBE2EF] dark:border-[#0F4C75] bg-[#DBE2EF]/20 dark:bg-[#0F4C75]/10 space-y-4"
        >
          <div className="w-16 h-16 mx-auto rounded-3xl flex items-center justify-center bg-[#3F72AF]/15 dark:bg-[#3282B8]/20 text-[#3F72AF] dark:text-[#3282B8]">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#112D4E] dark:text-[#BBE1FA]">
            {searchTerm ? 'لا توجد رسائل مطابقة لبحثك' : 'لا توجد رسائل سرية بعد'}
          </h3>
          <p className="text-sm text-[#112D4E]/70 dark:text-[#BBE1FA]/70 max-w-sm mx-auto">
            {searchTerm 
              ? 'جرّب كتابة كلمة بحث أخرى للوصول إلى الرسالة المطلوبة.'
              : 'شارك رابطك الشخصي في الـ Bio على فيسبوك وإنستجرام وستبدأ في استقبال رسائل أصدقائك هنا!'}
          </p>
        </motion.div>
      )}
    </div>
  );
};
