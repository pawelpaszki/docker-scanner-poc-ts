"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const child = require("child_process");
class ChildProcessHandler {
    constructor() {
        this.router = express_1.Router();
    }
    static executeFinalChildProcessCommand(command, successMessage, res, errorMessage, exactOutputRequired) {
        let ch = child.exec(command, function (error, stdout, stderr) {
            //console.log("stdout" + stdout + " stderr " + stderr + " error: " + error);
            //console.log(command);
            if (error) {
                return res.status(500)
                    .send({
                    message: errorMessage,
                    status: res.status
                });
            }
            if (stdout || error == null) {
                if (exactOutputRequired && stdout.length > 0) {
                    return res.status(200)
                        .send({
                        message: stdout,
                        status: res.status
                    });
                }
                else {
                    return res.status(200)
                        .send({
                        message: successMessage,
                        status: res.status
                    });
                }
            }
            // need to think about handling getting warnings when updating modules
            if (stderr) {
                return res.status(401)
                    .send({
                    message: stderr,
                    status: res.status
                });
            }
        });
    }
    static executeIntermediateChildProcCommand(command, errorsPossible) {
        let p = new Promise((resolve, reject) => {
            setTimeout(() => {
                let ch = child.exec(command, function (error, stdout, stderr) {
                    // console.log("stdout" + stdout + " stderr " + stderr + " error " + error);
                    // console.log(command);
                    if (error) {
                        if (errorsPossible === true) {
                            if (error === null) {
                                resolve(error);
                            }
                            else {
                                resolve("done");
                            }
                        }
                        else {
                            console.log("reject");
                            reject(error);
                        }
                    }
                    else if (stdout) {
                        resolve(stdout);
                    }
                    else if (stderr) {
                        if (errorsPossible === true) {
                            resolve(stderr);
                        }
                        else {
                            reject(stderr);
                        }
                    }
                    else {
                        resolve("done");
                    }
                });
            }, 200);
        });
        return p;
    }
}
exports.ChildProcessHandler = ChildProcessHandler;
//# sourceMappingURL=ChildProcessHandler.js.map