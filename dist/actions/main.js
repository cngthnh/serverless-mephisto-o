import { setFailed, info } from '@actions/core';
import { exec, ls } from 'shelljs';
async function run() {
    try {
        info("GH Workspace: " + ls(process.env.GITHUB_WORKSPACE));
        exec(`aws ecr get-login-password --region ${process.env.AWS_REGION} | docker login --username AWS ` +
            `--password-stdin ${process.env.AWS_ACCOUNT_ID}.dkr.ecr.${process.env.AWS_REGION}.amazonaws.com`);
        exec(`npm run deploy`);
    }
    catch (e) {
        setFailed(e);
    }
}
run();
