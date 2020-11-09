const { Observable } = require('rxjs');

const objs = new Observable( subscriber =>{

    //next, error, complete
    subscriber.next(1);
    subscriber.next(2);
    setTimeout(() => {
        subscriber.next(4);
    }, 4000);
    //subscriber.complete();
    subscriber.next(3); //non viene chiamato perchè è dopo complete
});
objs.subscribe(
    v =>{
    console.log(v);
}, 
error =>{console.log(error);},
() =>{
    console.log('valori completati');
},
);
console.log('one finita ');
objs.subscribe({
    next : v =>{
        console.log('subscricbe2 = ' + v);
    },
    complete : () =>{
        console.log('Seconda subscricbe completata');
    },
    error : error => console.log(error)
});