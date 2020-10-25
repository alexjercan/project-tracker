import Service from './service';
import { IProject, IProjectInput } from './types';
import Model from './model';

describe('Project Tests', () => {
  describe('Project Service Tests', () => {
    describe('CreateProject', () => {
      it('Should return the record when the model creates a record', async () => {
        const model: Model = {
          async Create(project: IProjectInput): Promise<IProject | undefined> {
            return {
              project_id: 1,
              owner_id: project.user_id,
              ...project,
            };
          },
          async FindOne(projectInput: IProjectInput): Promise<IProject | undefined> {
            return undefined;
          },
          async FindAll(userId: number): Promise<IProject[] | undefined> {
            return undefined;
          },
        };

        const userInput: IProjectInput = {
          user_id: 1,
          project_name: 'project',
        };

        const service = new Service(model);
        const record = await service.CreateProject(userInput);

        expect(record).toBeDefined();
        expect(record?.owner_id).toBe(userInput.user_id);
        expect(record?.project_name).toBe(userInput.project_name);
      });
      it('Should return undefined when the model does not create a record', async () => {
        const userInput: IProjectInput = {
          user_id: 1,
          project_name: 'project',
        };

        const model: Model = {
          async Create(project: IProjectInput): Promise<IProject | undefined> {
            return undefined;
          },
          async FindOne(projectInput: IProjectInput): Promise<IProject | undefined> {
            return undefined;
          },
          async FindAll(userId: number): Promise<IProject[] | undefined> {
            return undefined;
          },
        };

        const service = new Service(model);
        const record = await service.CreateProject(userInput);

        expect(record).toBeUndefined();
      });
    });
    describe('GetProject', () => {
      it('Should return the record when the model finds a record', async () => {
        const userInput: IProjectInput = {
          user_id: 1,
          project_name: 'project',
        };

        const model: Model = {
          async Create(project: IProjectInput): Promise<IProject | undefined> {
            return undefined;
          },
          async FindOne(projectInput: IProjectInput): Promise<IProject | undefined> {
            return {
              owner_id: projectInput.user_id,
              project_id: 1,
              project_name: projectInput.project_name,
            };
          },
          async FindAll(userId: number): Promise<IProject[] | undefined> {
            return undefined;
          },
        };

        const service = new Service(model);
        const record = await service.GetProject(userInput);

        expect(record).toBeDefined();
        expect(record?.project_name).toBe(userInput.project_name);
        expect(record?.owner_id).toBe(userInput.user_id);
      });
      it('Should return undefined when the model does not find a record', async () => {
        const userInput: IProjectInput = {
          user_id: 1,
          project_name: 'project',
        };

        const model: Model = {
          async Create(project: IProjectInput): Promise<IProject | undefined> {
            return undefined;
          },
          async FindOne(projectInput: IProjectInput): Promise<IProject | undefined> {
            return undefined;
          },
          async FindAll(userId: number): Promise<IProject[] | undefined> {
            return undefined;
          },
        };

        const service = new Service(model);
        const record = await service.GetProject(userInput);

        expect(record).toBeUndefined();
      });
    });
    describe('GetProjects', () => {
      it('Should return the records when the model finds records', async () => {
        const userId = 1;

        const model: Model = {
          async Create(project: IProjectInput): Promise<IProject | undefined> {
            return undefined;
          },
          async FindOne(projectInput: IProjectInput): Promise<IProject | undefined> {
            return undefined;
          },
          async FindAll(userId: number): Promise<IProject[] | undefined> {
            return [
              {
                owner_id: 1,
                project_id: 1,
                project_name: 'projectName1',
              },
              {
                owner_id: 1,
                project_id: 2,
                project_name: 'projectName2',
              },
            ];
          },
        };

        const service = new Service(model);
        const records = await service.GetProjects(userId);

        expect(records).toBeDefined();
        expect(records?.length).toBe(2);
      });
      it('Should return undefined when the model does not find a record', async () => {
        const userId = 1;

        const model: Model = {
          async Create(project: IProjectInput): Promise<IProject | undefined> {
            return undefined;
          },
          async FindOne(projectInput: IProjectInput): Promise<IProject | undefined> {
            return undefined;
          },
          async FindAll(userId: number): Promise<IProject[] | undefined> {
            return undefined;
          },
        };

        const service = new Service(model);
        const records = await service.GetProjects(userId);

        expect(records).toBeUndefined();
      });
    });
  });
});
