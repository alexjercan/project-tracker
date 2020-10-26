import { Router } from 'express';
import { contributorSuccess } from './middleware';
import Controller from "./controller";
import Service from "./service";
import Model from "./model";

const contributor = () => {
    const model = new Model();
    const service = new Service(model);
    const controller = new Controller(service);

    const router = Router();

    router.post('/', controller.AddContributor.bind(controller), contributorSuccess);
    router.get('/', controller.GetContributors.bind(controller), contributorSuccess);

    return router;
};

export default contributor;
