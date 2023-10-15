import { StackContext } from "sst/constructs/FunctionalStack";
import { Service } from "sst/constructs";
import DockerImageBuilder from "./DockerImageBuilder";
import { ContainerImage } from "aws-cdk-lib/aws-ecs";

export function DefaultStack({ stack }: StackContext) {
    new Service(stack, `${process.env.APP_NAME}-${process.env.APP_ENV}-service`, {
        cdk: {
            container: {
                image: ContainerImage.fromRegistry(new DockerImageBuilder()
                        .withStack(stack)
                        .withName(`${process.env.APP_NAME}-${process.env.APP_ENV}-service`)
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
                        .getImage())
            }
        },
        environment: {
            APP_ENV: process.env.APP_ENV as string,
            APP_NAME: process.env.APP_NAME as string
        }
    });
}