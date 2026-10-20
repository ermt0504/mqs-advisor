import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { fr } from "./fr";
import { en } from "./en";

describe("Québec patient transport project", () => {
  for (const [lang, dict] of Object.entries({ fr, en })) {
    test(`${lang}: Canadian project is under development, not live`, () => {
      const project = dict.projects.find((p) => p.slug === "transport-usagers-quebec");
      assert.equal(project?.country, "CA");
      assert.equal(project?.status, "wip");
      assert.equal(project?.confidential, false);
    });
    test(`${lang}: homepage totals match the portfolio`, () => {
      assert.equal(dict.home.figures[1]?.value, 3);
      assert.equal(dict.home.figures[2]?.value, 4);
      assert.equal(dict.projects.filter((p) => p.status === "wip").length, 4);
    });
  }
});