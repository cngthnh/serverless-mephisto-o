import { StackContext } from "sst/constructs/FunctionalStack";
import { Service } from "sst/constructs";
import DockerImageBuilder from "./DockerImageBuilder";
import { ContainerImage } from "aws-cdk-lib/aws-ecs";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { Duration } from "aws-cdk-lib";

export function DefaultServiceStack({ stack }: StackContext) {
    const vpc = Vpc.fromLookup(stack, `${process.env.APP_NAME}-${process.env.APP_ENV}-vpc`, {
        vpcId: process.env.VPC_ID
    });
    const port = process.env.CONT_PORT ? parseInt(process.env.CONT_PORT) : 3000;
    new Service(stack, `${process.env.APP_NAME}-${process.env.APP_ENV}`, {
        port,
        cdk: {
            vpc,
            container: {
                image: ContainerImage.fromDockerImageAsset(new DockerImageBuilder()
                    .withStack(stack)
                    .withName(`${process.env.APP_NAME}-${process.env.APP_ENV}`)
                    .withPath("./app_src/app")
                    .withBuildArgs({
                        GIT_USER_EMAIL: process.env.GIT_USER_EMAIL as string,
                        GIT_USER_NAME: process.env.GIT_USER_NAME as string,
                        MTURK_NAME: process.env.MTURK_NAME as string,
                        MTURK_TYPE: process.env.MTURK_TYPE as string,
                        MTURK_ACCESS_KEY_ID: process.env.MTURK_ACCESS_KEY_ID as string,
                        MTURK_SECRET_ACCESS_KEY: process.env.MTURK_SECRET_ACCESS_KEY as string,
                        DOTNETRC: process.env.DOTNETRC as string,
                        HEROKU_API_KEY: process.env.HEROKU_API_KEY as string,
                        PROLIFIC_API_KEY: process.env.PROLIFIC_API_KEY as string,
                        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID as string,
                        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY as string
                    })
                    .build()
                    .getImage()),
                healthCheck: {
                    command: ["CMD-SHELL", `curl -f http://localhost:${port}/ || exit 1`],
                    interval: Duration.minutes(5),
                    retries: 20,
                    startPeriod: Duration.minutes(5),
                    timeout: Duration.minutes(2),
                },
            }
        },
        customDomain: {
            domainName: `${process.env.APP_NAME}.mephisto.${process.env.DOMAIN}`,
            hostedZone: process.env.DOMAIN as string,
            isExternalDomain: false
        },
        environment: {
            APP_ENV: process.env.APP_ENV as string,
            APP_NAME: process.env.APP_NAME as string
        }
    });
}