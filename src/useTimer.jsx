import { useState } from 'react'
import { interval, merge, NEVER } from 'rxjs';
import { debounceTime, map, switchMap, tap, startWith, scan, buffer, filter } from 'rxjs/operators';

export const useTimer = (actions$) => {
  const start$ = actions$.pipe(filter(action => action === 'start'));
  const stop$ = actions$.pipe(filter(action => action === 'stop'));
  const wait$ = actions$.pipe(filter(action => action === 'wait'));

  const [time, setTime] = useState(0)
  let count = false;
  let value = 0;
  
  const events$ = merge(
    start$.pipe(
      map(() => {
        if (count) { 
          count = !count;
          return ({ value: 0, count: count });
        } else { 
          count = !count;
          return ({ value: value, count: count })
        }
      })
    ),
    wait$.pipe(
      buffer(wait$.pipe(debounceTime(300))),
      map( clicks  => clicks.length ),
      filter(clickLenth => clickLenth >= 2),
      map(() => {
        count = false;
        return { count: count }
      })
    ),
    stop$.pipe(
      map(() => ({ value: 0 }))
    ),
  );
  
  const stopWatch$ = events$.pipe(
    startWith({
      value: 0,
      count: false
    }),
    scan((state, curr) => ({ ...state, ...curr }), {}),
    tap(state => value = state.value),
    tap( _ => setTime(value)),
    switchMap(
      state => state.count ? interval(1000).pipe(
        tap( _ => state.value++),
        tap( _ => value = state.value),
        tap( _ => setTime(value)),
      )
      : NEVER
    )
  );

  return [time, stopWatch$]
}