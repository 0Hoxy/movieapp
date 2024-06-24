/* eslint-disable react/prop-types */
import './MovieList.css';
import Fire from '../../assets/fire.png';
import MovieCard from './MovieCard';
import { useEffect, useState } from 'react';
import _ from 'lodash';

export default function MovieList({ type, title, emoji }) {
  const [movies, setMovies] = useState([]);
  const [filterMovies, setFilterMovies] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState({
    by: 'default',
    order: 'asc',
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${type}?api_key=a8cc9407aad8f7bbcf2fca53b72ceb0a&language=ko`
    );
    const data = await response.json();
    setMovies(data.results);
    setFilterMovies(data.results);
    console.log(data.results);
  };

  const handleFilter = (rate) => {
    setMinRating(rate);

    const filtered = movies.filter((movie) => movie.vote_average >= rate);
    setFilterMovies(filtered);
  };

  const handleSort = (e) => {
    const { name, value } = e.target;
    setSort((prev) => ({ ...prev, [name]: value }));
  };
  console.log(sort);

  useEffect(() => {
    if (sort.by !== 'default') {
      const sortedMovies = _.orderBy(filterMovies, [sort.by], [sort.order]);
      setFilterMovies(sortedMovies);
    }
  }, [sort]);

  return (
    <section className='movie_list' id={`${type}`}>
      <header className='align_center movie_list_header'>
        <h2 className='align_center movie_list_heading'>
          {title} <img src={Fire} alt='fire emoji' className='navbar_emoji' />
        </h2>

        <div className='align_center movie_list_fs'>
          <ul className='align_center movie_filter'>
            {/* 최소 평점이 8과 같을 떄 참이라면 active 거짓일 경우 추가 클래스 없음*/}
            <li className={`movie_filter_item ${minRating === 8 ? 'active' : ''}`} onClick={() => handleFilter(8)}>
              8+ Star
            </li>
            <li className={`movie_filter_item ${minRating === 7 ? 'active' : ''}`} onClick={() => handleFilter(7)}>
              7+ Star
            </li>
            <li className={`movie_filter_item ${minRating === 6 ? 'active' : ''}`} onClick={() => handleFilter(6)}>
              6+ Star
            </li>
          </ul>

          <select name='by' id='' onChange={handleSort} className='movie_sorting'>
            <option value='default'>SortBy</option>
            <option value='release_date'>Date</option>
            <option value='vote_average'>Rating</option>
          </select>
          <select name='order' id='' onChange={handleSort} className='movie_sorting'>
            <option value='asc'>Ascending</option>
            <option value='desc'>Descending</option>
          </select>
        </div>
      </header>

      <div className='movie_cards'>
        {filterMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
