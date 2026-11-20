import React, { useState } from 'react';
import { Copy, Check, ExternalLink, QrCode, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const ShareLinkBanner = ({ username }) => {
  const [copied, setCopied] = useState(false);
  const publicUrl = `${window.location.origin}/u/${username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const shareText = encodeURIComponent(`صارحني برسالة سرية ومجهولة دون أن أعرف من أنت! 💬🔒\n${publicUrl}`);
  const whatsappUrl = `https://wa.me/?text=${shareText}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent('صارحني بسرية تامّة')}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border border-[#DBE2EF] dark:border-[#0F4C75] bg-gradient-to-br from-[#DBE2EF]/80 via-[#DBE2EF]/40 to-[#3F72AF]/10 dark:from-[#0F4C75]/60 dark:via-[#1B262C] dark:to-[#3282B8]/20"
    >
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Info */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#3F72AF]/15 dark:bg-[#3282B8]/25 text-[#3F72AF] dark:text-[#BBE1FA]">
            <Share2 className="w-3.5 h-3.5" />
            رابطك الشخصي جاهز للمشاركة
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#112D4E] dark:text-[#BBE1FA]">
            شارك رابطك واستقبل آراء أصدقائك بسرية 🤫
          </h2>
          <p className="text-sm text-[#112D4E]/70 dark:text-[#BBE1FA]/70 max-w-xl">
            انسخ الرابط وضعه في الـ Bio على إنستجرام، فيسبوك أو تيك توك، أو شاركه في جروبات واتساب واستمتع بقراءة الصراحة!
          </p>
        </div>

        {/* Action Controls */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          
          {/* Link pill */}
          <div className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-2xl border text-sm font-mono direction-ltr bg-white/70 dark:bg-[#1B262C]/70 border-[#DBE2EF] dark:border-[#0F4C75]">
            <span className="truncate max-w-[220px] text-xs font-semibold text-[#112D4E] dark:text-[#BBE1FA]">
              {publicUrl}
            </span>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg transition-colors text-[#3F72AF] hover:bg-[#3F72AF]/10 dark:text-[#3282B8] dark:hover:bg-[#3282B8]/20"
              title="نسخ الرابط"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Direct WhatsApp Share */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm text-white transition-all shadow-md bg-emerald-600 hover:bg-emerald-700 hover:scale-105"
          >
            واتساب
          </a>

          {/* Test Link */}
          <a
            href={publicUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl font-bold text-sm border transition-all text-[#112D4E] dark:text-[#BBE1FA] border-[#DBE2EF] dark:border-[#0F4C75] hover:bg-[#DBE2EF] dark:hover:bg-[#0F4C75]"
          >
            معاينة
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};
