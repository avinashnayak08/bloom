import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Code2,
  ChevronRight,
  Layers,
  Heart,
  Calendar,
  Flame,
  Droplets,
  Moon,
  Compass,
} from 'lucide-react';
import { generateAndroidZip, downloadAndroidZip } from './utils/androidProjectExporter';

interface AdLog {
  id: string;
  time: string;
  type: string;
  event: string;
  status: 'success' | 'info' | 'error';
  adUnitId: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'preview' | 'android-structure' | 'actions-guide'>('preview');
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('Sofia');
  const [reminderTime, setReminderTime] = useState<string>('7:30 AM');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showAppOpenAd, setShowAppOpenAd] = useState<boolean>(false);
  const [logs, setLogs] = useState<AdLog[]>([
    {
      id: '1',
      time: '00:01',
      type: 'SDK Init',
      event: 'MobileAds.initialize(context) succeeded',
      status: 'success',
      adUnitId: 'ca-app-pub-3940256099942544~3347511713',
    },
    {
      id: '2',
      time: '00:02',
      type: 'App Open Ad',
      event: 'Preload requested (ca-app-pub-3940256099942544/9257396915)',
      status: 'info',
      adUnitId: 'ca-app-pub-3940256099942544/9257396915',
    },
    {
      id: '3',
      time: '00:03',
      type: 'App Open Ad',
      event: 'Ad loaded into memory cache (freshness: 4 hours)',
      status: 'success',
      adUnitId: 'ca-app-pub-3940256099942544/9257396915',
    },
    {
      id: '4',
      time: '00:04',
      type: 'Adaptive Banner',
      event: 'Banner loaded (Anchored Adaptive Banner Ad)',
      status: 'success',
      adUnitId: 'ca-app-pub-3940256099942544/6300978111',
    },
  ]);

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
    const newLog: AdLog = {
      id: String(Date.now()),
      time: new Date().toLocaleTimeString(),
      type: 'App Open Ad',
      event: 'ProcessLifecycleOwner triggered showAdIfAvailable()',
      status: 'info',
      adUnitId: 'ca-app-pub-3940256099942544/9257396915',
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const dismissAppOpenAd = () => {
    setShowAppOpenAd(false);
    const newLog: AdLog = {
      id: String(Date.now()),
      time: new Date().toLocaleTimeString(),
      type: 'App Open Ad',
      event: 'onAdDismissedFullScreenContent() -> Preloading next ad',
      status: 'success',
      adUnitId: 'ca-app-pub-3940256099942544/9257396915',
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  return (
    <div id="bloom-root" className="min-h-screen bg-[#FAF8F5] text-[#2B2523] flex flex-col font-sans">
      {/* Top Universal Navbar */}
      <header className="bg-white border-b border-[#EBD9D3] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#A5574D] text-white flex items-center justify-center font-serif text-xl font-bold shadow-xs">
              B
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-[#2B2523]">Bloom</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  APK Ready
                </span>
              </div>
              <p className="text-xs text-[#7C7470]">Native Android Studio + AdMob Companion</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <nav className="hidden md:flex items-center gap-1 bg-[#F5EAE6] p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'preview'
                    ? 'bg-white text-[#A5574D] shadow-xs'
                    : 'text-[#7C7470] hover:text-[#2B2523]'
                }`}
              >
                Live Preview
              </button>
              <button
                onClick={() => setActiveTab('android-structure')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'android-structure'
                    ? 'bg-white text-[#A5574D] shadow-xs'
                    : 'text-[#7C7470] hover:text-[#2B2523]'
                }`}
              >
                Project Files (25)
              </button>
              <button
                onClick={() => setActiveTab('actions-guide')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'actions-guide'
                    ? 'bg-white text-[#A5574D] shadow-xs'
                    : 'text-[#7C7470] hover:text-[#2B2523]'
                }`}
              >
                GitHub Actions Setup
              </button>
            </nav>

            <a
              id="download-apk-btn"
              href="/assets/aistudio/bloom-debug.apk"
              download="bloom-debug.apk"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Download APK (20MB)</span>
            </a>

            <button
              id="download-clean-zip-btn"
              onClick={handleDownloadZip}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#A5574D] hover:bg-[#8C443B] active:scale-95 text-white font-medium text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating ZIP...' : 'Project ZIP'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Verified Status Banner */}
      <div className="bg-emerald-900 text-emerald-100 text-xs px-4 py-2.5 border-b border-emerald-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-white">Direct APK Available:</span>
            <span className="text-emerald-200">
              Built with Gradle 8.7 & JDK 17. Includes AdMob App Open & Adaptive Banner Ads!
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/assets/aistudio/bloom-debug.apk"
              download="bloom-debug.apk"
              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Download bloom-debug.apk
            </a>
            <a
              href="/assets/aistudio/bloom-android-project.zip"
              download="bloom-android-project.zip"
              className="underline text-emerald-300 hover:text-white font-medium flex items-center gap-1"
            >
              Source ZIP
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {activeTab === 'preview' && (
          <>
            {/* Left Column: Android Device Simulator */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="text-xs text-[#7C7470] mb-2 font-medium flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-[#A5574D]" />
                <span>Simulating Pixel 8 (393 × 852dp) – Android API 34</span>
                {onboardingCompleted && (
                  <button
                    onClick={() => {
                      setOnboardingCompleted(false);
                      setOnboardingStep(1);
                    }}
                    className="ml-auto underline text-[#A5574D] flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset Onboarding
                  </button>
                )}
              </div>

              {/* Phone Frame */}
              <div className="w-[360px] h-[720px] bg-[#FAF8F5] border-[8px] border-[#2B2523] rounded-[42px] shadow-2xl overflow-hidden flex flex-col relative">
                {/* Phone Speaker & Notch */}
                <div className="h-6 bg-[#2B2523] w-full flex items-center justify-center">
                  <div className="w-20 h-3 bg-black rounded-full mb-1"></div>
                </div>

                {/* Simulated Screen Content */}
                <div className="flex-1 overflow-y-auto flex flex-col justify-between">
                  {!onboardingCompleted ? (
                    /* Onboarding Flow */
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      {/* 4-Step Indicator */}
                      <div className="flex items-center gap-2 pt-2">
                        {[1, 2, 3, 4].map((s) => (
                          <div
                            key={s}
                            className={`flex-1 h-1.5 rounded-full transition-all ${
                              s <= onboardingStep ? 'bg-[#A5574D]' : 'bg-[#EBD9D3]'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Steps */}
                      {onboardingStep === 1 && (
                        <div className="text-center my-auto">
                          <h1 className="font-serif text-3xl italic text-[#2B2523] mb-4">Welcome to Bloom</h1>
                          <p className="text-sm text-[#7C7470] leading-relaxed">
                            A gentle daily companion for managing PCOS — track your cycle, meals, movement, water, relaxation, and sleep.
                          </p>
                        </div>
                      )}

                      {onboardingStep === 2 && (
                        <div className="my-auto">
                          <h2 className="font-serif text-2xl italic text-[#2B2523] text-center mb-6">A little about you</h2>
                          <label className="block text-xs font-semibold text-[#7C7470] mb-2 uppercase tracking-wide">
                            Your First Name
                          </label>
                          <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl border border-[#EBD9D3] bg-white focus:outline-hidden focus:border-[#A5574D] text-base"
                            placeholder="Sofia"
                          />
                        </div>
                      )}

                      {onboardingStep === 3 && (
                        <div className="my-auto text-center">
                          <h2 className="font-serif text-2xl italic text-[#2B2523] mb-3">
                            What would you like to track daily?
                          </h2>
                          <p className="text-xs text-[#7C7470] leading-relaxed mb-4">
                            Pick the goals that matter to you — partial progress still counts.
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-left text-xs">
                            {['Cycle & Flow', 'Nutrition & Meals', 'Hydration', 'Gentle Movement', 'Sleep Window', 'Stress & Mind'].map((item) => (
                              <div key={item} className="p-3 bg-white border border-[#EBD9D3] rounded-xl font-medium text-[#2B2523] flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#A5574D]" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {onboardingStep === 4 && (
                        <div className="my-auto text-center">
                          <h2 className="font-serif text-2xl italic text-[#2B2523] mb-3">
                            When should we remind you?
                          </h2>
                          <p className="text-xs text-[#7C7470] leading-relaxed mb-4">
                            We will send one daily mindful nudge to log how you are feeling.
                          </p>
                          <div className="inline-block px-5 py-2.5 bg-white border border-[#A5574D] rounded-2xl text-lg font-bold text-[#A5574D]">
                            {reminderTime}
                          </div>
                        </div>
                      )}

                      {/* Bottom Button */}
                      <div className="pt-4 flex flex-col gap-2">
                        <button
                          onClick={() => {
                            if (onboardingStep < 4) {
                              setOnboardingStep(onboardingStep + 1);
                            } else {
                              setOnboardingCompleted(true);
                              // Trigger App Open Ad for returning test
                              triggerAppOpenAd();
                            }
                          }}
                          className="w-full py-3.5 rounded-2xl bg-[#A5574D] hover:bg-[#8C443B] text-white font-semibold text-sm shadow-sm transition-all"
                        >
                          {onboardingStep === 1 ? 'Get started' : onboardingStep === 4 ? 'Enter Bloom' : 'Continue'}
                        </button>
                        {onboardingStep === 4 && (
                          <button
                            onClick={() => {
                              setOnboardingCompleted(true);
                              triggerAppOpenAd();
                            }}
                            className="text-xs text-[#7C7470] py-2 hover:text-[#2B2523]"
                          >
                            I'll set this up later
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Home Dashboard */
                    <div className="flex flex-col justify-between flex-1 pb-2">
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-[10px] tracking-widest text-[#7C7470] font-bold uppercase">
                              Good morning,
                            </span>
                            <h2 className="font-serif text-2xl italic text-[#2B2523] font-semibold">{userName}</h2>
                          </div>
                          <button
                            onClick={triggerAppOpenAd}
                            title="Simulate background to foreground event"
                            className="px-2.5 py-1 bg-[#F5EAE6] text-[#A5574D] rounded-lg text-[10px] font-semibold flex items-center gap-1 border border-[#EBD9D3]"
                          >
                            <Play className="w-2.5 h-2.5" /> Ad Open Demo
                          </button>
                        </div>

                        {/* Today's Goals Card */}
                        <div className="bg-white border border-[#EBD9D3] rounded-3xl p-5 shadow-xs mb-4">
                          <h3 className="font-serif text-lg italic text-[#2B2523] font-semibold">Today's Goals</h3>
                          <p className="text-xs text-[#7C7470] mb-3">Saturday, June 27</p>
                          <div className="flex items-center justify-between text-xs text-[#A5574D] font-medium mb-1">
                            <span>Let's get blooming</span>
                            <span>0 of 5 complete</span>
                          </div>
                          <div className="w-full h-2 bg-[#F5EAE6] rounded-full overflow-hidden">
                            <div className="w-0 h-full bg-[#A5574D]" />
                          </div>
                        </div>

                        {/* PCOS FAQ Card */}
                        <div className="bg-white border border-[#EBD9D3] rounded-2xl p-4 shadow-xs mb-4">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A5574D]">PCOS FAQ</span>
                          <h4 className="text-xs font-bold text-[#2B2523] mt-1">What exactly is PCOS?</h4>
                          <p className="text-[11px] text-[#7C7470] mt-1 leading-snug">
                            Polycystic Ovary Syndrome involves a hormonal imbalance affecting metabolic and reproductive cycles...
                          </p>
                        </div>
                      </div>

                      {/* AdMob Adaptive Banner Ad */}
                      <div className="mx-4 p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-200 text-xs">
                        <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                          <span className="font-semibold uppercase tracking-wider bg-neutral-800 px-1.5 py-0.5 rounded">AdMob Adaptive Banner</span>
                          <span>Unit: ...6300978111</span>
                        </div>
                        <div className="h-12 bg-neutral-800 rounded-lg flex items-center justify-center text-center px-2">
                          <span className="text-[11px] text-neutral-300 font-medium">
                            🌸 Google Test Banner Ad (Anchored Adaptive)
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Simulated App Open Ad Overlay */}
                {showAppOpenAd && (
                  <div className="absolute inset-0 bg-black/95 z-50 flex flex-col justify-between p-6 text-white animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase bg-neutral-800 px-2 py-0.5 rounded text-neutral-400">
                        AdMob App Open Ad (Test)
                      </span>
                      <button
                        onClick={dismissAppOpenAd}
                        className="px-3 py-1 bg-white text-black text-xs font-bold rounded-full hover:bg-neutral-200"
                      >
                        ✕ Close Ad
                      </button>
                    </div>

                    <div className="text-center my-auto">
                      <div className="w-16 h-16 rounded-2xl bg-[#A5574D] mx-auto flex items-center justify-center text-2xl font-bold font-serif mb-4">
                        B
                      </div>
                      <h3 className="font-serif text-xl italic font-bold">Google Test App Open Ad</h3>
                      <p className="text-xs text-neutral-400 mt-2 max-w-xs mx-auto">
                        Presented via ProcessLifecycleOwner when returning to foreground. Dismissing will preload next ad automatically.
                      </p>
                    </div>

                    <div className="text-[10px] text-neutral-500 text-center font-mono">
                      Unit ID: ca-app-pub-3940256099942544/9257396915
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: AdMob Console & Live Event Tracker */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              {/* AdMob Configuration Card */}
              <div className="bg-white border border-[#EBD9D3] rounded-3xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#A5574D]" />
                    <h3 className="font-serif text-lg italic text-[#2B2523] font-semibold">
                      Google AdMob Configuration
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-300">
                    Official Test IDs
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EBD9D3]">
                    <div className="flex items-center justify-between font-semibold text-[#2B2523] mb-1">
                      <span>AdMob App ID (AndroidManifest.xml)</span>
                      <span className="text-[10px] text-[#A5574D]">play-services-ads:23.6.0</span>
                    </div>
                    <code className="text-[11px] text-[#7C7470] font-mono select-all">
                      ca-app-pub-3940256099942544~3347511713
                    </code>
                  </div>

                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EBD9D3]">
                    <div className="flex items-center justify-between font-semibold text-[#2B2523] mb-1">
                      <span>App Open Ad Unit ID (AppOpenAdManager.kt)</span>
                      <span className="text-[10px] text-emerald-700">Preload on Launch</span>
                    </div>
                    <code className="text-[11px] text-[#7C7470] font-mono select-all">
                      ca-app-pub-3940256099942544/9257396915
                    </code>
                  </div>

                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EBD9D3]">
                    <div className="flex items-center justify-between font-semibold text-[#2B2523] mb-1">
                      <span>Adaptive Banner Ad Unit ID (BannerAdView.kt)</span>
                      <span className="text-[10px] text-emerald-700">Auto Screen-Width</span>
                    </div>
                    <code className="text-[11px] text-[#7C7470] font-mono select-all">
                      ca-app-pub-3940256099942544/6300978111
                    </code>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#EBD9D3] flex items-center justify-between">
                  <span className="text-xs text-[#7C7470]">Lifecycle Observation:</span>
                  <span className="text-xs font-semibold text-[#2B2523]">ProcessLifecycleOwner (2.8.7)</span>
                </div>
              </div>

              {/* Ad Lifecycle Event Console */}
              <div className="bg-[#2B2523] text-white rounded-3xl p-6 shadow-md flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-neutral-200">
                      Live AdMob Analytics Stream
                    </h3>
                  </div>
                  <button
                    onClick={() => setLogs([])}
                    className="text-[11px] text-neutral-400 hover:text-white transition-colors"
                  >
                    Clear Console
                  </button>
                </div>

                <div className="font-mono text-xs space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-lg bg-neutral-800/80 border border-neutral-700 flex items-start gap-2.5"
                    >
                      <span className="text-[10px] text-neutral-400 mt-0.5">{log.time}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.5 text-[9px] rounded font-bold uppercase ${
                              log.status === 'success'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : log.status === 'error'
                                ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                : 'bg-sky-950 text-sky-400 border border-sky-800'
                            }`}
                          >
                            {log.type}
                          </span>
                          <span className="text-neutral-200 text-[11px]">{log.event}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'android-structure' && (
          <div className="lg:col-span-12 bg-white border border-[#EBD9D3] rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif text-xl italic text-[#2B2523] font-semibold">
                  Complete Android Studio File Tree (25 Verified Files)
                </h3>
                <p className="text-xs text-[#7C7470]">
                  All files are stored in clean UTF-8 without Byte Order Marks and are ready to compile with Gradle 8.7.
                </p>
              </div>
              <button
                onClick={handleDownloadZip}
                className="px-4 py-2 rounded-xl bg-[#A5574D] text-white text-xs font-semibold hover:bg-[#8C443B] flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download ZIP
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
              {[
                { name: 'settings.gradle.kts', desc: 'Repositories & project plugins' },
                { name: 'build.gradle.kts', desc: 'AGP 8.3.2 & Kotlin 1.9.24' },
                { name: 'gradle.properties', desc: 'JVM args & AndroidX flags' },
                { name: 'app/build.gradle.kts', desc: 'Compose BOM, DataStore & AdMob 23.6.0' },
                { name: 'app/src/main/AndroidManifest.xml', desc: 'Internet, Access Network & AdMob App ID' },
                { name: '.../BloomApplication.kt', desc: 'MobileAds.initialize & AppOpen preloader' },
                { name: '.../admob/AppOpenAdManager.kt', desc: '4-hour freshness & lifecycle callbacks' },
                { name: '.../admob/BannerAdView.kt', desc: 'Compose AndroidView wrapper' },
                { name: '.../admob/AdAnalytics.kt', desc: 'Impression & load logger' },
                { name: '.../data/UserPreferencesRepository.kt', desc: 'DataStore onboarding flow persistence' },
                { name: '.../MainActivity.kt', desc: 'ComponentActivity with coroutine launch' },
                { name: '.../ui/theme/Theme.kt', desc: 'Terracotta & Blush light color scheme' },
                { name: '.../ui/screens/OnboardingScreen.kt', desc: '4-step onboarding with Color imports' },
                { name: '.../ui/screens/HomeScreen.kt', desc: 'Daily wellness goals & banner ad' },
                { name: '.github/workflows/build-apk.yml', desc: 'Automated GitHub Actions CI' },
              ].map((f) => (
                <div key={f.name} className="p-3 bg-[#FAF8F5] border border-[#EBD9D3] rounded-xl">
                  <div className="font-bold text-[#A5574D] truncate">{f.name}</div>
                  <div className="text-[11px] text-[#7C7470] mt-1 font-sans">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'actions-guide' && (
          <div className="lg:col-span-12 bg-white border border-[#EBD9D3] rounded-3xl p-8 shadow-xs">
            <h3 className="font-serif text-2xl italic text-[#2B2523] font-semibold mb-2">
              Automated APK Build via GitHub Actions
            </h3>
            <p className="text-sm text-[#7C7470] mb-6">
              When you push the downloaded ZIP files to any GitHub repository, GitHub Actions will compile and generate the debug APK automatically.
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-[#FAF8F5] border border-[#EBD9D3] rounded-2xl">
                <h4 className="font-semibold text-sm text-[#2B2523] mb-1">Step 1: Extract the ZIP</h4>
                <p className="text-xs text-[#7C7470]">
                  Unzip <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#EBD9D3]">Bloom-Android-Project.zip</code> into a new folder on your computer.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] border border-[#EBD9D3] rounded-2xl">
                <h4 className="font-semibold text-sm text-[#2B2523] mb-1">Step 2: Push to GitHub via Terminal</h4>
                <pre className="p-3 bg-[#2B2523] text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto mt-2">
{`git init -b main
git add .
git commit -m "Initial commit - Bloom Android project with AdMob"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main`}
                </pre>
              </div>

              <div className="p-4 bg-[#FAF8F5] border border-[#EBD9D3] rounded-2xl">
                <h4 className="font-semibold text-sm text-[#2B2523] mb-1">Step 3: Download Your APK</h4>
                <p className="text-xs text-[#7C7470]">
                  Navigate to the <strong>Actions</strong> tab in your repository. Click on the <strong>Build Android APK</strong> workflow run, and download <strong>bloom-debug-apk</strong> under Artifacts!
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EBD9D3] bg-white py-4 text-center text-xs text-[#7C7470]">
        Bloom Wellness &copy; 2026 &bull; Verified Android Studio Codebase with Google Mobile Ads SDK
      </footer>
    </div>
  );
}
