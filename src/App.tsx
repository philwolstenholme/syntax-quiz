import { useState, useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { Transition } from '@headlessui/react';
import { LevelSelect } from './components/LevelSelect';
import { QuestionsPage } from './pages/QuestionsPage';
import { ScorePage } from './pages/ScorePage';
import { ROUTES, ROUTE_PATTERNS } from './routes';

function App() {
  const [location] = useLocation();
  const [show, setShow] = useState(true);
  const [displayedLocation, setDisplayedLocation] = useState(location);

  useEffect(() => {
    if (location !== displayedLocation) {
      setShow(false);
    }
  }, [location, displayedLocation]);

  const handleAfterLeave = () => {
    setDisplayedLocation(location);
    setShow(true);
  };

  return (
    <Transition
      as="div"
      show={show}
      appear
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      afterLeave={handleAfterLeave}
    >
      <Switch location={displayedLocation}>
        <Route path={ROUTES.home} component={LevelSelect} />
        <Route path={ROUTE_PATTERNS.questions} component={QuestionsPage} />
        <Route path={ROUTE_PATTERNS.score} component={ScorePage} />
        <Route><LevelSelect /></Route>
      </Switch>
    </Transition>
  );
}

export default App;
