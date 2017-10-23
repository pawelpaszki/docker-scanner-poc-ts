import {Router, Request, Response, NextFunction} from 'express';

import {ChildProcessHandler} from "./ChildProcessHandler";

export class DependenciesBumper {
    private router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    public bumpDependencies(req: Request, res: Response, next: NextFunction) {
        let path = req.body.path;
        let successMessage = "components updated";
        let errorMessage = "Could not update components";
        async function bumpDeps () {
            try {
                // check if package.json exists in directory
                let output = await ChildProcessHandler.executeIntermediateChildProcCommand("cd " + path + " && find . -maxdepth 1 -name \"package.json\"", false);
                if(output.lentgh == 0) {
                    this.throwError(res);
                } else {
                    // update components
                    output = await ChildProcessHandler.executeIntermediateChildProcCommand("cd " + path + " && ncu -a --packageFile package.json", false);
                    if(output != null) {
                        // install updated components
                        await ChildProcessHandler.executeFinalChildProcessCommand("cd " + path + " && npm install", successMessage, res, errorMessage, false);
                    }
                }
            } catch (error) {
                this.throwError(res);
            }
        }
        bumpDeps();
    }

    private throwError(res:Response) {
        return res.status(500)
            .send({
                message: "Invalid directory",
                status: res.status
            });
    }

    private init() {
        this.router.post('/api/bumpDependencies', this.bumpDependencies);
    }
}