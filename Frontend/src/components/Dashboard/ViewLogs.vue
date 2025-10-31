<script setup lang="ts">
import { ref } from 'vue';
const headers = ref([
    { title: 'Staff ID', key: 'staffId', sortable: true },
    { title: 'First Name', key: 'firstName', sortable: true },
    { title: 'Surname', key: 'surname', sortable: true },
    { title: 'Role', key: 'role', sortable: true },
    { title: 'National ID Number', key: 'nationalIdNumber', sortable: true },
    { title: 'Action', key: 'action', sortable: true },
    { title: 'Time', key: 'time', sortable: true },
    { title: 'Date', key: 'date', sortable: true }
]);

const logs = ref([
    { staffId: 1, firstName: 'John', surname: 'Doe', role: 'Admin', nationalIdNumber: '1234567890', action: 'Login', date: '2021-01-01', time: '10:00' },
    { staffId: 2, firstName: 'Jane', surname: 'Smith', role: 'Clerk', nationalIdNumber: '1234567891', action: 'Logout', date: '2021-01-02', time: '11:00' },
    { staffId: 3, firstName: 'Jim', surname: 'Beam', role: 'Admin', nationalIdNumber: '1234567892', action: 'Login', date: '2021-01-03', time: '12:00' },
    { staffId: 4, firstName: 'Jill', surname: 'Jones', role: 'Clerk', nationalIdNumber: '1234567893', action: 'Logout', date: '2021-01-04', time: '13:00' },
    { staffId: 5, firstName: 'Jack', surname: 'Brown', role: 'Admin', nationalIdNumber: '1234567894', action: 'Login', date: '2021-01-05', time: '14:00' },
    { staffId: 6, firstName: 'Jill', surname: 'Davis', role: 'Clerk', nationalIdNumber: '1234567895', action: 'Logout', date: '2021-01-06', time: '15:00' },
    { staffId: 7, firstName: 'Jack', surname: 'Garcia', role: 'Admin', nationalIdNumber: '1234567896', action: 'Login', date: '2021-01-07', time: '16:00' },
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
        <h1 class="text-3xl font-bold text-primary mb-4">View Logs</h1>
        <p class="text-lg text-secondary mb-4">View Logs</p>
        <!-- Voters Data Table -->
        <v-card class="rounded-lg" elevation="2">
            <v-card-title class="pa-6 bg-primary/5 border-b">
                <v-row>
                    <v-col cols="12" md="6">
                        <div class="d-flex align-center">
                            <v-icon icon="mdi-account-group" color="primary" size="24" class="mr-3"></v-icon>
                            <h2 class="text-xl font-semibold text-primary">Logs</h2>
                        </div>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-btn color="primary" variant="flat" prepend-icon="mdi-file-export" class="rounded-lg"
                            size="small">
                            Export
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-text-field label="Search by Staff ID Number" prepend-inner-icon="mdi-magnify"
                            variant="outlined" class="rounded-lg" color="primary" bg-color="white"
                            type="text"></v-text-field>
                    </v-col>
                </v-row>
            </v-card-title>

            <v-data-table :headers="headers" :items="logs" item-value="staffId" class="logs-table"
                :items-per-page="10" :mobile="$vuetify.display.mdAndDown" :mobile-breakpoint="960">
                <!-- Role Column with Chips -->
                <template v-slot:item.role="{ item }">
                    <v-chip :color="getRoleColor(item.role)" size="small" variant="flat" class="rounded-lg font-medium">
                        {{ item.role }}
                    </v-chip>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<style scoped></style>