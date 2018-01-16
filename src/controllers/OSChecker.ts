import {Router, Request, Response} from 'express';

import {ChildProcessHandler} from "./ChildProcessHandler";
import * as get from 'simple-get';
import * as lodash from 'lodash';

export class OSChecker {
    private router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    checkOS(req: Request, response: Response) {
        let path = req.body.path;
        async function checkImagesOS () {
            try {
                // check if package.json exists in directory
                let output: string = await ChildProcessHandler.executeIntermediateChildProcCommand("cd " + path + " && cat etc/os-release", false);
                if (output.length == 0) {
                    this.throwError(response, "invalid directory");
                } else {
                    let idIndex: number = output.indexOf('ID') + 3;
                    let endOSnameIndex = idIndex + output.substring(idIndex).indexOf('\n');
                    let osName = output.substr(idIndex, endOSnameIndex - idIndex);
                    //console.log(output);
                    let prettyNameStartIndex = output.indexOf('PRETTY_NAME');
                    let endOfPrettyNameLineIndex = prettyNameStartIndex + output.substring(prettyNameStartIndex).indexOf('\n');
                    let prettyNameString: string = output.substring(prettyNameStartIndex, endOfPrettyNameLineIndex);
                    let start: number = 0;
                    let end: number = prettyNameString.length;
                    let startSet: boolean = false;
                    for(let i = 0; i < prettyNameString.length; i++) {
                        if(!isNaN(parseInt(prettyNameString.charAt(i))) && !startSet) {
                            start = i;
                            startSet = true;
                        }
                        if(startSet) {
                            if(!(!isNaN(parseInt(prettyNameString.charAt(i))) || prettyNameString.charAt(i) === '.')) {
                                end = i;
                                break;
                            }
                        }

                    }
                    let osVersion = prettyNameString.substring(start, end);
                    //console.log('version: ', prettyNameString.substring(start, end));
                    let url: string = 'https://registry.hub.docker.com/v2/repositories/library/' + osName + '/tags/';
                    let jsonResponse = null;
                    get.concat(url, function(err, res, data) {
                        if (err) {
                            return response.status(500)
                                .send({
                                    message: 'unable to get OS version',
                                    status: res.status
                                });
                        }
                        jsonResponse = JSON.parse(data.toString());
                        let results = lodash.map(jsonResponse.results, 'name');

                        //console.log(results);
                        let osVersions  = results.filter(function(el) {
                            return el.length && el==+el;
                        });
                        osVersions.sort();
                        let versionIndex = osVersions.indexOf(osVersion);
                        let message: string;
                        if(osVersion !== osVersions[osVersions.length - 1]) {
                            message = 'OS version in your docker image is not the latest. you use: ' + osName + ' ' + osVersion + ', the latest is: ' + osVersions[osVersions.length - 1];
                            return response.status(200)
                                .send({
                                    message: message,
                                    status: response.status
                                })
                        } else {
                            message = 'OS version in your docker image is the latest: ' + osVersion;
                            return response.status(200)
                                .send({
                                    message: message,
                                    status: response.status
                                })
                        }

                    });

                }
            } catch (error) {
                this.throwError(response, "unable to get OS version");
            }
        }
        checkImagesOS();

    }

    private init() {
        this.router.post('/api/checkOS', this.checkOS);
    }
}
