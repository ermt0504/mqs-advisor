import { describe, expect, test } from "bun:test";
import { fr } from "./fr";
import { en } from "./en";

describe("Québec patient transport project", () => {
  for (const [lang, dict] of Object.entries({ fr, en })) {
    test(`${lang}: Canadian project is under development, not live`, () => {
      const project = dict.projects.find((p) => p.slug === "transport-usagers-quebec");
      expect(project?.country).toBe("CA");
      expect(project?.status).toBe("wip");
      expect(project?.confidential).toBe(false);
    });
    test(`${lang}: homepage totals match the portfolio`, () => {
      expect(dict.home.figures[1].value).toBe(3);
      expect(dict.home.figures[2].value).toBe(4);
      expect(dict.projects.filter((p) => p.status === "wip").length).toBe(4);
    });
  }
});