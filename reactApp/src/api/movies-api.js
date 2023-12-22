export const getMovies = async () => {
    const response = await  fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=49646098df4cff8b6bf7e0407ba8490c&language=en-US&include_adult=false&page=1`
    )
    return response.json()
  };