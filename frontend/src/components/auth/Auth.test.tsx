import React from "react";
import { render, wait } from "@testing-library/react";
import SignIn from "./SignIn";
import { IUserInput } from "./types";

describe("Auth Tests", () => {
  describe("SignIn Tests", () => {
    it("should render the SignIn page when first loaded", () => {
      let headersValue: Headers | undefined = undefined;

      jest.mock("react", () => ({
        ...jest.requireActual("react"),
        useState: jest.fn(),
      }));

      const setState = jest.fn(() => {
        headersValue = new Headers();
      });

      const userInput: IUserInput = {
        username: "username",
        password: "password",
      };

      const signIn = (): Promise<Headers | undefined> => {
        return new Promise<Headers>(() => {});
      };

      const result = render(
        <SignIn
          userInput={userInput}
          signIn={signIn}
          setHeadersValue={setState}
          authenticationSuccessfulHandler={() => {}}
        />
      );

      expect(result).toBeDefined();
      expect(headersValue).toBeUndefined();
    });
    it("should set the headers when the button is clicked", () => {
      let headersValue: Headers | undefined = undefined;

      const mockCallBack = jest.fn();

      jest.mock("react", () => ({
        ...jest.requireActual("react"),
        useState: jest.fn(),
      }));

      const setState = jest.fn(() => {
        headersValue = new Headers();
      });

      const userInput: IUserInput = {
        username: "username",
        password: "password",
      };

      const signIn = jest.fn(
        async (): Promise<Headers | undefined> => {
          return new Promise<Headers>(setImmediate);
        }
      );

      const result = render(
        <SignIn
          userInput={userInput}
          signIn={signIn}
          setHeadersValue={setState}
          authenticationSuccessfulHandler={mockCallBack}
        />
      );

      expect(result).toBeDefined();

      result.findByRole("button").then((element) => {
        element.click();

        wait(
          () => {
            expect(signIn).toHaveBeenCalled();
            expect(headersValue).toBeDefined();
            expect(mockCallBack).toHaveBeenCalled();
            expect(mockCallBack.mock.calls.length).toEqual(1);
          },
          { timeout: 0 }
        );
      });
    });
  });
});
