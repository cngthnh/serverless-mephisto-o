import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import * as ecrdeploy from 'cdk-ecr-deployment';
import * as ecr from 'aws-cdk-lib/aws-ecr'
import { Construct } from 'constructs';
import { RemovalPolicy } from 'aws-cdk-lib';

export default class DockerImageBuilder {
    private name: string;
    private path: string;
    private stack: Construct;
    private image: string;
    private buildArgs: {
        [key: string]: string;
    };
    constructor() {
        this.name = 'unnamed';
        this.path = '';
        this.image = '';
        this.buildArgs = {};
        this.stack = undefined as unknown as Construct;
    }
    public withName(name: string): DockerImageBuilder {
        this.name = name;
        return this;
    }
    public withPath(path: string): DockerImageBuilder {
        this.path = path;
        return this;
    }
    public withStack(stack: Construct): DockerImageBuilder {
        this.stack = stack;
        return this;
    }
    public withBuildArgs(buildArgs: { [key: string]: string }): DockerImageBuilder {
        this.buildArgs = buildArgs;
        return this;
    }
    public build(): DockerImageBuilder {
        if (!this.path) {
            throw new Error("Missing path for building Docker image");
        }
        if (!this.name) {
            throw new Error("Missing image tag");
        }
        if (!this.stack) {
            throw new Error("There is no scope to build");
        }

        const image = new DockerImageAsset(this.stack, 'CDKDockerImage', {
            directory: this.path,
            buildArgs: this.buildArgs,
        });

        const repo = new ecr.Repository(this.stack, this.name, {
            repositoryName: this.name,
            lifecycleRules: [
                {
                    rulePriority: 2,
                    description: "Remove old images of the same app",
                    tagStatus: ecr.TagStatus.ANY,
                    maxImageCount: 1
                }
            ],
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteImages: true
        });

        const targetImageWithTags = `${this.name}:latest`
        console.log("IMAGE URI: " + image.imageUri);
        console.log("TARGET IMAGE WITH TAG: " + targetImageWithTags);

        new ecrdeploy.ECRDeployment(this.stack, 'DeployDockerImage', {
            src: new ecrdeploy.DockerImageName(image.imageUri),
            dest: new ecrdeploy.DockerImageName(`${process.env.AWS_ACCOUNT_ID}.dkr.ecr.${process.env.AWS_REGION}.amazonaws.com/${targetImageWithTags}`),
        });

        this.image = targetImageWithTags;

        return this;
    }

    public getImage(): string {
        return this.image;
    }
}