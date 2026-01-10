<script setup>

import { computed } from 'vue';

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
    modelValue: {
        type: [String, Number],
        required: true
    },
    title: {
        type: String,
        required: false
    },
    disabled: {
        type: Boolean,
        required: false,
    },
    type: {
        type: String
    }
})

const inputValue = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value);
    }
});

</script>

<template>
    <div class="input" :class="{'input--disabled': disabled}">
        <div v-if="title" class="input__title">{{ title }}</div>
        <input class="input__input" v-model="inputValue" :disabled="disabled" :type="type" />
    </div>
</template>