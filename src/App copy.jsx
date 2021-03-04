import { useState, useEffect } from 'react';
import { of, interval, concat, Subject, timer } from 'rxjs';
import {
  takeWhile,
  takeUntil,
  scan,
  startWith,
  repeatWhen,
  share,
  filter,
  switchMap,
} from 'rxjs/operators';

const actions$ = new Subject();
const start$ = actions$.pipe(filter(action => action === 'start'));
const stop$ = actions$.pipe(filter(action => action === 'stop'));
const reset$ = actions$.pipe(filter(action => action === 'reset'));


// const timer$ = interval(1000).pipe(
//   startWith(0),
//   // scan(time => time - 1),
// ).pipe(share());

// const observable$ = timer$.pipe(
//   repeatWhen(() => start$)
// )

const observable$ = interval(1000)
.pipe(
  startWith(0),
  takeUntil(stop$),
  repeatWhen(() => start$),
);

// reset$.pipe(switchMap(() => observable$ = interval(1000))).subscribe(console.log);

const App = () => {

  const [time, setTime] = useState(0);

  useEffect(() => {
    const sub = observable$.subscribe(setTime);
    return () => sub.unsubscribe();    
  }, [])


  const start = () => {
    actions$.next('start')
  }

  const stop = () => {
    actions$.next('stop')
  }

  const reset = () => {
    actions$.next('reset')
  }

  const timeConverter = (seconds) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  }

  return (
    <div className="app">
      <span className="timer">{time}</span>
      <span className="timer">{timeConverter(time)}</span>
      <div className="buttons">
        <button className="btn start" type="button" onClick={start} >Start / Stop</button>
        <button className="btn wait" type="button" onClick={reset} >Wait</button>
        <button className="btn reset" type="reset" onClick={stop}>Reset</button>
      </div>
    </div>
  );
}

export default App;