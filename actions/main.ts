import { getInput, setFailed, info } from '@actions/core';
import * as subProcess from 'child_process';

async function run(): Promise<void> {
    try {
        subProcess.exec(`ls ${process.env.GITHUB_WORKSPACE as string}`, (err, stdout, stderr) => {
            info("GH Workspace:");
            info(stdout);
            info(stderr);
        });
        subProcess.exec(`aws ecr get-login-password --region ${process.env.AWS_REGION as string} | docker login --username AWS ` +
            `--password-stdin ${process.env.AWS_ACCOUNT_ID as string}.dkr.ecr.${process.env.AWS_REGION as string}.amazonaws.com`);
        subProcess.exec(`npm run deploy`);
    } catch (e: any) {
        setFailed(e);
    }
}

run();