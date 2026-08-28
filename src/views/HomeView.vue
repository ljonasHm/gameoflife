<script setup lang="ts">

</script>

<template>
    <div class="view-container">
        <h1 class="view-title">Home page</h1>
        <div class="view-content">
            <router-link :to="{name: 'game'}">Game</router-link>
            <router-link :to="{name: 'game-local'}">Local multiplayer game</router-link>
        </div>
    </div>
</template>

<style lang="scss" scoped>

</style>