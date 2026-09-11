# 1. Move everything from Bloom-Android-Studio to current folder if it exists
if (Test-Path "Bloom-Android-Studio") {
    Get-ChildItem -Path "Bloom-Android-Studio\*" | Move-Item -Destination . -Force
    Remove-Item -Recurse -Force "Bloom-Android-Studio"
}

# 2. Ensure .github/workflows directory exists
New-Item -ItemType Directory -Force -Path ".github\workflows" | Out-Null

# 3. Create build-apk.yml
@'
name: Build Android APK

on:
  push:
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
          gradle assembleDebug --stacktrace --no-daemon

      - name: Upload Debug APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: bloom-debug-apk
          path: app/build/outputs/apk/debug/*.apk
          retention-days: 14
'@ | Set-Content -Path ".github\workflows\build-apk.yml" -Encoding utf8

# 4. Create res files
New-Item -ItemType Directory -Force -Path "app\src\main\res\values" | Out-Null
New-Item -ItemType Directory -Force -Path "app\src\main\res\xml" | Out-Null
New-Item -ItemType Directory -Force -Path "app\src\main\res\drawable" | Out-Null
New-Item -ItemType Directory -Force -Path "app\src\main\res\mipmap-anydpi-v26" | Out-Null

@'
<resources>
    <string name="app_name">Bloom</string>
</resources>
'@ | Set-Content -Path "app\src\main\res\values\strings.xml" -Encoding utf8

@'
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.Bloom" parent="android:Theme.Material.Light.NoActionBar">
        <item name="android:statusBarColor">#FDFBF9</item>
        <item name="android:navigationBarColor">#FFFFFF</item>
    </style>
</resources>
'@ | Set-Content -Path "app\src\main\res\values\themes.xml" -Encoding utf8

@'
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="bloom_terracotta">#A5574D</color>
    <color name="bloom_bg">#FDFBF9</color>
</resources>
'@ | Set-Content -Path "app\src\main\res\values\colors.xml" -Encoding utf8

@'
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#A5574D"
        android:pathData="M54,20 C40,20 28,32 28,46 C28,68 54,88 54,88 C54,88 80,68 80,46 C80,32 68,20 54,20 Z" />
</vector>
'@ | Set-Content -Path "app\src\main\res\drawable\ic_launcher_foreground.xml" -Encoding utf8

@'
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/bloom_bg" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>
'@ | Set-Content -Path "app\src\main\res\mipmap-anydpi-v26\ic_launcher.xml" -Encoding utf8

@'
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/bloom_bg" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>
'@ | Set-Content -Path "app\src\main\res\mipmap-anydpi-v26\ic_launcher_round.xml" -Encoding utf8

# 5. Commit and push
git add .
git commit -m "Configure GitHub Actions workflow and Android resources"
git push -f origin main
