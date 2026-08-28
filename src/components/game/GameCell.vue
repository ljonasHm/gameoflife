<script setup>

const props = defineProps({
    filled: {
        type: Boolean
    },
    filledColor: {
        type: String,
        default: ''
    },
    hoverColor: {
        type: String,
        default: ''
    },
    specialClass: {
        type: String,
        default: ''
    }
});

</script>

<template>
    <div
        class="game__cell"
        :style="{
            '--cell-background': filled && !specialClass ? filledColor : '',
            '--cell-hover': hoverColor || undefined
        }"
        :class="specialClass"
    ></div>
</template>
