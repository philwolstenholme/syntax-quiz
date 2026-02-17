import { Route, Switch, useLocation } from 'wouter';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { LevelSelect } from './components/LevelSelect';
import { QuestionsPage } from './pages/QuestionsPage';
import { ScorePage } from './pages/ScorePage';
import { ROUTES, ROUTE_PATTERNS } from './routes';

function App() {
  const [location] = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const pageTransition = prefersReducedMotion
    ? {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 },
      transition: { duration: 0 },
    }
    : {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 },
    };

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location} {...pageTransition}>
        <Switch>
          <Route path={ROUTES.home} component={LevelSelect} />
          <Route path={ROUTE_PATTERNS.questions} component={QuestionsPage} />
          <Route path={ROUTE_PATTERNS.score} component={ScorePage} />
          <Route><LevelSelect /></Route>
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
