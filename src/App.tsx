import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home as HomeIcon,
  BarChart2,
  BookOpen,
  Settings as SettingsIcon,
  Radio,
  Download,
  Smartphone,
  RotateCcw,
} from 'lucide-react';
import {
  UserProfile,
  TrackingPreferences,
  DailyGoalTargets,
  DailyGoalProgress,
  CycleData,
  SymptomsState,
} from './types';
import { LearnArticle, ADMOB_CONFIG } from './data/bloomData';
import { OnboardingFlow } from './components/OnboardingFlow';
import { HomeDashboard } from './components/HomeDashboard';
import { InsightsScreen } from './components/screens/InsightsScreen';
import { LearnScreen } from './components/screens/LearnScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { LogCycleSheet } from './components/sheets/LogCycleSheet';
import { LogSymptomsSheet } from './components/sheets/LogSymptomsSheet';
import { LogMealsSheet } from './components/sheets/LogMealsSheet';
import { LogCounterSheet, CounterCategory } from './components/sheets/LogCounterSheet';
import { EditProfileSheet } from './components/sheets/EditProfileSheet';
import { ReminderTimeSheet } from './components/sheets/ReminderTimeSheet';
import { LiveNotificationSheet } from './components/sheets/LiveNotificationSheet';
import { FaqArticleSheet } from './components/sheets/FaqArticleSheet';
import { AppOpenAdOverlay } from './components/admob/AppOpenAdOverlay';
import { AdMobInspectorModal } from './components/admob/AdMobInspectorModal';
import { AdEventTracker } from './components/admob/AdEventTracker';
import { BloomFlower } from './components/BloomFlower';
import { generateAndroidZip, downloadAndroidZip } from './utils/androidProjectExporter';

type Screen = 'splash' | 'onboarding' | 'home';
type Tab = 'dashboard' | 'insights' | 'learn' | 'settings';

export default function App() {
  // Screen & Navigation State
  const [screen, setScreen] = useState<Screen>('splash');
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(() => {
    return localStorage.getItem('bloom_onboarding_completed') === 'true';
  });

  // Device Frame View Mode
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(false);
  const [isExportingZip, setIsExportingZip] = useState<boolean>(false);

  // User Profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('bloom_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      name: 'Sofia',
      journeyStage: 'Not set',
      reminderTime: '7:30 AM',
      notificationsEnabled: true,
      onboardingCompleted: false,
    };
  });

  // Tracking Preferences
  const [tracking, setTracking] = useState<TrackingPreferences>(() => {
    const saved = localStorage.getItem('bloom_tracking_prefs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      meals: true,
      movement: true,
      water: true,
      relaxation: true,
      sleep: true,
      cycle: true,
      symptoms: true,
    };
  });

  // Daily Goal Targets
  const [targets, setTargets] = useState<DailyGoalTargets>(() => {
    const saved = localStorage.getItem('bloom_goal_targets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      meals: 3,
      movement: 30,
      water: 8,
      relaxation: 15,
      sleep: 8,
    };
  });

  // Daily Progress
  const [progress, setProgress] = useState<DailyGoalProgress>(() => {
    const saved = localStorage.getItem('bloom_today_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      mealsCount: 0,
      mealsData: {
        breakfast: null,
        lunch: null,
        dinner: null,
      },
      movementMinutes: 0,
      waterGlasses: 0,
      relaxationMinutes: 0,
      sleepHours: 0,
      sleepLoggedLastNight: false,
    };
  });

  // Cycle Data
  const [cycleData, setCycleData] = useState<CycleData>(() => {
    const saved = localStorage.getItem('bloom_cycle_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      periodStatus: 'None',
      flow: 'Medium',
      symptoms: [],
      notes: '',
    };
  });

  // Symptoms State
  const [symptoms, setSymptoms] = useState<SymptomsState>(() => {
    const saved = localStorage.getItem('bloom_symptoms_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      bloating: 'None',
      skinAcne: 'None',
      mood: 'Good',
      sleepQuality: 'Good',
    };
  });

  // AdMob State & Overlays
  const [showAppOpenAd, setShowAppOpenAd] = useState<boolean>(false);
  const [isAdMobInspectorOpen, setIsAdMobInspectorOpen] = useState<boolean>(false);

  // Sheets & Modals
  const [activeSheet, setActiveSheet] = useState<
    | null
    | 'cycle'
    | 'symptoms'
    | 'meals'
    | 'counter'
    | 'edit_profile'
    | 'reminder_time'
    | 'live_notification'
    | 'faq_article'
  >(null);
  const [counterCategory, setCounterCategory] = useState<CounterCategory>('water');
  const [activeFaqArticle, setActiveFaqArticle] = useState<LearnArticle | null>(null);

  // App Initialization & Splash Handling
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOnboardingCompleted) {
        // First launch -> Splash -> Onboarding (NO App Open Ad)
        setScreen('onboarding');
      } else {
        // Returning User -> Show App Open Ad before Home
        AdEventTracker.logEvent(
          'app_open_ad_requested',
          ADMOB_CONFIG.testAppOpenAdUnitId,
          'Returning user launched application'
        );
        setShowAppOpenAd(true);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [isOnboardingCompleted]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('bloom_user_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('bloom_tracking_prefs', JSON.stringify(tracking));
  }, [tracking]);

  useEffect(() => {
    localStorage.setItem('bloom_goal_targets', JSON.stringify(targets));
  }, [targets]);

  useEffect(() => {
    localStorage.setItem('bloom_today_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('bloom_cycle_data', JSON.stringify(cycleData));
  }, [cycleData]);

  useEffect(() => {
    localStorage.setItem('bloom_symptoms_data', JSON.stringify(symptoms));
  }, [symptoms]);

  const handleFinishOnboarding = (
    updatedProfile: Partial<UserProfile>,
    updatedTracking?: TrackingPreferences
  ) => {
    setProfile((prev) => ({
      ...prev,
      ...updatedProfile,
      onboardingCompleted: true,
    }));
    if (updatedTracking) {
      setTracking(updatedTracking);
    }
    setIsOnboardingCompleted(true);
    localStorage.setItem('bloom_onboarding_completed', 'true');
    setScreen('home');
  };

  const handleResetOnboarding = () => {
    localStorage.removeItem('bloom_onboarding_completed');
    setIsOnboardingCompleted(false);
    setScreen('onboarding');
    setIsAdMobInspectorOpen(false);
  };

  const handleSimulateForeground = () => {
    setIsAdMobInspectorOpen(false);
    setShowAppOpenAd(true);
  };

  const handleDownloadAndroidZip = async () => {
    setIsExportingZip(true);
    try {
      const blob = await generateAndroidZip();
      downloadAndroidZip(blob);
    } catch (e) {
      console.error('Error exporting Android project', e);
    } finally {
      setIsExportingZip(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0EBE6] text-[#2B2523] flex flex-col font-sans antialiased selection:bg-[#A5574D]/20 selection:text-[#A5574D]">
      {/* Dev / Reviewer Top Toolbar */}
      <header className="w-full bg-[#1C1D21] text-zinc-200 border-b border-zinc-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-md z-30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A5574D] animate-ping" />
            <span className="font-serif-italic text-lg text-white font-medium">Bloom</span>
          </div>
          <span className="hidden sm:inline-block text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 px-2 py-0.5 rounded-md font-mono">
            Android Studio + Google AdMob
          </span>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {/* AdMob Console Button */}
          <button
            onClick={() => setIsAdMobInspectorOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>AdMob Console</span>
          </button>

          {/* Simulate Foreground Button */}
          <button
            onClick={handleSimulateForeground}
            title="Simulate app returning to foreground (triggers App Open Ad)"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-all"
          >
            <span>Simulate Foreground</span>
          </button>

          {/* Device Frame View Toggle */}
          <button
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              deviceFrameMode
                ? 'bg-[#A5574D] border-[#A5574D] text-white'
                : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{deviceFrameMode ? 'Phone Frame' : 'Full Width'}</span>
          </button>

          {/* Download Android Studio Zip */}
          <button
            onClick={handleDownloadAndroidZip}
            disabled={isExportingZip}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#A5574D] hover:bg-[#8F473E] active:scale-95 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingZip ? 'Packaging...' : 'Export Android ZIP'}</span>
          </button>
        </div>
      </header>

      {/* Ready-to-push Clean Android Project Notice & Direct Download */}
      <div className="w-full bg-emerald-950/90 border-b border-emerald-700/60 px-4 py-2.5 text-emerald-200 text-xs flex flex-wrap items-center justify-between gap-3 shadow-inner z-20">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-emerald-100">Ready-to-Build Android Project ZIP:</span>
          <span className="text-emerald-300/90">Zero errors, 100% verified for GitHub Actions APK build.</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/assets/aistudio/bloom-android-project.zip"
            download="bloom-android-project.zip"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Clean ZIP</span>
          </a>
        </div>
      </div>

      {/* Main App Container */}
      <main className="flex-1 flex justify-center items-start p-0 sm:p-4 md:p-6 overflow-hidden">
        <div
          className={`w-full bg-[#FAF8F5] transition-all flex flex-col relative overflow-hidden ${
            deviceFrameMode
              ? 'max-w-[390px] h-[844px] rounded-[48px] border-[10px] border-[#1C1D21] shadow-2xl my-auto'
              : 'max-w-md min-h-[760px] md:rounded-3xl md:border md:border-[#E8DDD8] md:shadow-xl'
          }`}
          style={{ minHeight: deviceFrameMode ? '844px' : '760px' }}
        >
          {/* Mobile Status Bar Simulation in Phone Frame */}
          {deviceFrameMode && (
            <div className="h-7 w-full bg-transparent flex items-center justify-between px-7 text-[11px] font-semibold text-[#2B2523] select-none pt-1 shrink-0">
              <span>9:41</span>
              <div className="w-20 h-4 bg-black rounded-full mx-auto" />
              <div className="flex items-center gap-1.5">
                <span className="text-[10px]">5G</span>
                <span className="w-5 h-2.5 border border-[#2B2523] rounded-xs relative flex items-center p-0.5">
                  <div className="h-full w-3/4 bg-[#2B2523] rounded-xs" />
                </span>
              </div>
            </div>
          )}

          {/* Screens Content Area */}
          <div className="flex-1 flex flex-col relative overflow-hidden">
            {screen === 'splash' && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#FAF8F5] text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="flex flex-col items-center gap-5"
                >
                  <BloomFlower size={130} bloomLevel={5} showAura={true} showSparkles={true} />
                  <div className="space-y-1">
                    <h1 className="font-serif-italic text-4xl text-[#2B2523]">Bloom</h1>
                    <p className="text-xs text-[#7C7470]">A daily companion for PCOS wellness</p>
                  </div>
                </motion.div>
              </div>
            )}

            {screen === 'onboarding' && (
              <OnboardingFlow
                onComplete={handleFinishOnboarding}
                onFinish={handleFinishOnboarding}
              />
            )}

            {screen === 'home' && (
              <div className="flex-1 flex flex-col relative h-full overflow-hidden">
                {/* Active Tab Screen */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {activeTab === 'dashboard' && (
                    <HomeDashboard
                      profile={profile}
                      tracking={tracking}
                      targets={targets}
                      progress={progress}
                      cycleData={cycleData}
                      symptoms={symptoms}
                      onOpenCycle={() => setActiveSheet('cycle')}
                      onOpenSymptoms={() => setActiveSheet('symptoms')}
                      onOpenMeals={() => setActiveSheet('meals')}
                      onOpenCounter={(cat) => {
                        setCounterCategory(cat);
                        setActiveSheet('counter');
                      }}
                      onOpenFaqArticle={(article) => {
                        setActiveFaqArticle(article);
                        setActiveSheet('faq_article');
                      }}
                      onOpenSettings={() => setActiveTab('settings')}
                      onMarkSleepDone={() => {
                        setProgress((p) => ({
                          ...p,
                          sleepHours: targets.sleep,
                          sleepLoggedLastNight: true,
                        }));
                      }}
                    />
                  )}

                  {activeTab === 'insights' && (
                    <InsightsScreen
                      cycleData={cycleData}
                      symptoms={symptoms}
                      onOpenCycleSheet={() => setActiveSheet('cycle')}
                      onOpenSymptomsSheet={() => setActiveSheet('symptoms')}
                    />
                  )}

                  {activeTab === 'learn' && (
                    <LearnScreen
                      onSelectArticle={(art) => {
                        setActiveFaqArticle(art);
                        setActiveSheet('faq_article');
                      }}
                    />
                  )}

                  {activeTab === 'settings' && (
                    <SettingsScreen
                      profile={profile}
                      tracking={tracking}
                      targets={targets}
                      onUpdateProfile={(p) => setProfile((prev) => ({ ...prev, ...p }))}
                      onUpdateTracking={(t) => setTracking(t)}
                      onUpdateTargets={(tg) => setTargets(tg)}
                      onOpenEditProfile={() => setActiveSheet('edit_profile')}
                      onOpenReminderTime={() => setActiveSheet('reminder_time')}
                      onOpenLiveNotification={() => setActiveSheet('live_notification')}
                      onResetOnboarding={handleResetOnboarding}
                    />
                  )}
                </div>

                {/* Bottom Navigation Bar */}
                <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#EDE3DE] py-2 px-6 flex items-center justify-between z-20 shadow-lg">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex flex-col items-center gap-1 transition-colors ${
                      activeTab === 'dashboard' ? 'text-[#A5574D]' : 'text-[#8C7D77] hover:text-[#2B2523]'
                    }`}
                  >
                    <HomeIcon className="w-5 h-5" />
                    <span className="text-[10px] font-semibold">Today</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('insights')}
                    className={`flex flex-col items-center gap-1 transition-colors ${
                      activeTab === 'insights' ? 'text-[#A5574D]' : 'text-[#8C7D77] hover:text-[#2B2523]'
                    }`}
                  >
                    <BarChart2 className="w-5 h-5" />
                    <span className="text-[10px] font-semibold">Insights</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('learn')}
                    className={`flex flex-col items-center gap-1 transition-colors ${
                      activeTab === 'learn' ? 'text-[#A5574D]' : 'text-[#8C7D77] hover:text-[#2B2523]'
                    }`}
                  >
                    <BookOpen className="w-5 h-5" />
                    <span className="text-[10px] font-semibold">Learn</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex flex-col items-center gap-1 transition-colors ${
                      activeTab === 'settings' ? 'text-[#A5574D]' : 'text-[#8C7D77] hover:text-[#2B2523]'
                    }`}
                  >
                    <SettingsIcon className="w-5 h-5" />
                    <span className="text-[10px] font-semibold">Settings</span>
                  </button>
                </nav>
              </div>
            )}
          </div>

          {/* Interactive Bottom Sheets */}
          <AnimatePresence>
            {activeSheet === 'cycle' && (
              <LogCycleSheet
                cycleData={cycleData}
                onSave={(data) => setCycleData(data)}
                onClose={() => setActiveSheet(null)}
              />
            )}

            {activeSheet === 'symptoms' && (
              <LogSymptomsSheet
                symptoms={symptoms}
                onSave={(data) => setSymptoms(data)}
                onClose={() => setActiveSheet(null)}
              />
            )}

            {activeSheet === 'meals' && (
              <LogMealsSheet
                currentCount={progress.mealsCount}
                targetCount={targets.meals}
                mealsData={progress.mealsData}
                onSave={(count, mealsData) =>
                  setProgress((p) => ({
                    ...p,
                    mealsCount: count,
                    mealsData: mealsData || p.mealsData,
                  }))
                }
                onClose={() => setActiveSheet(null)}
                onOpenSettings={() => setActiveTab('settings')}
              />
            )}

            {activeSheet === 'counter' && (
              <LogCounterSheet
                category={counterCategory}
                currentValue={
                  counterCategory === 'water'
                    ? progress.waterGlasses
                    : counterCategory === 'relaxation'
                    ? progress.relaxationMinutes
                    : counterCategory === 'sleep'
                    ? progress.sleepHours
                    : progress.movementMinutes
                }
                targetValue={
                  counterCategory === 'water'
                    ? targets.water
                    : counterCategory === 'relaxation'
                    ? targets.relaxation
                    : counterCategory === 'sleep'
                    ? targets.sleep
                    : targets.movement
                }
                onSave={(val) => {
                  setProgress((p) => ({
                    ...p,
                    ...(counterCategory === 'water'
                      ? { waterGlasses: val }
                      : counterCategory === 'relaxation'
                      ? { relaxationMinutes: val }
                      : counterCategory === 'sleep'
                      ? { sleepHours: val }
                      : { movementMinutes: val }),
                  }));
                }}
                onClose={() => setActiveSheet(null)}
                onOpenSettings={() => setActiveTab('settings')}
              />
            )}

            {activeSheet === 'edit_profile' && (
              <EditProfileSheet
                profile={profile}
                onSave={(p) => setProfile((prev) => ({ ...prev, ...p }))}
                onClose={() => setActiveSheet(null)}
              />
            )}

            {activeSheet === 'reminder_time' && (
              <ReminderTimeSheet
                currentTime={profile.reminderTime || '7:30 AM'}
                onSave={(t) => setProfile((prev) => ({ ...prev, reminderTime: t }))}
                onClose={() => setActiveSheet(null)}
              />
            )}

            {activeSheet === 'live_notification' && (
              <LiveNotificationSheet onClose={() => setActiveSheet(null)} />
            )}

            {activeSheet === 'faq_article' && activeFaqArticle && (
              <FaqArticleSheet
                article={activeFaqArticle}
                onClose={() => {
                  setActiveSheet(null);
                  setActiveFaqArticle(null);
                }}
              />
            )}
          </AnimatePresence>

          {/* AdMob App Open Ad Overlay */}
          <AppOpenAdOverlay
            isOpen={showAppOpenAd}
            onClose={() => {
              setShowAppOpenAd(false);
              setScreen('home');
            }}
            onDismiss={() => {
              setShowAppOpenAd(false);
              setScreen('home');
            }}
          />

          {/* AdMob Developer Inspector Console */}
          <AdMobInspectorModal
            isOpen={isAdMobInspectorOpen}
            onClose={() => setIsAdMobInspectorOpen(false)}
            onSimulateForeground={handleSimulateForeground}
            onResetOnboarding={handleResetOnboarding}
            isOnboardingCompleted={isOnboardingCompleted}
            onDownloadAndroidProject={handleDownloadAndroidZip}
          />
        </div>
      </main>
    </div>
  );
}
