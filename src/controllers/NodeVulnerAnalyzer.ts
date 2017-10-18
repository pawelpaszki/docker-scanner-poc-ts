import {Router, Request, Response, NextFunction} from 'express';

import * as child from 'child_process';

export class NodeVulnerAnalyzer {
    private router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    public analyzeSourceCode(req: Request, res: Response, next: NextFunction) {
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
            if (stdout) {
                ch: child.ChildProcess = child.exec("cd " + path + " && nsp check --output json 2>> vuln.json", function (error, stdout, stderr) {
                    console.log("stdout" + stdout + " stderr " + stderr + " error" + error);
                    if (error) {
                        if(stdout != null) {
                            ch: child.ChildProcess = child.exec("cd " + path + " && cat vuln.json", function (error, stdout, stderr) {
                                console.log("stdout" + stdout + " stderr " + stderr);
                                if (error) {
                                    return res.status(500)
                                        .send({
                                            message: error,
                                            status: res.status
                                        });
                                } else {
                                    return res.status(200)
                                        .send({
                                            message: stdout.toString(),
                                            status: res.status
                                        });
                                }

                            });
                        }
                    }

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
    }

    private init() {
        this.router.post('/api/analyzeSourceCode', this.analyzeSourceCode);
    }
}