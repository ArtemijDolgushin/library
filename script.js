class Library {
    constructor() {
        this.storageInit();
        this.getBooksFromLocalMemory();
        this.displayFullLibrary();
        const submitBookButton = document.querySelector("#submitBook");
        submitBookButton.addEventListener("click", () => {
            this.processBookInput();
        });

    }

    storageInit() {
        if (!("books" in localStorage)) localStorage.books = "[]";
    }

    processBookInput() {
        const title = document.querySelector("#title");
        const author = document.querySelector("#author");
        const pages = document.querySelector("#pages");
        const read = document.querySelector("#read");

        const someInputsEmpty = !(title.value && author.value && pages.value);
        const bookAlreadyIn = this.books.find((book) => {
            return book.title === (title.value || "Unknown");
        });
        if (someInputsEmpty) return;
        if (bookAlreadyIn) return;

        const book = new Book(title.value, author.value, pages.value, read.checked);
        this.addBookToLibrary(book);
        this.addBookToDisplay(book);
        title.value = '';
        author.value = '';
        pages.value = '';
        read.checked = false;
    }

    addBookToLibrary(book) {
        this.books.push(book);
        this.storeBooksToLocalMemory();
    }

    addBookToDisplay(book) {
        const outputLibrary = document.querySelector(".outputLibrary");
        const bookDisplay = document.createElement("div");
        bookDisplay.id = `${book.title}`;
        bookDisplay.textContent = `${book.title} by ${book.author}. ${book.pages} pages.`;

        const readStatus = document.createElement("div");
        readStatus.id = `${book.title}ReadStatus`;
        readStatus.textContent = `${book.read ? "read" : "not read"}`;
        bookDisplay.appendChild(readStatus);

        const toggleReadButton = document.createElement("button");
        toggleReadButton.id = `${book.title}ToggleRead`;
        toggleReadButton.textContent = "Toggle read status";
        toggleReadButton.addEventListener("click", () => {
            this.toggleBookReadStatus(book.title);
        });
        bookDisplay.appendChild(toggleReadButton);

        const deleteBookButton = document.createElement("button");
        deleteBookButton.id = `${book.title}Delete`;
        deleteBookButton.textContent = "Delete book";
        deleteBookButton.addEventListener("click", () => {
            this.deleteBook(book.title);
        });
        bookDisplay.appendChild(deleteBookButton);

        outputLibrary.appendChild(bookDisplay);
    }

    deleteBook(titleOfBookToDelete) {
        const books = this.books;
        const indexOfBookToDelete = books.findIndex((book) => {
            return book.title === titleOfBookToDelete;
        });
        const outputLibrary = document.querySelector(".outputLibrary");
        const bookToDelete = document.querySelector(`#${titleOfBookToDelete}`);
        outputLibrary.removeChild(bookToDelete);
        books.splice(indexOfBookToDelete, 1);
        this.books = books;
        this.storeBooksToLocalMemory();
    }

    toggleBookReadStatus(titleOfBookToToggleReadStatus) {
        const books = this.books;
        const indexOfBookToToggleReadStatus = books.findIndex((book) => {
            return book.title === titleOfBookToToggleReadStatus;
        });
        const readStatusOfBook = document.querySelector(`#${titleOfBookToToggleReadStatus}ReadStatus`);
        readStatusOfBook.textContent = readStatusOfBook.textContent === "read" ? "not read" : "read";
        books[indexOfBookToToggleReadStatus].toggleRead();
        this.books = books;
        this.storeBooksToLocalMemory();
    }

    storeBooksToLocalMemory() {
        localStorage.setItem("books", JSON.stringify(this.books));
    }

    getBooksFromLocalMemory() {
        const booksString = localStorage.books
        const booksWithNoMetadata = JSON.parse(booksString)
        this.books = booksWithNoMetadata.map((book) => {
            return new Book(book.title, book.author, book.pages, book.read)
        });
    }

    displayFullLibrary() {
        this.books.forEach(book => this.addBookToDisplay(book));
    }
}

class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }

    toggleRead() {
        this.read = !this.read;
    }
}

new Library();

