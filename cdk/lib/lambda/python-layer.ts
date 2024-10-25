import { Construct } from "constructs";
import { LayerVersion, Code, Runtime } from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import * as cdk from "aws-cdk-lib";

export interface PythonLayerProps {
    readonly codePath: string;
    readonly runtime: Runtime;
    readonly layerName?: string;
}

export class PythonLambdaLayer extends Construct {

    public readonly layer: LayerVersion

    constructor(scope: Construct, id: string, props: PythonLayerProps) {
        super(scope, id);

        // Create a lambda layer for python dependencies
        this.layer = new LayerVersion(this, id, {
            layerVersionName: props.layerName,
            code: Code.fromAsset(path.resolve(__dirname, props.codePath), {
                assetHashType: cdk.AssetHashType.OUTPUT,
                bundling: {
                    image: props.runtime.bundlingImage,
                    command: [
                        'bash', '-c',
                        'pip install --no-cache-dir -r requirements.txt -t /asset-output/python/lib/python3.12/site-packages && cp -r . /asset-output'
                    ],
                }
            }),
            compatibleRuntimes: [Runtime.PYTHON_3_10, Runtime.PYTHON_3_11, Runtime.PYTHON_3_12],
        });
    }


}