import Service from './service';
import {IUser, IUserInput, IUserKey} from './types';
import Model from './model';
import * as bcrypt from 'bcrypt';

describe('Auth Tests', () => {
  describe('User Service Tests', () => {
    describe('SignUp', () => {
      it('Should return user record when the model creates a record', async () => {
        const model: Model = {
          async Create(userKey: IUserKey, userInput: IUserInput): Promise<IUser | undefined> {
            return {
              ...userKey,
              ...userInput,
            };
          },
          async FindOne(userKey: IUserKey): Promise<IUser | undefined> {
            return undefined;
          },
        };

        const userKey: IUserKey = {
          username: 'username',
        }
        
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
          async Create(userKey: IUserKey, userInput: IUserInput): Promise<IUser | undefined> {
            return undefined;
          },
          async FindOne(userKey: IUserKey): Promise<IUser | undefined> {
            return undefined;
          },
        };
        
        const userKey: IUserKey = {
          username: 'username',
        }

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
        }

        const userInput: IUserInput = {
          password: 'password',
        };

        const encryptedPassword = await bcrypt.hash(userInput.password, 5);

        const model: Model = {
          async Create(userKey: IUserKey, userInput: IUserInput): Promise<IUser | undefined> {
            return undefined;
          },
          async FindOne(userKey: IUserKey): Promise<IUser | undefined> {
            return {
              username: userKey.username,
              password: encryptedPassword,
            };
          },
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
        }

        const userInput: IUserInput = {
          password: 'password',
        };

        const model: Model = {
          async Create(userKey: IUserKey, userInput: IUserInput): Promise<IUser | undefined> {
            return undefined;
          },
          async FindOne(userKey: IUserKey): Promise<IUser | undefined> {
            return {
              username: userKey.username,
              password: userInput.password + '1',
            };
          },
        };

        const service = new Service(model);
        const userRecord = await service.SignIn(userKey, userInput);

        expect(userRecord).toBeUndefined();
      });
      it('Should return undefined when the model does not find a record', async () => {
        const userKey: IUserKey = {
          username: 'username',
        }

        const userInput: IUserInput = {
          password: 'password',
        };

        const model: Model = {
          async Create(userKey: IUserKey, userInput: IUserInput): Promise<IUser | undefined> {
            return undefined;
          },
          async FindOne(userKey: IUserKey): Promise<IUser | undefined> {
            return undefined;
          },
        };

        const service = new Service(model);
        const userRecord = await service.SignIn(userKey, userInput);

        expect(userRecord).toBeUndefined();
      });
    });
  });
});
