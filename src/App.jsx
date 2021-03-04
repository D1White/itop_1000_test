import { useEffect } from 'react';
import { Subject } from 'rxjs';
import { useTimer } from './useTimer';

const actions$ = new Subject();
 
const App = () => {
  const [time, observer$] = useTimer(actions$);

  useEffect(() => {
    const sub = observer$.subscribe();
    return () => sub.unsubscribe();    
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const start = () => {
    actions$.next('start')
  }

  const stop = () => {
    actions$.next('stop')
  }

  const wait = () => {
    actions$.next('wait')
  }

  const timeConverter = (seconds) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  }

  return (
    <div className="app">
      <span className="timer">{timeConverter(time)}</span>
      <div className="buttons">
        <button className="btn start" type="button" onClick={start} >Start / Stop</button>
        <button className="btn wait" type="button" onClick={wait} >Wait</button>
        <button className="btn reset" type="reset" onClick={stop} >Reset</button>
      </div>
    </div>
  );
}

export default App;