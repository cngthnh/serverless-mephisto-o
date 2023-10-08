import { getInput, setFailed, info } from '@actions/core';
import { exec, cd, ls } from 'shelljs';

async function run(): Promise<void> {
    try {
        info("GH Workspace: " + ls(process.env.GITHUB_WORKSPACE as string));
        exec(`aws ecr get-login-password --region ${process.env.AWS_REGION as string} | docker login --username AWS ` +
            `--password-stdin ${process.env.AWS_ACCOUNT_ID as string}.dkr.ecr.${process.env.AWS_REGION as string}.amazonaws.com`);
        exec(`npm run deploy`);
    } catch (e: any) {
        setFailed(e);
    }
}

run();