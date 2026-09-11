package com.bloom.app

import android.app.Activity
import android.app.Application
import android.os.Bundle
import androidx.lifecycle.DefaultLifecycleObserver
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.ProcessLifecycleOwner
import com.bloom.app.admob.AppOpenAdManager
import com.bloom.app.data.UserPreferencesRepository
import com.google.android.gms.ads.MobileAds
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

class BloomApplication : Application(), Application.ActivityLifecycleCallbacks, DefaultLifecycleObserver {

    lateinit var appOpenAdManager: AppOpenAdManager
        private set

    lateinit var preferencesRepository: UserPreferencesRepository
        private set

    private var currentActivity: Activity? = null

    override fun onCreate() {
        super<Application>.onCreate()
        registerActivityLifecycleCallbacks(this)

        preferencesRepository = UserPreferencesRepository(this)
        appOpenAdManager = AppOpenAdManager(this)

        // Initialize Google Mobile Ads SDK asynchronously
        CoroutineScope(Dispatchers.IO).launch {
            MobileAds.initialize(this@BloomApplication) { status ->
                // Preload the initial App Open Ad in the background
                appOpenAdManager.loadAd(this@BloomApplication)
            }
        }

        ProcessLifecycleOwner.get().lifecycle.addObserver(this)
    }

    /**
     * Called when the app moves to foreground (subsequent foreground events).
     */
    override fun onStart(owner: LifecycleOwner) {
        super.onStart(owner)
        CoroutineScope(Dispatchers.Main).launch {
            val isOnboardingCompleted = preferencesRepository.isOnboardingCompleted.first()
            if (isOnboardingCompleted) {
                currentActivity?.let { activity ->
                    appOpenAdManager.showAdIfAvailable(activity)
                }
            }
        }
    }

    override fun onActivityStarted(activity: Activity) {
        currentActivity = activity
    }

    override fun onActivityResumed(activity: Activity) {
        currentActivity = activity
    }

    override fun onActivityStopped(activity: Activity) {}
    override fun onActivityPaused(activity: Activity) {}
    override fun onActivitySaveInstanceState(activity: Activity, outState: Bundle) {}
    override fun onActivityDestroyed(activity: Activity) {
        if (currentActivity == activity) {
            currentActivity = null
        }
    }
    override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) {}
}
