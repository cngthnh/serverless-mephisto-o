import { getInput, setFailed, info } from '@actions/core';
import * as subProcess from 'child_process';

async function run(): Promise<void> {
    try {
        const buffer = subProcess.execSync("pwd");
        info("Current working dir: " + buffer.toString());
        subProcess.execSync(`cp -r ${process.env.GITHUB_WORKSPACE as string}/* app_src/`);
        subProcess.execSync(`aws ecr get-login-password --region ${process.env.AWS_REGION as string} | docker login --username AWS ` +
            `--password-stdin ${process.env.AWS_ACCOUNT_ID as string}.dkr.ecr.${process.env.AWS_REGION as string}.amazonaws.com`);
        subProcess.execSync(`npm run deploy`);
    } catch (e: any) {
        setFailed(e);
    }
}

run();