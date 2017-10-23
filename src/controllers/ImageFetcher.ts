import {Router, Request, Response} from 'express';

import {ChildProcessHandler} from "./ChildProcessHandler";

export class ImageFetcher {
    private router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    fetchImage(req: Request, res: Response) {
        let imageName = req.body.name;
        let successMessage = "image successfully pulled";
        ChildProcessHandler.executeFinalChildProcessCommand("docker pull " + imageName, successMessage, res,  "could not pull the image: " + imageName, false);

    }

    private init() {
        this.router.post('/api/fetchImage', this.fetchImage);
    }
}

