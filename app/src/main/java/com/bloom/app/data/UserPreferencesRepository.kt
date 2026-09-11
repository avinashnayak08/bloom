package com.bloom.app.data

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
