package com.bloom.app.ui.screens

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
