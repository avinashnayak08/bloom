import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Wifi,
  Battery,
  Signal,
  Calendar,
  Heart,
  BookOpen,
  User,
  ChevronRight,
  Droplet,
  Moon,
  Utensils,
  Clock,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { generateAndroidZip, downloadAndroidZip } from './utils/androidProjectExporter';

type TabType = 'today' | 'cycle' | 'care' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>('Sofia');
  const [reminderTime, setReminderTime] = useState<string>('7:30 AM');
  const [trackedGoals, setTrackedGoals] = useState<string[]>([
    'Cycle & Flow',
    'Nutrition & Meals',
    'Hydration',
    'Gentle Movement',
  ]);
  const [dailyGoals, setDailyGoals] = useState<{ [key: string]: boolean }>({
    'Cycle & Energy check-in': true,
    'Balanced low-GI meal': true,
    'Hydration goal (2L)': false,
    '20-minute gentle movement': false,
    'Restful sleep & wind-down': false,
  });
  const [waterGlasses, setWaterGlasses] = useState<number>(5);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Bloating', 'Fatigue']);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showAppOpenAd, setShowAppOpenAd] = useState<boolean>(false);

  const handleDownloadZip = async () => {
    setIsExporting(true);
    try {
      const blob = await generateAndroidZip();
      downloadAndroidZip(blob, 'Bloom-Android-Project.zip');
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const triggerAppOpenAd = () => {
    setShowAppOpenAd(true);
  };

  const dismissAppOpenAd = () => {
    setShowAppOpenAd(false);
  };

  const completedGoalsCount = Object.values(dailyGoals).filter(Boolean).length;
  const totalGoalsCount = Object.keys(dailyGoals).length;
  const goalsProgress = Math.round((completedGoalsCount / totalGoalsCount) * 100);

  return (
    <div id="bloom-app-root" className="min-h-screen bg-[#ECE6E1] text-[#2B2523] flex flex-col font-sans select-none antialiased">
      {/* Top Header Bar - Minimal and Compact */}
      <header className="w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#DFD6CF] py-2 px-4 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#A5574D] text-white flex items-center justify-center font-serif text-sm font-bold shadow-xs">
              B
            </div>
            <div>
              <span className="font-serif font-bold text-sm sm:text-base text-[#2B2523]">Bloom Android</span>
              <span className="ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 hidden sm:inline-block">
                Jetpack Compose
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onboardingCompleted) {
                  setOnboardingCompleted(false);
                  setOnboardingStep(1);
                } else {
                  setOnboardingCompleted(true);
                }
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-[#D8CDC5] text-[#5C5552] hover:text-[#2B2523] hover:border-[#A5574D] text-xs font-semibold transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#A5574D]" />
              <span>{onboardingCompleted ? 'Reset Onboarding' : 'View Home'}</span>
            </button>

            <a
              id="download-apk-btn"
              href="/assets/aistudio/bloom-debug.apk"
              download="bloom-debug.apk"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>APK (20MB)</span>
            </a>

            <button
              id="download-clean-zip-btn"
              onClick={handleDownloadZip}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#A5574D] hover:bg-[#8C443B] active:scale-95 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Exporting...' : 'ZIP'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Display: Centered Authentic Android Device */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Physical Phone Container */}
        <div className="relative my-auto flex items-center justify-center drop-shadow-[0_30px_60px_rgba(43,37,35,0.38)]">
          {/* Left Side Volume Keys */}
          <div className="absolute -left-[5px] top-28 w-[5px] h-12 bg-[#2D2A28] rounded-l-md shadow-xs border-r border-[#1B1A18]" />
          <div className="absolute -left-[5px] top-44 w-[5px] h-12 bg-[#2D2A28] rounded-l-md shadow-xs border-r border-[#1B1A18]" />
          {/* Right Side Power Key */}
          <div className="absolute -right-[5px] top-32 w-[5px] h-16 bg-[#2D2A28] rounded-r-md shadow-xs border-l border-[#1B1A18]" />

          {/* Premium Android Hardware Bezel (e.g. Pixel 8 / S24 Titanium Frame) */}
          <div className="w-[375px] h-[770px] bg-gradient-to-b from-[#2E2B29] via-[#1B1A18] to-[#121110] p-[10px] rounded-[50px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.22),0_0_0_1px_rgba(255,255,255,0.08)] flex flex-col relative">
            {/* Top Ear-piece Speaker Grill */}
            <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-14 h-[3.5px] bg-[#0E0E0E] rounded-full z-30 shadow-inner" />

            {/* Inner Touchscreen Display */}
            <div className="w-full h-full bg-[#FAF8F5] rounded-[40px] overflow-hidden flex flex-col relative shadow-inner">
              {/* Android Edge-to-Edge Status Bar */}
              <div className="h-10 px-6 bg-[#FAF8F5] flex items-center justify-between z-20 shrink-0 select-none pt-1">
                {/* Clock */}
                <span className="text-[12px] font-bold text-[#2B2523] tracking-tight">9:41</span>

                {/* Centered Punch-Hole Selfie Camera with optic ring */}
                <div className="w-4 h-4 bg-black rounded-full ring-[1.5px] ring-neutral-800 flex items-center justify-center shadow-inner">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0d1624] ring-1 ring-cyan-900/40" />
                </div>

                {/* Android Status Icons */}
                <div className="flex items-center gap-1.5 text-[#2B2523]">
                  <Signal className="w-3.5 h-3.5 stroke-[2.2]" />
                  <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
                  <Battery className="w-4 h-4 stroke-[2.2]" />
                </div>
              </div>

              {/* Viewport Content Area */}
              <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col justify-between relative bg-[#FAF8F5]">
                {!onboardingCompleted ? (
                  /* --- 4-STEP ONBOARDING FLOW --- */
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    {/* Step progress pills */}
                    <div className="flex items-center gap-1.5 pt-1">
                      {[1, 2, 3, 4].map((s) => (
                        <div
                          key={s}
                          className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                            s <= onboardingStep ? 'bg-[#A5574D]' : 'bg-[#EBD9D3]'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Step 1: Welcome */}
                    {onboardingStep === 1 && (
                      <div className="my-auto text-center py-6">
                        <div className="w-16 h-16 rounded-2xl bg-[#A5574D] text-white mx-auto flex items-center justify-center font-serif text-3xl font-bold shadow-md mb-5">
                          B
                        </div>
                        <h1 className="font-serif text-3xl italic text-[#2B2523] font-bold mb-2">
                          Welcome to Bloom
                        </h1>
                        <p className="text-xs text-[#7C7470] max-w-[260px] mx-auto leading-relaxed mb-6">
                          Your cycle-aware companion designed to navigate PCOS with nourishing daily habits.
                        </p>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5EAE6] text-[#A5574D] text-xs font-semibold border border-[#EBD9D3]">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Hormone harmony made simple</span>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Name Input */}
                    {onboardingStep === 2 && (
                      <div className="my-auto text-center py-4">
                        <h2 className="font-serif text-2xl italic text-[#2B2523] font-bold mb-2">
                          What should we call you?
                        </h2>
                        <p className="text-xs text-[#7C7470] leading-relaxed mb-6">
                          We personalize your check-ins and hormonal reminders to your journey.
                        </p>
                        <div className="max-w-[260px] mx-auto">
                          <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Your name"
                            className="w-full px-4 py-3 bg-white border-2 border-[#EBD9D3] focus:border-[#A5574D] rounded-2xl text-center text-sm font-semibold outline-hidden shadow-2xs transition-all"
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 3: Tracked Goals */}
                    {onboardingStep === 3 && (
                      <div className="my-auto text-center py-2">
                        <h2 className="font-serif text-2xl italic text-[#2B2523] font-bold mb-1.5">
                          What would you like to track?
                        </h2>
                        <p className="text-xs text-[#7C7470] leading-relaxed mb-4">
                          Pick daily areas that matter most — tap to toggle.
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-left">
                          {[
                            'Cycle & Flow',
                            'Nutrition & Meals',
                            'Hydration',
                            'Gentle Movement',
                            'Sleep Window',
                            'Stress & Mind',
                          ].map((item) => {
                            const isSelected = trackedGoals.includes(item);
                            return (
                              <button
                                key={item}
                                type="button"
                                onClick={() => {
                                  setTrackedGoals((prev) =>
                                    isSelected ? prev.filter((g) => g !== item) : [...prev, item]
                                  );
                                }}
                                className={`p-2.5 rounded-xl font-medium flex items-center gap-2 border transition-all text-left ${
                                  isSelected
                                    ? 'bg-[#A5574D] text-white border-[#A5574D] shadow-2xs'
                                    : 'bg-white text-[#2B2523] border-[#EBD9D3] hover:border-[#A5574D]'
                                }`}
                              >
                                <CheckCircle2
                                  className={`w-3.5 h-3.5 shrink-0 ${
                                    isSelected ? 'text-white' : 'text-[#A5574D]'
                                  }`}
                                />
                                <span className="text-[11px] font-semibold leading-tight">{item}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Step 4: Reminder Time */}
                    {onboardingStep === 4 && (
                      <div className="my-auto text-center py-3">
                        <h2 className="font-serif text-2xl italic text-[#2B2523] font-bold mb-1.5">
                          When should we remind you?
                        </h2>
                        <p className="text-xs text-[#7C7470] leading-relaxed mb-4">
                          We will send one mindful daily nudge to check in.
                        </p>
                        <div className="grid grid-cols-2 gap-2 max-w-[240px] mx-auto mb-3">
                          {['7:30 AM', '8:30 AM', '12:00 PM', '8:00 PM'].map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setReminderTime(t)}
                              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                                reminderTime === t
                                  ? 'bg-[#A5574D] text-white border-[#A5574D]'
                                  : 'bg-white text-[#2B2523] border-[#EBD9D3] hover:border-[#A5574D]'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                        <div className="inline-block px-3.5 py-1 bg-[#FAF8F5] border border-[#EBD9D3] rounded-full text-xs font-semibold text-[#A5574D]">
                          Selected: {reminderTime}
                        </div>
                      </div>
                    )}

                    {/* Onboarding Navigation Buttons */}
                    <div className="pt-3 flex flex-col gap-2">
                      <button
                        onClick={() => {
                          if (onboardingStep < 4) {
                            setOnboardingStep(onboardingStep + 1);
                          } else {
                            setOnboardingCompleted(true);
                            triggerAppOpenAd();
                          }
                        }}
                        className="w-full py-3 rounded-2xl bg-[#A5574D] hover:bg-[#8C443B] text-white font-semibold text-sm shadow-xs active:scale-[0.99] transition-all cursor-pointer"
                      >
                        {onboardingStep === 1 ? 'Get started' : onboardingStep === 4 ? 'Enter Bloom' : 'Continue'}
                      </button>
                      {onboardingStep === 4 && (
                        <button
                          onClick={() => {
                            setOnboardingCompleted(true);
                            triggerAppOpenAd();
                          }}
                          className="text-xs text-[#7C7470] py-1.5 hover:text-[#2B2523] cursor-pointer"
                        >
                          I'll set this up later
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* --- MAIN APP VIEWS (JETPACK COMPOSE SIMULATION) --- */
                  <div className="flex-1 flex flex-col justify-between">
                    {/* TAB 1: TODAY (HOME) */}
                    {activeTab === 'today' && (
                      <div className="p-4 space-y-3.5 animate-fadeIn">
                        {/* Header with Cycle Badge & Ad Demo Trigger */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] tracking-widest text-[#7C7470] font-bold uppercase">
                              Good morning,
                            </span>
                            <h2 className="font-serif text-2xl italic text-[#2B2523] font-semibold">{userName}</h2>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="px-2.5 py-0.5 bg-[#F5EAE6] text-[#A5574D] font-bold text-[10px] rounded-full border border-[#EBD9D3]">
                              Day 14 • Ovulatory
                            </span>
                            <button
                              onClick={triggerAppOpenAd}
                              title="Simulate background to foreground event"
                              className="px-2 py-0.5 bg-white text-[#A5574D] hover:bg-[#F5EAE6] rounded text-[9px] font-semibold flex items-center gap-1 border border-[#EBD9D3] cursor-pointer"
                            >
                              <Play className="w-2 h-2" /> Ad Open Demo
                            </button>
                          </div>
                        </div>

                        {/* Today's Goals Card */}
                        <div className="bg-white border border-[#EBD9D3] rounded-3xl p-4 shadow-2xs">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-serif text-base italic text-[#2B2523] font-bold">Today's Goals</h3>
                            <span className="text-xs font-semibold text-[#A5574D]">
                              {completedGoalsCount} of {totalGoalsCount} complete
                            </span>
                          </div>
                          <p className="text-[11px] text-[#7C7470] mb-2">Saturday, June 27</p>

                          {/* Progress bar */}
                          <div className="w-full h-2 bg-[#F5EAE6] rounded-full overflow-hidden mb-3">
                            <div
                              className="h-full bg-[#A5574D] transition-all duration-300"
                              style={{ width: `${goalsProgress}%` }}
                            />
                          </div>

                          {/* Interactive Checklist */}
                          <div className="space-y-1.5">
                            {Object.entries(dailyGoals).map(([goal, isDone]) => (
                              <button
                                key={goal}
                                type="button"
                                onClick={() =>
                                  setDailyGoals((prev) => ({ ...prev, [goal]: !prev[goal] }))
                                }
                                className="w-full flex items-center gap-2 py-1 px-1.5 rounded-lg hover:bg-[#FAF8F5] text-left transition-colors cursor-pointer"
                              >
                                <div
                                  className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                                    isDone
                                      ? 'bg-[#A5574D] border-[#A5574D] text-white'
                                      : 'border-[#C4B8B3] bg-white'
                                  }`}
                                >
                                  {isDone && <CheckCircle2 className="w-3 h-3" />}
                                </div>
                                <span
                                  className={`text-xs ${
                                    isDone ? 'line-through text-[#7C7470]' : 'text-[#2B2523] font-medium'
                                  }`}
                                >
                                  {goal}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Hydration Tracker Widget */}
                        <div className="bg-white border border-[#EBD9D3] rounded-2xl p-3.5 shadow-2xs flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <Droplet className="w-3.5 h-3.5 text-[#A5574D]" />
                              <h4 className="text-xs font-bold text-[#2B2523]">Hydration Tracker</h4>
                            </div>
                            <p className="text-[11px] text-[#7C7470] mt-0.5">
                              {waterGlasses} of 8 glasses ({waterGlasses * 250} ml)
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setWaterGlasses((prev) => Math.max(0, prev - 1))}
                              className="w-7 h-7 rounded-full bg-[#F5EAE6] text-[#A5574D] font-bold flex items-center justify-center hover:bg-[#EBD9D3] transition-colors cursor-pointer"
                            >
                              -
                            </button>
                            <span className="font-bold text-sm text-[#2B2523] w-4 text-center">
                              {waterGlasses}
                            </span>
                            <button
                              type="button"
                              onClick={() => setWaterGlasses((prev) => Math.min(12, prev + 1))}
                              className="w-7 h-7 rounded-full bg-[#A5574D] text-white font-bold flex items-center justify-center hover:bg-[#8C443B] transition-colors cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Daily Symptom Logger */}
                        <div className="bg-white border border-[#EBD9D3] rounded-2xl p-3.5 shadow-2xs">
                          <h4 className="text-xs font-bold text-[#2B2523] mb-1">Daily Symptom Log</h4>
                          <p className="text-[10px] text-[#7C7470] mb-2.5">
                            Tap to correlate symptoms with your hormonal phase
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {['Bloating', 'Fatigue', 'Cramps', 'Acne', 'Mood Shift', 'Cravings'].map(
                              (sym) => {
                                const isSelected = selectedSymptoms.includes(sym);
                                return (
                                  <button
                                    key={sym}
                                    type="button"
                                    onClick={() => {
                                      setSelectedSymptoms((prev) =>
                                        isSelected ? prev.filter((s) => s !== sym) : [...prev, sym]
                                      );
                                    }}
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                                      isSelected
                                        ? 'bg-[#A5574D] text-white border-[#A5574D]'
                                        : 'bg-[#FAF8F5] text-[#2B2523] border-[#EBD9D3] hover:border-[#A5574D]'
                                    }`}
                                  >
                                    {sym}
                                  </button>
                                );
                              }
                            )}
                          </div>
                        </div>

                        {/* PCOS FAQ & Micro-Guides */}
                        <div className="bg-white border border-[#EBD9D3] rounded-2xl p-3.5 shadow-2xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A5574D]">
                            PCOS Micro-Guides
                          </span>
                          <div className="mt-2 divide-y divide-[#F5EAE6]">
                            {[
                              {
                                q: 'What exactly is PCOS?',
                                a: 'Polycystic Ovary Syndrome involves a hormonal imbalance affecting metabolic and reproductive cycles. Gentle routine tracking helps balance cortisol.',
                              },
                              {
                                q: 'Why insulin resistance matters?',
                                a: 'Pairing carbohydrates with protein and healthy fats helps stabilize blood glucose and reduce cravings throughout the day.',
                              },
                              {
                                q: 'Gentle movement vs HIIT?',
                                a: 'Low-impact movement like walking and gentle yoga lowers cortisol and supports cellular insulin sensitivity without inducing adrenal fatigue.',
                              },
                            ].map((faq, idx) => {
                              const isOpen = expandedFaq === idx;
                              return (
                                <div key={idx} className="py-2 first:pt-0 last:pb-0">
                                  <button
                                    type="button"
                                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                                    className="w-full flex items-center justify-between text-left cursor-pointer"
                                  >
                                    <span className="text-[11px] font-bold text-[#2B2523]">{faq.q}</span>
                                    <span className="text-xs font-bold text-[#A5574D]">
                                      {isOpen ? '−' : '+'}
                                    </span>
                                  </button>
                                  {isOpen && (
                                    <p className="text-[10px] text-[#7C7470] mt-1 leading-relaxed">
                                      {faq.a}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 2: CYCLE & FLOW */}
                    {activeTab === 'cycle' && (
                      <div className="p-4 space-y-3.5 animate-fadeIn">
                        <div>
                          <span className="text-[10px] tracking-widest text-[#7C7470] font-bold uppercase">
                            Hormone Phase
                          </span>
                          <h2 className="font-serif text-2xl italic text-[#2B2523] font-semibold">Cycle & Flow</h2>
                        </div>

                        {/* Phase Circle Card */}
                        <div className="bg-white border border-[#EBD9D3] rounded-3xl p-5 text-center shadow-2xs">
                          <div className="w-28 h-28 rounded-full border-4 border-[#F5EAE6] border-t-[#A5574D] border-r-[#A5574D] mx-auto flex flex-col items-center justify-center mb-3">
                            <span className="text-xs text-[#7C7470] font-medium">Day</span>
                            <span className="font-serif text-3xl italic font-bold text-[#A5574D]">14</span>
                            <span className="text-[10px] text-[#7C7470]">of 28</span>
                          </div>
                          <h3 className="font-serif text-lg font-bold text-[#2B2523] italic">Ovulatory Phase</h3>
                          <p className="text-xs text-[#7C7470] mt-1 max-w-[240px] mx-auto leading-relaxed">
                            Estrogen and luteinizing hormone peak. Energy and focus are naturally higher today.
                          </p>
                        </div>

                        {/* Hormone Guidance */}
                        <div className="bg-white border border-[#EBD9D3] rounded-2xl p-4 shadow-2xs space-y-2">
                          <h4 className="text-xs font-bold text-[#2B2523]">Cycle Insights</h4>
                          <div className="flex items-start gap-2 text-xs text-[#7C7470]">
                            <Utensils className="w-4 h-4 text-[#A5574D] shrink-0 mt-0.5" />
                            <span>Fuel with cruciferous vegetables (broccoli, cabbage) to assist liver estrogen clearance.</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs text-[#7C7470]">
                            <Clock className="w-4 h-4 text-[#A5574D] shrink-0 mt-0.5" />
                            <span>Expected next period: In 14 days (approx. July 11).</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 3: PCOS CARE */}
                    {activeTab === 'care' && (
                      <div className="p-4 space-y-3.5 animate-fadeIn">
                        <div>
                          <span className="text-[10px] tracking-widest text-[#7C7470] font-bold uppercase">
                            Nourish & Restore
                          </span>
                          <h2 className="font-serif text-2xl italic text-[#2B2523] font-semibold">PCOS Care Plans</h2>
                        </div>

                        <div className="space-y-2.5">
                          {[
                            {
                              title: 'Insulin-Conscious Meals',
                              desc: 'Pair carbohydrates with fiber and protein to avoid glucose spikes.',
                              icon: Utensils,
                            },
                            {
                              title: 'Gentle Cortisol Walks',
                              desc: '15-20 min post-meal walks significantly lower postprandial insulin.',
                              icon: Sparkles,
                            },
                            {
                              title: 'Sleep & Adrenal Reset',
                              desc: 'Screen-off 45 min before bed promotes restorative deep sleep.',
                              icon: Moon,
                            },
                          ].map((plan, idx) => {
                            const IconComp = plan.icon;
                            return (
                              <div
                                key={idx}
                                className="bg-white border border-[#EBD9D3] rounded-2xl p-3.5 flex items-center justify-between shadow-2xs hover:border-[#A5574D] transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-xl bg-[#F5EAE6] text-[#A5574D] flex items-center justify-center shrink-0">
                                    <IconComp className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-bold text-[#2B2523]">{plan.title}</h4>
                                    <p className="text-[10px] text-[#7C7470] leading-snug">{plan.desc}</p>
                                  </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[#C4B8B3]" />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* TAB 4: SETTINGS & PROFILE */}
                    {activeTab === 'settings' && (
                      <div className="p-4 space-y-3.5 animate-fadeIn">
                        <div>
                          <span className="text-[10px] tracking-widest text-[#7C7470] font-bold uppercase">
                            Preferences
                          </span>
                          <h2 className="font-serif text-2xl italic text-[#2B2523] font-semibold">Settings</h2>
                        </div>

                        <div className="bg-white border border-[#EBD9D3] rounded-2xl p-4 shadow-2xs space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE6]">
                            <span className="text-xs font-semibold text-[#2B2523]">Logged In As</span>
                            <span className="text-xs text-[#A5574D] font-bold">{userName}</span>
                          </div>
                          <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE6]">
                            <span className="text-xs font-semibold text-[#2B2523]">Daily Reminder</span>
                            <span className="text-xs text-[#7C7470]">{reminderTime}</span>
                          </div>
                          <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE6]">
                            <span className="text-xs font-semibold text-[#2B2523]">AdMob SDK Status</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                              Initialized
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#2B2523]">Build Target</span>
                            <span className="text-xs text-[#7C7470]">API 34 (Android 14)</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setOnboardingCompleted(false);
                            setOnboardingStep(1);
                          }}
                          className="w-full py-2.5 rounded-xl border border-[#A5574D] text-[#A5574D] hover:bg-[#F5EAE6] text-xs font-bold transition-colors cursor-pointer"
                        >
                          Re-run Onboarding Setup
                        </button>
                      </div>
                    )}

                    {/* Anchored Google AdMob Adaptive Banner (Fixed above Bottom Navigation) */}
                    <div className="mx-3.5 my-1.5 p-2 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-200 text-xs shadow-xs shrink-0">
                      <div className="flex items-center justify-between text-[9px] text-neutral-400 mb-0.5">
                        <span className="font-semibold uppercase tracking-wider bg-neutral-800 px-1.5 py-0.5 rounded">
                          AdMob Adaptive Banner
                        </span>
                        <span className="font-mono text-[9px]">...6300978111</span>
                      </div>
                      <div className="h-8 bg-neutral-800 rounded-lg flex items-center justify-center text-center px-2">
                        <span className="text-[10px] text-neutral-300 font-medium">
                          🌸 Google Test Banner Ad (Anchored)
                        </span>
                      </div>
                    </div>

                    {/* Material 3 Bottom Navigation Bar */}
                    <div className="bg-white/95 backdrop-blur-md border-t border-[#EBD9D3] px-3 py-1.5 flex items-center justify-around shrink-0">
                      {[
                        { id: 'today', label: 'Today', icon: Sparkles },
                        { id: 'cycle', label: 'Cycle', icon: Calendar },
                        { id: 'care', label: 'Care', icon: Heart },
                        { id: 'settings', label: 'Settings', icon: User },
                      ].map((item) => {
                        const IconComponent = item.icon;
                        const isSelected = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveTab(item.id as TabType)}
                            className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer"
                          >
                            <div
                              className={`px-3 py-1 rounded-full transition-all ${
                                isSelected ? 'bg-[#F5EAE6] text-[#A5574D]' : 'text-[#7C7470]'
                              }`}
                            >
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <span
                              className={`text-[10px] font-bold ${
                                isSelected ? 'text-[#A5574D]' : 'text-[#7C7470]'
                              }`}
                            >
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Android Bottom Gesture Indicator Bar */}
              <div className="h-5 bg-[#FAF8F5] flex items-center justify-center shrink-0">
                <div className="w-28 h-1 bg-[#2B2523]/35 rounded-full" />
              </div>
            </div>

            {/* Simulated Full-Screen App Open Ad Overlay */}
            {showAppOpenAd && (
              <div className="absolute inset-0 bg-black/95 z-50 flex flex-col justify-between p-6 text-white animate-fadeIn rounded-[40px] m-[10px]">
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] font-mono uppercase bg-neutral-800 px-2 py-0.5 rounded text-neutral-400">
                    AdMob App Open Ad (Test)
                  </span>
                  <button
                    onClick={dismissAppOpenAd}
                    className="px-3 py-1 bg-white text-black text-xs font-bold rounded-full hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    ✕ Close Ad
                  </button>
                </div>

                <div className="text-center my-auto">
                  <div className="w-16 h-16 rounded-2xl bg-[#A5574D] mx-auto flex items-center justify-center text-2xl font-bold font-serif mb-4 shadow-lg">
                    B
                  </div>
                  <h3 className="font-serif text-xl italic font-bold">Google Test App Open Ad</h3>
                  <p className="text-xs text-neutral-400 mt-2 max-w-xs mx-auto leading-relaxed">
                    Presented via ProcessLifecycleOwner when returning to foreground. Dismissing preloads next ad automatically.
                  </p>
                </div>

                <div className="text-[10px] text-neutral-500 text-center font-mono pb-2">
                  Unit ID: ca-app-pub-3940256099942544/9257396915
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
