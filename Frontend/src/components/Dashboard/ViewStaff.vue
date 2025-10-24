<script setup lang="ts">
import { ref } from 'vue';
const headers = ref([
    { title: 'ID', key: 'id', sortable: true },
    { title: 'First Name', key: 'firstName', sortable: true },
    { title: 'Surname', key: 'surname', sortable: true },
    { title: 'Date of Birth', key: 'dateOfBirth', sortable: true },
    { title: 'Gender', key: 'gender', sortable: true },
    { title: 'National ID No.', key: 'nationalIdNumber', sortable: true },
    { title: 'Constituency', key: 'constituency', sortable: true },
    { title: 'Role', key: 'role', sortable: true },
    { title: 'Actions', key: 'actions', sortable: false },
]);
const staffAccounts = ref([
    { id: 1, firstName: 'John', surname: 'Doe', dateOfBirth: '1990-01-01', gender: 'Male', nationalIdNumber: '1234567890', constituency: 'Nairobi', role: 'Admin' },
    { id: 2, firstName: 'Jane', surname: 'Smith', dateOfBirth: '1995-08-08', gender: 'Female', nationalIdNumber: '1234567891', constituency: 'Machakos', role: 'Clerk' },
    { id: 3, firstName: 'Jim', surname: 'Beam', dateOfBirth: '2001-05-05', gender: 'Male', nationalIdNumber: '1234567892', constituency: 'Mombasa', role: 'Clerk' },
    { id: 4, firstName: 'Jill', surname: 'Jones', dateOfBirth: '2003-02-02', gender: 'Female', nationalIdNumber: '1234567893', constituency: 'Kisumu', role: 'Admin' },
    { id: 5, firstName: 'Jack', surname: 'Brown', dateOfBirth: '1997-11-11', gender: 'Male', nationalIdNumber: '1234567894', constituency: 'Bungoma', role: 'Clerk' },
    { id: 6, firstName: 'Jill', surname: 'Davis', dateOfBirth: '1986-06-06', gender: 'Female', nationalIdNumber: '1234567895', constituency: 'Isiolo', role: 'Admin' },
    { id: 7, firstName: 'Jack', surname: 'Garcia', dateOfBirth: '1986-03-03', gender: 'Male', nationalIdNumber: '1234567896', constituency: 'Tana River', role: 'Clerk' },
]);
const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
        case 'admin': return 'primary';
        case 'clerk': return 'secondary';
        default: return 'warning';
    }
};
</script>
<template>
    <div class="px-4 py-4">
        <h1 class="text-3xl font-bold text-primary mb-4">View Staff Accounts</h1>
        <p class="text-lg text-secondary mb-4">View your staff accounts</p>
        <!-- Bookings Data Table -->
        <v-card class="rounded-lg" elevation="2">
            <v-card-title class="pa-6 bg-primary/5 border-b">
                <v-row>
                    <v-col cols="12" md="4">
                        <div class="d-flex align-center">
                            <v-icon icon="mdi-account-group" color="primary" size="24" class="mr-3"></v-icon>
                            <h2 class="text-xl font-semibold text-primary">Staff Accounts</h2>
                        </div>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-menu>
                            <template v-slot:activator="{ props }">
                                <v-btn color="primary" variant="outlined" prepend-icon="mdi-filter" size="small"
                                    v-bind="props" class="rounded-lg">Filter</v-btn>
                            </template>
                        </v-menu>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" class="rounded-lg" size="small"
                            to="/dashboard/create-staff">
                            New Staff Account
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

            <v-data-table :headers="headers" :items="staffAccounts" item-value="firstName" class="staff-accounts-table"
                :items-per-page="10" :mobile="$vuetify.display.mdAndDown" :mobile-breakpoint="960">
                <!-- Role Column with Chips -->
                <template v-slot:item.role="{ item }">
                    <v-chip :color="getRoleColor(item.role)" size="small" variant="flat" class="rounded-lg font-medium">
                        {{ item.role }}
                    </v-chip>
                </template>
                <!-- Actions -->
                <template v-slot:item.actions="{ item }">
                    <div class="d-flex ga-2 justify-end">
                        <v-btn color="primary" variant="text" size="small" class="rounded-lg" append-icon="mdi-pencil">Edit</v-btn>
                    </div>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<style scoped></style>