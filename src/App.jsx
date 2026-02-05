import { Route, Switch, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'motion/react';
import { LevelSelect } from './components/LevelSelect';
import { QuestionsPage } from './pages/QuestionsPage';
import { ScorePage } from './pages/ScorePage';

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

function App() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location} {...pageTransition}>
        <Switch>
          <Route path="/" component={LevelSelect} />
          <Route path="/syntax-quiz/level/:levelId/questions" component={QuestionsPage} />
          <Route path="/syntax-quiz/level/:levelId/score" component={ScorePage} />
          {/* Fallback to home for unknown routes */}
          <Route>
            <LevelSelect />
          </Route>
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
