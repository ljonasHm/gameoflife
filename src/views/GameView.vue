<script setup lang="ts">

import Game from '@/components/game/Game.vue';
import { onMounted } from 'vue';

onMounted(() => {
    // Initialize the game here
    console.log('GameView mounted');
});

</script>

<template>
    <div class="view-container">
        <h1 class="view-title">Game</h1>
        <div class="view-content">
            <Game />
        </div>
    </div>
</template>

<style lang="scss" scoped>

</style>
