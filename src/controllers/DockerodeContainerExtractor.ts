import * as Docker from 'dockerode';
import * as fs from 'fs';

let docker = new Docker({
    socketPath: '/var/run/docker.sock'
});

export class DockerodeContainerExtractor {
    public static extractContainer(containerName: string): Promise {
        let p: Promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                docker.createContainer({
                    Image: containerName,
                    AttachStdin: false,
                    AttachStdout: true,
                    AttachStderr: true,
                    Tty: true,
                    OpenStdin: false,
                    StdinOnce: false
                }).then(

                    function (container) {
                        container.start();
                        // export container to .tar
                        container.export(function (err, stream) {
                            if (err) {
                                resolve (new Error("Could not export container"));
                            }
                            console.log("Start writing to tar");
                            let ws = fs.createWriteStream("test.tar");
                            stream.pipe(ws);
                            ws.on('finish', function () {
                                resolve(container);
                            });
                        });
                    });
            }, 200);
        });
        return p;
    }
}