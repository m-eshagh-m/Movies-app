import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import router from '../router/index.js'

export const useMovieStore = defineStore('movies', () => {
  /* basic variables - properties - methods */
  const isLoading = ref(false)
  const pageNumber = ref(1);

  // load new data with new url
  async function loadData(url) {
    const response = await fetch(url);
    // erro handling
    if (!response.ok) {
      const error = new Error(responseData.message);
      throw error;
    }
    const responseData = await response.json();
    return responseData
  }

  // iso date format
  function dateFormat(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
      dt = '0' + dt;
    }
    if (month < 10) {
      month = '0' + month;
    }

    return year + '-' + month + '-' + dt;
  }

  /* movies */
  const latestMovies = ref([])
  const genresMovies = ref([])
  const totalPages = ref(0)
  const totalResults = ref(0)

  // load popular movies list
  async function loadPopularMovies() {
    isLoading.value = true;

    const url = `https://api.themoviedb.org/3/discover/movie?api_key=770089a80c892ae109b4249e88285eaa&sort_by=popularity.desc&page=${pageNumber.value}`

    const responseData = await loadData(url)
    const responseDataResults = responseData.results;

    // set totral page and reuslt based on new response
    totalPages.value = responseData.total_pages
    totalResults.value = responseData.total_results

    if (genresMovies.value.length === 0) {
      await loadGenres();
    }

    const movies = [];
    for (const key in responseDataResults) {
      const movie = {
        id: responseDataResults[key].id,
        title: responseDataResults[key].title,
        posterPath: responseDataResults[key].poster_path,
        genres: computed(() => {
          const genres = []
          const genresIds = responseDataResults[key].genre_ids

          for (const index in genresIds) {
            const genre = genresMovies.value.find(gen => gen.id === genresIds[index]);
            genres.push(genre.name);
          }

          return genres
        }),
        releaseDate: responseDataResults[key].release_date
      };
      movies.push(movie);
    }

    latestMovies.value = movies
    isLoading.value = false;
  }

  // load movies limited by release date
  async function loadMovieByReleaseDate(date) {
    isLoading.value = true;

    // set start and end date format to iso
    const startDate = ref('')
    const endDate = ref('')
    if (date.value !== null && date.value) {
      if (date.value[0] !== null) {
        startDate.value = dateFormat(date.value[0])
      }
      if (date.value[1] !== null) {
        endDate.value = dateFormat(date.value[1])
      }
    }
    else {
      console.log('start release-date and end release-date are both null!!');
      isLoading.value = false;
      return
    }

    // make the url based on date received
    const baseUrl = `https://api.themoviedb.org/3/discover/movie?api_key=770089a80c892ae109b4249e88285eaa&page=${pageNumber.value}&primary_release_date.`

    const url = ref('')
    if (startDate.value && endDate.value) {
      url.value = `${baseUrl}gte=${startDate.value}&primary_release_date.lte=${endDate.value}`
    }
    else if (startDate.value && !endDate.value) {
      url.value = `${baseUrl}gte=${startDate.value}`
    }
    else if (!startDate.value && endDate.value) {
      url.value = `${baseUrl}lte=${endDate.value}`
    }

    router.push({ query: { mode: 'search' } })

    const responseData = await loadData(url.value)
    const responseDataResults = responseData.results;

    // set totral page and reuslt based on new response
    totalPages.value = responseData.total_pages
    totalResults.value = responseData.total_results

    if (genresMovies.value.length === 0) {
      await loadGenres();
    }

    const movies = [];
    for (const key in responseDataResults) {
      const movie = {
        id: responseDataResults[key].id,
        title: responseDataResults[key].title,
        posterPath: responseDataResults[key].poster_path,
        genres: computed(() => {
          const genres = []
          const genresIds = responseDataResults[key].genre_ids
          for (const index in genresIds) {
            const genre = genresMovies.value.find(gen => gen.id === genresIds[index]);
            genres.push(genre.name);
          }

          return genres
        }),
        releaseDate: responseDataResults[key].release_date
      };
      movies.push(movie);
    }

    latestMovies.value = movies
    isLoading.value = false;
  }

  // load all genres of movies
  async function loadGenres() {
    const url = 'https://api.themoviedb.org/3/genre/movie/list?api_key=770089a80c892ae109b4249e88285eaa'
    const responseData = await loadData(url)
    genresMovies.value = responseData.genres;
  }

  // load new movies because of chaning of page number (prev or next)
  async function loadNewMovies(newPage, mode, date) {
    pageNumber.value = newPage.value
    mode ? loadMovieByReleaseDate(date) : loadPopularMovies();
  }

  /* exposing all we needs in components */
  return {
    loadPopularMovies,
    loadNewMovies,
    loadMovieByReleaseDate,
    latestMovies,
    pageNumber,
    totalPages,
    totalResults,
    isLoading,
  }
})
