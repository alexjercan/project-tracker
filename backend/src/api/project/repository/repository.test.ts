import Model from './model';
import { IProjectInput, IRepository, IRepositoryInput } from './types';
import Service from './service';

describe('Repository Tests', () => {
  describe('Repository Service Tests', () => {
    describe('GetRepository', () => {
      it('Should return the record when the model finds one', async () => {
        const model: Model = {
          async Edit(repositoryInput: IRepositoryInput): Promise<IRepository | undefined> {
            return undefined;
          },
          async FindOne(projectInput): Promise<IRepository | undefined> {
            return {
              deadline: '',
              description: '',
              last_modified: '',
              progress: '',
              started: '',
            };
          },
        };

        const projectInput: IProjectInput = {
          user_id: 1,
          project_name: '',
        };

        const service = new Service(model);
        const result = await service.GetRepository(projectInput);

        expect(result).toBeDefined();
      });
      it('Should return undefined when the model does not find a record', async () => {
        const model: Model = {
          async Edit(repositoryInput: IRepositoryInput): Promise<IRepository | undefined> {
            return undefined;
          },
          async FindOne(projectInput: IProjectInput): Promise<IRepository | undefined> {
            return undefined;
          },
        };

        const projectInput: IProjectInput = {
          user_id: 1,
          project_name: '',
        };

        const service = new Service(model);
        const result = await service.GetRepository(projectInput);

        expect(result).toBeUndefined();
      });
    });
    describe('EditRepository', () => {
      it('Should return the record when the model edits it', async () => {
        const repositoryInput: IRepositoryInput = {
          deadline: '20-03-2020',
          description: 'description',
          progress: 'progress',
          project_name: '',
          user_id: 1,
        };
        
        const model: Model = {
          async Edit(repositoryInput: IRepositoryInput): Promise<IRepository | undefined> {
            return {
              deadline: repositoryInput.deadline,
              description: repositoryInput.description,
              last_modified: '',
              progress: repositoryInput.progress,
              started: '',
            }; 
          },
          async FindOne(projectInput: IProjectInput): Promise<IRepository | undefined> {
            return undefined;
          },
        };
        
        const service = new Service(model);
        const result = await service.EditRepository(repositoryInput);
        
        expect(result).toBeDefined();
        expect(result?.description).toBe(repositoryInput.description);
        expect(result?.progress).toBe(repositoryInput.progress);
        expect(result?.deadline).toBe(repositoryInput.deadline);
      });
      it('Should return undefined when the model does not edit it', async () => {
        const repositoryInput: IRepositoryInput = {
          deadline: '20-03-2020',
          description: 'description',
          progress: 'progress',
          project_name: '',
          user_id: 1,
        };

        const model: Model = {
          async Edit(repositoryInput: IRepositoryInput): Promise<IRepository | undefined> {
            return undefined;
          },
          async FindOne(projectInput: IProjectInput): Promise<IRepository | undefined> {
            return undefined;
          },
        };

        const service = new Service(model);
        const result = await service.EditRepository(repositoryInput);

        expect(result).toBeUndefined();
      })
    });
  });
});
