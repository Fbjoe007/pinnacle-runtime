import { describe, expect, it } from "vitest";

import {
  resolveCapability,
  listCapabilities
} from "../capabilities/registry.js";


describe("Capability registry", () => {


  it("resolves enabled vertex capability", () => {

    const capability =
      resolveCapability(
        "vertex"
      );


    expect(capability.name)
      .toBe("vertex");


    expect(capability.provider)
      .toBe("vertex");


    expect(capability.enabled)
      .toBe(true);

  });



  it("lists enabled capabilities", () => {

    const capabilities =
      listCapabilities();


    expect(capabilities.length)
      .toBeGreaterThan(0);


    expect(
      capabilities.some(
        capability =>
          capability.name === "vertex"
      )
    ).toBe(true);

  });


});
