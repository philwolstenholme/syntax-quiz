# GitHub Copilot Instructions for syntax-quiz

## Project Overview
A React-based quiz application for testing syntax knowledge. The project is built with modern web technologies and emphasizes type safety and clean code practices.

## Tech Stack
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4 with PostCSS
- **Routing**: Wouter (lightweight router)
- **Animations**: Motion (Framer Motion)
- **Drag & Drop**: @dnd-kit
- **Language**: TypeScript with strict mode enabled

## TypeScript Configuration
- Target: ES2020
- Strict mode enabled
- `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` enabled
- `noUncheckedIndexedAccess` enabled (always check array access)
- Use `react-jsx` for JSX transformation
- Do not use `any` type - prefer proper typing or `unknown`

## Coding Standards and Conventions

### React Components
- Use function components exclusively (no class components)
- Use named exports for components (e.g., `export const ComponentName`)
- Place component interfaces/types immediately before the component definition
- Use `interface` for component props (e.g., `interface ComponentNameProps`)
- Import React types explicitly (e.g., `import type { ReactNode }`)

### TypeScript Practices
- Always use explicit types for function parameters
- Prefer `interface` for object shapes (including component props) and `type` for unions/intersections
- Use type imports with `import type` when only importing types
- Handle null/undefined cases explicitly due to `noUncheckedIndexedAccess`

### File Organization
- Components go in `src/components/`
- Pages go in `src/pages/`
- Utilities go in `src/utils/`
- Data/constants go in `src/data/`
- Use `.tsx` extension for files containing JSX
- Use `.ts` extension for utility files without JSX

### Styling
- Use Tailwind CSS utility classes for styling
- Use responsive design patterns (e.g., `sm:`, `md:`, `lg:` breakpoints)
- Prefer Tailwind utilities over custom CSS
- Use template literals for conditional classes

### Naming Conventions
- Components: PascalCase (e.g., `PageLayout`, `LevelSelect`)
- Files: Match component names (e.g., `PageLayout.tsx`)
- Variables and functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Interfaces/Types: PascalCase, with props interfaces suffixed with `Props`

### ESLint Rules
- Unused variables are errors (except those matching `^[A-Z_]` pattern)
- Follow React Hooks rules
- Follow React Refresh patterns for Vite

### Import Organization
- React and React types first
- Third-party libraries next
- Local components and utilities last
- Use named imports for better tree-shaking

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (runs typecheck first)
- `npm run typecheck` - Run TypeScript compiler checks
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project-Specific Guidelines
- This is a quiz application - maintain clean, educational code
- Ensure accessibility in interactive elements (quiz questions, drag-and-drop)
- Use animation/motion for better UX but keep it smooth and purposeful
- The app uses client-side routing with wouter - keep URLs clean and semantic

## Testing & Quality
- Always run `npm run typecheck` before committing
- Run `npm run lint` to catch code quality issues
- Test responsive design across different screen sizes
- Verify animations work smoothly
- **Note**: Currently, there is no automated test infrastructure in this project. When adding features, consider adding tests if appropriate, but they are not required.

## Dependencies
- Use `es-toolkit` for utility functions (modern lodash alternative)
- Use `lucide-react` for icons
- Keep dependencies up to date but test thoroughly after updates
- Prefer lightweight alternatives when possible
