import { useEffect, useState } from "react"
import Search from "./components/Search"
import Spinner from "./components/Spinner"
import MovieCard from "./components/MovieCard"

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  var [searchTerm, setSearchTerm] = useState("");
  var [errorMessage, setErrorMessage] = useState();
  var [movieList, setMovieList] = useState([]);
  var [trendingMovies, setTrendingMovies] = useState([]);
  var [isLoading, setIsLoading] = useState(false);

   const fetchMovies = async (query = '', retrieveTrendingMovies) => {
    setIsLoading(true);
    try{
      let endpoint = '';
      if (retrieveTrendingMovies) {
        endpoint =`${API_BASE_URL}/trending/movie/day?language=en-US`;
      } else {
        if (query) {
          endpoint = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        } else {
          endpoint = `${API_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;
        }
      }
      const response = await fetch(endpoint, API_OPTIONS);
      if(!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      if(data.Response == 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies.');
      }
      if (retrieveTrendingMovies) {
        setTrendingMovies(data.results);
      } else {
        setMovieList(data.results);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`)
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
   }

  useEffect(() => {
    if (searchTerm) {
      const delayedDenounce = setTimeout(()=> {
        fetchMovies(searchTerm);
      }, 800)
      return () => clearTimeout(delayedDenounce);
    } else {
      fetchMovies();
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchMovies("", true);
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="Hero Banner"/>
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>

        </header>
        <section className="trending">
          <h2 className="mt-[40px]">Trending</h2>
          {isLoading ? 
          <Spinner/> : 
          <ul>
            {trendingMovies.map((movie, index) => (
              <li key={movie.id}>
                <p>{index+1}</p>
                <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : './No-Poster.png'} alt={movie.title}></img>
              </li>
            ))}
          </ul>
        }
        </section>

        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>

          {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </section>
      </div>
    </main>
  )
}

export default App
