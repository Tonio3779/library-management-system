
import { useEffect, useState } from 'react';

function SearchBar({ onSearch }) {
  const [search, setSearch] = useState('');

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(search);
    }, 400);

    // Clear the previous timer when the user types again
    return () => clearTimeout(timer);
  }, [search, onSearch]);

  return (
    <div>
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
  );
}

export default SearchBar;
