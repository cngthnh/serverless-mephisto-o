import { getInput, setFailed, info } from '@actions/core';
import * as subProcess from 'child_process';

async function run(): Promise<void> {
    try {
        info("Cloning deployment kit into the board");
        subProcess.execSync(`git clone --branch ${process.env.SVLD_VERSION as string} https://github.com/cngthnh/serverless-mephisto .deploy`)
        subProcess.execSync("mkdir -p ./.deploy/app_src && rsync -a --exclude=./.deploy ./ ./.deploy/app_src");
        
        info("Signing in ECR");
        let buffer = subProcess.execSync(`aws ecr get-login-password --region ${process.env.AWS_REGION as string} | docker login --username AWS ` +
            `--password-stdin ${process.env.AWS_ACCOUNT_ID as string}.dkr.ecr.${process.env.AWS_REGION as string}.amazonaws.com`);
        info(buffer.toString());

        info("Waiting for confirmation...");
        info(`nohup sh -c "aws logs tail /sst/service/dev-serverless-mephisto-task-test-deployment-test-dev-wvpc-mephisto-task-test-deployment-test-dev-wvpc --follow --since 1d | egrep '${process.env.PREVIEW_URL_PREFIX}' > _run.log" &`);
        subProcess.spawn(`nohup sh -c "aws logs tail /sst/service/dev-serverless-mephisto-task-test-deployment-test-dev-wvpc-mephisto-task-test-deployment-test-dev-wvpc --follow --since 1d | egrep '${process.env.PREVIEW_URL_PREFIX}' > _run.log" &`);
        info(`while ! grep '${process.env.PREVIEW_URL_PREFIX}' _run.log; do echo "===FILE==="; cat _run.log; sleep 1; done`)
        const stream = subProcess.exec(`while ! grep '${process.env.PREVIEW_URL_PREFIX}' _run.log; do echo "===FILE==="; cat _run.log; sleep 1; done`);
        stream.stdout?.on('data', (data) => {
            info(data);
        });
        stream.stderr?.on('data', (data) => {
            info("stderr: " + data);
        });
        buffer = subProcess.execSync(`grep '${process.env.PREVIEW_URL_PREFIX}' _run.log`);
        info(buffer.toString());

        // info("Installing dependencies...");
        // buffer = subProcess.execSync(`cd .deploy && npm install`);
        // info(buffer.toString());

        // // info("Removing old stacks");
        // // buffer = subProcess.execSync(`cd .deploy && echo "${process.env.APP_ENV}" | npm run remove`);
        // // info(buffer.toString());

        // const repoName = `${process.env.APP_NAME}-${process.env.APP_ENV}`;
        // info("Creating repository...");
        // buffer = subProcess.execSync(`cd .deploy && aws ecr create-repository --repository-name "${repoName}" --region ${process.env.AWS_REGION} || true`);
        // info(buffer.toString());

        // info("Putting lifecycle policy...");
        // buffer = subProcess.execSync(`cd .deploy && aws ecr put-lifecycle-policy --repository-name "${repoName}" --lifecycle-policy-text file://$(pwd)/conf/lifecycle_policy.json || true`);
        // info(buffer.toString());

        // info("Deploying...")
        // let stream = subProcess.exec(`cd .deploy && echo "${process.env.APP_ENV}" | npm run deploy`);
        // stream.stdout?.on('data', (data) => {
        //     info(data);
        // });
        // stream.stderr?.on('data', (data) => {
        //     info("stderr: " + data);
        // });
    } catch (e: any) {
        setFailed(e);
    }
}

run();