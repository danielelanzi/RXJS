function createAlbumList(title) {
    const ul = document.querySelector('#albums');
    if (ul) {
        const li = document.createElement('li');
        li.textContent = title;
        ul.appendChild(li);
    }
} 
function updateTotal(total) {
    const span = document.querySelector('#total');
    if (span) {
        span.textContent = total;
    }
}
const apiurl = 'https://jsonplaceholder.typicode.com/albums';
const { from } = rxjs;
const { map, switchMap } = rxjs.operators;

const promise = fetch(apiurl).then(body => body.json()
                // .then(res => console.log(res))
);
//Obserable
const objs = from(promise);

objs.subscribe(resData => updateTotal(resData.length));
objs.pipe(
    switchMap( 
        resData => from(resData)
        ),
        map(album => album.title)
).subscribe(createAlbumList)