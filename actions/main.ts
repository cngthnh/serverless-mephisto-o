import { getInput, setFailed, info } from '@actions/core';
import * as subProcess from 'child_process';

async function run(): Promise<void> {
    try {
        info("GH Workspace ENV: " + process.env.GITHUB_WORKSPACE as string)
        const buffer = subProcess.execSync(`ls ${process.env.GITHUB_WORKSPACE as string}`);
        info(buffer.toString());
        subProcess.execSync(`aws ecr get-login-password --region ${process.env.AWS_REGION as string} | docker login --username AWS ` +
            `--password-stdin ${process.env.AWS_ACCOUNT_ID as string}.dkr.ecr.${process.env.AWS_REGION as string}.amazonaws.com`);
        subProcess.execSync(`npm run deploy`);
    } catch (e: any) {
        setFailed(e);
    }
}

run();