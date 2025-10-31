<script setup lang="ts">
import { VDateInput } from 'vuetify/labs/VDateInput';
import { VPie } from 'vuetify/labs/VPie'
import { ref } from 'vue';
const filterDialog = ref(false);
const constituencies = ref([
    { id: 1, name: 'Nairobi', value: 80, color: '#3B82F6' },
    { id: 2, name: 'Machakos', value: 50, color: '#DC10B6' },
    { id: 3, name: 'Mombasa', value: 50, color: '#13475c' },
    { id: 4, name: 'Kisumu', value: 30, color: '#FF0000' },
    { id: 5, name: 'Bungoma', value: 40, color: '#008000' },
    { id: 6, name: 'Isiolo', value: 30, color: '#8D6F64' },
    { id: 7, name: 'Tana River', value: 60, color: '#FFA500' },
]);
</script>
<template>
    <div class="px-4 py-4">
        <div class="mb-8 flex align-center justify-between">
            <div class="">
                <h1 class="text-3xl font-bold text-primary mb-2">View Analytics</h1>
                <p class="text-lg text-secondary">View your analytics and insights</p>
            </div>
            <v-btn color="primary" variant="outlined" prepend-icon="mdi-filter" size="small" class="rounded-lg"
                @click="filterDialog = true">Filter</v-btn>
            <v-dialog v-model="filterDialog" max-width="500">
                <v-card class="rounded-lg pa-4">
                    <v-card-title>
                        <h2 class="text-xl font-semibold text-primary">Filter Analytics</h2>
                    </v-card-title>
                    <v-card-text>
                        <v-list>
                            <v-list-item>
                                <v-list-item-title>Start Date</v-list-item-title>
                                <v-date-input label="Start Date" variant="outlined" class="rounded-lg mt-2  "
                                    color="primary" bg-color="white"></v-date-input>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-title>End Date</v-list-item-title>
                                <v-date-input label="End Date" variant="outlined" class="rounded-lg mt-2  "
                                    color="primary" bg-color="white"></v-date-input>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="error" variant="outlined" class="rounded-lg"
                            @click="filterDialog = false">Clear</v-btn>
                        <v-btn color="primary" variant="flat" class="rounded-lg"
                            @click="filterDialog = false">Apply</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-btn color="primary" variant="flat" prepend-icon="mdi-export" size="small"
                class="rounded-lg">Export</v-btn>
            <v-btn color="primary" variant="outlined" prepend-icon="mdi-refresh" size="small"
                class="rounded-lg">Refresh</v-btn>
        </div>
        <v-row class="mt-4">
                <v-col cols="12" md="4">
                    <v-card class="pa-4 rounded-lg" elevation="2">
                        <div class="d-flex align-center">
                            <v-avatar size="48" class="bg-primary mr-4">
                                <v-icon icon="mdi-account-group" color="white" size="24"></v-icon>
                            </v-avatar>
                            <div>
                                <p class="text-secondary">Total Number of Staff</p>
                                <p class="text-2xl font-bold text-primary">40</p>
                            </div>
                        </div>
                    </v-card>
                </v-col>
                <v-col cols="12" md="4">
                    <v-card class="pa-4 rounded-lg" elevation="2">
                        <div class="d-flex align-center">
                            <v-avatar size="48" class="bg-primary mr-4">
                                <v-icon icon="mdi-account-group" color="white" size="24"></v-icon>
                            </v-avatar>
                            <div>
                                <p class="text-secondary">Total Number of deceased voters</p>
                                <p class="text-2xl font-bold text-primary">10</p>
                            </div>
                        </div>
                    </v-card>
                </v-col>
                <v-col cols="12" md="4">
                    <v-card class="pa-4 rounded-lg" elevation="2">
                        <div class="d-flex align-center">
                            <v-avatar size="48" class="bg-primary mr-4">
                                <v-icon icon="mdi-account-group" color="white" size="24"></v-icon>
                            </v-avatar>
                            <div>
                                <p class="text-secondary">Total Number of New Voters</p>
                                <p class="text-2xl font-bold text-primary">20</p>
                            </div>
                        </div>
                    </v-card>
                </v-col>
        </v-row>
        <v-row>
            <!-- Voter Registration Analytics -->
            <v-col cols="12">
                <v-card class="rounded-lg " elevation="2">
                    <v-card-title class="text-xl font-semibold text-primary mb-4">Total Voter
                        Registration</v-card-title>
                    <v-pie animation :legend="{ position: $vuetify.display.mdAndUp ? 'right' : 'bottom' }"
                        inner-cut="70" hide-slice size="300" hover-scale="0" rounded="2" gap="2"
                        :palette="constituencies.map(constituency => constituency.color)" tooltip reveal
                        :items="constituencies.map(constituency => ({ title: constituency.name, value: constituency.value, color: constituency.color }))"
                        class="flex justify-center items-center mx-auto">
                        <template v-slot:center>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-primary">{{constituencies.reduce((total,
                                    constituency) => total + constituency.value, 0) }}</div>
                                <div class="text-sm text-secondary">Total Voter Registrations</div>
                            </div>
                        </template>
                        <template v-slot:legend>
                            <v-list class="" width="300">
                                <v-list-item v-for="constituency in constituencies" :key="constituency.id"
                                    class="rounded-lg mb-2" link>
                                    <template v-slot:title>
                                        <p class="text-secondary">{{ constituency.name }}:</p>
                                    </template>
                                    <template v-slot:prepend>
                                        <v-avatar :color="constituency.color" :size="16"></v-avatar>
                                    </template>
                                    <template v-slot:append>
                                        <p class="text-secondary">{{ constituency.value }} Members</p>
                                    </template>
                                </v-list-item>
                            </v-list>
                        </template>
                    </v-pie>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>
<style scoped></style>