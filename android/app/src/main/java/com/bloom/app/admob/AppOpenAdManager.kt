package com.bloom.app.admob

import android.app.Activity
import android.content.Context
import android.util.Log
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.appopen.AppOpenAd
import java.util.Date

/**
 * Handles preloading, lifecycle-aware showing, and reloading of Google AdMob App Open Ads.
 */
class AppOpenAdManager(private val context: Context) {

    companion object {
        private const val TAG = "AppOpenAdManager"
        // Google official test ad unit ID for Android App Open Ads
        const val TEST_AD_UNIT_ID = "ca-app-pub-3940256099942544/9257396915"
        // Ad freshness window (4 hours in milliseconds)
        private const val FOUR_HOURS_MILLIS = 4 * 3600 * 1000L
    }

    private var appOpenAd: AppOpenAd? = null
    private var isLoadingAd = false
    var isShowingAd = false
        private set
    private var loadTime: Long = 0

    /**
     * Preloads an App Open Ad if not already loading or available.
     */
    fun loadAd(context: Context, onLoaded: (() -> Unit)? = null) {
        if (isLoadingAd || isAdAvailable()) {
            return
        }

        isLoadingAd = true
        AdAnalytics.logEvent(AdAnalytics.EVENT_APP_OPEN_AD_REQUESTED, TEST_AD_UNIT_ID)

        val request = AdRequest.Builder().build()
        AppOpenAd.load(
            context,
            TEST_AD_UNIT_ID,
            request,
            object : AppOpenAd.AppOpenAdLoadCallback() {
                override fun onAdLoaded(ad: AppOpenAd) {
                    Log.d(TAG, "App Open Ad loaded successfully.")
                    appOpenAd = ad
                    isLoadingAd = false
                    loadTime = Date().time
                    AdAnalytics.logEvent(AdAnalytics.EVENT_APP_OPEN_AD_LOADED, TEST_AD_UNIT_ID)
                    onLoaded?.invoke()
                }

                override fun onAdFailedToLoad(loadAdError: LoadAdError) {
                    Log.e(TAG, "App Open Ad failed to load: ${loadAdError.message}")
                    isLoadingAd = false
                    appOpenAd = null
                    AdAnalytics.logEvent(
                        AdAnalytics.EVENT_APP_OPEN_AD_FAILED,
                        TEST_AD_UNIT_ID,
                        loadAdError.message
                    )
                }
            }
        )
    }

    /**
     * Checks if ad is loaded and not expired (less than 4 hours old).
     */
    private fun isAdAvailable(): Boolean {
        val wasLoadedRecently = (Date().time - loadTime) < FOUR_HOURS_MILLIS
        return appOpenAd != null && wasLoadedRecently
    }

    /**
     * Shows the preloaded App Open Ad if eligible.
     */
    fun showAdIfAvailable(
        activity: Activity,
        onAdDismissedOrFailed: (() -> Unit)? = null
    ) {
        // Prevent showing multiple ads simultaneously
        if (isShowingAd) {
            Log.d(TAG, "The app open ad is already showing.")
            onAdDismissedOrFailed?.invoke()
            return
        }

        // If ad is not available, proceed without blocking
        if (!isAdAvailable()) {
            Log.d(TAG, "The app open ad is not ready yet. Preloading next...")
            loadAd(activity)
            onAdDismissedOrFailed?.invoke()
            return
        }

        appOpenAd?.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() {
                Log.d(TAG, "App Open Ad was dismissed.")
                appOpenAd = null
                isShowingAd = false
                AdAnalytics.logEvent(AdAnalytics.EVENT_APP_OPEN_AD_DISMISSED, TEST_AD_UNIT_ID)
                onAdDismissedOrFailed?.invoke()
                // Reload next ad for future foreground events
                loadAd(activity)
            }

            override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                Log.e(TAG, "App Open Ad failed to show: ${adError.message}")
                appOpenAd = null
                isShowingAd = false
                AdAnalytics.logEvent(
                    AdAnalytics.EVENT_APP_OPEN_AD_FAILED,
                    TEST_AD_UNIT_ID,
                    adError.message
                )
                onAdDismissedOrFailed?.invoke()
                loadAd(activity)
            }

            override fun onAdShowedFullScreenContent() {
                Log.d(TAG, "App Open Ad is showing full screen.")
                isShowingAd = true
                AdAnalytics.logEvent(AdAnalytics.EVENT_APP_OPEN_AD_SHOWN, TEST_AD_UNIT_ID)
            }
        }

        isShowingAd = true
        appOpenAd?.show(activity)
    }
}
