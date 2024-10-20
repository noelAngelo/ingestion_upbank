import { Construct } from "constructs";
import { LayerVersion, Code, Runtime } from "aws-cdk-lib/aws-lambda";
import * as path from "path";


export interface PythonLayerProps {
    readonly codePath: string;
}

export class PythonLambdaLayer extends Construct {

    public readonly layer: LayerVersion

    constructor(scope: Construct, id: string, props: PythonLayerProps) {
        super(scope, id);

        // Create a lambda layer for python dependencies
        this.layer = new LayerVersion(this, `${id}Layer`, {
            layerVersionName: `${id}Layer`,
            code: Code.fromAsset(path.resolve(__dirname, props.codePath)),
            compatibleRuntimes: [Runtime.PYTHON_3_10, Runtime.PYTHON_3_11, Runtime.PYTHON_3_12],
        });
    }


}