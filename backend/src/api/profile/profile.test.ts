import Service from './service';
import { IProfile, IProfileInput, IProfileKey } from './types';
import Model from './model';

describe('Profile Tests', () => {
  describe('Profile Service Tests', () => {
    describe('EditProfile', () => {
      it('Should return a record when the model edits a record', async () => {
        const model: Model = {
          async Edit(profileKey: IProfileKey, profileInput: IProfileInput): Promise<IProfile | undefined> {
            return {
              ...profileKey,
              ...profileInput,
            };
          },
          async Get(profileKey: IProfileKey): Promise<IProfile | undefined> {
            return undefined;
          },
        };

        const profileKey: IProfileKey = {
          username: 'username',
        };

        const profileInput: IProfileInput = {
          email: 'test@test.com',
          first_name: 'first',
          last_name: 'last',
        };

        const service = new Service(model);
        const record = await service.EditProfile(profileKey, profileInput);

        expect(record).toBeDefined();
        expect(record?.email).toBe(profileInput.email);
        expect(record?.first_name).toBe(profileInput.first_name);
        expect(record?.last_name).toBe(profileInput.last_name);
      });
      it('Should return undefined when the model does not edit the record', async () => {
        const model: Model = {
          async Edit(profileKey: IProfileKey, profileInput: IProfileInput): Promise<IProfile | undefined> {
            return undefined;
          },
          async Get(profileKey: IProfileKey): Promise<IProfile | undefined> {
            return undefined;
          },
        };

        const profileKey: IProfileKey = {
          username: 'username',
        };

        const profileInput: IProfileInput = {
          email: 'test@test.com',
          first_name: 'first',
          last_name: 'last',
        };

        const service = new Service(model);
        const record = await service.EditProfile(profileKey, profileInput);

        expect(record).toBeUndefined();
      });
    });
    describe('GetProfile', () => {
      it('Should return a record when the model finds a record', async () => {
        const model: Model = {
          async Edit(profileKey: IProfileKey, profileInput: IProfileInput): Promise<IProfile | undefined> {
            return undefined;
          },
          async Get(profileKey: IProfileKey): Promise<IProfile | undefined> {
            return {
              ...profileKey,
              email: 'test@test.com',
              first_name: 'first',
              last_name: 'last',
            };
          },
        };

        const profileKey: IProfileKey = {
          username: 'username',
        };

        const service = new Service(model);
        const record = await service.GetProfile(profileKey);

        expect(record).toBeDefined();
      });
      it('Should return undefined when the model does not find a record', async () => {
        const model: Model = {
          async Edit(profileKey: IProfileKey, profileInput: IProfileInput): Promise<IProfile | undefined> {
            return undefined;
          },
          async Get(profileKey: IProfileKey): Promise<IProfile | undefined> {
            return undefined;
          },
        };

        const profileKey: IProfileKey = {
          username: 'username',
        };

        const service = new Service(model);
        const record = await service.GetProfile(profileKey);

        expect(record).toBeUndefined();
      });
    });
  });
});
