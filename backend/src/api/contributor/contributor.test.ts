import Service from './service';
import { IContributor, IContributorInput, IContributorKey } from './types';
import Model from './model';

describe('Contributor Tests', () => {
  describe('Contributor Service Tests', () => {
    const returnsRecordCreate = async (
      contributorKey: IContributorKey,
      contributorInput: IContributorInput,
    ): Promise<IContributor | undefined> => {
      return {
        ...contributorKey,
        ...contributorInput,
      };
    };

    const returnsUndefinedCreate = async (
      contributorKey: IContributorKey,
      contributorInput: IContributorInput,
    ): Promise<IContributor | undefined> => {
      return undefined;
    };

    const returnsRecordsFindAll = async (
      ownerUsername: string,
      projectName: string,
    ): Promise<IContributor[] | undefined> => {
      return [
        {
          contributor_username: 'contributor1',
          owner_username: 'owner',
          project_name: 'project',
        },
        {
          contributor_username: 'contributor2',
          owner_username: 'owner',
          project_name: 'project',
        },
      ];
    };

    const returnsUndefinedFindAll = async (
      ownerUsername: string,
      projectName: string,
    ): Promise<IContributor[] | undefined> => {
      return undefined;
    };

    const returnsRecordFindOne = async (contributorKey: IContributorKey): Promise<IContributor | undefined> => {
      return {
        ...contributorKey,
      };
    };

    const returnsUndefinedFindOne = async (contributorKey: IContributorKey): Promise<IContributor | undefined> => {
      return undefined;
    };

    describe('AddContributor', () => {
      it('Should return a record when the model creates a record', async () => {
        const model: Model = {
          Create: returnsRecordCreate,
          FindOne: returnsUndefinedFindOne,
          FindAll: returnsUndefinedFindAll,
        };

        const contributorKey: IContributorKey = {
          contributor_username: 'contributor',
          owner_username: 'owner',
          project_name: 'project',
        };

        const contributorInput: IContributorInput = {};

        const service = new Service(model);
        const record = await service.AddContributor(contributorKey, contributorInput);

        expect(record).toBeDefined();
        expect(record?.contributor_username).toBe(contributorKey.contributor_username);
        expect(record?.owner_username).toBe(contributorKey.owner_username);
        expect(record?.project_name).toBe(contributorKey.project_name);
      });
      it('Should return undefined when the model does not create a record', async () => {
        const model: Model = {
          Create: returnsUndefinedCreate,
          FindOne: returnsUndefinedFindOne,
          FindAll: returnsUndefinedFindAll,
        };

        const contributorKey: IContributorKey = {
          contributor_username: 'contributor',
          owner_username: 'owner',
          project_name: 'project',
        };

        const contributorInput: IContributorInput = {};

        const service = new Service(model);
        const record = await service.AddContributor(contributorKey, contributorInput);

        expect(record).toBeUndefined();
      });
    });
    describe('GetContributors', () => {
      it('Should return the records when the model returns records', async () => {
        const model: Model = {
          Create: returnsRecordCreate,
          FindOne: returnsUndefinedFindOne,
          FindAll: returnsRecordsFindAll,
        };

        const contributorInput: IContributorInput = {};

        const service = new Service(model);
        const records = await service.GetContributors('owner', 'project');

        expect(records).toBeDefined();
        expect(records?.length).toBe(2);
      });
      it('Should return undefined when the model returns undefined', async () => {
        const model: Model = {
          Create: returnsUndefinedCreate,
          FindOne: returnsUndefinedFindOne,
          FindAll: returnsUndefinedFindAll,
        };

        const contributorInput: IContributorInput = {};

        const service = new Service(model);
        const records = await service.GetContributors('owner', 'project');

        expect(records).toBeUndefined();
      });
    });
  });
});
