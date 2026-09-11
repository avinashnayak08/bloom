# Bloom App – Android Studio & AdMob Integration

## Overview
**Bloom** is a women's wellness application tailored for PCOS health management, daily goal tracking, symptom correlation, and Google AdMob monetization.

## Architecture
- **Language**: Kotlin 1.9+
- **UI Framework**: Jetpack Compose with Material3
- **Design System**: Warm terracotta (`#A5574D`), soft rose, Playfair Display typography
- **Architecture Pattern**: MVVM with Kotlin Coroutines & StateFlow
- **Persistence**: Jetpack DataStore Preferences (persisting onboarding status & profile)
- **Monetization**: Google Mobile Ads SDK (v23.6.0)

## AdMob Implementation & Test Ad IDs
This project utilizes the official Google AdMob Test Ad IDs:
- **Application ID**: `ca-app-pub-3940256099942544~3347511713` (declared in `AndroidManifest.xml`)
- **App Open Ad Unit**: `ca-app-pub-3940256099942544/9257396915`
- **Adaptive Banner Ad Unit**: `ca-app-pub-3940256099942544/6300978111`

### App Open Ad Flow
- **First-Time User**: `Splash -> Onboarding -> Home` (No App Open Ad interrupts first-time onboarding).
- **Returning User**: `Launch -> App Open Ad -> Home`
- **Subsequent Foreground**: `Background -> Foreground -> App Open Ad (if available)`
- Managed via `ProcessLifecycleOwner` and `AppOpenAdManager` with 4-hour freshness validation.

### Adaptive Banner Ad
- Rendered on the Home Screen content bottom via `BannerAdView`, matching device width without blocking navigation.

## Steps to Run in Android Studio
1. Open **Android Studio** (Hedgehog, Iguana, Jellyfish, or newer).
2. Select **File > Open** and choose the extracted project directory.
3. Allow Gradle to sync dependencies.
4. Select a virtual device (Pixel 7 / 8 running API 26+) or a physical Android phone with USB Debugging enabled.
5. Click the green **Run (Shift+F10)** button.
