import { lazy, Suspense } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { LazyMotion, domMax, m, AnimatePresence, useReducedMotion } from 'motion/react';
import { LevelSelect } from './components/LevelSelect';
import { ROUTES, ROUTE_PATTERNS } from './routes';
import { QuizResultProvider } from './context/QuizResultContext';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';

const QuestionsPage = lazy(() => import('./pages/QuestionsPage').then(m => ({ default: m.QuestionsPage })));
const ScorePage = lazy(() => import('./pages/ScorePage').then(m => ({ default: m.ScorePage })));
const BuildPage = lazy(() => import('./pages/BuildPage').then(m => ({ default: m.BuildPage })));
const BuildScorePage = lazy(() => import('./pages/BuildScorePage').then(m => ({ default: m.BuildScorePage })));

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
      transition: { duration: 0.2, ease: [0, 0, 0.2, 1] as const },
    };

  return (
    <ThemeProvider>
      <QuizResultProvider>
        <LazyMotion features={domMax}>
          <div className="app-shell relative overflow-x-hidden bg-[var(--bg)] min-h-dvh">
            <ThemeToggle />
            <AnimatePresence mode="popLayout">
              <m.div key={location} {...pageTransition}>
                <Suspense>
                  <Switch>
                    <Route path={ROUTES.home} component={LevelSelect} />
                    <Route path={ROUTE_PATTERNS.questions} component={QuestionsPage} />
                    <Route path={ROUTE_PATTERNS.score} component={ScorePage} />
                    <Route path={ROUTE_PATTERNS.build} component={BuildPage} />
                    <Route path={ROUTE_PATTERNS.buildScore} component={BuildScorePage} />
                    <Route><LevelSelect /></Route>
                  </Switch>
                </Suspense>
              </m.div>
            </AnimatePresence>
          </div>
        </LazyMotion>
      </QuizResultProvider>
    </ThemeProvider>
  );
}

export default App;
