import {Router, Request, Response, NextFunction} from 'express';

import * as child from 'child_process';

export class TestRunner {
    private router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    public runTests(req: Request, res: Response, next: NextFunction) {
        let path = req.body.path;
        let ch: child.ChildProcess = child.exec("cd " + path + " && find . -maxdepth 1 -name \"package.json\"", function (error, stdout, stderr) {
            if (error) {
                return res.status(500)
                    .send({
                        message: error,
                        status: res.status
                    });
            }
            if(stdout.length == 0) {
                return res.status(500)
                    .send({
                        message: "invalid directory",
                        status: res.status
                    });
            }
            ch: child.ChildProcess = child.exec("cd " + path + " && npm test > result.txt", function (error, stdout, stderr) {
                ch: child.ChildProcess = child.exec("cd " + path + " && cat result.txt", function(error, stdout, stderr) {
                    if (error) {
                        return res.status(500)
                            .send({
                                message: error,
                                status: res.status
                            });
                    }
                    if (stdout) {
                        return res.status(200)
                            .send({
                                message: stdout,
                                status: res.status
                            });
                    }
                    if (stderr) {
                        return res.status(401)
                            .send({
                                message: stderr,
                                status: res.status
                            });
                    }
                });
            });
        });
    }

    private init() {
        this.router.post('/api/runTests', this.runTests);
    }
}