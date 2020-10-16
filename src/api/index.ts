import { Request, Response, NextFunction, Router } from 'express';
import { IVerified, verify } from '../token';

const api = () => {
  const router = Router();

  router.use(verify);

  router.get('/', (req: Request, res: Response, next: NextFunction) => {
    const verified: IVerified = req.body.verified;
    return res.status(200).send('peepeepoopoo ' + verified.username);
  });

  return router;
};

export default api;
