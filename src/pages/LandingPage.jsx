import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  Share2, 
  ArrowLeft, 
  Zap, 
  Lock, 
  EyeOff, 
  Download,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="space-y-24 py-8 sm:py-16">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto space-y-6"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold border transition-transform hover:scale-105 bg-[#DBE2EF]/60 dark:bg-[#0F4C75]/50 border-[#DBE2EF] dark:border-[#0F4C75] text-[#3F72AF] dark:text-[#BBE1FA]">
            <Sparkles className="w-4 h-4" />
            <span>المنصة الأحدث لمشاركة الرسائل السرية</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl font-black tracking-tight leading-tight sm:leading-tight text-[#112D4E] dark:text-[#BBE1FA]">
            استقبل رسائل سرية وآراء حقيقية{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3F72AF] via-[#3282B8] to-[#112D4E] dark:to-[#BBE1FA]">
              بسرية تامّة
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={itemVariants} className="text-base sm:text-xl font-medium leading-relaxed text-[#112D4E]/80 dark:text-[#BBE1FA]/80">
            احصل على رابطك الشخصي في ثوانٍ، شاركه مع أصدقائك ومتابعيك، واكتشف ما يقوله الناس عنك دون معرفة هويتهم!
          </motion.p>

          {/* Action CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {user ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base text-white transition-all shadow-lg hover:shadow-xl hover:scale-105 bg-gradient-to-r from-[#3F72AF] to-[#3282B8]"
              >
                الدخول إلى صندوق رسائلك
                <ArrowLeft className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base text-white transition-all shadow-lg hover:shadow-xl hover:scale-105 bg-gradient-to-r from-[#3F72AF] to-[#3282B8]"
                >
                  أنشئ حسابك الآن مجاناً
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base border transition-all hover:scale-105 bg-white/40 dark:bg-[#0F4C75]/30 border-[#DBE2EF] dark:border-[#0F4C75] text-[#112D4E] dark:text-[#BBE1FA]"
                >
                  تسجيل الدخول
                </Link>
              </>
            )}
          </motion.div>

          {/* Trust points */}
          <motion.div variants={itemVariants} className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-[#112D4E]/60 dark:text-[#BBE1FA]/60">
            <span className="flex items-center gap-1.5">
              <EyeOff className="w-4 h-4 text-[#3F72AF] dark:text-[#3282B8]" />
              هوية مجهولة بنسبة 100%
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#3F72AF] dark:text-[#3282B8]" />
              تشفير وأمان عالي
            </span>
            <span className="flex items-center gap-1.5">
              <Download className="w-4 h-4 text-[#3F72AF] dark:text-[#3282B8]" />
              تحميل الردود كستوري
            </span>
          </motion.div>
        </motion.div>

        {/* Floating Mockup Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 max-w-2xl mx-auto rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-[#DBE2EF] dark:border-[#0F4C75] bg-[#DBE2EF]/60 dark:bg-[#0F4C75]/40 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#3F72AF]/10 dark:border-[#BBE1FA]/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#3F72AF] text-white font-bold">
                🔒
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-[#112D4E] dark:text-[#BBE1FA]">شخص مجهول</p>
                <p className="text-xs text-[#112D4E]/60 dark:text-[#BBE1FA]/60">منذ بضع دقائق</p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#3F72AF]/15 text-[#3F72AF] dark:text-[#BBE1FA]">
              نموذج رسالة
            </span>
          </div>

          <p className="text-right text-base sm:text-lg font-semibold leading-relaxed text-[#112D4E] dark:text-[#BBE1FA] my-4">
            "شغلك في البرمجة والباك إند مبهر جداً وبتتطور بسرعة، بالتوفيق ومستني أشوف مشاريعك الجاية!" ✨
          </p>

          <div className="flex items-center justify-between pt-3 text-xs font-bold text-[#3F72AF] dark:text-[#3282B8]">
            <span>مشاركة كصورة ستوري 📸</span>
            <span>صَارَحَـنِي 2026</span>
          </div>
        </motion.div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-[#112D4E] dark:text-[#BBE1FA]">
            لماذا يفضل الجميع منصة صَارَحَـنِي؟
          </h2>
          <p className="text-sm sm:text-base text-[#112D4E]/70 dark:text-[#BBE1FA]/70">
            صُممت المنصة لتوفير تجربة استثنائية وسلسة للجميع مع أحدث تقنيات الويب.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <motion.div
            whileHover={{ y: -6 }}
            className="rounded-3xl p-8 space-y-4 shadow-sm border border-[#DBE2EF] dark:border-[#0F4C75] bg-[#DBE2EF]/40 dark:bg-[#0F4C75]/30"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#3F72AF]/15 dark:bg-[#3282B8]/20 text-[#3F72AF] dark:text-[#3282B8]">
              <EyeOff className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#112D4E] dark:text-[#BBE1FA]">سرية وهوية مجهولة</h3>
            <p className="text-sm leading-relaxed text-[#112D4E]/70 dark:text-[#BBE1FA]/70">
              لا نقوم بتسجيل أو عرض أي بيانات تخص مرسل الرسالة، مما يمنحه الحرية الكاملة ليعبر بصراحة وأمان.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            whileHover={{ y: -6 }}
            className="rounded-3xl p-8 space-y-4 shadow-sm border border-[#DBE2EF] dark:border-[#0F4C75] bg-[#DBE2EF]/40 dark:bg-[#0F4C75]/30"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#3F72AF]/15 dark:bg-[#3282B8]/20 text-[#3F72AF] dark:text-[#3282B8]">
              <Download className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#112D4E] dark:text-[#BBE1FA]">مشاركة كصورة ستوري</h3>
            <p className="text-sm leading-relaxed text-[#112D4E]/70 dark:text-[#BBE1FA]/70">
              حول أي رسالة مميزة بضغطة زر إلى بطاقة أنيقة عالية الجودة لمشاركتها مباشرة على إنستجرام وواتساب.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            whileHover={{ y: -6 }}
            className="rounded-3xl p-8 space-y-4 shadow-sm border border-[#DBE2EF] dark:border-[#0F4C75] bg-[#DBE2EF]/40 dark:bg-[#0F4C75]/30"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#3F72AF]/15 dark:bg-[#3282B8]/20 text-[#3F72AF] dark:text-[#3282B8]">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#112D4E] dark:text-[#BBE1FA]">سرعة واستجابة فورية</h3>
            <p className="text-sm leading-relaxed text-[#112D4E]/70 dark:text-[#BBE1FA]/70">
              واجهة خفيفة وسريعة جداً متوافقة مع جميع شاشات الهواتف والأجهزة اللوحية وحواسيب سطح المكتب.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 border border-[#DBE2EF] dark:border-[#0F4C75] bg-gradient-to-r from-[#DBE2EF]/50 to-[#3F72AF]/10 dark:from-[#0F4C75]/40 dark:to-[#1B262C]">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#112D4E] dark:text-[#BBE1FA]">
              كيف يعمل في 3 خطوات بسيطة؟
            </h2>
            <p className="text-sm text-[#112D4E]/70 dark:text-[#BBE1FA]/70">
              ابدأ في استقبال الرسائل فوراً بدون أي تعقيدات.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center font-black text-lg bg-[#3F72AF] text-white">
                1
              </div>
              <h4 className="font-bold text-lg text-[#112D4E] dark:text-[#BBE1FA]">سجل حسابك مجاناً</h4>
              <p className="text-sm text-[#112D4E]/70 dark:text-[#BBE1FA]/70">
                في أقل من دقيقة اختر اسم المستخدم وابدأ مباشرة.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center font-black text-lg bg-[#3282B8] text-white">
                2
              </div>
              <h4 className="font-bold text-lg text-[#112D4E] dark:text-[#BBE1FA]">شارك رابطك في كل مكان</h4>
              <p className="text-sm text-[#112D4E]/70 dark:text-[#BBE1FA]/70">
                في بايو حساباتك على التواصل الاجتماعي أو في المحادثات.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center font-black text-lg bg-[#112D4E] dark:bg-[#BBE1FA] text-white dark:text-[#112D4E]">
                3
              </div>
              <h4 className="font-bold text-lg text-[#112D4E] dark:text-[#BBE1FA]">اقرأ واستمتع بالصراحة</h4>
              <p className="text-sm text-[#112D4E]/70 dark:text-[#BBE1FA]/70">
                تصفح الرسائل السرية الواردة وشارك أفضلها كصورة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="text-3xl sm:text-5xl font-black text-[#112D4E] dark:text-[#BBE1FA]">
          جاهز لمعرفة ما يقوله الآخرون؟
        </h2>
        <p className="text-base sm:text-lg text-[#112D4E]/70 dark:text-[#BBE1FA]/70">
          انضم الآن وابدأ في استقبال آراء أصدقائك بصدق وبدون مجاملات.
        </p>
        <div>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl font-bold text-lg text-white shadow-xl hover:scale-105 transition-all bg-gradient-to-r from-[#3F72AF] to-[#3282B8]"
          >
            ابدأ الآن مجاناً
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};
