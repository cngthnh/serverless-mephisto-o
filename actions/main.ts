import { getInput, setFailed, info } from '@actions/core';
import * as subProcess from 'child_process';

async function run(): Promise<void> {
    try {
        info("Cloning deployment kit into the board");
        subProcess.execSync(`git clone --branch ${process.env.SVLD_VERSION as string} https://github.com/cngthnh/serverless-mephisto .deploy`)
        subProcess.execSync("mkdir -p ../.deploy/app_src && rsync -a --exclude=../.deploy ../ ../.deploy/app_src");
        
        info("Signing in ECR");
        let buffer = subProcess.execSync(`aws ecr get-login-password --region ${process.env.AWS_REGION as string} | docker login --username AWS ` +
            `--password-stdin ${process.env.AWS_ACCOUNT_ID as string}.dkr.ecr.${process.env.AWS_REGION as string}.amazonaws.com`);
        info(buffer.toString());

        info("Deploying...");
        buffer = subProcess.execSync(`npm run deploy`);
        info(buffer.toString());
    } catch (e: any) {
        setFailed(e);
    }
}

run();