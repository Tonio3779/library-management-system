
import { useEffect, useState } from 'react';
import api from '../api/axios';
import BookCard from './BookCard';

function BookGrid({ search, genreId, sortBy }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch books whenever search or genre changes
  useEffect(() => {
    let cancelled = false;

    async function fetchBooks() {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/books', {
          params: {
            search: search || undefined,
            genreId: genreId || undefined,
            page: 1,
            limit: 10,
          },
        });

        if (!cancelled) {
          setBooks(response.data.data);
        }
      } catch (error) {
        console.error('Unable to fetch books:', error);

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
  }, [search, genreId]);

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

  // Skeleton loading state
  if (loading) {
    return (
      <div>
        <p className="mb-6 text-slate-600">
          Loading books...
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-pulse"
            >
              <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>

              <div className="h-4 bg-slate-200 rounded w-1/2 mb-6"></div>

              <div className="h-3 bg-slate-200 rounded w-2/3 mb-3"></div>

              <div className="h-3 bg-slate-200 rounded w-1/2 mb-3"></div>

              <div className="h-3 bg-slate-200 rounded w-1/3 mb-5"></div>

              <div className="h-5 bg-slate-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <p className="text-red-600">
        {error}
      </p>
    );
  }

  // Empty state
  if (sortedBooks.length === 0) {
    return (
      <p className="text-slate-500">
        No books found. Try another search.
      </p>
    );
  }

  return (
    <section>
      <p className="mb-6 text-slate-600">
        Showing {sortedBooks.length} books
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
          />
        ))}
      </div>
    </section>
  );
}

export default BookGrid;
