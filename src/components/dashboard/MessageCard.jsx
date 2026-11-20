import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Share2, Download, Check, Sparkles, MessageSquareQuote } from 'lucide-react';
import html2canvas from 'html2canvas';

export const MessageCard = ({ message, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  const formattedDate = new Date(message.createdAt || Date.now()).toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleDelete = async () => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذه الرسالة؟')) return;
    setIsDeleting(true);
    try {
      await onDelete(message._id);
    } catch (err) {
      setIsDeleting(false);
    }
  };

  const handleDownloadStoryImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: null,
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `saraha-message-${message._id?.substring(0, 6) || 'card'}.png`;
      link.click();
    } catch (err) {
      console.error('Failed to export story card:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(message.title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="relative group rounded-3xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl bg-[#DBE2EF]/50 hover:bg-[#DBE2EF] dark:bg-[#0F4C75]/40 dark:hover:bg-[#0F4C75]/70 border border-[#DBE2EF] dark:border-[#0F4C75]"
    >
      {/* Inner Card Container targeted for image export */}
      <div ref={cardRef} className="p-2 rounded-2xl">
        {/* Header badge & quotes */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#3F72AF]/15 dark:bg-[#3282B8]/20 text-[#3F72AF] dark:text-[#3282B8]">
              <MessageSquareQuote className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#3F72AF]/10 dark:bg-[#3282B8]/20 text-[#3F72AF] dark:text-[#BBE1FA]">
              رسالة سرية 🔒
            </span>
          </div>
          <span className="text-xs text-[#112D4E]/60 dark:text-[#BBE1FA]/60">
            {formattedDate}
          </span>
        </div>

        {/* Message Content */}
        <p className="text-base sm:text-lg leading-relaxed font-semibold my-4 whitespace-pre-wrap text-[#112D4E] dark:text-[#BBE1FA]">
          {message.title}
        </p>

        {/* Story watermark when exported */}
        <div className="mt-4 pt-3 border-t border-[#3F72AF]/10 dark:border-[#BBE1FA]/10 flex items-center justify-between text-[11px] font-bold text-[#3F72AF] dark:text-[#3282B8]">
          <span>صَارَحَـنِي • رسالة مجهولة</span>
          <span>saraha.me</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#112D4E]/10 dark:border-[#BBE1FA]/10">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          {isDeleting ? 'جاري الحذف...' : 'حذف'}
        </button>

        <div className="flex items-center gap-2">
          {/* Copy Text */}
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors bg-[#DBE2EF] hover:bg-[#3F72AF] hover:text-white dark:bg-[#0F4C75] dark:hover:bg-[#3282B8] text-[#112D4E] dark:text-[#BBE1FA]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            {copied ? 'تم النسخ!' : 'نسخ'}
          </button>

          {/* Download as Image Story */}
          <button
            onClick={handleDownloadStoryImage}
            disabled={isExporting}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl text-white transition-all shadow-sm bg-gradient-to-r from-[#3F72AF] to-[#3282B8] hover:opacity-95"
          >
            <Download className="w-3.5 h-3.5" />
            {isExporting ? 'جاري التحضير...' : 'تحميل كصورة ستوري'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
