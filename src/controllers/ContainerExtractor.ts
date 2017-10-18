import {Router, Request, Response, NextFunction} from 'express';

import * as child from 'child_process';
import * as Docker from 'dockerode';
import * as fs from 'fs';

let docker = new Docker({
    socketPath: '/var/run/docker.sock'
});

export class ContainerExtractor {
    private router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    public extractContainer(req: Request, res: Response, next: NextFunction) {
        let containerName = req.body.name;

        docker.createContainer({
            Image: containerName,
            AttachStdin: false,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true,
            OpenStdin: false,
            StdinOnce: false
        }).then(function (container) {
            container.start();
            // export container to .tar
            container.export(function (err, stream) {
                if (err) {
                    return console.log("Error when exporting");
                }
                console.log("Start writing to tar");
                let ws = fs.createWriteStream("test.tar");
                stream.pipe(ws);
                ws.on('finish', function () {
                    let ch: child.ChildProcess = child.exec("cd .. && mkdir test_dir", function (error, stdout, stderr) {
                        if (error) {
                            console.log('error: ' + error);
                        }
                        // untar exported container into newly created directory
                        ch: child.ChildProcess = child.exec("tar -x -f test.tar --directory ../test_dir", function (error, stdout, stderr) {
                            console.log("Start extracting from tar");
                            if (error) {
                                res.status(500)
                                    .send({
                                        message: error,
                                        status: res.status
                                    });
                            } else {
                                container.stop();
                                ch: child.ChildProcess = child.exec("rm -rf test.tar", function (error, stdout, stderr) {
                                    if (error) {
                                        res.status(500)
                                            .send({
                                                message: error,
                                                status: res.status
                                            });
                                    } else {
                                        res.status(200)
                                            .send({
                                                message: "container extracted",
                                                status: res.status
                                            });
                                    }
                                });
                            }
                        });
                    });
                });
            });
        });
    }

    private init() {
        this.router.post('/api/extractContainer', this.extractContainer);
    }
}