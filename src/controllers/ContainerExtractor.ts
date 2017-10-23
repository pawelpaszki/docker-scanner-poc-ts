import {Router, Request, Response, NextFunction} from 'express';

import {DockerodeContainerExtractor} from "./DockerodeContainerExtractor";
import {ChildProcessHandler} from "./ChildProcessHandler";

export class ContainerExtractor {
    private router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    public extractContainer(req: Request, res: Response, next: NextFunction) {
        let containerName = req.body.name;
        let successMessage = "container extracted";
        let errorMessage = "unable to extract container";
        let mkdirStarted = false;

        async function extractCont () {
            try {
                let output = await DockerodeContainerExtractor.extractContainer(containerName);
                mkdirStarted = true;
                await ChildProcessHandler.executeIntermediateChildProcCommand("cd .. && mkdir test_dir", true);
                await ChildProcessHandler.executeIntermediateChildProcCommand("tar -x -f test.tar --directory ../test_dir", true);
                await ChildProcessHandler.executeFinalChildProcessCommand("rm -rf test.tar", successMessage, res, errorMessage, true);

            } catch (error) {
                if(mkdirStarted) {
                    await ChildProcessHandler.executeIntermediateChildProcCommand("tar -x -f test.tar --directory ../test_dir", true);
                    await ChildProcessHandler.executeFinalChildProcessCommand("rm -rf test.tar", successMessage, res, errorMessage, true);
                }
            }
        }

        extractCont();
    }

    private init() {
        this.router.post('/api/extractContainer', this.extractContainer);
    }

    private throwError(res:Response, message: string) {
        return res.status(500)
            .send({
                message: message,
                status: res.status
            });
    }
}