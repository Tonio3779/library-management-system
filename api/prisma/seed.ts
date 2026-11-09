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
    publicationYear: 1958,
    genre: 'Fiction',
  },
  {
    title: 'Half of a Yellow Sun',
    author: 'Chimamanda Ngozi Adichie',
    publicationYear: 2006,
    genre: 'Fiction',
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    publicationYear: 1925,
    genre: 'Fiction',
  },
  {
    title: 'Purple Hibiscus',
    author: 'Chimamanda Ngozi Adichie',
    publicationYear: 2003,
    genre: 'Fiction',
  },

  // Science
  {
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    publicationYear: 1988,
    genre: 'Science',
  },
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    publicationYear: 1976,
    genre: 'Science',
  },
  {
    title: 'Cosmos',
    author: 'Carl Sagan',
    publicationYear: 1980,
    genre: 'Science',
  },
  {
    title: 'The Gene',
    author: 'Siddhartha Mukherjee',
    publicationYear: 2016,
    genre: 'Science',
  },

  // History
  {
    title: 'The Art of War',
    author: 'Sun Tzu',
    publicationYear: -500,
    genre: 'History',
  },
  {
    title: 'Long Walk to Freedom',
    author: 'Nelson Mandela',
    publicationYear: 1994,
    genre: 'History',
  },
  {
    title: 'The Diary of a Young Girl',
    author: 'Anne Frank',
    publicationYear: 1947,
    genre: 'History',
  },
  {
    title: 'Things Hidden Since the Foundation of the World',
    author: 'René Girard',
    publicationYear: 1978,
    genre: 'History',
  },

  // Technology
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    publicationYear: 2008,
    genre: 'Technology',
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt and David Thomas',
    publicationYear: 1999,
    genre: 'Technology',
  },
  {
    title: 'Code',
    author: 'Charles Petzold',
    publicationYear: 1999,
    genre: 'Technology',
  },
  {
    title: 'The Innovators',
    author: 'Walter Isaacson',
    publicationYear: 2014,
    genre: 'Technology',
  },
];
async function main() {
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

await prisma.book.createMany({
  data: booksToCreate,
});
  console.log('Successfully seeded 4 genres and 16 books!');
main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });