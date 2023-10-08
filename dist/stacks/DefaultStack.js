import { Service } from "sst/constructs";
export function DefaultStack({ stack }) {
    new Service(stack, "MephistoService", {
        path: "./src/app",
        build: {
            buildArgs: {
                GIT_USER_EMAIL: process.env.GIT_USER_EMAIL,
                GIT_USER_NAME: process.env.GIT_USER_NAME,
                MTURK_NAME: process.env.MTURK_NAME,
                MTURK_TYPE: process.env.MTURK_TYPE,
                MTURK_ACCESS_KEY_ID: process.env.MTURK_ACCESS_KEY_ID,
                MTURK_SECRET_ACCESS_KEY: process.env.MTURK_SECRET_ACCESS_KEY,
                DOTNETRC: process.env.DOTNETRC,
                HEROKU_API_KEY: process.env.HEROKU_API_KEY,
                PROLIFIC_API_KEY: process.env.PROLIFIC_API_KEY,
                AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
                AWS_SECRET_ACCESS_KEY: process.env.AWS_ACCESS_KEY_ID
            }
        },
        environment: {
            APP_ENV: process.env.APP_ENV,
            APP_NAME: process.env.APP_NAME
        }
    });
}
