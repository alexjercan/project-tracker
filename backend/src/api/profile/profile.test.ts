import Service from './service';
import { IProfile, IProfileInput } from './types';
import Model from './model';

describe('Profile Tests', () => {
  describe('Profile Service Tests', () => {
    describe('EditProfile', () => {
      it('Should return a record when the model edits a record', async () => {
        const model: Model = {
          async Edit(profile: IProfileInput): Promise<IProfile | undefined> {
            return {
              email: 'test@test.com',
              first_name: 'first',
              last_name: 'last',
            };
          },
          async Get(userId: number): Promise<IProfile | undefined> {
            return undefined;
          },
        };

        const userInput: IProfileInput = {
          email: 'test@test.com',
          first_name: 'first',
          last_name: 'last',
          user_id: 0,
        };

        const service = new Service(model);
        const record = await service.EditProfile(userInput);

        expect(record).toBeDefined();
        expect(record?.email).toBe(userInput.email);
        expect(record?.first_name).toBe(userInput.first_name);
        expect(record?.last_name).toBe(userInput.last_name);
      });
      it('Should return undefined when the model does not edit the record', async () => {
        const model: Model = {
          async Edit(profile: IProfileInput): Promise<IProfile | undefined> {
            return undefined;
          },
          async Get(userId: number): Promise<IProfile | undefined> {
            return undefined;
          },
        };

        const userInput: IProfileInput = {
          email: 'test@test.com',
          first_name: 'first',
          last_name: 'last',
          user_id: 0,
        };

        const service = new Service(model);
        const record = await service.EditProfile(userInput);

        expect(record).toBeUndefined();
      });
    });
    describe('GetProfile', () => {
      it('Should return a record when the model finds a record', async () => {
        const model: Model = {
          async Edit(profile: IProfileInput): Promise<IProfile | undefined> {
            return undefined;
          },
          async Get(userId: number): Promise<IProfile | undefined> {
            return {
              email: 'test@test.com',
              first_name: 'first',
              last_name: 'last',
            };
          },
        };

        const userId = 1;

        const service = new Service(model);
        const record = await service.GetProfile(userId);

        expect(record).toBeDefined();
      });
      it('Should return undefined when the model does not find a record', async () => {
        const model: Model = {
          async Edit(profile: IProfileInput): Promise<IProfile | undefined> {
            return undefined;
          },
          async Get(userId: number): Promise<IProfile | undefined> {
            return undefined;
          },
        };

        const userId: number = 1;

        const service = new Service(model);
        const record = await service.GetProfile(userId);

        expect(record).toBeUndefined();
      });
    });
  });
});
