import {Router, Request, Response, NextFunction} from 'express';

import * as child from 'child_process';

export class ImageFetcher {
    private router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    public fetchImage(req: Request, res: Response, next: NextFunction) {
        let imageName = req.body.name;
        let ch: child.ChildProcess = child.exec("docker pull " + imageName, function (error, stdout, stderr) {
            if (error) {
                res.status(500)
                    .send({
                        message: error,
                        status: res.status
                    });
            }
            if (stdout) {
                res.status(200)
                    .send({
                        message: "image successfully pulled",
                        status: res.status
                    });
            }
            if (stdout) {
                res.status(401)
                    .send({
                        message: stderr,
                        status: res.status
                    });
            }
        });
    }

    private init() {
        this.router.post('/api/fetchImage', this.fetchImage);
    }
}