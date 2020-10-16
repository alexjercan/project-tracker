import { Request, Response, NextFunction, Router } from 'express';
import { verify } from '../token';

const api = () => {
  const router = Router();

  router.use(verify);

  router.get('/', (req: Request, res: Response, next: NextFunction) => {
    
    return res.status(200).send('peepeepoopoo' + username));
  };

  return router;
};

export default api;
