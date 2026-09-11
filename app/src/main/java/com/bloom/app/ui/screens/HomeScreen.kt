package com.bloom.app.ui.screens

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
                        text = "$waterGlasses of 8 glasses logged (${waterGlasses * 250} ml)",
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

