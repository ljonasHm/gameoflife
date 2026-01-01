<script setup lang="ts">

import GameSettings from '@/components/game/GameSettings.vue';
import GameBase from '@/components/game/GameBase.vue';

</script>

<template>
    <div class="view-container">
        <h1 class="view-title">Game</h1>
        <div class="mt-4 flex gap-2 items-center">
            <GameSettings />
        </div>
        <div class="view-content">
            <GameBase />
        </div>
    </div>
</template>

<style lang="scss" scoped>

</style>
