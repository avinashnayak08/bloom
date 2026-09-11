package com.bloom.app

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
                            kotlinx.coroutines.CoroutineScope(kotlinx.coroutines.Dispatchers.IO).run {
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
