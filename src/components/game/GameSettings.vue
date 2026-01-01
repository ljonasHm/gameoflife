<script setup>

import UPopUp from '@/components/ui/UPopUp.vue';
import {ref} from "vue";
import { useGameStore } from '@/stores/game';

const gameStore = useGameStore();
const game = ref(gameStore.game);

const show = ref(false);
const height = ref(game.value.height);
const width = ref(game.value.width);
const speed = ref(game.value.speed);

const confirm = () => {
    show.value = false;
    game.value.setProps({
        height: height.value,
        width: width.value,
        speed: speed.value
    });
}

</script>

<template>
    <div>
        <button @click="show = !show" class="common-button">
            Settings
        </button>
        <UPopUp v-model="show" :title="'Settings'">
            <div class="input">
                <div class="input__title">Height</div>
                <input class="input__input" v-model="height" />
            </div>
            <div class="input mt-3">
                <div class="input__title">Width</div>
                <input class="input__input" v-model="width" />
            </div>
            <div class="input mt-3">
                <div class="input__title">Speed</div>
                <div class="flex gap-2">
                    <div class="min-w-[21px]">
                        {{ speed }}
                    </div>
                    <input v-model="speed" type="range" min="0.1" max="2" step="0.1" />
                </div>
            </div>
            <button @click="confirm" class="common-button mt-3">
                Confirm
            </button>
        </UPopUp>
    </div>
</template>