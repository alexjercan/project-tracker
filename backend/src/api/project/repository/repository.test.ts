import Model from './model';
import { IRepositoryKey, IRepository, IRepositoryInput } from './types';
import Service from './service';

describe('Repository Tests', () => {
  describe('Repository Service Tests', () => {
    describe('GetRepository', () => {
      it('Should return the record when the model finds one', async () => {
        const model: Model = {
          async Edit(
            repositoryKey: IRepositoryKey,
            repositoryInput: IRepositoryInput,
          ): Promise<IRepository | undefined> {
            return undefined;
          },
          async FindOne(repositoryInput: IRepositoryKey): Promise<IRepository | undefined> {
            return {
              owner_username: '',
              project_name: '',
              deadline: '',
              description: '',
              last_modified: '',
              started: '',
            };
          },
        };

        const repositoryKey: IRepositoryKey = {
          owner_username: '',
          project_name: '',
          username: '',
        };

        const service = new Service(model);
        const result = await service.GetRepository(repositoryKey);

        expect(result).toBeDefined();
      });
      it('Should return undefined when the model does not find a record', async () => {
        const model: Model = {
          async Edit(
            repositoryKey: IRepositoryKey,
            repositoryInput: IRepositoryInput,
          ): Promise<IRepository | undefined> {
            return undefined;
          },
          async FindOne(projectInput: IRepositoryKey): Promise<IRepository | undefined> {
            return undefined;
          },
        };

        const repositoryKey: IRepositoryKey = {
          owner_username: '',
          project_name: '',
          username: '',
        };

        const service = new Service(model);
        const result = await service.GetRepository(repositoryKey);

        expect(result).toBeUndefined();
      });
    });
    describe('EditRepository', () => {
      it('Should return the record when the model edits it', async () => {
        const repositoryKey: IRepositoryKey = {
          owner_username: '',
          project_name: '',
          username: '',
        };

        const repositoryInput: IRepositoryInput = {
          deadline: '26-OCT-2020',
          description: 'description',
        };

        const model: Model = {
          async Edit(
            repositoryKey: IRepositoryKey,
            repositoryInput: IRepositoryInput,
          ): Promise<IRepository | undefined> {
            return {
              owner_username: '',
              project_name: '',
              deadline: repositoryInput.deadline,
              description: repositoryInput.description,
              last_modified: '',
              started: '',
            };
          },
          async FindOne(projectInput: IRepositoryKey): Promise<IRepository | undefined> {
            return undefined;
          },
        };

        const service = new Service(model);
        const result = await service.EditRepository(repositoryKey, repositoryInput);

        expect(result).toBeDefined();
        expect(result?.description).toBe(repositoryInput.description);
        expect(result?.deadline).toBe(repositoryInput.deadline);
      });
      it('Should return undefined when the model does not edit it', async () => {
        const repositoryKey: IRepositoryKey = {
          owner_username: '',
          project_name: '',
          username: '',
        };

        const repositoryInput: IRepositoryInput = {
          deadline: '',
          description: '',
        };

        const model: Model = {
          async Edit(
            repositoryKey: IRepositoryKey,
            repositoryInput: IRepositoryInput,
          ): Promise<IRepository | undefined> {
            return undefined;
          },
          async FindOne(projectInput: IRepositoryKey): Promise<IRepository | undefined> {
            return undefined;
          },
        };

        const service = new Service(model);
        const result = await service.EditRepository(repositoryKey, repositoryInput);

        expect(result).toBeUndefined();
      });
    });
  });
});
