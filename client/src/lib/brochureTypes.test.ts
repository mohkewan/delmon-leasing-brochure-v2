import { describe, expect, it } from "vitest";
import { BROCHURE_THEMES } from "./brochureTypes";

describe("Delmon leasing corporate template", () => {
  it("keeps the approved identity palette on the default brochure template", () => {
    const corporateTemplate = BROCHURE_THEMES.find((theme) => theme.id === "classic");

    expect(corporateTemplate).toMatchObject({
      nameAr: "هوية دلمون للتأجير",
      primaryColor: "#949437",
      accentColor: "#94B6D2",
      bgColor: "#FFFFFF",
      textColor: "#262626",
    });
  });
});
