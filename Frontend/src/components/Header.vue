<script setup lang="ts"></script>

<template>
    <v-app-bar elevation="1" class="pa-4">
        <v-app-bar-title>
            <div class="flex items-center w-1/4 gap-2">
                <v-img height="50" width="50" src="https://verify.iebc.or.ke/images/1.png"></v-img>
                <span class="text-2xl font-semibold text-primary cursor-pointer">Voter Verification Portal</span>
            </div>
        </v-app-bar-title>

        <v-spacer></v-spacer>

        <div class="w-1/4">
            <v-btn color="primary" variant="text">Home</v-btn>
            <v-btn color="primary" variant="text">Login</v-btn>
            <v-btn color="primary" variant="text">Register</v-btn>
        </div>
    </v-app-bar>
</template>

<style scoped></style>