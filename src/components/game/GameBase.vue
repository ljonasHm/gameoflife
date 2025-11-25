<script setup>

import { ref } from 'vue'
import { Game } from '@/services/Game';
import GameCell from '@/components/game/GameCell.vue';

const game = ref(new Game(70, 70));
let cells = Array.from({ length: game.value.height }, () => Array.from({ length: game.value.width }, () => ref(0)));

const start = () => {
    game.value.setBoard(cells);

    watch(() => game.value.board, () => {
        // cells = game.value.board;
    })
}

</script> 

<template>
    <div class="game">
        <div class="game__field">
            <div v-for="(row, y) in cells" :key="y" class="game__row">
                <GameCell v-for="(cell, x) in row" @click="cell.value = (cell.value === 0) ? 1 : 0" :filled="!!cell.value" :filled-color="game.filledCellColor" :key="x" />
            </div>
        </div>
        <div class="mt-3 flex justify-center gap-2">
            <template v-if="!game.started">
                <button @click="game.fillRandomly(50)" class="game__button">Fill randomly {{ game.randomFillPercentage }}%</button>
                <button @click="start" class="game__button">Start</button>
            </template>
            <template v-else-if="game.paused">
                <button @click="game.play()" class="game__button">Play ▶</button>
                <button @click="game.nextGeneration()" class="game__button">Next ></button>
                <button @click="game.reset()" class="game__button">Reset</button>
            </template>
            <template v-else>
                <button @click="game.pause()" class="game__button">Pause ||</button>
                <button @click="game.reset()" class="game__button">Reset</button>
            </template>
        </div>
    </div>
</template>