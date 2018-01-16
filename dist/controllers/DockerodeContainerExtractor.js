"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Docker = require("dockerode");
const fs = require("fs");
let docker = new Docker({
    socketPath: '/var/run/docker.sock'
});
class DockerodeContainerExtractor {
    static extractContainer(containerName) {
        let p = new Promise((resolve, reject) => {
            setTimeout(() => {
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
                            resolve(new Error("Could not export container"));
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
exports.DockerodeContainerExtractor = DockerodeContainerExtractor;
//# sourceMappingURL=DockerodeContainerExtractor.js.map