<script setup>

import UPopUp from '@/components/ui/UPopUp.vue';
import {ref, watch} from "vue";
import { useGameStore } from '@/stores/game';
import UInput from '@/components/ui/UInput.vue';
import { storeToRefs } from 'pinia';

const props = defineProps({
    multiplay: {
        type: Boolean,
        default: false
    }
});

const gameStore = useGameStore();
const { game, isGameInited } = storeToRefs(gameStore);

const show = ref(false);
const height = ref(game.value?.height || 0);
const width = ref(game.value?.width || 0);
const speed = ref(game.value?.speed || 0);
const filledCellColor = ref(game.value?.filledCellColor || '#000000');
const filledCellColor2 = ref(game.value?.filledCellColor2 || '#A63232');

const syncFromGame = () => {
    height.value = game.value?.height || 0;
    width.value = game.value?.width || 0;
    speed.value = game.value?.speed || 0;
    filledCellColor.value = game.value?.filledCellColor || '#000000';
    filledCellColor2.value = game.value?.filledCellColor2 || '#A63232';
};

const confirm = () => {
    show.value = false;
    game.value.setProps({
        height: height.value,
        width: width.value,
        speed: speed.value,
        filledCellColor: filledCellColor.value,
        filledCellColor2: filledCellColor2.value
    });
}

if (!isGameInited.value) {
    watch(isGameInited, () => {
        syncFromGame();
    })
} else {
    syncFromGame();
}

</script>

<template>
    <div>
        <button @click="show = !show" class="common-button">
            Settings
        </button>
        <UPopUp v-model="show" :title="'Settings'">
            <UInput v-model="height" title="Height" type="number" :disabled="game.started" />
            <UInput v-model="width" title="Width" type="number" :disabled="game.started" />
            <div class="input mt-3">
                <div class="input__title">Speed</div>
                <div class="flex gap-2">
                    <div class="min-w-[21px]">
                        {{ speed }}
                    </div>
                    <input v-model="speed" type="range" min="0.1" max="2" step="0.1" />
                </div>
            </div>
            <div class="input mt-3">
                <div class="input__title">{{ multiplay ? 'Player 1 color' : 'Cell color' }}</div>
                <input v-model="filledCellColor" type="color" />
            </div>
            <div v-if="multiplay" class="input mt-3">
                <div class="input__title">Player 2 color</div>
                <input v-model="filledCellColor2" type="color" />
            </div>
            <button @click="confirm" class="common-button mt-3">
                Confirm
            </button>
        </UPopUp>
    </div>
</template>
