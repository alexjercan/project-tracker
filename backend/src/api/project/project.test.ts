import Service from './service';
import { IProject, IProjectInput, IProjectKey } from './types';
import Model from './model';

describe('Project Tests', () => {
  describe('Project Service Tests', () => {
    describe('CreateProject', () => {
      it('Should return the record when the model creates a record', async () => {
        const model: Model = {
          async Create(project: IProjectKey): Promise<IProject | undefined> {
            return {
              owner_username: 'username',
              project_name: project.project_name,
            };
          },
          async FindOne(projectInput: IProjectKey): Promise<IProject | undefined> {
            return undefined;
          },
          async FindAll(username: string): Promise<IProject[] | undefined> {
            return undefined;
          },
        };

        const userKey: IProjectKey = {
          owner_username: 'username',
          project_name: 'project',
        };

        const userInput: IProjectInput = {};

        const service = new Service(model);
        const record = await service.CreateProject(userKey, userInput);

        expect(record).toBeDefined();
        expect(record?.project_name).toBe(userKey.project_name);
      });
      it('Should return undefined when the model does not create a record', async () => {
        const userKey: IProjectKey = {
          owner_username: 'username',
          project_name: 'project',
        };

        const userInput: IProjectInput = {};

        const model: Model = {
          async Create(project: IProjectKey): Promise<IProject | undefined> {
            return undefined;
          },
          async FindOne(projectInput: IProjectKey): Promise<IProject | undefined> {
            return undefined;
          },
          async FindAll(username: string): Promise<IProject[] | undefined> {
            return undefined;
          },
        };

        const service = new Service(model);
        const record = await service.CreateProject(userKey, userInput);

        expect(record).toBeUndefined();
      });
    });
    describe('GetProjects', () => {
      it('Should return the records when the model finds records', async () => {
        const username = 'username';

        const model: Model = {
          async Create(project: IProjectKey): Promise<IProject | undefined> {
            return undefined;
          },
          async FindOne(projectInput: IProjectKey): Promise<IProject | undefined> {
            return undefined;
          },
          async FindAll(username: string): Promise<IProject[] | undefined> {
            return [
              {
                owner_username: 'username',
                project_name: 'projectName1',
              },
              {
                owner_username: 'username',
                project_name: 'projectName2',
              },
            ];
          },
        };

        const service = new Service(model);
        const records = await service.GetProjects(username);

        expect(records).toBeDefined();
        expect(records?.length).toBe(2);
      });
      it('Should return undefined when the model does not find a record', async () => {
        const username = 'username';

        const model: Model = {
          async Create(project: IProjectKey): Promise<IProject | undefined> {
            return undefined;
          },
          async FindOne(projectInput: IProjectKey): Promise<IProject | undefined> {
            return undefined;
          },
          async FindAll(username: string): Promise<IProject[] | undefined> {
            return undefined;
          },
        };

        const service = new Service(model);
        const records = await service.GetProjects(username);

        expect(records).toBeUndefined();
      });
    });
  });
});
