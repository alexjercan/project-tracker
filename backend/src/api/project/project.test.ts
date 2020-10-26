import Service from './service';
import { IProject, IProjectInput, IProjectKey } from './types';
import Model from './model';

describe('Project Tests', () => {
  describe('Project Service Tests', () => {
    const returnsRecordCreate = async (
      projectKey: IProjectKey,
      projectInput: IProjectInput,
    ): Promise<IProject | undefined> => {
      return {
        ...projectKey,
        ...projectInput,
      };
    };

    const returnsUndefinedCreate = async (
      projectKey: IProjectKey,
      projectInput: IProjectInput,
    ): Promise<IProject | undefined> => {
      return undefined;
    };

    const returnsUndefinedFindOne = async (projectKey: IProjectKey): Promise<IProject | undefined> => {
      return undefined;
    };

    const returnsRecordsFindAll = async (username: string): Promise<IProject[] | undefined> => {
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
    };

    const returnsUndefinedFindAll = async (username: string): Promise<IProject[] | undefined> => {
      return undefined;
    };

    describe('CreateProject', () => {
      it('Should return the record when the model creates a record', async () => {
        const model: Model = {
          Create: returnsRecordCreate,
          FindOne: returnsUndefinedFindOne,
          FindAll: returnsUndefinedFindAll,
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
          Create: returnsUndefinedCreate,
          FindOne: returnsUndefinedFindOne,
          FindAll: returnsUndefinedFindAll,
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
          Create: returnsUndefinedCreate,
          FindOne: returnsUndefinedFindOne,
          FindAll: returnsRecordsFindAll,
        };

        const service = new Service(model);
        const records = await service.GetProjects(username);

        expect(records).toBeDefined();
        expect(records?.length).toBe(2);
      });
      it('Should return undefined when the model does not find a record', async () => {
        const username = 'username';

        const model: Model = {
          Create: returnsUndefinedCreate,
          FindOne: returnsUndefinedFindOne,
          FindAll: returnsUndefinedFindAll,
        };

        const service = new Service(model);
        const records = await service.GetProjects(username);

        expect(records).toBeUndefined();
      });
    });
  });
});
