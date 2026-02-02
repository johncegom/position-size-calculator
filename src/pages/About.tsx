import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Target,
  TrendingUp,
  ArrowRight,
  Wallet,
  Settings,
  LineChart,
  CheckCircle2,
} from "lucide-react";

const About = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Target,
      title: t("about.features.precision.title"),
      desc: t("about.features.precision.desc"),
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      icon: TrendingUp,
      title: t("about.features.visual.title"),
      desc: t("about.features.visual.desc"),
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      icon: ShieldCheck,
      title: t("about.features.protection.title"),
      desc: t("about.features.protection.desc"),
      color: "text-indigo-500",
      bg: "bg-indigo-50 dark:bg-indigo-500/10",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in-up pb-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 font-display leading-tight">
          {t("about.hero.title")}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          {t("about.hero.subtitle")}
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-white/5 shadow-xl shadow-indigo-500/5 hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.bg} ${feature.color}`}
            >
              <feature.icon className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Philosophy Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 md:p-12 text-white shadow-2xl shadow-indigo-500/20">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex flex-col-reverse lg:flex-row gap-8 items-center text-center lg:text-left">
          <div className="space-y-4 flex-1">
            <h2 className="text-2xl md:text-3xl font-bold font-display">
              {t("about.philosophy.title")}
            </h2>
            <p className="text-indigo-100 leading-relaxed text-lg">
              {t("about.philosophy.description")}
            </p>
            <div className="pt-4 flex justify-center lg:justify-start">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg shadow-black/10"
              >
                {t("about.cta")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-1/3 flex justify-center pb-6 lg:pb-0">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 border-4 border-white/20 rounded-full animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-4 border-4 border-white/40 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works - Cards */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white font-display">
          {t("about.howTo.title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="relative group">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 h-full">
              <div className="mb-4 text-xs font-bold uppercase tracking-widest text-indigo-500">
                Step 01
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                <Wallet className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                {t("about.howTo.step1")}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("about.howTo.step1Desc")}
              </p>
            </div>
            {/* Connector Line (Desktop) */}
            <div className="hidden lg:block absolute top-[60%] right-[-10%] w-[20%] h-px bg-gray-200 dark:bg-gray-700 z-0"></div>
          </div>

          {/* Step 2 */}
          <div className="relative group">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 h-full">
              <div className="mb-4 text-xs font-bold uppercase tracking-widest text-indigo-500">
                Step 02
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                <Settings className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                {t("about.howTo.step2")}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("about.howTo.step2Desc")}
              </p>
            </div>
            {/* Connector Line (Desktop) */}
            <div className="hidden lg:block absolute top-[60%] right-[-10%] w-[20%] h-px bg-gray-200 dark:bg-gray-700 z-0"></div>
          </div>

          {/* Step 3 */}
          <div className="relative group">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 h-full">
              <div className="mb-4 text-xs font-bold uppercase tracking-widest text-indigo-500">
                Step 03
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                <LineChart className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                {t("about.howTo.step3")}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("about.howTo.step3Desc")}
              </p>
            </div>
            {/* Connector Line (Desktop) */}
            <div className="hidden lg:block absolute top-[60%] right-[-10%] w-[20%] h-px bg-gray-200 dark:bg-gray-700 z-0"></div>
          </div>

          {/* Step 4 */}
          <div className="relative group">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 h-full shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/20">
              <div className="mb-4 text-xs font-bold uppercase tracking-widest text-indigo-500">
                Step 04
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mb-4 text-white">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                {t("about.howTo.step4")}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("about.howTo.step4Desc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
