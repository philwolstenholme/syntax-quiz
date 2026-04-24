import { os } from "@orpc/server";
import { z } from "zod";
import { levelMap } from "./data.mjs";
import { LevelMetaSchema } from "./schemas.mjs";

export const levelsRoute = os
  .route({ method: "GET", path: "/levels", tags: ["Reference"], summary: "List all levels" })
  .output(z.array(LevelMetaSchema))
  .handler(async () =>
    Array.from(levelMap.values(), (l) => ({
      id: l.id,
      name: l.name,
      subtitle: l.subtitle,
      description: l.description,
      questionCount: l.questions.length,
    })),
  );
