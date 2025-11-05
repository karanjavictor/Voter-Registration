<script setup lang="ts">
import axiosInstance from '@/config/axiosInstance'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { ref } from 'vue'
import type { VForm } from 'vuetify/components'
interface StaffForm {
    firstName: string;
    surname: string;
    dateOfBirth: string;
    gender: string;
    nationalIdNumber: string;
    constituency: { name: string; shortName: string };
    role: { name: string; shortName: string };
    password?: string;
}
const constituencies = ref([
    { name: 'Nairobi', shortName: 'NBO' },
    { name: 'Machakos', shortName: 'MCK' },
    { name: 'Mombasa', shortName: 'MSA' },
    { name: 'Kisumu', shortName: 'KSM' },
    { name: 'Bungoma', shortName: 'BGM' },
    { name: 'Isiolo', shortName: 'ISL' },
    { name: 'Tana River', shortName: 'TNR' },
])
const roles = ref([
    {
        name: 'Administrator',
        shortName: 'ADM'
    },
    {
        name: 'Clerk',
        shortName: 'CLK'
    },
    {
        name: 'Supervisor',
        shortName: 'SUP'
    }
])
const genders = ref([
    'Male',
    'Female',
    'Rather not say'
])
const showStaffLoginDetails = ref(false)
const loading = ref(false)
const staffForm = ref<StaffForm>({
    firstName: '',
    surname: '',
    dateOfBirth: '',
    gender: '',
    nationalIdNumber: '',
    constituency: { name: '', shortName: '' },
    role: { name: '', shortName: '' },
    password: ''
})
const staffLoginDetails = ref({
    staffId: '',
    password: ''
})
const showSuccessAlert = ref(false)
const successAlertMessage = ref('')
const showErrorAlert = ref(false)
const errorAlertMessage = ref('')
const createStaffForm = ref<VForm | null>(null);
const copyStaffLoginDetails = () => {
    navigator.clipboard.writeText(staffLoginDetails.value.staffId + ' ' + staffLoginDetails.value.password)
}

const generateStaffLoginDetails = async () => {
    const { valid } = await createStaffForm.value?.validate() as { valid: boolean };
    if (!valid) {
        return
    }
    // Find the constituency shortName based on the selected name
    const selectedConstituency = constituencies.value.find(
        c => c.name === staffForm.value.constituency.name
    )

    // Find the role shortName based on the selected name
    const selectedRole = roles.value.find(
        r => r.name === staffForm.value.role.name
    )

    // Generate 4-digit random number (1000-9999)
    const fourDigitNumber = Math.floor(Math.random() * 9000) + 1000

    // Generate numeric password (7 digits)
    const passwordLength = 7
    const password = Math.floor(Math.random() * Math.pow(10, passwordLength))
        .toString()
        .padStart(passwordLength, '0')

    // Generate staffId in format: IEBC/{constituency}_{role}.{4-digit-number}
    staffLoginDetails.value.staffId = `IEBC/${selectedConstituency?.shortName || 'XXX'}_${selectedRole?.shortName || 'XXX'}.${fourDigitNumber}`
    staffLoginDetails.value.password = password

    // Show the modal with the generated details
    showStaffLoginDetails.value = true
}
const createStaff = async () => {
    loading.value = true
    try {
        const response = await axiosInstance.post('/api/staff/create-staff', {
            firstName: staffForm.value.firstName,
            surname: staffForm.value.surname,
            dateOfBirth: staffForm.value.dateOfBirth,
            gender: staffForm.value.gender,
            nationalIdNumber: staffForm.value.nationalIdNumber,
            constituency: staffForm.value.constituency.name,
            role: staffForm.value.role.name,
            password: staffLoginDetails.value.password,
            staffId: staffLoginDetails.value.staffId,
        })
        console.log(response)
        showSuccessAlert.value = true
        successAlertMessage.value = response.data.message
    } catch (error: any) {
        showErrorAlert.value = true
        errorAlertMessage.value = error instanceof Error ? error.message : 'An unknown error occurred'
        console.error(error)
    } finally {
        loading.value = false
        showStaffLoginDetails.value = false
    }
}
</script>

<template>
    <!-- Success Alert -->
     <v-snackbar v-if="showSuccessAlert" v-model="showSuccessAlert" color="success" class="rounded-lg">
        {{ successAlertMessage }}
     </v-snackbar>
    <!-- Error Alert -->
     <v-snackbar v-if="showErrorAlert" v-model="showErrorAlert" color="error" class="rounded-lg">
        {{ errorAlertMessage }}
     </v-snackbar>
    <div class="px-4 py-4">
        <h1 class="text-3xl font-bold text-primary mb-4">Create Staff</h1>
        <p class="text-lg text-secondary mb-4">Fill in the details below to create a staff profile</p>
        <!-- Create Staff Form -->
        <v-form ref="createStaffForm" @submit.prevent="generateStaffLoginDetails" class="mt-8">
            <v-row>
                <v-col cols="12" lg="6">
                    <v-text-field label="Staff First Name*" prepend-inner-icon="mdi-account" variant="outlined"
                        class="rounded-lg" color="primary" type="text" bg-color="white" required
                        v-model="staffForm.firstName" :rules="[(v) => !!v || 'First name is required']"></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                    <v-text-field label="Staff Surname*" prepend-inner-icon="mdi-account" variant="outlined"
                        class="rounded-lg" color="primary" type="text" bg-color="white" required
                        v-model="staffForm.surname" :rules="[(v) => !!v || 'Surname is required']"></v-text-field>
                </v-col>
            </v-row>
            <!-- Date of Birth and Gender -->
            <h3 class="text-lg font-bold text-primary mt-4 mb-4">Date of Birth and Gender</h3>
            <v-row>
                <v-col cols="12" lg="6">
                    <v-date-input label="Date of Birth*" variant="outlined" class="rounded-lg" color="primary"
                        bg-color="white" required v-model="staffForm.dateOfBirth" :rules="[(v) => !!v || 'Date of birth is required']"></v-date-input>
                </v-col>
                <v-col cols="12" lg="6">
                    <v-select label="Gender*" prepend-inner-icon="mdi-human-male-female" variant="outlined"
                        class="rounded-lg" color="primary" :items="genders" bg-color="white" required
                        v-model="staffForm.gender" :rules="[(v) => !!v || 'Gender is required']"></v-select>
                </v-col>
            </v-row>
            <!-- National ID Number and Constituency -->
            <h3 class="text-lg font-bold text-primary mt-4 mb-4">National ID Number and Constituency</h3>
            <v-row>
                <v-col cols="12" lg="6">
                    <v-text-field label="National ID Number*" prepend-inner-icon="mdi-card" variant="outlined"
                        class="rounded-lg" color="primary" type="number" bg-color="white" required
                        v-model="staffForm.nationalIdNumber" :rules="[(v) => !!v || 'National ID number is required']"></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                    <v-select label="Constituency*" prepend-inner-icon="mdi-flag" variant="outlined" class="rounded-lg"
                        color="primary" :items="constituencies.map(constituency => constituency.name)" bg-color="white"
                        required v-model="staffForm.constituency.name" :rules="[(v) => !!v || 'Constituency is required']"></v-select>
                </v-col>
            </v-row>
            <!-- Staff Role and Actions -->
            <h3 class="text-lg font-bold text-primary mt-4 mb-4">Staff Role and Actions</h3>
            <p class="text-sm text-secondary mb-4">Note: The staff role will determine the actions the staff can perform
            </p>
            <v-row>
                <v-col cols="12" lg="6">
                    <v-select label="Staff Role*" prepend-inner-icon="mdi-account-group" variant="outlined"
                        class="rounded-lg" color="primary" :items="roles.map(role => role.name)" bg-color="white"
                        required v-model="staffForm.role.name" :rules="[(v) => !!v || 'Role is required']"></v-select>
                </v-col>
            </v-row>
            <!-- Staff creation Process -->
            <div class="p-4 rounded-lg my-4">
                <p class="text-sm text-secondary mb-2 font-medium">Staff creation process:</p>
                <ul class="text-sm text-error space-y-1">
                    <li class="flex items-center gap-2">
                        <v-icon size="16" color="error">mdi-alert-circle</v-icon>
                        Once all the details are filled, you will be required to copy the staff ID and password to share
                        with the staff
                    </li>
                    <li class="flex items-center gap-2">
                        <v-icon size="16" color="error">mdi-alert-circle</v-icon>
                        You will be required to confirm the creation of the staff by clicking the button below
                    </li>
                </ul>
            </div>
            <!-- Submit Button -->
            <div class="mt-8 flex justify-center items-center">
                <v-btn color="primary" variant="flat" size="large" class="rounded-lg"
                type="submit">Create Staff</v-btn>
            </div>

        </v-form>
    </div>
    <!-- Staff Login Details Modal -->
    <v-dialog v-model="showStaffLoginDetails" width="500">
        <v-card class="pa-4">
            <v-card-title>
                <h3 class="text-lg font-bold text-primary mb-2">Staff Login Details</h3>
                <p class="text-sm text-secondary">Note: Please copy the staff login details before creating the staff</p>
            </v-card-title>
            <v-card-text>
                <p class="text-sm text-secondary">Staff ID: <span class="font-bold">{{ staffLoginDetails.staffId
                }}</span></p>
                <p class="text-sm text-secondary">Password: <span class="font-bold">{{ staffLoginDetails.password
                }}</span></p>
            </v-card-text>
            <v-card-actions class="flex justify-start gap-2">
                <v-btn color="error" variant="flat" size="small" class="rounded-lg"
                    @click="showStaffLoginDetails = false">Cancel</v-btn>
                <v-btn color="secondary" variant="flat" size="small" class="rounded-lg" append-icon="mdi-clipboard-text"
                    @click="copyStaffLoginDetails">Copy Login Details</v-btn>
                <v-btn color="primary" variant="flat" size="small" class="rounded-lg" :loading="loading" @click="createStaff">Create Staff</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped></style>