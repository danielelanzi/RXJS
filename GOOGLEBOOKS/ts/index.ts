declare const rxjs: any;

interface GoogleBook {
    totalItems: number
    kind: string
    items: []
}

interface BookThumbnail {
    smallThumbnail: string 
    thumbnail: string
}

interface VolumeInfo {
    authors: []
    description: string
    imageLinks: BookThumbnail
    infoLink: string
    language: string
    previewLink: string
    title: string
    categories: []
}

interface Book {
    title: string
    description: string
    authors: []
    categories: []
    thumbnail: string
}

interface BookItem {
    volumeInfo: VolumeInfo
    id: string
}

function getBooks(booktitle:string): void {
    const {from} = rxjs;
    const {map, switchMap, tap} = rxjs.operators;
    let apiurl = 'https://www.googleapis.com/books/v1/volumes?q=';

    const p = fetch(apiurl + booktitle).then(res => res.json());
        // .then(books => console.log(books))
    return from(p)
    .pipe(
        tap((data: GoogleBook) => showTotal(data.items.length)),
        switchMap((data: GoogleBook) => from(data.items || [])),
        map((ele: BookItem) => {
            const book:Book = {
                title : ele.volumeInfo.title,
                categories : ele.volumeInfo.categories,
                authors : ele.volumeInfo.authors,
                description : ele.volumeInfo.description,
                thumbnail : ele.volumeInfo.imageLinks.thumbnail 
            };
            return book;
            }
        ),
        // tap((book: Book) => console.log(book)),
    )
}
function displayBook(book:Book): void {
    const bookTpl = `
    <div class="card mb-4 shadow-sm">
      <img src="${book.thumbnail}" title="${book.title}" alt="${book.title}">
      <div class="card-body">
      <h5>${book.title}</h4>
        <p class="card-text"></p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="btn-group">
            <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
            <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
          </div>
          <small class="text-muted">9 mins</small>
        </div>
      </div>
    </div>`;
  const div = document.createElement('div');
  div.setAttribute('class', 'col-md-3');
  div.innerHTML = bookTpl;
  const books = document.querySelector('#books');
  if (books) {
      books.appendChild(div);
  }
}
function showTotal(total:number) {
    const found = document.querySelector('#found');
    if (found) {
      found.textContent = ''+total;
    }
}
function cleanBooks() {
    const books = document.querySelector('#books');
    if (books) {
      books.innerHTML = '';
    }
}
function searchBooks() {
    const searchEle = document.querySelector('#search');
    const {fromEvent} = rxjs;
    const { filter, map, switchMap, debounceTime, tap } = rxjs.operators;
    if (searchEle) {
        fromEvent(searchEle, 'keyup')
        .pipe(
            map((ele: any) => ele.target.value),
            filter((ele: string) => ele.length > 2),
            debounceTime(1200),
            tap( () => cleanBooks()),
            switchMap((ele: string) => getBooks(ele))
        )
        .subscribe((book:Book) => displayBook(book));
        // getBooks('java programming');
    }
}
function searchButtonClicked() {
    const books:any = document.querySelector('#search');
    if (books) {
      getBooks((books.value).subscribe((book:Book) => displayBook(book)));
    }
}
searchBooks();
