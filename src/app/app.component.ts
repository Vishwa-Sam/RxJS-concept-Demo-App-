import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, map, Observable, Subscriber } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{
  clickCount = signal(0)
  constructor() {
    // effect(() => {
    //   console.log( `clicked button ${this.clickCount()} times.`)
    // })
  }
  // interval = signal(0);
  // doubleInterval = computed(() => this.interval() * 2); // to show thi acts like map()

 // Creating custom Observable 

 customInterval$ = new Observable((subscriber) => { // tgis subscriber fn() is executed automatically when we subscribe o the suctomInterval$ observable
  let timesExecuted = 0;
  const interval = setInterval(() =>{
    if (timesExecuted > 4) {
      clearInterval(interval);
      subscriber.complete();
      return;
    }
    console.log('Emitting new values');
    subscriber.next({ message: ' New value '}); //here the next () is triggered and sends/emites values from the observable to the next() in subscribe
    timesExecuted++ ;
  },2000)
 });


  // for converting observale to signal

  interval$ = interval(4000);
  intervalSignal = toSignal(this.interval$
    .pipe(map((val) => val * 2)), // just tried to transform the value
  { initialValue: 0}); //setting initial value as observal start as undefined




  // for converting signal to Observable 

  private destroyRef = inject(DestroyRef) //for unsubscribing
  clickCount$ = toObservable(this.clickCount); // clickCount must be donoted using () though its a signal

  ngOnInit(): void {
      // const subscription = interval(4000).pipe(map((val) => val * 2 ))
      // .subscribe({
      //   next: (val) => console.log(val)
      // });

      // this.destroyRef.onDestroy(() => {
      //   subscription.unsubscribe();
      // })

      // custom Observable 

      this.customInterval$.subscribe({
        next:(val) => console.log(val), // values are recieved and handled here , values are received when first/ above next() is triggered
        complete: () => console.log( ' emitting value is done')
      })


      // converted signal to observable
      const subscription = this.clickCount$.subscribe({
        next: (val) => console.log(`clicked button ${this.clickCount()} times.`)
      })
        this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      })
  }

  onClick() {
    this.clickCount.update(prevCount => prevCount + 1);
  }
}
