<script setup lang="ts">
import axiosInstance from '@/config/axiosInstance'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { ref } from 'vue'

interface VoterCheckForm {
  nationalIdNumber: string
  dateOfBirth: string
}

interface VoterCheckResponse {
  firstName: string
  surname: string
  dateOfBirth: string
  gender: string
  nationalIdNumber: string
  constituency: string
}

interface ApiResponse {
  message: string
  voter: VoterCheckResponse
}

// Reactive refs with proper typing
const selectedVoter = ref<VoterCheckResponse | null>(null)
const voterCheckForm = ref<VoterCheckForm>({
  nationalIdNumber: '',
  dateOfBirth: ''
})
const hasSearched = ref(false)
const showErrorAlert = ref(false)
const errorAlertMessage = ref('')
const loading = ref(false)

const checkVoter = async (): Promise<void> => {
  if (!voterCheckForm.value.nationalIdNumber || !voterCheckForm.value.dateOfBirth) {
    return
  }

  loading.value = true
  showErrorAlert.value = false
  errorAlertMessage.value = ''

  try {

    const response = await axiosInstance.post<ApiResponse>('/api/voter/check-voter', voterCheckForm.value)

    // Optional: double-check date formatting
    const voter = response.data.voter

    selectedVoter.value = voter
    hasSearched.value = true
  } catch (error: any) {
    console.error(error)
    hasSearched.value = true
    showErrorAlert.value = true

    if (error.response?.status === 400) {
      errorAlertMessage.value = error.response.data.error
    } else {
      errorAlertMessage.value = 'An unknown error occurred'
    }

    selectedVoter.value = null
  } finally {
    loading.value = false
  }
}
</script>

<template>
    <div class="px-4 py-4 mt-6">
        <!-- Page Header -->
        <div class="mb-8 text-center">
            <h1 class="text-3xl font-bold text-primary mb-2">Check your Voter Details</h1>
            <p class="text-lg text-secondary">Fill in the form below to check your voter details</p>
        </div>
        <!-- Voter Check Form -->
        <v-form v-if="!hasSearched" ref="voterCheck" class="mt-8" @submit.prevent="checkVoter">
            <h3 class="text-lg font-bold text-primary mt-4 mb-4">National ID Number</h3>
            <v-row>
                <v-col cols="12" lg="6">
                    <v-text-field v-model="voterCheckForm.nationalIdNumber" label="National ID Number"
                        prepend-inner-icon="mdi-card" variant="outlined" class="rounded-lg" color="primary"
                        type="number" bg-color="white" required :rules="[(v) => !!v || 'National ID number is required', (v) => {
                            return v.toString().length === 8 || 'National ID number must be 8 digits';
                        }]">
                    </v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                    <v-date-input label="Date of Birth" variant="outlined" class="rounded-lg" color="primary"
                        bg-color="white" required v-model="voterCheckForm.dateOfBirth" :rules="[(v) => !!v || 'Date of birth is required', (v) => {
                            const today = new Date();
                            const birthDate = new Date(v);
                            const age = today.getFullYear() - birthDate.getFullYear();
                            return age >= 18 || 'You must be at least 18 years old to check your voter details';
                        }]"></v-date-input>
                </v-col>
            </v-row>
            <div class="flex justify-center mt-8">
                <v-btn color="primary" variant="flat" class="rounded-lg" size="large" type="submit" :loading="loading">Check</v-btn>
            </div>
        </v-form>

        <!-- Show voter details card only if searched and voter found -->
        <v-card v-if="hasSearched && selectedVoter !== null" class="mt-8 mx-auto border rounded-lg bg-primary/10"
            elevation="0" max-width="800px">
            <v-card-title class="text-center mt-4">
                <h2 class="text-2xl font-bold text-primary">Voter Details Found!</h2>
            </v-card-title>
            <v-card-text class="p-4 text-center">
                <v-row no-gutters class="pa-4">
                    <v-col cols="6" lg="6" class="flex justify-start items-center">
                        <div class="text-lg text-secondary border w-full pa-2">First Name:</div>
                    </v-col>
                    <v-col cols="6" lg="6" class="flex justify-start">
                        <div class="text-lg text-secondary border w-full pa-2">{{ selectedVoter.firstName }}</div>
                    </v-col>
                    <v-col cols="6" lg="6" class="flex justify-start items-center">
                        <div class="text-lg text-secondary border w-full pa-2">Surname:</div>
                    </v-col>
                    <v-col cols="6" lg="6" class="flex justify-start">
                        <div class="text-lg text-secondary border w-full pa-2">{{ selectedVoter.surname }}</div>
                    </v-col>
                    <v-col cols="6" lg="6" class="flex justify-start items-center">
                        <div class="text-lg text-secondary border w-full pa-2">Date Of Birth:</div>
                    </v-col>
                    <v-col cols="6" lg="6" class="flex justify-start">
                        <div class="text-lg text-secondary border w-full pa-2">{{ selectedVoter.dateOfBirth }}</div>
                    </v-col>
                    <v-col cols="6" lg="6" class="flex justify-start items-center">
                        <div class="text-lg text-secondary border w-full pa-2">Gender:</div>
                    </v-col>
                    <v-col cols="6" lg="6" class="flex justify-start">
                        <div class="text-lg text-secondary border w-full pa-2">{{ selectedVoter.gender }}</div>
                    </v-col>
                    <v-col cols="6" lg="6" class="flex justify-start items-center">
                        <div class="text-lg text-secondary border w-full pa-2">National ID Number:</div>
                    </v-col>
                    <v-col cols="6" lg="6" class="flex justify-start">
                        <div class="text-lg text-secondary border w-full pa-2">{{ selectedVoter.nationalIdNumber }}
                        </div>
                    </v-col>
                    <v-col cols="6" lg="6" class="flex justify-start items-center">
                        <div class="text-lg text-secondary border w-full pa-2">Constituency:</div>
                    </v-col>
                    <v-col cols="6" lg="6" class="flex justify-start">
                        <div class="text-lg text-secondary border w-full pa-2">{{ selectedVoter.constituency }}</div>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions class="flex justify-center mt-4 mb-4">
                <v-btn color="primary" variant="flat" class="rounded-lg" size="large" append-icon="mdi-file-pdf">Print PDF</v-btn>
                <v-btn color="primary" variant="flat" class="rounded-lg" size="large" to="/"
                    append-icon="mdi-arrow-right">Back to Home</v-btn>
            </v-card-actions>
        </v-card>

        <!-- Show empty state only if searched and voter not found -->
        <v-empty-state v-if="hasSearched && selectedVoter === null" title="No Voter Details Found"
            image="https://verify.iebc.or.ke/images/1.png"
            description="Please check your National ID Number and try again" class="mt-8 mx-auto">
            <template v-slot:actions>
                <v-btn color="primary" variant="flat" class="rounded-lg" size="large" append-icon="mdi-refresh"
                    @click="hasSearched = false">Check Again</v-btn>
                <v-btn color="primary" variant="flat" class="rounded-lg" size="large" to="/voter-registration">Register
                    as a Voter</v-btn>
            </template>
        </v-empty-state>
    </div>
</template>

<style scoped></style>