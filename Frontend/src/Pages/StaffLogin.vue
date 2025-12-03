<script setup lang="ts">
import { ref } from 'vue';
import type { VForm } from 'vuetify/components'
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore();

interface LoginForm {
    staffId: string;
    password: string;
}

const loginForm = ref<LoginForm>({
    staffId: '',
    password: ''
})
const showSuccessAlert = ref(false)
const successAlertMessage = ref('')
const showErrorAlert = ref(false)
const errorAlertMessage = ref('')
const loading = ref(false)
const createLoginForm = ref<VForm | null>(null);

const login = async () => {
  loading.value = true;

  try {
    const message = await authStore.login(
      loginForm.value.staffId,
      loginForm.value.password
    );

    showSuccessAlert.value = true;
    successAlertMessage.value = message;

    // Redirect to dashboard if needed
    router.push("/dashboard");
  } catch (error: any) {
    showErrorAlert.value = true;
    errorAlertMessage.value = error;
  } finally {
    loading.value = false;
  }
};

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
    <section class="relative min-h-screen flex items-center justify-center">
        <!-- Staff Login form -->
        <div class="flex items-center justify-center p-8">
            <div class="w-full space-y-8">
                <!-- Header -->
                <div class="text-center">
                    <h1 class="text-3xl font-bold text-primary mb-2">Login to your Staff Account</h1>
                    <p class="text-secondary">Access your Dashboard</p>
                </div>
                <!-- Form -->
                <v-form ref="createLoginForm" class="mt-8" @submit.prevent="login">
                    <v-text-field label="Staff ID" prepend-inner-icon="mdi-account" variant="outlined"
                        class="rounded-lg" color="primary" type="text" bg-color="white"
                        v-model="loginForm.staffId"></v-text-field>

                    <v-text-field label="Password" prepend-inner-icon="mdi-lock-outline" color="primary"
                        class="rounded-lg" variant="outlined" type="password" bg-color="white"
                        v-model="loginForm.password"></v-text-field>

                    <div class="flex justify-center mt-8">
                        <v-btn color="primary" variant="flat" class="rounded-lg" size="large"
                         type="submit" :loading="loading">Login</v-btn>
                    </div>
                </v-form>
            </div>
        </div>
    </section>
</template>

<style scoped></style>