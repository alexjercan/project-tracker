import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import Auth from "./Auth";
import Request from "./request";
import { IResponse, IUserInput } from "./types";
import Service from "./service";
import Handler from "./handler";
import "@testing-library/jest-dom/extend-expect";

describe("Auth Tests", () => {
  describe("Basic Tests", () => {
    it("should render the auth page when first loaded", () => {
      const setState = jest.fn(() => {});

      const result = render(<Auth setHeadersValue={setState} />, {
        wrapper: MemoryRouter,
      });

      expect(result).toBeDefined();
      result
        .findAllByRole("href")
        .then((value) => expect(value.length).toStrictEqual(2));
    });
  });
  describe("Service Tests", () => {
    describe("SignIn Tests", () => {
      it("should return the headers when the post request has status 200", async () => {
        const userInput: IUserInput = {
          username: "username",
          password: "password",
        };

        const request: Request = {
          async Post(path: string, body: string): Promise<IResponse> {
            return { status: 200, headers: new Headers() };
          },
        };
        const service: Service = new Service(request);

        const result = await service.SignIn(userInput);

        expect(result).toBeDefined();
      });
      it("should return undefined when the post request has status other than 200", async () => {
        const userInput: IUserInput = {
          username: "username",
          password: "password",
        };

        const request: Request = {
          async Post(path: string, body: string): Promise<IResponse> {
            return { status: 500, headers: new Headers() };
          },
        };
        const service: Service = new Service(request);

        const result = await service.SignIn(userInput);

        expect(result).toBeUndefined();
      });
    });
    describe("SignUp Tests", () => {
      it("should return the headers when the post request has status 200", async () => {
        const userInput: IUserInput = {
          username: "username",
          password: "password",
        };

        const request: Request = {
          async Post(path: string, body: string): Promise<IResponse> {
            return { status: 200, headers: new Headers() };
          },
        };
        const service: Service = new Service(request);

        const result = await service.SignUp(userInput);

        expect(result).toBeDefined();
      });
      it("should return undefined when the post request has status other than 200", async () => {
        const userInput: IUserInput = {
          username: "username",
          password: "password",
        };

        const request: Request = {
          async Post(path: string, body: string): Promise<IResponse> {
            return { status: 500, headers: new Headers() };
          },
        };
        const service: Service = new Service(request);

        const result = await service.SignUp(userInput);

        expect(result).toBeUndefined();
      });
    });
  });
  describe("Handler Tests", () => {
    describe("SignIn Test", () => {
      it("should call the callback and define the headers when the request has status 200", async () => {
        let headersValue: Headers | undefined = undefined;

        const setHeadersValue = jest.fn(() => {
          headersValue = new Headers();
        });

        const authenticationSuccessfulHandler = jest.fn();

        const userInput: IUserInput = {
          username: "username",
          password: "password",
        };

        const request: Request = {
          async Post(path: string, body: string): Promise<IResponse> {
            return { status: 200, headers: new Headers() };
          },
        };
        const service: Service = new Service(request);
        const handler: Handler = new Handler(
          service,
          setHeadersValue,
          authenticationSuccessfulHandler
        );

        await handler.SignInClickedHandler(userInput);

        expect(authenticationSuccessfulHandler).toHaveBeenCalled();
        expect(headersValue).toBeDefined();
      });
      it("should not call the callback nor define the headers when the request has status other than 200", async () => {
        let headersValue: Headers | undefined = undefined;

        const setHeadersValue = jest.fn((headers) => {
          headersValue = headers;
        });

        const authenticationSuccessfulHandler = jest.fn();

        const userInput: IUserInput = {
          username: "username",
          password: "password",
        };

        const request: Request = {
          async Post(path: string, body: string): Promise<IResponse> {
            return { status: 500, headers: new Headers() };
          },
        };
        const service: Service = new Service(request);
        const handler: Handler = new Handler(
          service,
          setHeadersValue,
          authenticationSuccessfulHandler
        );

        await handler.SignInClickedHandler(userInput);

        expect(authenticationSuccessfulHandler).toHaveBeenCalledTimes(0);
        expect(setHeadersValue).toHaveBeenCalled();
        expect(headersValue).toBeUndefined();
      });
    });
    describe("SignUp Test", () => {
      it("should call the callback and define the headers when the request has status 200", async () => {
        let headersValue: Headers | undefined = undefined;

        const setHeadersValue = jest.fn(() => {
          headersValue = new Headers();
        });

        const authenticationSuccessfulHandler = jest.fn();

        const userInput: IUserInput = {
          username: "username",
          password: "password",
        };

        const request: Request = {
          async Post(path: string, body: string): Promise<IResponse> {
            return { status: 200, headers: new Headers() };
          },
        };
        const service: Service = new Service(request);
        const handler: Handler = new Handler(
          service,
          setHeadersValue,
          authenticationSuccessfulHandler
        );

        await handler.SignUpClickedHandler(userInput);

        expect(authenticationSuccessfulHandler).toHaveBeenCalled();
        expect(headersValue).toBeDefined();
      });
      it("should not call the callback nor define the headers when the request has status other than 200", async () => {
        let headersValue: Headers | undefined = undefined;

        const setHeadersValue = jest.fn((headers) => {
          headersValue = headers;
        });

        const authenticationSuccessfulHandler = jest.fn();

        const userInput: IUserInput = {
          username: "username",
          password: "password",
        };

        const request: Request = {
          async Post(path: string, body: string): Promise<IResponse> {
            return { status: 500, headers: new Headers() };
          },
        };
        const service: Service = new Service(request);
        const handler: Handler = new Handler(
          service,
          setHeadersValue,
          authenticationSuccessfulHandler
        );

        await handler.SignUpClickedHandler(userInput);

        expect(authenticationSuccessfulHandler).toHaveBeenCalledTimes(0);
        expect(setHeadersValue).toHaveBeenCalled();
        expect(headersValue).toBeUndefined();
      });
    });
  });
});
