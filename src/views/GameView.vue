<script setup lang="ts">

import GameSettings from '@/components/game/GameSettings.vue';
import GameBase from '@/components/game/GameBase.vue';

const props = defineProps({
    multiplay: {
        type: Boolean,
        default: false
    }
})

</script>

<template>
    <div class="view-container">
        <h1 class="view-title">Game</h1>
        <div class="mt-4 flex gap-2 items-center">
            <GameSettings :multiplay="multiplay" />
        </div>
        <div class="view-content">
            <GameBase :multiplay="multiplay" />
        </div>
    </div>
</template>

<style lang="scss" scoped>

</style>
