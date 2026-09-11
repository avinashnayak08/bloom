package com.bloom.app.admob

import android.util.Log

/**
 * Lightweight ad analytics tracker for observing ad lifecycle events.
 */
object AdAnalytics {
    const val EVENT_APP_OPEN_AD_REQUESTED = "app_open_ad_requested"
    const val EVENT_APP_OPEN_AD_LOADED = "app_open_ad_loaded"
    const val EVENT_APP_OPEN_AD_FAILED = "app_open_ad_failed"
    const val EVENT_APP_OPEN_AD_SHOWN = "app_open_ad_shown"
    const val EVENT_APP_OPEN_AD_DISMISSED = "app_open_ad_dismissed"
    const val EVENT_BANNER_AD_LOADED = "banner_ad_loaded"
    const val EVENT_BANNER_AD_FAILED = "banner_ad_failed"
    const val EVENT_BANNER_AD_IMPRESSION = "banner_ad_impression"

    fun logEvent(eventName: String, adUnitId: String, details: String? = null) {
        val message = "AdEvent: $eventName | Unit: $adUnitId ${if (details != null) "| $details" else ""}"
        Log.i("AdAnalytics", message)
    }
}
