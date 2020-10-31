import Service from './service';
import { IComment, ICommentInput, ICommentKey } from './types';
import Model from './model';

describe('Comment Tests', () => {
  describe('Comment Service Tests', () => {
    const returnsRecordCreate = async (
      commentKey: ICommentKey,
      commentInput: ICommentInput,
    ): Promise<IComment | undefined> => {
      return {
        ...commentKey,
        ...commentInput,
        timestamp: 'timestamp',
      };
    };

    const returnsUndefinedCreate = async (
      commentKey: ICommentKey,
      commentInput: ICommentInput,
    ): Promise<IComment | undefined> => {
      return undefined;
    };

    const returnsRecordsFindAll = async (
      ownerUsername: string,
      projectName: string,
      username: string,
    ): Promise<IComment[] | undefined> => {
      return [
        {
          project_name: 'name',
          owner_username: 'owner',
          username: 'username',
          description: 'description1',
          timestamp: 'timestamp1',
        },
        {
          project_name: 'name',
          owner_username: 'owner',
          username: 'username',
          description: 'description2',
          timestamp: 'timestamp2',
        },
      ];
    };

    const returnsUndefinedFindAll = async (
      ownerUsername: string,
      projectName: string,
      username: string,
    ): Promise<IComment[] | undefined> => {
      return undefined;
    };

    describe('AddComment', () => {
      it('Should return a record when the model creates a record', async () => {
        const model: Model = {
          Create: returnsRecordCreate,
          FindAll: returnsUndefinedFindAll,
        };

        const commentKey: ICommentKey = {
          project_name: 'project',
          owner_username: 'owner',
          username: 'username',
        };

        const commentInput: ICommentInput = {
          description: 'description1',
        };

        const service = new Service(model);
        const record = await service.AddComment(commentKey, commentInput);

        expect(record).toBeDefined();
        expect(record?.project_name).toBe(commentKey.project_name);
        expect(record?.owner_username).toBe(commentKey.owner_username);
        expect(record?.username).toBe(commentKey.username);
        expect(record?.description).toBe(commentInput.description);
        expect(record?.timestamp).toBe('timestamp');
      });
      it('Should return undefined when the model does not create a record', async () => {
        const model: Model = {
          Create: returnsUndefinedCreate,
          FindAll: returnsUndefinedFindAll,
        };

        const commentKey: ICommentKey = {
          owner_username: 'owner',
          project_name: 'project',
          username: 'username',
        };

        const commentInput: ICommentInput = {
          description: 'description',
        };

        const service = new Service(model);
        const record = await service.AddComment(commentKey, commentInput);

        expect(record).toBeUndefined();
      });
    });
    describe('GetComments', () => {
      it('Should return the records when the model returns records', async () => {
        const model: Model = {
          Create: returnsUndefinedCreate,
          FindAll: returnsRecordsFindAll,
        };

        const service = new Service(model);
        const records = await service.GetComments('owner', 'project', 'username');

        expect(records).toBeDefined();
        expect(records?.length).toBe(2);
      });
      it('Should return undefined when the model returns undefined', async () => {
        const model: Model = {
          Create: returnsUndefinedCreate,
          FindAll: returnsUndefinedFindAll,
        };

        const service = new Service(model);
        const records = await service.GetComments('owner', 'project', 'username');

        expect(records).toBeUndefined();
      });
    });
  });
});
