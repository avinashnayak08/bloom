package com.bloom.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bloom.app.admob.BannerAdView
import com.bloom.app.ui.theme.*

@Composable
fun HomeScreen() {
    val scrollState = rememberScrollState()

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
                .padding(20.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "GOOD MORNING,",
                    fontSize = 11.sp,
                    color = BloomTextSecondary,
                    letterSpacing = 1.sp
                )
                Text(
                    text = "Sofia",
                    fontSize = 24.sp,
                    fontStyle = FontStyle.Italic,
                    color = BloomTextPrimary
                )
            }
        }

        // Today's Goals Card
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = BloomCardBg)
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text(
                    text = "Today's Goals",
                    fontSize = 22.sp,
                    fontStyle = FontStyle.Italic,
                    color = BloomTextPrimary
                )
                Text(
                    text = "Saturday, June 27",
                    fontSize = 12.sp,
                    color = BloomTextSecondary
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Let's get blooming",
                    fontSize = 13.sp,
                    fontStyle = FontStyle.Italic,
                    color = BloomTerracotta
                )
                Text(
                    text = "0 of 5 complete",
                    fontSize = 12.sp,
                    color = BloomTextSecondary
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // PCOS FAQ Card
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = BloomCardBg)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "PCOS FAQ",
                    fontSize = 14.sp,
                    fontStyle = FontStyle.Italic,
                    color = BloomTextPrimary
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "What exactly is PCOS?",
                    fontSize = 13.sp,
                    color = BloomTextPrimary
                )
                Text(
                    text = "PCOS stands for polycystic ovary syndrome...",
                    fontSize = 11.sp,
                    color = BloomTextSecondary
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // AdMob Adaptive Banner Ad placed at the bottom of the home content
        BannerAdView()
    }
}
