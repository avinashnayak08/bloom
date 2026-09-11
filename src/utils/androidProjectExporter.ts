import JSZip from 'jszip';

export interface AndroidProjectFile {
  path: string;
  content: string;
}

export const ANDROID_FILES: AndroidProjectFile[] = [
  {
    path: 'settings.gradle.kts',
    content: `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "Bloom"
include(":app")
`,
  },
  {
    path: 'build.gradle.kts',
    content: `plugins {
    id("com.android.application") version "8.3.2" apply false
    id("org.jetbrains.kotlin.android") version "1.9.24" apply false
}
`,
  },
  {
    path: 'gradle.properties',
    content: `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official
`,
  },
  {
    path: 'app/build.gradle.kts',
    content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.bloom.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.bloom.app"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.14"
    }
}

dependencies {
    // AndroidX & Compose
    implementation(platform("androidx.compose:compose-bom:2024.09.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.activity:activity-compose:1.9.3")
    implementation("androidx.navigation:navigation-compose:2.8.3")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.8.7")
    implementation("androidx.lifecycle:lifecycle-process:2.8.7")

    // DataStore Preferences (for Onboarding state persistence)
    implementation("androidx.datastore:datastore-preferences:1.1.1")

    // Google Mobile Ads SDK (AdMob)
    implementation("com.google.android.gms:play-services-ads:23.6.0")

    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")
}
`,
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Permissions for Google Mobile Ads SDK -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:name=".BloomApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.Bloom">

        <!-- Google AdMob Application ID (Official Google Test App ID) -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-3940256099942544~3347511713" />

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.Bloom">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`,
  },
  {
    path: 'app/src/main/java/com/bloom/app/BloomApplication.kt',
    content: `package com.bloom.app

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
`,
  },
  {
    path: 'app/src/main/java/com/bloom/app/admob/AppOpenAdManager.kt',
    content: `package com.bloom.app.admob

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
                    Log.e(TAG, "App Open Ad failed to load: \${loadAdError.message}")
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
                Log.e(TAG, "App Open Ad failed to show: \${adError.message}")
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
`,
  },
  {
    path: 'app/src/main/java/com/bloom/app/admob/BannerAdView.kt',
    content: `package com.bloom.app.admob

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
`,
  },
  {
    path: 'app/src/main/java/com/bloom/app/admob/AdAnalytics.kt',
    content: `package com.bloom.app.admob

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
        val message = "AdEvent: \$eventName | Unit: \$adUnitId \${if (details != null) "| \$details" else ""}"
        Log.i("AdAnalytics", message)
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/bloom/app/data/UserPreferencesRepository.kt',
    content: `package com.bloom.app.data

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore by preferencesDataStore(name = "bloom_user_preferences")

class UserPreferencesRepository(private val context: Context) {

    companion object {
        val KEY_ONBOARDING_COMPLETED = booleanPreferencesKey("onboarding_completed")
        val KEY_USER_NAME = stringPreferencesKey("user_name")
        val KEY_REMINDER_TIME = stringPreferencesKey("reminder_time")
    }

    val isOnboardingCompleted: Flow<Boolean> = context.dataStore.data.map { preferences ->
        preferences[KEY_ONBOARDING_COMPLETED] ?: false
    }

    val userName: Flow<String> = context.dataStore.data.map { preferences ->
        preferences[KEY_USER_NAME] ?: "Sofia"
    }

    suspend fun setOnboardingCompleted(completed: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[KEY_ONBOARDING_COMPLETED] = completed
        }
    }

    suspend fun saveUserProfile(name: String, reminderTime: String) {
        context.dataStore.edit { preferences ->
            preferences[KEY_USER_NAME] = name
            preferences[KEY_REMINDER_TIME] = reminderTime
            preferences[KEY_ONBOARDING_COMPLETED] = true
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/bloom/app/MainActivity.kt',
    content: `package com.bloom.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.bloom.app.ui.screens.HomeScreen
import com.bloom.app.ui.screens.OnboardingScreen
import com.bloom.app.ui.theme.BloomTheme
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val app = application as BloomApplication

        setContent {
            BloomTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val isOnboardingCompleted by app.preferencesRepository.isOnboardingCompleted
                        .collectAsState(initial = false)

                    BloomAppNavigation(
                        isOnboardingCompleted = isOnboardingCompleted,
                        onCompleteOnboarding = { name, reminder ->
                            // Save completion in DataStore
                            CoroutineScope(Dispatchers.IO).launch {
                                app.preferencesRepository.saveUserProfile(name, reminder)
                            }
                        }
                    )
                }
            }
        }
    }
}

@Composable
fun BloomAppNavigation(
    isOnboardingCompleted: Boolean,
    onCompleteOnboarding: (String, String) -> Unit
) {
    val navController = rememberNavController()
    val startDestination = if (isOnboardingCompleted) "home" else "onboarding"

    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        composable("onboarding") {
            OnboardingScreen(
                onFinishOnboarding = { name, reminder ->
                    onCompleteOnboarding(name, reminder)
                    navController.navigate("home") {
                        popUpTo("onboarding") { inclusive = true }
                    }
                }
            )
        }
        composable("home") {
            HomeScreen()
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/bloom/app/ui/theme/Theme.kt',
    content: `package com.bloom.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val BloomTerracotta = Color(0xFFA5574D)
val BloomTerracottaDark = Color(0xFF8C443B)
val BloomBlush = Color(0xFFF5EAE6)
val BloomGold = Color(0xFFC2923A)
val BloomBackground = Color(0xFFFAF8F5)
val BloomCardBg = Color(0xFFFFFFFF)
val BloomTextPrimary = Color(0xFF2B2523)
val BloomTextSecondary = Color(0xFF7C7470)

private val LightColorScheme = lightColorScheme(
    primary = BloomTerracotta,
    onPrimary = Color.White,
    primaryContainer = BloomBlush,
    onPrimaryContainer = BloomTerracottaDark,
    background = BloomBackground,
    onBackground = BloomTextPrimary,
    surface = BloomCardBg,
    onSurface = BloomTextPrimary,
    surfaceVariant = BloomBlush,
    onSurfaceVariant = BloomTextSecondary,
)

@Composable
fun BloomTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        content = content
    )
}
`,
  },
  {
    path: 'app/src/main/java/com/bloom/app/ui/screens/OnboardingScreen.kt',
    content: `package com.bloom.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bloom.app.ui.theme.*

@Composable
fun OnboardingScreen(
    onFinishOnboarding: (name: String, reminder: String) -> Unit
) {
    var step by remember { mutableStateOf(1) }
    var name by remember { mutableStateOf("Sofia") }
    var reminderTime by remember { mutableStateOf("7:30 AM") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BloomBackground)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Top 4-bar indicator
        Row(
            modifier = Modifier.fillMaxWidth().padding(top = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            for (i in 1..4) {
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .height(6.dp)
                        .background(
                            if (i <= step) BloomTerracotta else Color(0xFFEBD9D3),
                            RoundedCornerShape(3.dp)
                        )
                )
            }
        }

        // Step Content
        when (step) {
            1 -> {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.padding(horizontal = 16.dp)
                ) {
                    Text(
                        text = "Welcome to Bloom",
                        fontSize = 32.sp,
                        fontStyle = FontStyle.Italic,
                        color = BloomTextPrimary,
                        textAlign = TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "A simple daily companion for managing PCOS — track your cycle, meals, movement, water, relaxation and sleep.",
                        fontSize = 14.sp,
                        color = BloomTextSecondary,
                        textAlign = TextAlign.Center,
                        lineHeight = 22.sp
                    )
                }
                Button(
                    onClick = { step = 2 },
                    modifier = Modifier.fillMaxWidth().height(56.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = BloomTerracotta)
                ) {
                    Text("Get started", fontSize = 16.sp)
                }
            }
            2 -> {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "A little about you",
                        fontSize = 28.sp,
                        fontStyle = FontStyle.Italic,
                        color = BloomTextPrimary
                    )
                    Spacer(modifier = Modifier.height(24.dp))
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("Your first name") },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp)
                    )
                }
                Button(
                    onClick = { step = 3 },
                    modifier = Modifier.fillMaxWidth().height(56.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = BloomTerracotta)
                ) {
                    Text("Continue", fontSize = 16.sp)
                }
            }
            3 -> {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "What would you like to track daily?",
                        fontSize = 24.sp,
                        fontStyle = FontStyle.Italic,
                        color = BloomTextPrimary,
                        textAlign = TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "Pick the goals that matter to you — partial progress still counts.",
                        fontSize = 13.sp,
                        color = BloomTextSecondary,
                        textAlign = TextAlign.Center
                    )
                }
                Button(
                    onClick = { step = 4 },
                    modifier = Modifier.fillMaxWidth().height(56.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = BloomTerracotta)
                ) {
                    Text("Continue", fontSize = 16.sp)
                }
            }
            4 -> {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "When should we remind you?",
                        fontSize = 24.sp,
                        fontStyle = FontStyle.Italic,
                        color = BloomTextPrimary,
                        textAlign = TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "We'll send one daily nudge to log how you're doing.",
                        fontSize = 13.sp,
                        color = BloomTextSecondary,
                        textAlign = TextAlign.Center
                    )
                }
                Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(
                        onClick = { onFinishOnboarding(name, reminderTime) },
                        modifier = Modifier.fillMaxWidth().height(56.dp),
                        shape = RoundedCornerShape(16.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = BloomTerracotta)
                    ) {
                        Text("Enter Bloom", fontSize = 16.sp)
                    }
                    TextButton(
                        onClick = { onFinishOnboarding(name, "Not set") },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("I'll set this up later", color = BloomTextSecondary)
                    }
                }
            }
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/bloom/app/ui/screens/HomeScreen.kt',
    content: `package com.bloom.app.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bloom.app.admob.BannerAdView
import com.bloom.app.ui.theme.*

@Composable
fun HomeScreen() {
    val scrollState = rememberScrollState()

    // Interactive Daily Goals
    val goals = remember {
        mutableStateMapOf(
            "Cycle & Energy check-in" to false,
            "Balanced low-GI meal" to true,
            "Hydration goal (2L)" to false,
            "20-minute gentle movement" to false,
            "Restful sleep & wind-down" to false
        )
    }

    // Hydration Tracker state
    var waterGlasses by remember { mutableIntStateOf(5) }

    // Symptom Tracker state
    val selectedSymptoms = remember { mutableStateListOf("Bloating") }
    val symptomOptions = listOf("Bloating", "Fatigue", "Cramps", "Acne", "Mood Shift", "Cravings")

    // FAQ expansion state
    var expandedFaqIndex by remember { mutableIntStateOf(0) }

    val completedCount = goals.values.count { it }
    val totalGoals = goals.size

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BloomBackground)
            .verticalScroll(scrollState)
            .padding(bottom = 24.dp)
    ) {
        // Top Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "GOOD MORNING,",
                    fontSize = 11.sp,
                    color = BloomTextSecondary,
                    letterSpacing = 1.sp,
                    fontWeight = FontWeight.Medium
                )
                Text(
                    text = "Sofia",
                    fontSize = 26.sp,
                    fontStyle = FontStyle.Italic,
                    fontWeight = FontWeight.Bold,
                    color = BloomTextPrimary
                )
            }
            // Cycle Badge
            Surface(
                shape = RoundedCornerShape(14.dp),
                color = BloomBlush,
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFEBD9D3))
            ) {
                Text(
                    text = "Day 14 • Ovulatory",
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = BloomTerracotta
                )
            }
        }

        // Today's Goals Card
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = BloomCardBg),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "Today's Goals",
                            fontSize = 20.sp,
                            fontStyle = FontStyle.Italic,
                            fontWeight = FontWeight.Bold,
                            color = BloomTextPrimary
                        )
                        Text(
                            text = "Saturday, June 27",
                            fontSize = 12.sp,
                            color = BloomTextSecondary
                        )
                    }
                    Text(
                        text = "$completedCount of $totalGoals complete",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = BloomTerracotta
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Progress Bar
                LinearProgressIndicator(
                    progress = { completedCount.toFloat() / totalGoals.toFloat() },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(8.dp)
                        .clip(RoundedCornerShape(4.dp)),
                    color = BloomTerracotta,
                    trackColor = Color(0xFFF5EAE6)
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Goal Checklist
                goals.keys.forEach { goalTitle ->
                    val isChecked = goals[goalTitle] == true
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .clickable { goals[goalTitle] = !isChecked }
                            .padding(vertical = 4.dp, horizontal = 2.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Checkbox(
                            checked = isChecked,
                            onCheckedChange = { goals[goalTitle] = it },
                            colors = CheckboxDefaults.colors(
                                checkedColor = BloomTerracotta,
                                uncheckedColor = Color(0xFFC4B8B3)
                            )
                        )
                        Text(
                            text = goalTitle,
                            fontSize = 14.sp,
                            color = if (isChecked) BloomTextSecondary else BloomTextPrimary,
                            fontWeight = if (isChecked) FontWeight.Normal else FontWeight.Medium
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Hydration Widget
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = BloomCardBg)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Hydration Tracker",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = BloomTextPrimary
                    )
                    Text(
                        text = "$waterGlasses of 8 glasses logged (\${waterGlasses * 250} ml)",
                        fontSize = 12.sp,
                        color = BloomTextSecondary
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape)
                            .background(Color(0xFFF5EAE6))
                            .clickable { if (waterGlasses > 0) waterGlasses-- },
                        contentAlignment = Alignment.Center
                    ) {
                        Text("-", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = BloomTerracotta)
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Text(
                        text = "$waterGlasses",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = BloomTextPrimary
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape)
                            .background(BloomTerracotta)
                            .clickable { if (waterGlasses < 12) waterGlasses++ },
                        contentAlignment = Alignment.Center
                    ) {
                        Text("+", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // PCOS Symptoms Quick Logger
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = BloomCardBg)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "Daily Symptom Log",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = BloomTextPrimary
                )
                Text(
                    text = "Tap to record any active PCOS symptoms today",
                    fontSize = 11.sp,
                    color = BloomTextSecondary
                )
                Spacer(modifier = Modifier.height(10.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    symptomOptions.take(3).forEach { sym ->
                        val isSelected = selectedSymptoms.contains(sym)
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(12.dp))
                                .background(if (isSelected) BloomTerracotta else Color(0xFFF5EAE6))
                                .clickable {
                                    if (isSelected) selectedSymptoms.remove(sym)
                                    else selectedSymptoms.add(sym)
                                }
                                .padding(vertical = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = sym,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = if (isSelected) Color.White else BloomTextPrimary
                            )
                        }
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    symptomOptions.drop(3).forEach { sym ->
                        val isSelected = selectedSymptoms.contains(sym)
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(12.dp))
                                .background(if (isSelected) BloomTerracotta else Color(0xFFF5EAE6))
                                .clickable {
                                    if (isSelected) selectedSymptoms.remove(sym)
                                    else selectedSymptoms.add(sym)
                                }
                                .padding(vertical = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = sym,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = if (isSelected) Color.White else BloomTextPrimary
                            )
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // PCOS FAQ & Micro-guides
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = BloomCardBg)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "PCOS Micro-Guides",
                    fontSize = 15.sp,
                    fontStyle = FontStyle.Italic,
                    fontWeight = FontWeight.Bold,
                    color = BloomTextPrimary
                )
                Spacer(modifier = Modifier.height(8.dp))

                val faqs = listOf(
                    "What exactly is PCOS?" to "Polycystic Ovary Syndrome involves a hormonal imbalance affecting metabolic and reproductive cycles. Gentle routine tracking helps balance cortisol.",
                    "Why insulin resistance matters?" to "Insulin resistance is common in PCOS. Pairing carbohydrates with protein and healthy fats helps stabilize blood glucose and reduce cravings.",
                    "Gentle movement vs HIIT?" to "Low-impact movement like walking and gentle yoga lowers cortisol and supports cellular insulin sensitivity without inducing adrenal fatigue."
                )

                faqs.forEachIndexed { index, (question, answer) ->
                    val isExpanded = expandedFaqIndex == index
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .clickable {
                                expandedFaqIndex = if (isExpanded) -1 else index
                            }
                            .padding(vertical = 8.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = question,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = BloomTextPrimary
                            )
                            Text(
                                text = if (isExpanded) "−" else "+",
                                fontSize = 16.sp,
                                color = BloomTerracotta,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        AnimatedVisibility(visible = isExpanded) {
                            Text(
                                text = answer,
                                fontSize = 12.sp,
                                color = BloomTextSecondary,
                                lineHeight = 18.sp,
                                modifier = Modifier.padding(top = 6.dp)
                            )
                        }
                    }
                    if (index < faqs.size - 1) {
                        Divider(color = Color(0xFFF0EAE6), thickness = 0.8.dp)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // AdMob Adaptive Banner Ad placed at the bottom of the home content
        BannerAdView()
    }
}

`,
  },
  {
    path: 'app/src/main/res/values/strings.xml',
    content: `<resources>
    <string name="app_name">Bloom</string>
</resources>
`,
  },
  {
    path: 'app/src/main/res/values/themes.xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.Bloom" parent="android:Theme.Material.Light.NoActionBar">
        <item name="android:statusBarColor">#FDFBF9</item>
        <item name="android:navigationBarColor">#FFFFFF</item>
    </style>
</resources>
`,
  },
  {
    path: 'app/src/main/res/values/colors.xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="bloom_terracotta">#A5574D</color>
    <color name="bloom_bg">#FDFBF9</color>
</resources>
`,
  },
  {
    path: 'app/src/main/res/xml/backup_rules.xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<full-backup-content>
</full-backup-content>
`,
  },
  {
    path: 'app/src/main/res/xml/data_extraction_rules.xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<data-extraction-rules>
    <cloud-backup>
    </cloud-backup>
    <device-transfer>
    </device-transfer>
</data-extraction-rules>
`,
  },
  {
    path: 'app/src/main/res/drawable/ic_launcher_foreground.xml',
    content: `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#A5574D"
        android:pathData="M54,20 C40,20 28,32 28,46 C28,68 54,88 54,88 C54,88 80,68 80,46 C80,32 68,20 54,20 Z" />
</vector>
`,
  },
  {
    path: 'app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/bloom_bg" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>
`,
  },
  {
    path: 'app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/bloom_bg" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>
`,
  },
  {
    path: 'gradle/wrapper/gradle-wrapper.properties',
    content: `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.7-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`,
  },
  {
    path: '.github/workflows/build-apk.yml',
    content: `name: Build Android APK

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    name: Build Debug APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Setup Android SDK
        uses: android-actions/setup-android@v3

      - name: Accept Android SDK Licenses
        run: |
          yes | sdkmanager --licenses || true

      - name: Setup Gradle 8.7
        uses: gradle/actions/setup-gradle@v4
        with:
          gradle-version: '8.7'

      - name: Build APK with Gradle
        run: |
          if [ -d "android" ]; then
            cd android
          fi
          gradle assembleDebug --stacktrace --no-daemon

      - name: Upload Debug APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: bloom-debug-apk
          path: |
            **/build/outputs/apk/debug/*.apk
          retention-days: 14
`,
  },
  {
    path: 'README.md',
    content: `# Bloom App – Android Studio & AdMob Integration

## Overview
**Bloom** is a women's wellness application tailored for PCOS health management, daily goal tracking, symptom correlation, and Google AdMob monetization.

## Architecture
- **Language**: Kotlin 1.9+
- **UI Framework**: Jetpack Compose with Material3
- **Design System**: Warm terracotta (\`#A5574D\`), soft rose, Playfair Display typography
- **Architecture Pattern**: MVVM with Kotlin Coroutines & StateFlow
- **Persistence**: Jetpack DataStore Preferences (persisting onboarding status & profile)
- **Monetization**: Google Mobile Ads SDK (v23.6.0)

## AdMob Implementation & Test Ad IDs
This project utilizes the official Google AdMob Test Ad IDs:
- **Application ID**: \`ca-app-pub-3940256099942544~3347511713\` (declared in \`AndroidManifest.xml\`)
- **App Open Ad Unit**: \`ca-app-pub-3940256099942544/9257396915\`
- **Adaptive Banner Ad Unit**: \`ca-app-pub-3940256099942544/6300978111\`

### App Open Ad Flow
- **First-Time User**: \`Splash -> Onboarding -> Home\` (No App Open Ad interrupts first-time onboarding).
- **Returning User**: \`Launch -> App Open Ad -> Home\`
- **Subsequent Foreground**: \`Background -> Foreground -> App Open Ad (if available)\`
- Managed via \`ProcessLifecycleOwner\` and \`AppOpenAdManager\` with 4-hour freshness validation.

### Adaptive Banner Ad
- Rendered on the Home Screen content bottom via \`BannerAdView\`, matching device width without blocking navigation.

## Steps to Run in Android Studio
1. Open **Android Studio** (Hedgehog, Iguana, Jellyfish, or newer).
2. Select **File > Open** and choose the extracted project directory.
3. Allow Gradle to sync dependencies.
4. Select a virtual device (Pixel 7 / 8 running API 26+) or a physical Android phone with USB Debugging enabled.
5. Click the green **Run (Shift+F10)** button.
`,
  },
];

export async function generateAndroidZip(): Promise<Blob> {
  const zip = new JSZip();

  for (const file of ANDROID_FILES) {
    zip.file(file.path, file.content);
  }

  return await zip.generateAsync({ type: 'blob' });
}

export function downloadAndroidZip(blob: Blob, filename = 'Bloom-Android-Studio-Project.zip') {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
