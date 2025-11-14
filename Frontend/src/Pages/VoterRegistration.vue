<script setup lang="ts">
import axiosInstance from '@/config/axiosInstance'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { ref } from 'vue'
import type { VForm } from 'vuetify/components'
import { useRouter } from 'vue-router'

const router = useRouter()
interface VoterRegistrationForm {
    firstName: string;
    surname: string;
    dateOfBirth: string;
    gender: string;
    nationalIdNumber: string;
    constituency: string;
}
const constituencies = ref([
    'Nairobi',
    'Machakos',
    'Mombasa',
    'Kisumu',
    'Bungoma',
    'Isiolo',
    'Tana River',
])
const genders = ref([
    'Male',
    'Female',
    'Rather not say',
])
const voterRegistrationForm = ref<VoterRegistrationForm>({
    firstName: '',
    surname: '',
    dateOfBirth: '',
    gender: '',
    nationalIdNumber: '',
    constituency: '',
})

const showSuccessAlert = ref(false)
const successAlertMessage = ref('')
const showErrorAlert = ref(false)
const errorAlertMessage = ref('')
const loading = ref(false)
const createVoterRegistrationForm = ref<VForm | null>(null);

const registerVoter = async () => {
    const { valid } = await createVoterRegistrationForm.value?.validate() as { valid: boolean };
    if (!valid) {
        return;
    }
    loading.value = true
    try {
        const response = await axiosInstance.post('/api/voter/register-voter', voterRegistrationForm.value)
        console.log(response)
        showSuccessAlert.value = true
        successAlertMessage.value = response.data.message
        setTimeout(() => {
            router.push('/voter-check')
        }, 3000)
    } catch (error: any) {
        if (error.response?.status === 400) {
            showErrorAlert.value = true
            errorAlertMessage.value = error.response.data.error
        } else {
            showErrorAlert.value = true
            errorAlertMessage.value = 'An unknown error occurred'
        }
    } finally {
        loading.value = false
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
    <div class="px-4 py-4 mt-6">
        <!-- Page Header -->
        <div class="mb-8 text-center">
            <h1 class="text-3xl font-bold text-primary mb-2">Register your Voter Details</h1>
            <p class="text-lg text-secondary">Fill in the form below to register as a voter</p>
        </div>
        <!-- Voter Registration Form -->
        <v-form ref="createVoterRegistrationForm" @submit.prevent="registerVoter" class="mt-8">
            <h3 class="text-lg font-bold text-primary mt-4 mb-4">Personal Information</h3>
            <v-row>
                <v-col cols="12" lg="6">
                    <v-text-field label="First Name" prepend-inner-icon="mdi-account" variant="outlined"
                        class="rounded-lg" color="primary" type="text" bg-color="white" required
                        v-model="voterRegistrationForm.firstName"
                        :rules="[(v) => !!v || 'First name is required']"></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                    <v-text-field label="Surname" prepend-inner-icon="mdi-account" variant="outlined" class="rounded-lg"
                        color="primary" type="text" bg-color="white" required v-model="voterRegistrationForm.surname"
                        :rules="[(v) => !!v || 'Surname is required']"></v-text-field>
                </v-col>
            </v-row>
            <h3 class="text-lg font-bold text-primary mt-4 mb-4">Date of Birth and Gender</h3>
            <p class="text-sm text-secondary mb-4">Note: Only those above 18 years are eligible to register</p>
            <v-row>
                <v-col cols="12" lg="6">
                    <v-date-input label="Date of Birth" variant="outlined" class="rounded-lg" color="primary"
                        bg-color="white" required v-model="voterRegistrationForm.dateOfBirth" :rules="[(v) => !!v || 'Date of birth is required', (v) => {
                            const today = new Date();
                            const birthDate = new Date(v);
                            const age = today.getFullYear() - birthDate.getFullYear();
                            return age >= 18 || 'You must be at least 18 years old to register';
                        }]"></v-date-input>
                </v-col>
                <v-col cols="12" lg="6">
                    <v-select label="Gender" prepend-inner-icon="mdi-human-male-female" variant="outlined"
                        class="rounded-lg" color="primary" :items="genders" bg-color="white" required
                        v-model="voterRegistrationForm.gender" :rules="[(v) => !!v || 'Gender is required']"></v-select>
                </v-col>
            </v-row>
            <h3 class="text-lg font-bold text-primary mt-4 mb-4">National ID Number and Constituency</h3>
            <v-row>
                <v-col cols="12" lg="6">
                    <v-text-field label="National ID Number" prepend-inner-icon="mdi-card" variant="outlined"
                        class="rounded-lg" color="primary" type="number" bg-color="white" required
                        v-model="voterRegistrationForm.nationalIdNumber" :rules="[(v) => !!v || 'National ID number is required', (v) => {
                            return v.toString().length === 8 || 'National ID number must be 8 digits';
                        }]"></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                    <v-select label="Constituency" prepend-inner-icon="mdi-flag" variant="outlined" class="rounded-lg"
                        color="primary" :items="constituencies" f bg-color="white" required
                        v-model="voterRegistrationForm.constituency"
                        :rules="[(v) => !!v || 'Constituency is required']"></v-select>
                </v-col>
            </v-row>
            <div class="flex justify-center mt-8">
                <v-btn color="primary" variant="flat" class="rounded-lg" size="large" type="submit" :loading="loading">Register</v-btn>
            </div>
        </v-form>
    </div>
</template>

<style scoped></style>