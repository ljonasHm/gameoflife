<script setup lang="ts">

import { Game } from '@/services/Game.js';

const game = new Game(20, 20);
console.log('Game initialized:', game);

</script>

<template>
    <div class="game">
        <div class="game__field">
            
        </div>
    </div>
</template>