
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BookCatalog from './pages/BookCatalog';
import BookDetail from './pages/BookDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookCatalog />} />
        <Route path="/books/:id" element={<BookDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
