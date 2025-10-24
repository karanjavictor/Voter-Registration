<script setup lang="ts">
import { ref } from 'vue';
</script>

<template>
    <section class="relative min-h-screen flex items-center justify-center">
        <!-- Staff Login form -->
        <div class="flex items-center justify-center p-8">
            <div class="w-full space-y-8">
                <!-- Header -->
                <div class="text-center">
                    <h1 class="text-3xl font-bold text-primary mb-2">Login to your Staff Account</h1>
                    <p class="text-secondary">Access your Dashboard</p>
                </div>
                <!-- Form -->
                <v-form ref="staffLoginForm" class="mt-8">
                    <v-select label="Staff Type" prepend-inner-icon="mdi-account" variant="outlined" class="rounded-lg"
                        color="primary" :items="['Clerk', 'Admin', 'Supervisor']" bg-color="white"></v-select>
                    <v-text-field label="Staff ID" prepend-inner-icon="mdi-account" variant="outlined" class="rounded-lg"
                        color="primary" type="text" bg-color="white"></v-text-field>

                    <v-text-field label="Password" prepend-inner-icon="mdi-lock-outline" color="primary"
                        class="rounded-lg" variant="outlined" type="password" bg-color="white"></v-text-field>

                    <div class="flex justify-center mt-8">
                        <v-btn color="primary" variant="flat" class="rounded-lg" size="large">Login</v-btn>
                    </div>
                </v-form>
            </div>
        </div>
    </section>
</template>

<style scoped></style>