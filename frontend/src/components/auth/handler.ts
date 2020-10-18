import Service from "./service";
import { IUserInput } from "./types";

export default class Handler {
  constructor(
    private _service: Service,
    private _setHeadersValue: (
      value: React.SetStateAction<Headers | undefined>
    ) => void,
    private _authenticationSuccessfulHandler: () => void
  ) {}

  async SignInClickedHandler(userInput: IUserInput) {
    const headers = await this._service.SignIn(userInput);
    this._setHeadersValue(headers);

    if (headers !== undefined) this._authenticationSuccessfulHandler();
  }

  async SignUpClickedHandler(userInput: IUserInput) {
    const headers = await this._service.SignUp(userInput);
    this._setHeadersValue(headers);

    if (headers !== undefined) this._authenticationSuccessfulHandler();
  }
}
