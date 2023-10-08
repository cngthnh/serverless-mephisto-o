import { SSTConfig } from "sst";
import { DefaultStack } from "./stacks/DefaultStack";

export default {
  config(_input) {
    return {
      name: `serverless-mephisto-${process.env.APP_NAME}-${process.env.APP_ENV}`,
      region: process.env.AWS_REGION || "ap-southeast-2",
      cdk: {
        "imageAssetsRepositoryName": `serverless-mephisto-${process.env.APP_NAME}-${process.env.APP_ENV}`
      }
    };
  },
  stacks(app) {
    app.stack(DefaultStack);
  },
} satisfies SSTConfig;
