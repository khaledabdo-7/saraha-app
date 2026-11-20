import React from 'react';
import { Heart, MessageSquare, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full mt-20 border-t border-[#DBE2EF] dark:border-[#0F4C75]/60 bg-[#F9F7F7] dark:bg-[#1B262C] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-tr from-[#3F72AF] to-[#3282B8] text-white">
                <MessageSquare className="w-5 h-5 transform -scale-x-100" />
              </div>
              <span className="text-xl font-black text-[#112D4E] dark:text-[#BBE1FA]">
                صَارَحَـنِي | Saraha
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-[#112D4E]/70 dark:text-[#BBE1FA]/70">
              منصة متطورة لمشاركة الصراحة والآراء البناءة بكل سرية وأمان. مصممة ببنية تحتية قوية قائمة على Node.js, Express & MongoDB.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#3F72AF] dark:text-[#3282B8]">
              <ShieldCheck className="w-4 h-4" />
              تشفير كامل وحماية تامة لهوية المرسل
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm mb-4 text-[#112D4E] dark:text-[#BBE1FA]">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-[#112D4E]/70 dark:text-[#BBE1FA]/70 hover:text-[#3F72AF] dark:hover:text-[#3282B8] transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-[#112D4E]/70 dark:text-[#BBE1FA]/70 hover:text-[#3F72AF] dark:hover:text-[#3282B8] transition-colors">
                  تسجيل الدخول
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-[#112D4E]/70 dark:text-[#BBE1FA]/70 hover:text-[#3F72AF] dark:hover:text-[#3282B8] transition-colors">
                  إنشاء حساب مجاني
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer credit */}
          <div>
            <h4 className="font-bold text-sm mb-4 text-[#112D4E] dark:text-[#BBE1FA]">المطور والمهندس</h4>
            <div className="space-y-2 text-sm text-[#112D4E]/70 dark:text-[#BBE1FA]/70">
              <p className="font-semibold text-[#112D4E] dark:text-[#BBE1FA]">خالد عبدالله السيد</p>
              <p className="text-xs">Full-Stack Software Engineer</p>
              <a
                href="https://github.com/khaledabdo-7"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3F72AF] dark:text-[#3282B8] hover:underline pt-2"
              >
                GitHub Profile
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[#DBE2EF] dark:border-[#0F4C75]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#112D4E]/60 dark:text-[#BBE1FA]/60">
          <p>© {new Date().getFullYear()} صَارَحَـنِي. جميع الحقوق محفوظة.</p>
          <p className="flex items-center gap-1">
            صنع بكل <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> بواسطة خالد عبدالله
          </p>
        </div>
      </div>
    </footer>
  );
};
