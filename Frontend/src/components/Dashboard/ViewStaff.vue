<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axiosInstance from '@/config/axiosInstance';

type StaffRole = 'Administrator' | 'Clerk' | 'Supervisor';
type Gender = 'Male' | 'Female' | 'Rather not say';
type Constituency = 'nairobi' | 'Machakos' | 'Mombasa' | 'Kisumu' | 'Bungoma' | 'Isiolo' | 'Tana River';

interface Staff {
    staff_id: string;
    firstname: string;
    surname: string;
    dateOfBirth: string;
    gender: Gender;
    nationalIdNumber: string;
    constituency: Constituency;
    role: StaffRole;
    password: string;
    staffId: string;
}
const staffAccounts = ref<Staff[]>([]);
const headers = ref([
    { title: 'ID', key: 'id', sortable: true },
    { title: 'First Name', key: 'firstname', sortable: true },
    { title: 'Surname', key: 'surname', sortable: true },
    { title: 'Date of Birth', key: 'dateOfBirth', sortable: true },
    { title: 'Gender', key: 'gender', sortable: true },
    { title: 'National ID', key: 'nationalIdNumber', sortable: true },
    { title: 'Constituency', key: 'constituency', sortable: true },
    { title: 'Role', key: 'role', sortable: true },
    { title: 'Actions', key: 'actions', sortable: false },
]);
const constituencies = ref([
    'Nairobi',
    'Machakos',
    'Mombasa',
    'Kisumu',
    'Bungoma',
    'Isiolo',
    'Tana River',
]);

const dialog = ref(false);

const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
        case 'administrator': return 'primary';
        case 'clerk': return 'info';
        case 'supervisor': return 'success';
        default: return 'warning';
    }
};

const getAllStaff = async () => {
    try {
        const response = await axiosInstance.get('/api/staff/get-all-staff');
        console.log(response);
        staffAccounts.value = response.data.staff as Staff[];
    } catch (error) {
        console.error(error);
    }
}

onMounted(() => {
    getAllStaff();
})
</script>
<template>
    <div class="px-4 py-4">
        <h1 class="text-3xl font-bold text-primary mb-4">View Staff Accounts</h1>
        <p class="text-lg text-secondary mb-4">View Staff Accounts By Constituency</p>
        <!-- Bookings Data Table -->
        <v-card class="rounded-lg" elevation="2">
            <v-card-title class="pa-6 bg-primary/5 border-b">
                <v-row>
                    <v-col cols="12" md="3">
                        <div class="d-flex align-center">
                            <v-icon icon="mdi-account-group" color="primary" size="24" class="mr-3"></v-icon>
                            <h2 class="text-xl font-semibold text-primary">Staff Accounts</h2>
                        </div>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-menu class="rounded-lg">
                            <template v-slot:activator="parent">
                                <v-btn color="primary" variant="outlined" prepend-icon="mdi-filter" size="small"
                                    v-bind="parent.props" class="rounded-lg">Filter</v-btn>
                            </template>
                            <v-list>
                                <v-list-item>
                                    Constituency
                                    <template v-slot:append>
                                        <v-icon icon="mdi-menu-right"></v-icon>
                                    </template>
                                    <v-menu activator="parent" submenu>
                                        <v-list>
                                            <v-list-item v-for="constituency in constituencies" :key="constituency">
                                                {{ constituency }}
                                            </v-list-item>
                                        </v-list>
                                    </v-menu>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="rounded-lg" size="small"
                            to="/dashboard/create-staff">
                            New Staff Account
                        </v-btn>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-btn color="primary" variant="flat" prepend-icon="mdi-file-export" class="rounded-lg" size="small">
                            Export
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-text-field label="Search by Name or National ID Number" prepend-inner-icon="mdi-magnify"
                            variant="outlined" class="rounded-lg" color="primary" bg-color="white"
                            type="text"></v-text-field>
                    </v-col>
                </v-row>
            </v-card-title>

            <v-data-table :headers="headers" :items="staffAccounts" item-value="id" class="staff-accounts-table"
                :items-per-page="10" :mobile="$vuetify.display.mdAndDown" :mobile-breakpoint="960">
                <!-- date of birth column -->
                <template v-slot:item.dateOfBirth="{ item }">
                    <p class="text-sm text-secondary">{{ new Date(item.dateOfBirth).toLocaleDateString() }}</p>
                </template>
                <!-- Role Column with Chips -->
                <template v-slot:item.role="{ item }">
                    <v-chip :color="getRoleColor(item.role)" size="small" variant="flat" class="rounded-lg font-medium">
                        {{ item.role }}
                    </v-chip>
                </template>
                <!-- Actions -->
                <template v-slot:item.actions="{ item }">
                    <div class="d-flex ga-2 justify-end">
                        <v-btn color="primary" variant="text" size="small" class="rounded-lg" append-icon="mdi-pencil" @click="dialog = true">Edit</v-btn>
                    </div>
                </template>
            </v-data-table>
        </v-card>
    </div>
    <v-dialog v-model="dialog" max-width="500">
        <v-card class="pa-4">
            <v-card-title>
                <h2 class="text-xl font-semibold text-primary">Edit Staff Account</h2>
            </v-card-title>
            <v-card-text>
                <!-- Deactivate Staff Account Form -->
                <v-form>
                    <v-switch label="Deactivate Staff Account"></v-switch>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn color="error" variant="flat" size="small" class="rounded-lg" @click="dialog = false">Cancel</v-btn>
                <v-btn color="primary" variant="flat" size="small" class="rounded-lg">Confirm</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped></style>