import { SSTConfig } from "sst";
import { Tags } from "aws-cdk-lib";
import { DefaultStack } from "./stacks/DefaultStack";

export default {
  config(_input) {
    return {
      name: `serverless-mephisto-${process.env.APP_NAME}-${process.env.APP_ENV}`,
      region: process.env.AWS_REGION || "ap-southeast-2"
    };
  },
  stacks(app) {
    Tags.of(app).add("task-tag", `${app.name}-${app.stage}`);
    app.stack(DefaultStack);
  },
} satisfies SSTConfig;
