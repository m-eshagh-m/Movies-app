<script setup>
// main components
import MovieCardVue from '../components/movie/MovieCard.vue'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
// some methods or features 
import { useMovieStore } from '../stores/movies.js'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'

/* basic variables - properties - methods */
const moviesStore = useMovieStore()
const date = ref();

const isLoading = computed(() => {
  return moviesStore.isLoading
})

const latesMoviesVue = computed(() => {
  return moviesStore.latestMovies
});

const pageNumber = computed({
  get: () => {
    return moviesStore.pageNumber
  },
  set: (newValue) => {
    return newValue
  }
})

const totalPages = computed(() => {
  return moviesStore.totalPages
})

/* date value == false => load popular movies list */
const router = useRouter()
const route = useRoute()

if (!date.value) {
  router.replace({ query: null })
  moviesStore.loadPopularMovies();
}

/* prev and next buttons */
const isDisabled = computed(() => {
  return totalPages.value === pageNumber.value ? true : false
})

const totalResults = computed(() => {
  return moviesStore.totalResults
})

const endResultsNumber = computed(() => {
  return totalPages.value === pageNumber.value ? totalResults : pageNumber.value * 20
})

const startResultsNumber = computed(() => {
  return pageNumber.value === 1 ? 1 : (pageNumber.value * 20) - 20
})

/* load new movies */
function getMode() {
  return route.query.mode
}

function changePage(event) {
  const newPage = ref()
  const mode = getMode()
  newPage.value = event === 'nextPage' ? ++pageNumber.value : --pageNumber.value

  moviesStore.loadNewMovies(newPage, mode, date)
}

/* search mode */
function searchByReleaseDate() {
  moviesStore.pageNumber = 1
  moviesStore.loadMovieByReleaseDate(date)
}

/* end */
</script>

<template>
  <base-card class="mx-auto w-3/4 items-center p-5 flex justify-between">
    <div class="ml-10 flex items-center w-4/6">
      <label for="">Search by release date:</label>
      <Datepicker class="ml-3  w-4/6" v-model="date" :enableTimePicker="false" range multiCalendars></Datepicker>
    </div>
    <base-button class="mr-10" @click="searchByReleaseDate">Search</base-button>
  </base-card>

  <section v-if="!isLoading" class="mx-auto max-w-screen-xl grid md:grid-cols-3 gap-12 my-16">
    <MovieCardVue v-for="movie in latesMoviesVue" :key="movie.id" :posterPath="movie.posterPath" :title="movie.title"
      :genres="movie.genres" :releaseDate="movie.releaseDate" :movieId="movie.id" />
  </section>
  <base-loading v-else></base-loading>

  <section>
    <div class=" mx-auto w-fit grid grid-cols-2">
      <button class="bg-white w-fit font-bold rounded-l py-4 px-4"
        :class="pageNumber > 1 ? 'text-blue-600 hover:text-blue-700 hover:bg-gray-200' : 'text-gray-400'"
        :disabled="pageNumber > 1 ? false : true" @click="changePage('previousPage')">
        Previous Page
      </button>
      <button class="bg-white w-fit font-bold rounded-r py-4 px-4 border-l-2 border-l-gray-400"
        :class="isDisabled ? 'text-gray-400' : 'text-blue-600 hover:text-blue-700 hover:bg-gray-200'"
        :disabled="isDisabled" @click="changePage('nextPage')">
        Next Page
      </button>
    </div>
    <p class="text-center cursor-default text-lg text-gray-400 font-bold py-3">
      Showing results {{ startResultsNumber }}-{{ endResultsNumber }}
    </p>
  </section>
</template>


