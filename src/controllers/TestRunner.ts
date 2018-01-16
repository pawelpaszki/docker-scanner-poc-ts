import {Router, Request, Response, NextFunction} from 'express';

import {ChildProcessHandler} from "./ChildProcessHandler";

export class TestRunner {
	private router: Router;

	constructor() {
		this.router = Router();
		this.init();
	}

	public runTests(req: Request, res: Response, next: NextFunction) {
		let path = req.body.path;
		let successMessage, errorMessage = "placeholder - not needed";
		let testRan = false;
		async function runNodeTests () {
			try {
				// check if package.json exists in directory
				let output = await ChildProcessHandler.executeIntermediateChildProcCommand("cd " + path + " && find . -maxdepth 1 -name \"package.json\"", false);
				if (output.lentgh == 0) {
					this.throwError(res, "invalid directory");
				} else {
					// run docker tests
					testRan = true;
					output = await ChildProcessHandler.executeIntermediateChildProcCommand("cd " + path + " && npm test > result.txt", true);
					if(output != null) {
						await ChildProcessHandler.executeFinalChildProcessCommand("cd " + path + " && cat result.txt", JSON.parse(successMessage), res, errorMessage, true);
					}
				}
			} catch (error) {
				// possible to get errors when running tests
				if(testRan) {
					await ChildProcessHandler.executeFinalChildProcessCommand("cd " + path + " && cat result.txt", successMessage, res, errorMessage, true);
				} else {
					this.throwError(res, "unable to run tests");
				}
			}
		}
		runNodeTests();
	}

	private init() {
		this.router.post('/api/runTests', this.runTests);
	}

	private throwError(res:Response, message: string) {
		return res.status(500)
			.send({
				message: message,
				status: res.status
			});
	}
}