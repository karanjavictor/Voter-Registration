<script setup lang="ts"></script>

<template>
        <section class="relative min-h-[80vh] flex items-center">
        <v-container fluid>
            <h1
                class="hero-title text-xl md:text-2xl lg:text-4xl text-primary font-bold text-center leading-tight mb-6">
                WELCOME TO THE VOTER VERIFICATION PORTAL
            </h1>
            <p class="hero-subtitle text-xl md:text-2xl text-secondary text-center mb-12 max-w-3xl mx-auto">
                This is the official portal for verifying your voter ID
            </p>
            <div class="button-container rounded-xl p-6 flex gap-x-4 justify-center items-center max-w-3xl mx-auto">
                <v-btn color="primary" variant="flat" class="rounded-lg" size="large">Register as a Voter</v-btn>
                <v-btn color="primary" variant="flat" class="rounded-lg" size="large">Check your Voter Details</v-btn>

            </div>
        </v-container>
    </section>
</template>

<style scoped></style>