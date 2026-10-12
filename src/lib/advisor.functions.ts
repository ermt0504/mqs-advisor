import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { runAdvisor } from "./advisor.core";

const Input = z.object({ idea: z.string().trim().min(10).max(2000), lang: z.enum(["fr", "en"]) });

export const recommendWebsite = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => runAdvisor(data.idea, data.lang));
