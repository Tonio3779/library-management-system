
import { useEffect, useState } from 'react';
import api from '../api/axios';
import SearchBar from '../components/SearchBar';
import BookGrid from '../components/BookGrid';

function HomePage() {
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('');

  // Fetch genres when the page loads
  useEffect(() => {
    api.get('/genres')
      .then((response) => {
        setGenres(response.data);
      })
      .catch((error) => {
        console.error('Unable to load genres:', error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white px-8 py-6">
        <h1 className="text-3xl font-bold">
          Library Management System
        </h1>

        <p className="mt-2 text-slate-300">
          Discover your next favourite book.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Our Book Collection
          </h2>

          <p className="text-slate-500 mt-2">
            Explore books available in our library.
          </p>
        </div>

        {/* Search, genre filter and sorting */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar onSearch={setSearch} />
          </div>

          <div>
            <label
              htmlFor="genre"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Filter by genre
            </label>

            <select
              id="genre"
              value={selectedGenre}
              onChange={(event) => setSelectedGenre(event.target.value)}
              className="w-full sm:w-64 border border-slate-300 rounded-lg px-4 py-3 bg-white"
            >
              <option value="">All genres</option>

              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="sort"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Sort books
            </label>

            <select
              id="sort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="w-full sm:w-64 border border-slate-300 rounded-lg px-4 py-3 bg-white"
            >
              <option value="">Default order</option>
              <option value="title">Sort by title</option>
              <option value="author">Sort by author</option>
            </select>
          </div>
        </div>

        <BookGrid
          search={search}
          genreId={selectedGenre}
          sortBy={sortBy}
        />
      </main>
    </div>
  );
}

export default HomePage;
