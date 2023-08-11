// Logic Top 3 Books
const vinci = document.getElementById('vinci');
const potter = document.getElementById('potter');
const hobbit = document.getElementById('hobbit');

vinci.addEventListener('click', function(){
    window.open('https://play.google.com/store/books/details/Dan_Brown_The_Da_Vinci_Code?id=ohZ1wcYifLsC');
});

potter.addEventListener('click', function(){
    window.open('https://play.google.com/store/books/details/John_Williams_Harry_Potter_and_the_Sorcerer_s_Ston?id=q0nABgAAQBAJ');
});

hobbit.addEventListener('click', function(){
    window.open('https://play.google.com/store/books/details/J_R_R_Tolkien_The_Hobbit_Illustrated_by_Alan_Lee?id=Lry4SK8RmQgC');
});

// ----------------------------------------------- //


// Logic Pop Up untuk Insert Books
const insert_modal = document.querySelector('.insert-modal')
const insert_button = document.querySelector('.insert-button');
const cancel_button = document.querySelector('.form-buttons .cancel-btn');
const overlay = document.getElementById('overlay');
const buku_buku = document.querySelector('#books');

insert_button.addEventListener('click', function(){

    buku_buku.scrollIntoView({
        behavior: 'smooth'
    });

    insert_modal.classList.toggle('active');
    overlay.classList.toggle('active');
});

overlay.addEventListener('click', function(){
    overlay.classList.toggle('active');
    insert_modal.classList.toggle('active');
});

cancel_button.addEventListener('click', function(){
    overlay.classList.toggle('active');
    insert_modal.classList.toggle('active');
});
// --------------------------------------------- //



// Logic Pop Up untuk Delete
const delete_modal = document.getElementById('delete-modal');
const overlay_2 = document.getElementById('overlay-2');
const hapus_button = document.querySelector(".buttons .delete-btn");
const batal_button = document.querySelector(".buttons .cancel-btn");

batal_button.addEventListener('click', function(){
    overlay_2.classList.toggle('active');
    delete_modal.classList.toggle('active');
});

overlay_2.addEventListener('click', function(){
    overlay_2.classList.toggle('active');
    delete_modal.classList.toggle('active');
});
// --------------------------------------------- //




// Logic untuk proses book shelf online
const books = [];
let is_searching = false;
let searched_book = '';

const RENDER_EVENT = 'render-books';
const SAVED_EVENT = 'saved-books';
const STORAGE_KEY = 'BOOKS_APPS';

function isStorageExist(){
    if (typeof (Storage) === undefined){
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }

    return true;
};

function saveData(){
    if (isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    };
};

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const todo of data) {
        books.push(todo);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(STORAGE_KEY));
});

function generateId(){
    return +new Date();
};

function generateBookObject(id, judul, nama_penulis ,timestamp, isFinished, book_img){
    return {
        id,
        judul,
        nama_penulis,
        timestamp,
        isFinished,
        book_img
    };
};

function wordToLetters(bookTitle){
    let title_letters = [];

    for (let title of bookTitle){
        title_letters.push(title);
    }

    return title_letters;
};

function findBook(bookId){
    for (const bookItem of books){
        if (bookItem.id === bookId){
            return bookItem;
        };
    };

    return null;
};

function findBookIndex(bookId){
    for (const index in books){
        if (books[index].id === bookId){
            return index;
        };
    };

    return -1;
};

function addBookToCompleted(bookId){
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isFinished = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function removeBookFromShelf(bookId){
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget,1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    delete_modal.classList.toggle('active');
    overlay_2.classList.toggle('active');
};

function undoBookFromFinished(bookId){
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isFinished = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function generateImg (judul){
    judul = judul.toLowerCase();

    if (judul == 'harry potter'){
        return "Assets/potter.jpg";
    } else if (judul == 'the hobbit'){
        return "Assets/hobbit.jpg";
    } else if (judul == 'the da vinci code'){
        return "Assets/vinci.jpg";
    } else {
        numb = Math.floor(Math.random() * 6) + 1;
        img_src = "Assets/"+ numb + ".png";
        return img_src;
    };
};

function makeBook (bookObject){
    // Slot component
    const slot = document.createElement('div');
    slot.classList.add('slot');
    slot.setAttribute('id', `SBN-${bookObject.id}`)

    // Image component
    const image = document.createElement('div');
    image.classList.add('image');

    const book_img = document.createElement('img');
    book_img.src = bookObject.book_img;

    image.append(book_img);

    // Data buku component
    const data_buku = document.createElement('div');
    data_buku.classList.add('data-buku');

    const textJudul = document.createElement('h3');
    textJudul.innerText = bookObject.judul

    const textNama = document.createElement('p');
    textNama.innerText = bookObject.nama_penulis;

    const textTimeStamp = document.createElement('p');
    textTimeStamp.innerText = bookObject.timestamp;

    data_buku.append(textJudul,textNama,textTimeStamp);

    // Proses Append button Finished Books
    if (bookObject.isFinished){

        // Unfinished Button component
        const unfinishedButton = document.createElement('button');
        unfinishedButton.innerText = "Unfinished";
        unfinishedButton.setAttribute('id','not-done');

        unfinishedButton.addEventListener('click',function(){
            undoBookFromFinished(bookObject.id);
        });

        // Delete Button Component
        const deleteButton = document.createElement('button');

        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('id','delete');

        deleteButton.addEventListener('click', function(){
            delete_modal.classList.toggle('active');
            overlay_2.classList.toggle('active');

            hapus_button.addEventListener('click', function(){
                removeBookFromShelf(bookObject.id);
            });

        });

        data_buku.append(deleteButton, unfinishedButton);



     // Proses Append button Unfinished Books    
    } else {

        // Delete Button Component
        const deleteButton = document.createElement('button');

        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('id','delete');

        deleteButton.addEventListener('click', function(){
            delete_modal.classList.toggle('active');
            overlay_2.classList.toggle('active');

            hapus_button.addEventListener('click', function(){
                removeBookFromShelf(bookObject.id);
            });

        });

        // Finished BUtton Component
        const finishedButton = document.createElement('button');
        finishedButton.innerText = 'Finished';
        finishedButton.setAttribute('id','done');

        finishedButton.addEventListener('click', function(){
            addBookToCompleted(bookObject.id);
        });

        data_buku.append(deleteButton,finishedButton);
    };

    // Proses Append Slot
    slot.append(image,data_buku)

    return slot;
    
};

document.addEventListener(RENDER_EVENT, function () {
    const unfinishedBooks = document.querySelector('section.belum-selesai .books-container');
    unfinishedBooks.innerHTML = '';
    
    const finishedBooks = document.querySelector('section.selesai .books-finished-container');
    finishedBooks.innerHTML = '';

    if (is_searching === false){
        const not_found_msg = document.querySelector('.search-bar h3');
        not_found_msg.style.transform = "scale(0)";

        for (const bookItem of books){
            const bookElement = makeBook(bookItem);
    
            if (!bookItem.isFinished){
                unfinishedBooks.append(bookElement);
            
            } else {
                finishedBooks.append(bookElement);
            };
            
        };

    } else if (is_searching === true){
        const not_found_msg = document.querySelector('.search-bar h3');

        for (const bookItem of books){
            const bookElement = makeBook(bookItem);
            let judul_value = String(bookItem.judul);
            let penulis_value = String(bookItem.nama_penulis);

            searched_book = searched_book.toLowerCase();
            judul_value = judul_value.toLowerCase();
            penulis_value = penulis_value.toLowerCase();

            if (judul_value.includes(searched_book) || penulis_value.includes(searched_book)){
                if (!bookItem.isFinished) {
                    unfinishedBooks.append(bookElement);
                
                } else {
                    finishedBooks.append(bookElement);
                };
            }
            
        };

        if ((!unfinishedBooks.hasChildNodes()) && (!finishedBooks.hasChildNodes())){
            not_found_msg.style.transform = "scale(1)";
        } else {
            not_found_msg.style.transform = "scale(0)";
        };
    };

});

function addBook(){
    const judulBuku = document.getElementById('judul-buku').value;
    const nama_penulis = document.getElementById('nama-penulis').value;
    const timestamp = document.getElementById('tahun-terbit').value;
    
    const generateID = generateId();
    const img_src = generateImg(String(judulBuku));
    console.log(judulBuku);
    const bookObject = generateBookObject(generateID, judulBuku, nama_penulis, timestamp, false, img_src);

    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('form');
    const searchBook = document.getElementById('search-bar');

    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
    });

    searchBook.addEventListener('keypress', function(event){

        if (event.key === "Enter"){
            if(searchBook.value == '' || searchBook.value == ' ' || searchBook.value == '  '){
                is_searching = false;
                searched_book = '';
                document.dispatchEvent(new Event(RENDER_EVENT));
    
            } else {
                is_searching = true;
                searched_book = searchBook.value;
                document.dispatchEvent(new Event(RENDER_EVENT));
            };
        };

    });

    if (isStorageExist()){
        loadDataFromStorage();
    };
});