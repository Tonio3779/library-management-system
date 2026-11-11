
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const genres = [
  { name: 'Fiction' },
  { name: 'Science' },
  { name: 'History' },
  { name: 'Technology' },
];

const books = [
  // Fiction
  {
    title: 'Things Fall Apart',
    author: 'Chinua Achebe',
    isbn: 'SEED-BOOK-001',
    publicationYear: 1958,
    genre: 'Fiction',
  },
  {
    title: 'Half of a Yellow Sun',
    author: 'Chimamanda Ngozi Adichie',
    isbn: 'SEED-BOOK-002',
    publicationYear: 2006,
    genre: 'Fiction',
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: 'SEED-BOOK-003',
    publicationYear: 1925,
    genre: 'Fiction',
  },
  {
    title: 'Purple Hibiscus',
    author: 'Chimamanda Ngozi Adichie',
    isbn: 'SEED-BOOK-004',
    publicationYear: 2003,
    genre: 'Fiction',
  },

  // Science
  {
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    isbn: 'SEED-BOOK-005',
    publicationYear: 1988,
    genre: 'Science',
  },
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    isbn: 'SEED-BOOK-006',
    publicationYear: 1976,
    genre: 'Science',
  },
  {
    title: 'Cosmos',
    author: 'Carl Sagan',
    isbn: 'SEED-BOOK-007',
    publicationYear: 1980,
    genre: 'Science',
  },
  {
    title: 'The Gene',
    author: 'Siddhartha Mukherjee',
    isbn: 'SEED-BOOK-008',
    publicationYear: 2016,
    genre: 'Science',
  },

  // History
  {
    title: 'The Art of War',
    author: 'Sun Tzu',
    isbn: 'SEED-BOOK-009',
    publicationYear: -500,
    genre: 'History',
  },
  {
    title: 'Long Walk to Freedom',
    author: 'Nelson Mandela',
    isbn: 'SEED-BOOK-010',
    publicationYear: 1994,
    genre: 'History',
  },
  {
    title: 'The Diary of a Young Girl',
    author: 'Anne Frank',
    isbn: 'SEED-BOOK-011',
    publicationYear: 1947,
    genre: 'History',
  },
  {
    title: 'Things Hidden Since the Foundation of the World',
    author: 'René Girard',
    isbn: 'SEED-BOOK-012',
    publicationYear: 1978,
    genre: 'History',
  },

  // Technology
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: 'SEED-BOOK-013',
    publicationYear: 2008,
    genre: 'Technology',
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt and David Thomas',
    isbn: 'SEED-BOOK-014',
    publicationYear: 1999,
    genre: 'Technology',
  },
  {
    title: 'Code',
    author: 'Charles Petzold',
    isbn: 'SEED-BOOK-015',
    publicationYear: 1999,
    genre: 'Technology',
  },
  {
    title: 'The Innovators',
    author: 'Walter Isaacson',
    isbn: 'SEED-BOOK-016',
    publicationYear: 2014,
    genre: 'Technology',
  },
];

async function main() {
  const librarianPassword = process.env.LIBRARIAN_PASSWORD;

  if (!librarianPassword) {
    throw new Error('LIBRARIAN_PASSWORD is missing from .env');
  }

  const hashedPassword = await bcrypt.hash(librarianPassword, 12);

  await prisma.user.upsert({
    where: { email: 'librarian@library.com' },
    update: {
      name: 'Library Administrator',
      role: 'LIBRARIAN',
      password: hashedPassword,
    },
    create: {
      name: 'Library Administrator',
      email: 'librarian@library.com',
      role: 'LIBRARIAN',
      password: hashedPassword,
    },
  });

  await prisma.genre.createMany({
    data: genres,
    skipDuplicates: true,
  });

  const genreRecords = await prisma.genre.findMany();

  const booksToCreate = books.map(({ genre, ...book }) => {
    const matchingGenre = genreRecords.find(
      (item) => item.name === genre,
    );

    if (!matchingGenre) {
      throw new Error(`Genre not found: ${genre}`);
    }

    return {
      ...book,
      genreId: matchingGenre.id,
    };
  });

  const existingBooks = await prisma.book.findMany({
    select: {
      title: true,
      author: true,
    },
  });

  const newBooks = booksToCreate.filter(
    (book) =>
      !existingBooks.some(
        (existing) =>
          existing.title === book.title &&
          existing.author === book.author,
      ),
  );

  if (newBooks.length > 0) {
    await prisma.book.createMany({
      data: newBooks,
    });
  }

  console.log(
    'Librarian account and book records processed successfully!',
  );
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
