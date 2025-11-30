<script setup>

import { ref } from 'vue'
import { Game } from '@/services/Game';
import { watch } from 'vue';
import GameCell from '@/components/game/GameCell.vue';

const game = ref(new Game(40, 40));
let cells = Array.from({ length: game.value.height }, () => Array.from({ length: game.value.width }, () => ref(0)));

let stopBoardWatcher = () => {};

const start = () => {
    game.value.setBoard(Array.from(cells, (row, heightIndex) => Array.from(row, (_, widthIndex) => cells[heightIndex][widthIndex].value)));

    stopBoardWatcher();

    stopBoardWatcher = watch(() => game.value.board, () => {
        cells.forEach((row, heightIndex) => {
            row.forEach((cell, widthIndex) => {
                cell.value = Number(game.value.isCellFilled(widthIndex, heightIndex));
            })
        })
    })

    game.value.start();
}

const fillRandomly = () => {
    game.value.fillRandomly(50);

    cells.forEach((row, heightIndex) => {
        row.forEach((cell, widthIndex) => {
            cell.value = Number(game.value.isCellFilled(widthIndex, heightIndex));
        })
    })
}

const reset = () => {
    game.value.reset();
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
                <button @click="fillRandomly" class="game__button">Fill randomly {{ game.randomFillPercentage }}%</button>
                <button @click="start" class="game__button">Start</button>
            </template>
            <template v-else-if="game.paused">
                <button @click="game.play()" class="game__button">Play ▶</button>
                <button @click="game.nextGeneration()" class="game__button">Next ></button>
                <button @click="reset" class="game__button">Reset</button>
            </template>
            <template v-else>
                <button @click="game.pause()" class="game__button">Pause ||</button>
                <button @click="reset" class="game__button">Reset</button>
            </template>
        </div>
    </div>
</template>