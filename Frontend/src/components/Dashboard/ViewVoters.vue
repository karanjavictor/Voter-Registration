<script setup lang="ts">
import axiosInstance from '@/config/axiosInstance';
import { ref, onMounted } from 'vue';
import type { VForm } from 'vuetify/components'

type Gender = 'Male' | 'Female' | 'Rather not say';
type Constituency = 'Nairobi' | 'Machakos' | 'Mombasa' | 'Kisumu' | 'Bungoma' | 'Isiolo' | 'Tana River';

interface Voter {
    id?: number;
    firstName: string;
    surname: string;
    dateOfBirth: Date;
    gender: Gender;
    nationalIdNumber: string;
    constituency: Constituency;
    isDeceased?: Boolean;
    deathCertificateNumber?: ''
}
interface SelectedVoter {
    nationalIdNumber: '';
    isDeceased: false;
    constituency: Constituency
    deathCertificateNumber: ''
}
const headers = ref([
    { title: 'ID', key: 'id', sortable: true },
    { title: 'First Name', key: 'firstName', sortable: true },
    { title: 'Surname', key: 'surname', sortable: true },
    { title: 'Date of Birth', key: 'dateOfBirth', sortable: true },
    { title: 'Gender', key: 'gender', sortable: true },
    { title: 'National ID No.', key: 'nationalIdNumber', sortable: true },
    { title: 'Constituency', key: 'constituency', sortable: true },
    { title: 'Actions', key: 'actions', sortable: false },
]);
const voters = ref<Voter[]>([]);
const constituencies = ref([
    'Nairobi',
    'Machakos',
    'Mombasa',
    'Kisumu',
    'Bungoma',
    'Isiolo',
    'Tana River',
]);

const editDialog = ref(false);
const selectedVoter = ref<SelectedVoter>({
    nationalIdNumber: '',
    isDeceased: false,
    constituency: 'Nairobi',
    deathCertificateNumber: ''
})
const loading = ref(false)
const showSuccessAlert = ref(false)
const showErrorAlert = ref(false)
const successAlertMessage = ref('')
const errorAlertMessage = ref('')
const updateVoterRegistrationForm = ref<VForm | null>(null);

const getAllVoters = async () => {
    loading.value = true;
    try {
        const response = await axiosInstance.get('/api/voter/get-all-voters');
        console.log(response);
        voters.value = response.data.voters as Voter[];
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
}

const editVoter = (item: any) => {
    selectedVoter.value = {
        nationalIdNumber: item.nationalIdNumber,
        isDeceased: item.isDeceased,
        constituency: item.constituency,
        deathCertificateNumber: item.deathCertificateNumber
    }
    editDialog.value = true
}
const handleSave = async (updatedValue: any) => {
    const { valid } = await updateVoterRegistrationForm.value?.validate() as { valid: boolean };
    if (!valid) {
        return;
    }
    loading.value = true
    try {
        const response = await axiosInstance.patch('/api/voter/update-voter', updatedValue)
        console.log(response)
        showSuccessAlert.value = true
        successAlertMessage.value = response.data.message
        getAllVoters()
    } catch (error: any) {
        if (error.response?.status === 400) {
            showErrorAlert.value = true
            errorAlertMessage.value = error.response.data.error
        } else {
            showErrorAlert.value = true
            errorAlertMessage.value = 'An unknown error occurred'
        }
    }
    finally {
        loading.value = false
    }
}

onMounted(() => {
    getAllVoters();
})
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
        <div class="mb-8 flex align-center justify-between">
            <div class="">
                <h1 class="text-3xl font-bold text-primary mb-4">View Voters</h1>
                <p class="text-lg text-secondary mb-4">View Voters By Constituency</p>
            </div>
            <v-btn color="primary" variant="outlined" prepend-icon="mdi-refresh" size="small" class="rounded-lg"
                @click="getAllVoters" :loading="loading">Refresh</v-btn>
        </div>
        <!-- Voters Data Table -->
        <v-card class="rounded-lg" elevation="2">
            <v-card-title class="pa-6 bg-primary/5 border-b">
                <v-row>
                    <v-col cols="12" md="4">
                        <div class="d-flex align-center">
                            <v-icon icon="mdi-account-group" color="primary" size="24" class="mr-3"></v-icon>
                            <h2 class="text-xl font-semibold text-primary">Voters</h2>
                        </div>
                    </v-col>
                    <v-col cols="12" md="4">
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
                    <v-col cols="12" md="4">
                        <v-btn color="primary" variant="flat" prepend-icon="mdi-file-export" class="rounded-lg"
                            size="small">
                            Export
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-text-field label="Search by National ID Number" prepend-inner-icon="mdi-magnify"
                            variant="outlined" class="rounded-lg" color="primary" bg-color="white"
                            type="text"></v-text-field>
                    </v-col>
                </v-row>
            </v-card-title>

            <v-data-table :headers="headers" :items="voters" item-value="firstName" class="voters-table"
                :items-per-page="10" :mobile="$vuetify.display.mdAndDown" :mobile-breakpoint="960">
                <template v-slot:item.nationalIdNumber="{ item }">
                    <p :class="{'line-through text-error' :item.isDeceased}">{{ item.nationalIdNumber  }}</p>
                </template>
                <!-- Actions -->
                <template v-slot:item.actions="{ item }">
                    <div class="d-flex ga-2 justify-end">
                        <v-btn color="primary" variant="text" size="small" class="rounded-lg" append-icon="mdi-pencil"
                            @click="editVoter(item)">Edit</v-btn>
                    </div>
                </template>
            </v-data-table>
        </v-card>
    </div>
    <v-dialog v-model="editDialog" max-width="500">
        <v-confirm-edit ref="confirm" ok-text="Save" :model-value="selectedVoter" @save="handleSave"
            @cancel="editDialog = false">
            <template v-slot:default="{ model: proxyModel, actions }">
                <v-card class="pa-4">
                    <v-card-title>s
                        <h2 class="text-xl font-semibold text-primary">Update Voter Details</h2>
                    </v-card-title>
                    <v-card-text>
                        <v-form ref="updateVoterRegistrationForm"  @submit.prevent="handleSave">
                            <v-select label="Update Constituency" prepend-inner-icon="mdi-flag" variant="outlined"
                                class="rounded-lg" color="primary" :items="constituencies" bg-color="white"
                                v-model="proxyModel.value.constituency"></v-select>
                            <v-divider class="my-4"></v-divider>
                            <v-switch :disabled="proxyModel.value.isDeceased" v-model="proxyModel.value.isDeceased"
                                label="Mark as Deceased" color="error"></v-switch>
                            <v-text-field v-if="proxyModel.value.isDeceased" label="Death Certificate Number"
                                hint="Must be a valid death certificate number" prepend-inner-icon="mdi-card"
                                variant="outlined" class="rounded-lg" color="primary" type="number" bg-color="white"
                                v-model="proxyModel.value.deathCertificateNumber" :rules="[(v) => !!v || 'Death Certificate number is required', (v) => {
                                    return v.toString().length === 8 || 'Death Certificate Number number must be 8 digits';
                                }]" :required="proxyModel.value.isDeceased"></v-text-field>
                            <p class="text-sm text-error mb-4">Note: Marking as deceased cannot be undone</p>
                        </v-form>
                    </v-card-text>
                    <template v-slot:actions>
                        <v-spacer></v-spacer>
                        <component :is="actions" />
                    </template>
                </v-card>
            </template>
        </v-confirm-edit>
    </v-dialog>
</template>

<style scoped></style>