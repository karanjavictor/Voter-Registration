<script setup lang="ts">
import { ref } from 'vue';
const navLinks = ref([
    {
        title: 'Dashboard Overview',
        subtitle: 'View your dashboard',
        icon: 'mdi-home',
        to: '/dashboard/home',
    },
    {
        title: 'Create Staff',
        subtitle: 'Create a new staff member',
        icon: 'mdi-account-plus',
        to: '/dashboard/create-staff',
    },
    {
        title: 'View Staff',
        subtitle: 'View staff members',
        icon: 'mdi-account-group',
        to: '/dashboard/view-staff',
    },
    {
        title: 'View Voters',
        subtitle: 'View voters',
        icon: 'mdi-account-group',
        to: '/dashboard/view-voters',
    },
    {
        title: 'Analytics',
        subtitle: 'View analytics',
        icon: 'mdi-chart-bar',
        to: '/dashboard/analytics',
    },
]);
</script>

<template>
    <!-- Desktop Navigation Drawer -->
    <v-navigation-drawer permanent width="400" class="desktop-nav-drawer" elevation="2">
        <!-- Dashboard Header -->
        <div class="drawer-header">
            <div class="d-flex align-center pa-6 bg-primary/5 border-b">
                <v-avatar size="48" class="bg-primary/20 mr-4">
                    <v-icon icon="mdi-account-circle" color="primary" size="32"></v-icon>
                </v-avatar>
                <div>
                    <h2 class="text-xl font-bold text-primary mb-1">Dashboard</h2>
                    <p class="text-sm text-secondary">Manage Voter Verification Portal</p>
                </div>
            </div>
        </div>
        <!-- Dashboard Navigation Links -->
        <div class="drawer-nav-links">
            <v-list>
                <v-list-item v-for="item in navLinks" :to="item.to" class="ma-2 rounded-lg min-h-auto" lines="two">
                    <template v-slot:prepend>
                        <v-avatar size="40" class="bg-primary/10 mr-4">
                            <v-icon :icon="item.icon" color="primary" size="20"></v-icon>
                        </v-avatar>
                    </template>

                    <div class="pr-2">
                        <div class="font-semibold mb-1 text-secondary text-wrap">
                            {{ item.title }}
                        </div>
                        <div class="text-sm text-secondary leading-relaxed text-wrap">
                            {{ item.subtitle }}
                        </div>
                    </div>
                    <template v-slot:append>
                        <v-icon icon="mdi-chevron-right" color="primary" size="20" class="ml-2"></v-icon>
                    </template>
                </v-list-item>
            </v-list>
        </div>
        <template v-slot:append>
            <div class="pa-2">
                <v-btn block color="primary" variant="flat" class="rounded-lg" append-icon="mdi-logout">
                    Logout
                </v-btn>
            </div>
        </template>
    </v-navigation-drawer>
    <!-- Router View for nested dashboard pages -->
    <div class="mt-8">
        <router-view />
    </div>
</template>

<style scoped>
:deep(.v-list-item--active) {
    border-left: 4px solid rgb(var(--v-theme-primary));
}

:deep(.v-list-item--active .v-list-item__content) {
    color: rgb(var(--v-theme-primary)) !important;
}

:deep(.v-list-item--active .v-avatar) {
    background-color: rgba(var(--v-theme-primary), 0.2) !important;
}
</style>