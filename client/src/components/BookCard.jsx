
import { Link } from 'react-router-dom';

function BookCard({ book }) {
  return (
    <Link
      to={`/books/${book.id}`}
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

      <p className="text-sm font-medium mt-3">
        {book.isAvailable ? (
          <span className="text-green-600">Available</span>
        ) : (
          <span className="text-red-600">Not available</span>
        )}
      </p>
    </Link>
  );
}

export default BookCard;
