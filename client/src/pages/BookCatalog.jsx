
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function BookCatalog() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sort books by title or author
  const sortedBooks = [...books].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }

    if (sortBy === 'author') {
      return a.author.localeCompare(b.author);
    }

    return 0;
  });

  // Fetch genres when the page loads
  useEffect(() => {
    api.get('/genres')
      .then((response) => {
        setGenres(response.data);
      })
      .catch((error) => {
        console.error(error);
        setError('Unable to load genres.');
      });
  }, []);

  // Wait 400ms after the user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch books whenever the search or genre changes
  useEffect(() => {
    let cancelled = false;

    async function fetchBooks() {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/books', {
          params: {
            search: debouncedSearch || undefined,
            genreId: selectedGenre || undefined,
            page: 1,
            limit: 10,
          },
        });

        if (!cancelled) {
          setBooks(response.data.data);
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setError('Unable to load books. Please try again.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchBooks();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, selectedGenre]);

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
            <label
              htmlFor="search"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Search books
            </label>

            <input
              id="search"
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title or author..."
              className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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

        {loading && (
          <p className="text-slate-600">Loading books...</p>
        )}

        {error && (
          <p className="text-red-600">{error}</p>
        )}

        {!loading && !error && (
          <>
            <p className="mb-6 text-slate-600">
              Showing {sortedBooks.length} books
            </p>

            {sortedBooks.length === 0 ? (
              <p className="text-slate-500">
                No books found. Try another search.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedBooks.map((book) => (
                  <Link
                    to={`/books/${book.id}`}
                    key={book.id}
                    className="block bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition"
                  >
                    <h3 className="text-lg font-bold text-slate-900">
                      {book.title}
                    </h3>

                    <p className="text-slate-500 mt-2">
                      By {book.author}
                    </p>

                    <p className="text-sm text-slate-400 mt-4">
                      Genre: {book.genre?.name || 'Not specified'}
                    </p>

                    <p className="text-sm text-slate-500 mt-2">
                      Published: {book.publicationYear}
                    </p>

                    <p className="text-sm text-slate-500 mt-2">
                      Total copies: {book.totalCopies}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default BookCatalog;
