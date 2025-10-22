<script setup lang="ts">
import { VDateInput } from 'vuetify/labs/VDateInput'
</script>

<template>
    <div class="px-4 py-4 mt-6">
        <!-- Page Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-primary mb-2">Register as a Voter</h1>
            <p class="text-lg text-secondary">Fill in the form below to register as a voter</p>
        </div>
        <!-- Voter Registration Form -->
        <v-form ref="voterRegistrationForm" class="mt-8">
            <h3 class="text-lg font-bold text-primary mt-4 mb-4">Personal Information</h3>
            <v-row>
                <v-col cols="12" lg="6">
                    <v-text-field label="First Name" prepend-inner-icon="mdi-account" variant="outlined"
                        class="rounded-lg" color="primary" type="text" bg-color="white"></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                    <v-text-field label="Surname" prepend-inner-icon="mdi-account" variant="outlined" class="rounded-lg"
                        color="primary" type="text" bg-color="white"></v-text-field>
                </v-col>
            </v-row>
            <h3 class="text-lg font-bold text-primary mt-4 mb-4">Date of Birth and Gender</h3>
            <p class="text-sm text-secondary mb-4">Note: Only those above 18 years are eligible to register</p>
            <v-row>
                <v-col cols="12" lg="6">
                    <v-date-input label="Date of Birth" variant="outlined" class="rounded-lg" color="primary"
                        bg-color="white"></v-date-input>
                </v-col>
                <v-col cols="12" lg="6">
                    <v-select label="Gender" prepend-inner-icon="mdi-human-male-female" variant="outlined"
                        class="rounded-lg" color="primary" :items="['Male', 'Female', 'Rather not say']"
                        bg-color="white"></v-select>
                </v-col>
            </v-row>
            <h3 class="text-lg font-bold text-primary mt-4 mb-4">National ID Number and Constituency</h3>
            <v-row>
                <v-col cols="12" lg="6">
                    <v-text-field label="National ID Number" prepend-inner-icon="mdi-card" variant="outlined"
                        class="rounded-lg" color="primary" type="text" bg-color="white"></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                    <v-select label="Constituency" prepend-inner-icon="mdi-flag" variant="outlined" class="rounded-lg"
                        color="primary"
                        :items="['Nairobi', 'Machakos', 'Mombasa', 'Kisumu', 'Bungoma', 'Isiolo', 'Tana River', 'Kiambu', 'Nyeri', 'Turkana']"
                        bg-color="white"></v-select>
                </v-col>
            </v-row>
            <div class="flex justify-center mt-8">
                <v-btn color="primary" variant="flat" class="rounded-lg" size="large">Register</v-btn>
            </div>
        </v-form>
    </div>
</template>

<style scoped></style>