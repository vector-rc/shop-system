<template>
    <div class="profile">
        <ProfileWrite />
        <PasswordForm />
    </div>
</template>

<script setup>
import ProfileWrite from '@/components/Profile/ProfileWrite.vue'
import PasswordForm from '../components/Profile/PasswordForm.vue'
</script>

<style>
.profile {
    display: grid;
    align-items: start;
    /* grid-auto-rows: 40rem; */
    grid-template-columns: repeat(auto-fill,minmax(30rem,1fr));
    min-height: 90vh;
    gap: 1rem;
}
</style>
