import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Sun, 
  Moon, 
  MessageSquare, 
  User, 
  LogOut, 
  Settings, 
  Menu, 
  X, 
  LayoutDashboard,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-300 bg-[#F9F7F7]/80 dark:bg-[#1B262C]/80 backdrop-blur-md border-b border-[#DBE2EF] dark:border-[#0F4C75]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-[#3F72AF] to-[#3282B8] text-white shadow-md shadow-[#3F72AF]/25 group-hover:scale-105 transition-transform duration-300">
            <MessageSquare className="w-6 h-6 transform -scale-x-100" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-[#112D4E] dark:text-[#BBE1FA]">
              صَارَحَـنِي
            </span>
            <span className="text-xs font-medium text-[#3F72AF] dark:text-[#3282B8]">
              رسائل سرية وآراء حقيقية
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className="font-medium text-[#112D4E]/80 dark:text-[#BBE1FA]/80 hover:text-[#3F72AF] dark:hover:text-[#3282B8] transition-colors"
          >
            الرئيسية
          </Link>
          {user && (
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 font-medium text-[#112D4E]/80 dark:text-[#BBE1FA]/80 hover:text-[#3F72AF] dark:hover:text-[#3282B8] transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              لوحة التحكم
            </Link>
          )}
        </nav>

        {/* Actions & Theme Toggle */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="تغيير المظهر"
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-[#DBE2EF]/60 hover:bg-[#DBE2EF] dark:bg-[#0F4C75]/50 dark:hover:bg-[#0F4C75] text-[#112D4E] dark:text-[#BBE1FA]"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-300 transform rotate-0 hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon className="w-5 h-5 text-[#3F72AF] transform rotate-0 hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>

          {/* User Menu or Auth Buttons */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border transition-all bg-[#DBE2EF]/40 hover:bg-[#DBE2EF] dark:bg-[#0F4C75]/40 dark:hover:bg-[#0F4C75] border-[#DBE2EF] dark:border-[#0F4C75]"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#3F72AF] dark:bg-[#3282B8] text-white font-bold text-sm">
                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="font-semibold text-sm max-w-[120px] truncate text-[#112D4E] dark:text-[#BBE1FA]">
                  {user.displayName || user.username}
                </span>
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2 w-56 rounded-2xl shadow-xl p-2 z-50 bg-[#F9F7F7] dark:bg-[#1B262C] border border-[#DBE2EF] dark:border-[#0F4C75]"
                  >
                    <div className="px-3 py-2 border-b border-[#DBE2EF] dark:border-[#0F4C75]/60 mb-1">
                      <p className="text-xs text-[#3F72AF] dark:text-[#3282B8]">مسجل باسم</p>
                      <p className="font-bold text-sm truncate text-[#112D4E] dark:text-[#BBE1FA]">@{user.username}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium hover:bg-[#DBE2EF] dark:hover:bg-[#0F4C75] transition-colors text-[#112D4E] dark:text-[#BBE1FA]"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#3F72AF] dark:text-[#3282B8]" />
                      صندوق الرسائل
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium hover:bg-[#DBE2EF] dark:hover:bg-[#0F4C75] transition-colors text-[#112D4E] dark:text-[#BBE1FA]"
                    >
                      <Settings className="w-4 h-4 text-[#3F72AF] dark:text-[#3282B8]" />
                      الإعدادات والبروفايل
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      تسجيل الخروج
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2.5">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl font-semibold text-sm transition-colors text-[#112D4E] dark:text-[#BBE1FA] hover:bg-[#DBE2EF] dark:hover:bg-[#0F4C75]"
              >
                تسجيل الدخول
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-xl font-bold text-sm text-white transition-all shadow-md bg-gradient-to-r from-[#3F72AF] to-[#3282B8] hover:opacity-95 hover:shadow-lg hover:shadow-[#3F72AF]/20"
              >
                إنشاء حساب
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center bg-[#DBE2EF]/60 dark:bg-[#0F4C75]/50 text-[#112D4E] dark:text-[#BBE1FA]"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-[#DBE2EF] dark:border-[#0F4C75] px-4 py-4 space-y-3 bg-[#F9F7F7] dark:bg-[#1B262C]"
          >
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg font-medium text-[#112D4E] dark:text-[#BBE1FA] hover:bg-[#DBE2EF] dark:hover:bg-[#0F4C75]"
            >
              الرئيسية
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 px-3 rounded-lg font-medium text-[#112D4E] dark:text-[#BBE1FA] hover:bg-[#DBE2EF] dark:hover:bg-[#0F4C75]"
                >
                  صندوق الرسائل
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 px-3 rounded-lg font-medium text-[#112D4E] dark:text-[#BBE1FA] hover:bg-[#DBE2EF] dark:hover:bg-[#0F4C75]"
                >
                  الإعدادات
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-right py-2 px-3 rounded-lg font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl font-semibold border border-[#DBE2EF] dark:border-[#0F4C75] text-[#112D4E] dark:text-[#BBE1FA]"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#3F72AF] to-[#3282B8]"
                >
                  إنشاء حساب جديد
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
