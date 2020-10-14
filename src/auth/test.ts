import Service from './service';
import { IUser, IUserInput } from './types';
import Model from './model';

describe('Auth Tests', () => {
  describe('User Service Tests', () => {
    describe('SignUp', () => {
      it('Should return user record when the model creates a record', async () => {
        const model: Model = {
          async Create(user: IUserInput): Promise<IUser | undefined> {
            return {
              _id: 'mock',
              ...user,
            };
          },
          async FindOne(username: string): Promise<IUser | undefined> {
            return undefined;
          },
        };

        const userInput: IUserInput = {
          username: 'username',
          password: 'password',
        };

        const service = new Service(model);
        const userRecord = await service.SignUp(userInput);

        expect(userRecord).toBeDefined();
        expect(userRecord?._id).toBe('mock');
      });
      it('Should return undefined when the model does not create a record', async () => {
        const model: Model = {
          async Create(user: IUserInput): Promise<IUser | undefined> {
            return undefined;
          },
          async FindOne(username: string): Promise<IUser | undefined> {
            return undefined;
          },
        };

        const userInput: IUserInput = {
          username: 'username',
          password: 'password',
        };

        const service = new Service(model);
        const userRecord = await service.SignUp(userInput);

        expect(userRecord).toBeUndefined();
      });
      it('Should emit signedUp when the model creates a record', async () => {
        const model: Model = {
          async Create(user: IUserInput): Promise<IUser | undefined> {
            return {
              _id: 'mock',
              ...user,
            };
          },
          async FindOne(username: string): Promise<IUser | undefined> {
            return undefined;
          },
        };

        const userInput: IUserInput = {
          username: 'username',
          password: 'password',
        };

        const mockFunction = jest.fn();

        const service = new Service(model);
        service.eventEmitter.on('signedUp', mockFunction);
        const userRecord = await service.SignUp(userInput);

        expect(mockFunction).toHaveBeenCalled();
      });
      it('Should not emit signedUp when the model does not creates a record', async () => {
        const model: Model = {
          async Create(user: IUserInput): Promise<IUser | undefined> {
            return undefined;
          },
          async FindOne(username: string): Promise<IUser | undefined> {
            return undefined;
          },
        };

        const userInput: IUserInput = {
          username: 'username',
          password: 'password',
        };

        const mockFunction = jest.fn();

        const service = new Service(model);
        service.eventEmitter.on('signedUp', mockFunction);
        const userRecord = await service.SignUp(userInput);

        expect(mockFunction).toHaveBeenCalledTimes(0);
      });
    });
    describe('SignIn', () => {
      it('Should return user record when the model finds a record and the passwords match', async () => {
        const userInput: IUserInput = {
          username: 'username',
          password: 'password',
        };

        const model: Model = {
          async Create(user: IUserInput): Promise<IUser | undefined> {
            return undefined;
          },
          async FindOne(username: string): Promise<IUser | undefined> {
            return {
              _id: 'mock',
              username,
              password: userInput.password,
            };
          },
        };

        const service = new Service(model);
        const userRecord = await service.SignIn(userInput);

        expect(userRecord).toBeDefined();
        expect(userRecord?._id).toBe('mock');
        expect(userRecord?.username).toBe(userInput.username);
        expect(userRecord?.password).toBe(userInput.password);
      });
      it('Should return undefined when the model finds a record but the passwords dont match', async () => {
        const userInput: IUserInput = {
          username: 'username',
          password: 'password',
        };

        const model: Model = {
          async Create(user: IUserInput): Promise<IUser | undefined> {
            return undefined;
          },
          async FindOne(username: string): Promise<IUser | undefined> {
            return {
              _id: 'mock',
              username,
              password: userInput.password + '1',
            };
          },
        };

        const service = new Service(model);
        const userRecord = await service.SignIn(userInput);

        expect(userRecord).toBeUndefined();
      });
      it('Should return undefined when the model does not find a record', async () => {
        const userInput: IUserInput = {
          username: 'username',
          password: 'password',
        };

        const model: Model = {
          async Create(user: IUserInput): Promise<IUser | undefined> {
            return undefined;
          },
          async FindOne(username: string): Promise<IUser | undefined> {
            return undefined;
          },
        };

        const service = new Service(model);
        const userRecord = await service.SignIn(userInput);

        expect(userRecord).toBeUndefined();
      });
      it('Should emit signedIn when the model finds a record and the passwords match', async () => {
        const userInput: IUserInput = {
          username: 'username',
          password: 'password',
        };

        const model: Model = {
          async Create(user: IUserInput): Promise<IUser | undefined> {
            return undefined;
          },
          async FindOne(username: string): Promise<IUser | undefined> {
            return {
              _id: 'mock',
              username,
              password: userInput.password,
            };
          },
        };

        const mockFunction = jest.fn();

        const service = new Service(model);
        service.eventEmitter.on('signedIn', mockFunction);
        const userRecord = await service.SignIn(userInput);

        expect(mockFunction).toHaveBeenCalled();
      });
      it('Should not emit signedIn when the model does not find a record', async () => {
        const userInput: IUserInput = {
          username: 'username',
          password: 'password',
        };

        const model: Model = {
          async Create(user: IUserInput): Promise<IUser | undefined> {
            return undefined;
          },
          async FindOne(username: string): Promise<IUser | undefined> {
            return undefined;
          },
        };

        const mockFunction = jest.fn();

        const service = new Service(model);
        service.eventEmitter.on('signedIn', mockFunction);
        const userRecord = await service.SignIn(userInput);

        expect(mockFunction).toHaveBeenCalledTimes(0);
      });
      it('Should not emit signedIn when the model finds a record and the passwords do not match', async () => {
        const userInput: IUserInput = {
          username: 'username',
          password: 'password',
        };

        const model: Model = {
          async Create(user: IUserInput): Promise<IUser | undefined> {
            return undefined;
          },
          async FindOne(username: string): Promise<IUser | undefined> {
            return {
              _id: 'mock',
              username,
              password: userInput.password + '1',
            };
          },
        };

        const mockFunction = jest.fn();

        const service = new Service(model);
        service.eventEmitter.on('signedIn', mockFunction);
        const userRecord = await service.SignIn(userInput);

        expect(mockFunction).toHaveBeenCalledTimes(0);
      });
    });
  });
});
