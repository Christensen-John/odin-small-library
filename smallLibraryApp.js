const myLibrary = [];
const newBookButton = document.getElementById("newBookButton");
const newBookForm = document.getElementById("newBookForm");

//	**BOOK CLASS**	//
//CONSTRUCTOR//
function Book(title, authFirst, authInit, authLast, length, read) {
	this.title = title;
	this.authorFirstName = authFirst;
	this.authorInitial = authInit;
	this.authorLastName = authLast;
	this.length = length;
	this.read = read ? read : false;
}

//ACCESSORS//
Book.prototype.getTitle = function () {
	return this.title;
};

Book.prototype.getAuthor = function () {
	return `${this.authorFirstName} ${this.authorInitial} ${this.authorLastName}`;
};

Book.prototype.getLength = function () {
	return this.length;
};

Book.prototype.getReadStatus = function () {
	return this.read;
};

//MUTATORS//
Book.prototype.setTitle = function (newTitle) {
	this.title = newTitle;
};

Book.prototype.setAuthor = function (newAuthFirst, newAuthInit, newAuthLast) {
	this.authorFirstName = newAuthFirst;
	this.authorInitial = newAuthInit;
	this.authorLastName = newAuthLast;
};

Book.prototype.setLength = function (newLength) {
	this.length = newLength;
};

Book.prototype.setReadStatus = function (newReadStatus) {
	this.read = newReadStatus;
};

//	**LIBRARY APP FUNCTIONS**	//
/**
 *
 * @param {String} title The title of the book
 * @param {String} authFirstName The first name of the author
 * @param {String} authMiddleInit The middle names or initials of the author, if necessary
 * @param {String} authLastName The last name of the author
 * @param {int} length The length or number of pages of the book
 * @param {boolean} read The status of whether the book has been read or not
 */
function addBookToLibrary(
	title,
	authFirstName,
	authMiddleInit,
	authLastName,
	length,
	read
) {
	//Look for the book title in the library
	let bookExists = myLibrary.find((book) => {
		if (book.title === title && book.authorFirstName === authFirstName)
			return true;
		return false;
	});
	if (bookExists) {
		//Let user know that the book already exists in the library
		alert("Book has already been added to the libary");
	} else {
		//Add the book to the library
		myLibrary.push(
			new Book(title, authFirstName, authMiddleInit, authLastName, length, read)
		);
		//Let the user know that the book was added successfully
		let authName = authFirstName;
		if (authMiddleInit) authName += ` ${authMiddleInit}`;
		if (authLastName) authName += ` ${authLastName}`;
		alert(`${title} by ${authName} successfully added to your Library!`);
	}
}

/**
 *
 * @param {String} fullAuthorName The full name of the author
 * @returns An array where the first name is index 0, last name is index -1, and any middle names or initials are in between
 */
function splitName(fullAuthorName) {
	let splitNames = fullAuthorName.split(" ");
	return splitNames;
}

/**
 *
 * @param {int} numBooks The number of test books to create
 */
function createFillerBooks(numBooks) {
	for (let i = 0; i < numBooks; i++) {
		addBookToLibrary(
			`BookTitle${i}`,
			`AuthorFirst${i}`,
			`${i}`,
			`AuthorLast${i}`,
			Math.floor(Math.random() * 1000) + 100,
			Math.round(Math.random())
		);
	}
}

/**
 *
 * @param {Array} nameArray An array of Strings representing the different parts of an authors name.
 * @returns A string representing all middle parts of the authors name, excludes the first and last name
 */
function getRemainingName(nameArray) {
	let remainingName = ``;
	for (let i = 1; i < nameArray.length - 1; i++) {
		remainingName += `${nameArray[i]} `;
	}
	return remainingName.trim();
}

function updateLibaryView() {
	//Get the container object
	let bookListContainer = document.getElementById("bookListContainer");
	//Clear the previous view
	bookListContainer.innerHTML = ``;
	//Loop through all the books and add them to the view
	myLibrary.forEach((book) => {
		let bookCard = createBookCard(book);
		bookListContainer.appendChild(bookCard);
	});
}

function createBookCard(book) {
	let newBookElement = document.createElement("li");
	newBookElement.classList.add("cardContainer");
	newBookElement.innerHTML = `
		<div class="bookCard" id="${book.title}">
			<div class="cardMenu">
				<button onClick="removeCard(event)" class="removeBookButton" id="${
					book.title
				}">-</button>
			</div>
			<div class="cardContent">
				<h2 class="bookTitle">${book.title}</h2>
				<div class="bookcard-name">
				${book.authorFirstName} ${book.authorInitial} ${book.authorLastName}
				</div>
				<p class="length">${book.length} pages</p>
				<div class="hasReadContainer">${book.read ? `Read!` : `Unread!`}</div>
			</div>
		</div>
`;
	return newBookElement;
}

function addBookToView(title, fn, mI, ln, len, read) {
	let book = new Book(title, fn, mI, ln, len, read);
	let bookListContainer = document.getElementById("bookListContainer");
	bookListContainer.appendChild(createBookCard(book));
}

//	**LISTENERS AND INPUT HANDLING**	//
// newBookButton.addEventListener("click", (event) => {
// 	//Prevent the form from trying to submit to a server
// 	event.preventDefault();
// });

//NOTE: Could also try to use a FormData object: https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_forms_through_JavaScript
newBookForm.addEventListener("submit", (event) => {
	//Prevents the page from trying to send data to a server and reloading the page.
	event.preventDefault();

	//Get form inputs
	let newBookTitle = event.target[0].value.trim();
	let newBookAuthor_full = splitName(event.target[1].value);
	let newBookLength = event.target[2].value;
	let newBookReadStatus = event.target[3].checked;

	//Parse name data
	let newBookAuthor_first = "";
	let newBookAuthor_middle = "";
	let newBookAuthor_last = "";
	switch (newBookAuthor_full.length) {
		case 1:
			newBookAuthor_first = newBookAuthor_full[0];
			break;
		case 2:
			newBookAuthor_first = newBookAuthor_full[0];
			newBookAuthor_last = newBookAuthor_full[1];
			break;
		case 3:
			newBookAuthor_first = newBookAuthor_full[0];
			newBookAuthor_middle = newBookAuthor_full[1];
			newBookAuthor_last = newBookAuthor_full[2];
			break;
		default:
			newBookAuthor_first = newBookAuthor_full[0];
			newBookAuthor_last = newBookAuthor_full[newBookAuthor_full.length - 1];
			newBookAuthor_middle = getRemainingName(newBookAuthor_full);
			break;
	}
	addBookToLibrary(
		newBookTitle,
		newBookAuthor_first,
		newBookAuthor_middle,
		newBookAuthor_last,
		newBookLength,
		newBookReadStatus
	);
	newBookForm.reset();

	updateLibaryView();
});

function removeCard(event) {
	//Get the title of the book we want to remove
	let title = event.srcElement.id;
	event.stopPropagation();

	//Remove the book from the Array object
	removeBook(title);

	//Re-display the remaining cards
	updateLibaryView();
}

function removeBook(title) {
	let removedBookIndex = myLibrary.findIndex((book) => {
		return book.title === title;
	});
	myLibrary.splice(removedBookIndex, 1);
}

// ** LIBRARY SORTING FUNCTIONS ** //
//TODO: ADD LIBRARY SORTING FUNCTIONS
// function alert() {}
