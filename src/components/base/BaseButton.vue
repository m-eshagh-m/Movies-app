<script setup>
const props = defineProps({
    mode: {
        type: String,
        required: false,
        default: null,
    },
    link: {
        type: Boolean,
        required: false,
        default: false,
    },
    to: {
        type: Boolean,
        required: false,
        default: null,
    }
})

</script>

<template>
    <button v-if="!link" :class="mode" class="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded-full">
        <slot></slot>
    </button>
    <router-link v-else :to="to" :class="mode"
        class="px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900">
        <slot></slot>
    </router-link>
</template>

