<script setup lang="ts">
import { VDateInput } from 'vuetify/labs/VDateInput'
import { ref } from 'vue'
const showStaffLoginDetails = ref(false)
const staffLoginDetails = ref({
    staffId: '',
    password: ''
})
const copyStaffLoginDetails = () => {
    navigator.clipboard.writeText(staffLoginDetails.value.staffId + ' ' + staffLoginDetails.value.password)
}
</script>

<template>
    <div class="px-4 py-4">
        <h1 class="text-3xl font-bold text-primary mb-4">Create Staff</h1>
        <p class="text-lg text-secondary mb-4">Fill in the details below to create a staff profile</p>
        <!-- Create Staff Form -->
        <v-form ref="createStaffForm" class="mt-8">
            <v-row>
                <v-col cols="12" lg="6">
                    <v-text-field label="Staff First Name" prepend-inner-icon="mdi-account" variant="outlined"
                        class="rounded-lg" color="primary" type="text" bg-color="white"></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                    <v-text-field label="Staff Surname" prepend-inner-icon="mdi-account" variant="outlined"
                        class="rounded-lg" color="primary" type="text" bg-color="white"></v-text-field>
                </v-col>
            </v-row>
            <!-- Date of Birth and Gender -->
            <h3 class="text-lg font-bold text-primary mt-4 mb-4">Date of Birth and Gender</h3>
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
            <!-- National ID Number and Constituency -->
            <h3 class="text-lg font-bold text-primary mt-4 mb-4">National ID Number and Constituency</h3>
            <v-row>
                <v-col cols="12" lg="6">
                    <v-text-field label="National ID Number" prepend-inner-icon="mdi-card" variant="outlined"
                        class="rounded-lg" color="primary" type="text" bg-color="white"></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                    <v-select label="Constituency" prepend-inner-icon="mdi-flag" variant="outlined" class="rounded-lg"
                        color="primary" :items="['Nairobi', 'Machakos', 'Mombasa', 'Kisumu', 'Bungoma', 'Isiolo', 'Tana River', 'Kiambu', 'Nyeri', 'Turkana']"
                        bg-color="white"></v-select>
                </v-col>
            </v-row>
            <!-- Staff Role and Actions -->
            <h3 class="text-lg font-bold text-primary mt-4 mb-4">Staff Role and Actions</h3>
            <p class="text-sm text-secondary mb-4">Note: The staff role will determine the actions the staff can perform</p>
            <v-row>
                <v-col cols="12" lg="6">
                    <v-select label="Staff Role" prepend-inner-icon="mdi-account-group" variant="outlined"
                        class="rounded-lg" color="primary" :items="['Admin', 'Clerk']" bg-color="white"></v-select>
                </v-col>
            </v-row>
            <!-- Staff creation Process -->
            <div class="p-4 rounded-lg my-4">
                <p class="text-sm text-secondary mb-2 font-medium">Staff creation process:</p>
                <ul class="text-sm text-error space-y-1">
                    <li class="flex items-center gap-2">
                        <v-icon size="16" color="error">mdi-alert-circle</v-icon>
                        Once all the details are filled, you will be required to copy the staff ID and password to share with the staff
                    </li>
                    <li class="flex items-center gap-2">
                        <v-icon size="16" color="error">mdi-alert-circle</v-icon>
                        You will be required to confirm the creation of the staff by clicking the button below
                    </li>
                </ul>
            </div>
            <!-- Submit Button -->
            <div class="mt-8 flex justify-center items-center">
                <v-btn color="primary" variant="flat" size="large" class="rounded-lg" @click="showStaffLoginDetails = true">Create Staff</v-btn>
            </div>

        </v-form>
    </div>
    <!-- Staff Login Details Modal -->
    <v-dialog v-model="showStaffLoginDetails" width="500">
        <v-card class="pa-4">
            <v-card-title>
                <h3 class="text-lg font-bold text-primary">Staff Login Details</h3>
            </v-card-title>
        <v-card-text>
            <p class="text-sm text-secondary">Staff ID: <span class="font-bold">1234567890</span></p>
            <p class="text-sm text-secondary">Password: <span class="font-bold">1234567890</span></p>
        </v-card-text>
        <v-card-actions class="flex justify-start gap-2">
            <v-btn color="error" variant="flat" size="small" class="rounded-lg" @click="showStaffLoginDetails = false">Cancel</v-btn>
            <v-btn color="secondary" variant="flat" size="small" class="rounded-lg" append-icon="mdi-clipboard-text" @click="copyStaffLoginDetails">Copy Login Details</v-btn>
            <v-btn color="primary" variant="flat" size="small" class="rounded-lg">Create Staff</v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped></style>