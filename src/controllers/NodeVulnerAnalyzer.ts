import {Router, Request, Response, NextFunction} from 'express';

import {ChildProcessHandler} from "./ChildProcessHandler";

export class NodeVulnerAnalyzer {
    private router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    public analyzeSourceCode(req: Request, res: Response, next: NextFunction) {
        let path = req.body.path;
        let successMessage, errorMessage = "placeholder - not needed";
        let testRan = false;
        async function checkVuln () {
            try {
                // check if package.json exists in directory
                let output = await ChildProcessHandler.executeIntermediateChildProcCommand("cd " + path + " && find . -maxdepth 1 -name \"package.json\"", false);
                if(output.lentgh == 0) {
                    this.throwError(res);
                } else {
                    // run vuln test
                    testRan = true;
                    output = await ChildProcessHandler.executeIntermediateChildProcCommand("cd " + path + " && nsp check > vuln.txt", true);
                    if(output != null) {
                        // output results
                        await ChildProcessHandler.executeFinalChildProcessCommand("cd " + path + " && cat vuln.txt", successMessage, res, errorMessage, true);
                    }
                }
            } catch (error) {
                // possible to get errors as a result of vuln check
                if(testRan) {
                    await ChildProcessHandler.executeFinalChildProcessCommand("cd " + path + " && cat vuln.txt", successMessage, res, errorMessage, true);
                } else {
                    this.throwError(res, "unable to run tests");
                }
            }
        }
        checkVuln();
    }

    private init() {
        this.router.post('/api/analyzeSourceCode', this.analyzeSourceCode);
    }

    private throwError(res:Response, message: string) {
        return res.status(500)
            .send({
                message: message,
                status: res.status
            });
    }
}