package com.bloom.app.ui.theme

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
