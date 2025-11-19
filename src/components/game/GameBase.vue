<script setup>

import { Game } from '../../services/Game';
import { ref } from 'vue'

const game = ref(new Game(70, 70));

</script>

<template>
    <div class="game">
        <div class="game__field">
            <div v-for="(row, y) in game.height" :key="y" class="game__row">
                <div v-for="(cell, x) in game.width" @click="game.cellClick(x, y)" :key="x" 
                    class="game__cell" :style="{background: game.isCellFilled(x, y) ? game.filledCellColor : ''}"></div>
            </div>
        </div>
        <div class="mt-3 flex justify-center gap-2">
            <template v-if="!game.started">
                <button @click="game.fillRandomly(50)" class="game__button">Fill randomly {{ game.randomFillPercentage }}%</button>
                <button @click="game.start()" class="game__button">Start</button>
            </template>
            <template v-else-if="game.paused">
                <button @click="game.play()" class="game__button">Play ▶</button>
                <button @click="game.nextGeneration()" class="game__button">Next ></button>
                <button @click="game.reset()">Reset</button>
            </template>
            <template v-else>
                <button @click="game.pause()" class="game__button">Pause ||</button>
                <button @click="game.reset()">Reset</button>
            </template>
        </div>
    </div>
</template>