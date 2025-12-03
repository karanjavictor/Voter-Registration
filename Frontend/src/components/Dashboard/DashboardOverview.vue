<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import { computed, ref } from 'vue';
const auth = useAuthStore();
const role = computed(() =>
  auth.staff?.role?.toString().toLowerCase() ?? ''
);

const canManageStaff = computed(() =>
  ['administrator', 'supervisor'].includes(role.value)
);
</script>
<template>
    <div class="px-4 py-4">
        <h1 class="text-3xl font-bold text-primary mb-2">Dashboard Overview</h1>
        <p class="text-lg text-secondary mb-6">
            Good {{ new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening' }},
            here’s a quick overview of your dashboard.
        </p>
        <!-- Quick Navigation Links  -->
        <v-row>
            <v-col cols="12" md="4" v-if="canManageStaff">
                <v-card class="pa-4 rounded-lg" elevation="2">
                    <v-card-title class="text-xl font-semibold text-primary mb-4">View Staff Accounts</v-card-title>
                    <v-card-text>
                        <p class="text-secondary">View all your staff accounts</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" variant="flat" class="rounded-lg" size="small" to="/dashboard/view-staff">View Staff Accounts</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col cols="12" md="4">
                <v-card class="pa-4 rounded-lg" elevation="2">
                    <v-card-title class="text-xl font-semibold text-primary mb-4">View Voters</v-card-title>
                    <v-card-text>
                        <p class="text-secondary">View all your voters</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" variant="flat" class="rounded-lg" size="small" to="/dashboard/view-voters">View Voters</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col cols="12" md="4" v-if="canManageStaff">
                <v-card class="pa-4 rounded-lg" elevation="2">
                    <v-card-title class="text-xl font-semibold text-primary mb-4">View Analytics</v-card-title>
                    <v-card-text>
                        <p class="text-secondary">View your analytics</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" variant="flat" class="rounded-lg" size="small" to="/dashboard/view-analytics">View Analytics</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>
<style scoped></style>