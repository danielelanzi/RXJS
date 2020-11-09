const apiurl = 'https://jsonplaceholder.typicode.com/albums';
const { from, of } = require('rxjs');
const fetch = require('node-fetch');
const { switchMap} = require('rxjs/operators');

const promise = fetch(apiurl).then(body => body.json()
                // .then(res => console.log(res))
);

from(promise).pipe(
    switchMap( 
        // resData => from(resData)
        resData => of(...resData)
        )  
).subscribe(res => console.log(res))