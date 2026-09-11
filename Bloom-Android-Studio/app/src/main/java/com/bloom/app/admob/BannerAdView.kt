package com.bloom.app.admob

import android.content.Context
import android.util.DisplayMetrics
import android.view.ViewGroup
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import com.google.android.gms.ads.AdListener
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdSize
import com.google.android.gms.ads.AdView
import com.google.android.gms.ads.LoadAdError

/**
 * Jetpack Compose wrapper for Google AdMob Adaptive Banner Ad.
 */
@Composable
fun BannerAdView(
    modifier: Modifier = Modifier,
    adUnitId: String = "ca-app-pub-3940256099942544/6300978111"
) {
    AndroidView(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp),
        factory = { context ->
            AdView(context).apply {
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                )
                setAdUnitId(adUnitId)
                setAdSize(getAdaptiveBannerSize(context))

                adListener = object : AdListener() {
                    override fun onAdLoaded() {
                        super.onAdLoaded()
                        AdAnalytics.logEvent(AdAnalytics.EVENT_BANNER_AD_LOADED, adUnitId)
                    }

                    override fun onAdFailedToLoad(error: LoadAdError) {
                        super.onAdFailedToLoad(error)
                        AdAnalytics.logEvent(
                            AdAnalytics.EVENT_BANNER_AD_FAILED,
                            adUnitId,
                            error.message
                        )
                    }

                    override fun onAdImpression() {
                        super.onAdImpression()
                        AdAnalytics.logEvent(AdAnalytics.EVENT_BANNER_AD_IMPRESSION, adUnitId)
                    }
                }

                loadAd(AdRequest.Builder().build())
            }
        }
    )
}

/**
 * Calculates responsive adaptive banner size based on current screen width.
 */
private fun getAdaptiveBannerSize(context: Context): AdSize {
    val displayMetrics: DisplayMetrics = context.resources.displayMetrics
    val screenWidthDp = (displayMetrics.widthPixels / displayMetrics.density).toInt()
    return AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(context, screenWidthDp)
}
