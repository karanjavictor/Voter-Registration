<script setup lang="ts">
import { ref } from 'vue';

interface VoterCheckForm {
    nationalIdNumber: string;
    yearOfBirth: string;
}
interface VoterCheckResponse {
    firstName: string;
    surname: string;
    yearOfBirth: string;
    gender: string;
    nationalIdNumber: string;
    constituency: string;
}

// Use null instead of an empty object to indicate no selection yet
const selectedVoter = ref<VoterCheckResponse | null>(null);

// Track if form has been submitted
const hasSearched = ref(false);

const voterCheckForm = ref<VoterCheckForm>({
    nationalIdNumber: '',
    yearOfBirth: ''
});

const voterDetails = ref<VoterCheckResponse[]>([{
    firstName: 'John',
    surname: 'Doe',
    yearOfBirth: '2001',
    gender: 'Male',
    nationalIdNumber: '39025888',
    constituency: 'Kiambu'
},
{
    firstName: 'Jane',
    surname: 'Doe',
    yearOfBirth: '2003',
    gender: 'Female',
    nationalIdNumber: '39025889',
    constituency: 'Kiambu'
},
{
    firstName: 'Jim',
    surname: 'Beam',
    yearOfBirth: '2003',
    gender: 'Male',
    nationalIdNumber: '39025890',
    constituency: 'Kiambu'
}])

const checkVoter = () => {
    if (voterCheckForm.value.nationalIdNumber === '' || voterCheckForm.value.yearOfBirth === '') {
        return;
    }
    
    // Mark that a search has been performed
    hasSearched.value = true;
    
    const voter = voterDetails.value.find(voter => 
        voter.nationalIdNumber === voterCheckForm.value.nationalIdNumber && 
        voter.yearOfBirth === voterCheckForm.value.yearOfBirth
    );
    
    if (voter) {
        selectedVoter.value = voter;
    } else {
        selectedVoter.value = null;
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
        <v-form v-if="!hasSearched" ref="voterCheck" class="mt-8">
            <h3 class="text-lg font-bold text-primary mt-4 mb-4">National ID Number</h3>
            <v-row>
                <v-col cols="12" lg="6">
                    <v-text-field 
                        v-model="voterCheckForm.nationalIdNumber"
                        label="National ID Number" 
                        prepend-inner-icon="mdi-card" 
                        variant="outlined"
                        class="rounded-lg" 
                        color="primary" 
                        type="text" 
                        bg-color="white">
                    </v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                    <v-text-field 
                        v-model="voterCheckForm.yearOfBirth"
                        label="Year of Birth" 
                        prepend-inner-icon="mdi-calendar" 
                        variant="outlined"
                        class="rounded-lg" 
                        color="primary" 
                        type="text" 
                        bg-color="white">
                    </v-text-field>
                </v-col>
            </v-row>    
            <div class="flex justify-center mt-8">
                <v-btn color="primary" variant="flat" class="rounded-lg" size="large" @click="checkVoter">Check</v-btn>
            </div>
        </v-form>
        
        <!-- Show voter details card only if searched and voter found -->
        <v-card v-if="hasSearched && selectedVoter !== null" class="mt-8 mx-auto border rounded-lg bg-primary/10" elevation="0" max-width="800px">
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
                        <div class="text-lg text-secondary border w-full pa-2">{{ selectedVoter.yearOfBirth }}</div>
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
                        <div class="text-lg text-secondary border w-full pa-2">{{ selectedVoter.nationalIdNumber }}</div>
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
                <v-btn color="primary" variant="flat" class="rounded-lg" size="large" append-icon="mdi-file-pdf">Print Voter Details To PDF</v-btn>
                <v-btn color="primary" variant="flat" class="rounded-lg" size="large" to="/" append-icon="mdi-arrow-right">Back to Home</v-btn>
            </v-card-actions>
        </v-card>
        
        <!-- Show empty state only if searched and voter not found -->
        <v-empty-state v-if="hasSearched && selectedVoter === null" title="No Voter Details Found" image="https://verify.iebc.or.ke/images/1.png" description="Please check your National ID Number and try again" class="mt-8 mx-auto">
            <template v-slot:actions>
                <v-btn color="primary" variant="flat" class="rounded-lg" size="large" append-icon="mdi-refresh" @click="hasSearched = false">Check Again</v-btn>
                <v-btn color="primary" variant="flat" class="rounded-lg" size="large" to="/voter-registration">Register as a Voter</v-btn>
            </template>
        </v-empty-state>    
    </div>
</template>

<style scoped></style>