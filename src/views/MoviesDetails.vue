<script setup>
// some methods or features 
import { useRouter, useRoute } from 'vue-router'
import { reactive, computed, ref } from 'vue';

/* basic variables - properties - methods */
const router = useRouter()
const route = useRoute()
const movieId = route.params.id;
const topCredits = ref([])
const isLoading = ref(false)

const movieDetials = reactive({
  title: '',
  posterPath: '',
  budget: 0,
  revenue: 0,
  releaseDate: '',
  runtime: 0,
  score: {
    vote_average: 0,
    vote_count: 0,
  },
  genres: {},
  tagline: '',
  homepageLink: '',
  imdbLink: '',
  overview: ''
})

const posterLink = computed(() => {
  if (!movieDetials.posterPath) {
    return '/images/defaultPoster.jpg'
  }
  return 'https://image.tmdb.org/t/p/w400' + movieDetials.posterPath
})

//auto-run load movie's credits & take apart top 10
async function loadCredits() {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=770089a80c892ae109b4249e88285eaa`);

  // erro handling
  if (!response.ok) {
    const error = new Error(responseData.message);
    throw error;
  }

  const responseData = await response.json();
  const castMovie = responseData.cast

  const sortedCasts = castMovie.sort((firstCast, secondCast) => (firstCast.popularity < secondCast.popularity) ? 1 : ((secondCast.popularity < firstCast.popularity) ? -1 : 0))

  const mainCreidts = sortedCasts.slice(0, 10)
  for (const credit in mainCreidts) {
    topCredits.value.push(mainCreidts[credit].name)
  }
}

//auto-run load movie's details data
const refLoadMovieDetails = (async function loadMovieDetails() {
  isLoading.value = true
  const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=770089a80c892ae109b4249e88285eaa`);

  // erro handling
  if (!response.ok) {
    const error = new Error(responseData.message);
    throw error;
  }
  const responseData = await response.json();

  movieDetials.title = responseData.title
  movieDetials.posterPath = responseData.poster_path
  movieDetials.budget = numberWithCommas(responseData.budget)
  movieDetials.revenue = numberWithCommas(responseData.revenue)
  movieDetials.releaseDate = responseData.release_date
  movieDetials.runtime = responseData.runtime
  movieDetials.score = {
    vote_average: responseData.vote_average,
    vote_count: responseData.vote_count
  }
  movieDetials.genres = computed(() => {
    const genres = []
    for (const key in responseData.genres) {
      genres.push(responseData.genres[key].name)
    }
    return genres.join(', ')
  })
  movieDetials.tagline = responseData.tagline
  movieDetials.homepageLink = responseData.homepage
  movieDetials.imdbLink = responseData.imdb_id
  movieDetials.overview = responseData.overview

  // load movie's credits
  loadCredits()

  isLoading.value = false
}())

// Separate the cost numbers with commas
function numberWithCommas(cost) {
  return cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// back home
function backHome() {
  router.push({ name: 'movies' })
}

/* end */
</script>

<template>

  <section>
    <base-card class="mx-auto w-3/4 items-center  p-5 flex">

      <base-button class="mr-10 flex gap-2 items-center" @click="backHome">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </base-button>

      <div class="ml-10">
        <h1 class="font-bold text-lg">{{ movieDetials.title }}</h1>
        <p class="text-gray-700 text-sm">{{ movieDetials.tagline }}</p>
      </div>
    </base-card>

    <section v-if="!isLoading" class="mx-auto w-3/4 mt-10">
      <main class="flex pb-8">
        <img class="rounded-lg w-4/12" :src="posterLink" alt="">
        <div class="ml-16 w-full py-4">
          <div class="flex justify-between text-lg pb-4">
            <h3 class="font-bold ">Budget</h3>
            <span>${{ movieDetials.budget }}</span>
          </div>
          <div class="flex justify-between text-lg pb-4">
            <h3 class="font-bold ">Revenue</h3>
            <span>${{ movieDetials.revenue }}</span>
          </div>
          <div class="flex justify-between text-lg pb-4">
            <h3 class="font-bold ">Release Date</h3>
            <span>{{ movieDetials.releaseDate }}</span>
          </div>
          <div class="flex justify-between text-lg pb-4">
            <h3 class="font-bold ">Runtime</h3>
            <span>{{ movieDetials.runtime }}m</span>
          </div>
          <div class="flex justify-between text-lg pb-4">
            <h3 class="font-bold ">Score</h3>
            <span>{{ movieDetials.score.vote_average }}({{ movieDetials.score.vote_count }} votes)</span>
          </div>
          <div class="flex justify-between text-lg pb-4">
            <h3 class="font-bold ">Genres</h3>
            <span>{{ movieDetials.genres }}</span>
          </div>
          <div class="flex justify-between text-lg pb-4">
            <h3 class="font-bold ">IMDB Link</h3>
            <a class="underline text-blue-600" :href="'https://www.imdb.com/title/' + movieDetials.imdbLink">link</a>
          </div>
          <div class="flex justify-between text-lg pb-4">
            <h3 class="font-bold ">Homepage Link</h3>
            <a class="underline text-blue-600" :href="movieDetials.homepageLink">link</a>
          </div>
        </div>
      </main>
      <p class="text-black pl-2">{{ movieDetials.overview }}</p>

      <div class="mt-5">
        <h3 class="font-bold text-base ">Credits:</h3>
        <div class="flex flex-wrap">
          <span v-for="credit in topCredits" :key="credit">{{ credit + ',' }}&nbsp;</span>
        </div>
      </div>
    </section>

    <base-loading v-else></base-loading>
  </section>

</template>
