import Service from './service';
import { IUser, IUserInput, IUserKey } from './types';
import Model from './model';
import * as bcrypt from 'bcrypt';

describe('Auth Tests', () => {
  describe('User Service Tests', () => {
    const returnsRecordCreate = async (userKey: IUserKey, userInput: IUserInput): Promise<IUser | undefined> => {
      return {
        ...userKey,
        ...userInput,
      };
    };

    const returnsUndefinedCreate = async (userKey: IUserKey, userInput: IUserInput): Promise<IUser | undefined> => {
      return undefined;
    };

    const returnsRecordFindOne = async (userKey: IUserKey): Promise<IUser | undefined> => {
      return {
        ...userKey,
        password: await bcrypt.hash('password', 5),
      };
    };

    const returnsUndefinedFindOne = async (userKey: IUserKey): Promise<IUser | undefined> => {
      return undefined;
    };

    describe('SignUp', () => {
      it('Should return user record when the model creates a record', async () => {
        const model: Model = {
          Create: returnsRecordCreate,
          FindOne: returnsUndefinedFindOne,
        };

        const userKey: IUserKey = {
          username: 'username',
        };

        const userInput: IUserInput = {
          password: 'password',
        };

        const service = new Service(model);
        const userRecord = await service.SignUp(userKey, userInput);

        expect(userRecord).toBeDefined();
        expect(userRecord?.username).toBe(userKey.username);
        if (userRecord) expect(await bcrypt.compare(userInput.password, userRecord.password)).toBe(true);
      });
      it('Should return undefined when the model does not create a record', async () => {
        const model: Model = {
          Create: returnsUndefinedCreate,
          FindOne: returnsUndefinedFindOne,
        };

        const userKey: IUserKey = {
          username: 'username',
        };

        const userInput: IUserInput = {
          password: 'password',
        };

        const service = new Service(model);
        const userRecord = await service.SignUp(userKey, userInput);

        expect(userRecord).toBeUndefined();
      });
    });
    describe('SignIn', () => {
      it('Should return user record when the model finds a record and the passwords match', async () => {
        const userKey: IUserKey = {
          username: 'username',
        };

        const userInput: IUserInput = {
          password: 'password',
        };

        const model: Model = {
          Create: returnsUndefinedCreate,
          FindOne: returnsRecordFindOne,
        };

        const service = new Service(model);
        const userRecord = await service.SignIn(userKey, userInput);

        expect(userRecord).toBeDefined();
        expect(userRecord?.username).toBe(userKey.username);
        if (userRecord) expect(await bcrypt.compare(userInput.password, userRecord.password)).toBe(true);
      });
      it('Should return undefined when the model finds a record but the passwords dont match', async () => {
        const userKey: IUserKey = {
          username: 'username',
        };

        const userInput: IUserInput = {
          password: 'password1',
        };

        const model: Model = {
          Create: returnsUndefinedCreate,
          FindOne: returnsUndefinedFindOne,
        };

        const service = new Service(model);
        const userRecord = await service.SignIn(userKey, userInput);

        expect(userRecord).toBeUndefined();
      });
      it('Should return undefined when the model does not find a record', async () => {
        const userKey: IUserKey = {
          username: 'username',
        };

        const userInput: IUserInput = {
          password: 'password',
        };

        const model: Model = {
          Create: returnsUndefinedCreate,
          FindOne: returnsUndefinedFindOne,
        };

        const service = new Service(model);
        const userRecord = await service.SignIn(userKey, userInput);

        expect(userRecord).toBeUndefined();
      });
    });
  });
});
