import Service from './service';
import { IProject, IProjectKey } from './types';
import Model from './model';

describe('Project Tests', () => {
  describe('Project Service Tests', () => {
    describe('CreateProject', () => {
      it('Should return the record when the model creates a record', async () => {
        const model: Model = {
          async Create(project: IProjectKey): Promise<IProject | undefined> {
            return {
              username: "username",
              project_name: project.project_name
            };
          },
          async FindOne(projectInput: IProjectKey): Promise<IProject | undefined> {
            return undefined;
          },
          async FindAll(userId: number): Promise<IProject[] | undefined> {
            return undefined;
          },
        };

        const userInput: IProjectKey = {
          user_id: 1,
          project_name: 'project',
        };

        const service = new Service(model);
        const record = await service.CreateProject(userInput);

        expect(record).toBeDefined();
        expect(record?.project_name).toBe(userInput.project_name);
      });
      it('Should return undefined when the model does not create a record', async () => {
        const userInput: IProjectKey = {
          user_id: 1,
          project_name: 'project',
        };

        const model: Model = {
          async Create(project: IProjectKey): Promise<IProject | undefined> {
            return undefined;
          },
          async FindOne(projectInput: IProjectKey): Promise<IProject | undefined> {
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
    describe('GetProjects', () => {
      it('Should return the records when the model finds records', async () => {
        const userId = 1;

        const model: Model = {
          async Create(project: IProjectKey): Promise<IProject | undefined> {
            return undefined;
          },
          async FindOne(projectInput: IProjectKey): Promise<IProject | undefined> {
            return undefined;
          },
          async FindAll(userId: number): Promise<IProject[] | undefined> {
            return [
              {
                username: "username",
                project_name: 'projectName1',
              },
              {
                username: "username",
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
          async Create(project: IProjectKey): Promise<IProject | undefined> {
            return undefined;
          },
          async FindOne(projectInput: IProjectKey): Promise<IProject | undefined> {
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
