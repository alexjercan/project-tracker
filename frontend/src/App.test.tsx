import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

describe("App Tests", () => {
  it("should render the home page when first loaded", () => {
    const result = render(<App />);

    expect(result).toBeDefined();
    result
      .findAllByRole("href")
      .then((value) => expect(value.length).toStrictEqual(2));
  });
});
