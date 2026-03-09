## Design Context

### Users
JavaScript and TypeScript developers at all levels practicing syntax terminology precision. They arrive wanting quick, focused practice — not a course. Context is often a few spare minutes: on a break, warming up before coding, or testing themselves after learning something new.

### Brand Personality
**Sharp, playful, confident.** Technical precision meets gamified fun. The interface knows what it is and doesn't try too hard. Think: a well-crafted dev tool that happens to be a game.

### Emotional Goals
- **Satisfying mastery** — the core loop. Getting answers right should feel *good*: snappy feedback, count-up animations, streak rewards.
- **Competitive drive** — streaks, scores, and completion stats create internal motivation to improve.
- **Curiosity & discovery** — hints and explanations turn wrong answers into learning moments ("oh, I didn't know that").
- **Calm focus** — despite the gamification, the environment stays clean and distraction-free. No pressure, just flow.

### Aesthetic Direction
- **References:** Linear and Raycast (ultra-polished dev tools, sharp typography, subtle purposeful motion) blended with Duolingo and Brilliant (clear feedback loops, satisfying interactions, gamified learning done right).
- **Anti-references:** Generic SaaS dashboards, overly gamified/childish apps, dense academic interfaces, flashy marketing-heavy sites. No corporate blandness, no cartoon characters, no gradient soup, no walls of text.
- **Theme:** Dark and light mode with system preference detection. Neutral palette (Tailwind neutrals) with semantic accent colors: emerald (correct), red (incorrect), amber (hint), yellow (highlight), blue (focus/interactive).
- **Typography:** Geist (UI) + Geist Mono (code). Clean, modern, developer-native.
- **Motion:** Purposeful animations via Motion (Framer Motion). Score pop, streak pulse, feedback slide-in, staggered reveals. Always respect `prefers-reduced-motion`.

### Design Principles
1. **Feedback is instant and satisfying** — Every interaction gets a clear, immediate response. Haptics, sound, color, and motion work together to make correct answers feel rewarding and wrong answers feel informative, not punishing.
2. **Clarity over decoration** — Every visual element earns its place. No ornamental gradients, no unnecessary icons, no visual noise. If it doesn't help the user understand or act, it doesn't belong.
3. **Accessible by default** — Keyboard navigation, screen reader support, touch targets, reduced motion, and color contrast are not afterthoughts. They are the baseline.
4. **Polish is in the details** — The difference between good and great lives in consistent spacing, aligned elements, smooth transitions, and thoughtful micro-interactions. Sweat the small stuff.
5. **Developer-native aesthetic** — Monospace where it matters, syntax highlighting done right, and a visual language that feels at home in a developer's workflow. Sharp, not soft.

## API Development

When adding, modifying, or removing API routes in `netlify/functions/api/`, you **must** update the Bruno collection in `bruno/` to match. This includes updating request paths, methods, body schemas, and post-response scripts that handle game state propagation.
