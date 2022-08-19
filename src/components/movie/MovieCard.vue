<script setup>
// some methods or features 
import { computed } from 'vue'

/* basic variables - properties - methods */
const props = defineProps({
    posterPath: String,
    genres: Array,
    title: String,
    releaseDate: String,
    movieId: Number
})

const posterLink = computed(() => {
    if (!props.posterPath) {
        return '/images/defaultPoster.jpg'
    }
    return 'https://image.tmdb.org/t/p/w200' + props.posterPath
})

const movieDetailsLink = computed(() => {
    return { path: `/movies/${props.movieId}` }
})

/* end */
</script>

<template>
    <router-link :to="movieDetailsLink" class="flex">
        <div
            class="w-full items-center cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-lg shadow flex border border-gray-200 transition ease-in-out duration-1000">
            <div class="w-6/12 h-full">
                <img class="w-full h-full rounded-lg p-1 sm:rounded-none sm:rounded-l-lg" :src="posterLink"
                    alt="Bonnie Avatar">
            </div>
            <div class="w-7/12 grid grid-cols-1 content-between h-full py-5 px-2">
                <h3 class="text-lg tracking-tight text-black font-bold">{{ title }}</h3>
                <div>
                    <div class="flex gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p class="font-normal  text-gray-700 ">{{ releaseDate }}</p>
                    </div>
                    <ul class="flex flex-wrap gap-x-5 ml-3 gap-y-1 sm:mt-4">
                        <li v-for="genre in genres" :key="genre">
                            <span class="text-gray-700 ">
                                {{ genre }}
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </router-link>
</template>

<style lang="postcss" scoped>
li::before {
    @apply content-[''] absolute w-1.5 h-1.5 rounded-full bg-gray-800 top-2.5 -left-2.5;
}
</style>