const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "books.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,

       await db.exec(const createTableQuery =`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      genre TEXT NOT NULL,
      publishedYear INTEGER NOT NULL,
      status TEXT CHECK(status IN ('reading', 'completed', 'planned')) NOT NULL,
      createdAt TEXT DEFAULT (datetime('now', 'utc'))
    )`;

    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

// Get Books API
app.get("/books/", async (request, response) => {
  const getBooksQuery = `SELECT
      *
    FROM
      books
    ORDER BY
      id;`;
  const booksArray = await db.all(getBooksQuery);
  response.send(booksArray);
});

//Get Book API
app.get("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const getBookQuery = `SELECT
      *
    FROM
      books
    WHERE
      id = ${bookId};`;
  const book = await db.get(getBookQuery);
  response.send(book);
});

//Post Book API
app.post("/books/", async (request, response) => {
  const bookDetails = request.body;
  const {
    title,
    author,
    genre,
    publishedYear,
    status,
    createdAt
  } = bookDetails;
  const addBookQuery = `INSERT INTO
      books (title,author, genre, publishedYear, status, createdAt)
    VALUES
      (
        '${title}',
         '${author}',
         '${genre}',
         ${publishedYear},
         '${status}',
         '${createdAt}'
      );`;

  const dbResponse = await db.run(addBookQuery);
  const bookId = dbResponse.lastID;
  response.send({ bookId: bookId });
});

//Put Book API
app.put("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const bookDetails = request.body;
  const {
    title,
    author,
    genre,
    publishedYear,
    status
    createdAt
  } = bookDetails;
  const updateBookQuery = `UPDATE
      books
    SET
      title='${title}',
      author='${author}',
      genre='${genre}',
      publishedYear=${publishedYear},
      status = '${status}',
      createdAt = '${createdAt}'
    WHERE
      id = ${bookId};`;
  await db.run(updateBookQuery);
  response.send("Book Updated Successfully");
});

//Delete Book API
app.delete("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const deleteBookQuery = `DELETE FROM 
      books 
    WHERE
      id = ${bookId};`;
  await db.run(deleteBookQuery);
  response.send("Book Deleted Successfully");
});


