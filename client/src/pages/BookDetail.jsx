
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

function BookDetail() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/books/${id}`)
      .then((response) => {
        setBook(response.data);
      })
      .catch((error) => {
        console.error(error);
        setError('Unable to find this book.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading book details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-10 text-center">
        <p className="text-red-600">{error}</p>
        <Link to="/" className="text-blue-600 underline mt-4 inline-block">
          Back to catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white px-8 py-6">
        <h1 className="text-3xl font-bold">
          Library Management System
        </h1>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <Link
          to="/"
          className="text-blue-600 hover:underline"
        >
          ← Back to catalog
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mt-8">
          <h2 className="text-3xl font-bold text-slate-900">
            {book.title}
          </h2>

          <p className="text-lg text-slate-500 mt-3">
            By {book.author}
          </p>

          <div className="mt-8 space-y-4">
            <p>
              <strong>Genre:</strong> {book.genre?.name || 'Not specified'}
            </p>

            <p>
              <strong>ISBN:</strong> {book.isbn}
            </p>

            <p>
              <strong>Publication Year:</strong> {book.publicationYear}
            </p>

            <p>
              <strong>Total Copies:</strong> {book.totalCopies}
            </p>

            <p>
              <strong>Availability:</strong>{' '}
              {book.isAvailable ? 'Available' : 'Not available'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BookDetail;
