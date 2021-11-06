import * as cdk from "@aws-cdk/core";
import * as eks from "@aws-cdk/aws-eks";
import * as ec2 from "@aws-cdk/aws-ec2";



export class K8sStack extends cdk.Stack {
    private cluster : eks.Cluster;
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        let clusterName = cdk.Fn.importValue('clusterName').toString();
        let clusterMastersRole = cdk.Fn.importValue('clusterRoleArn').toString();

        const cluster = eks.Cluster.fromClusterAttributes(this, 'EksCluster-1', {
            clusterName: clusterName,
            kubectlRoleArn: clusterMastersRole,
        });

        const appLabel = { app: "nginx" };

        const deployment = {
            apiVersion: "apps/v1",
            kind: "Deployment",
            metadata: { name: "nginx" },
            spec: {
                replicas: 2,
                selector: { matchLabels: appLabel },
                template: {
                    metadata: { labels: appLabel },
                    spec: {
                        containers: [
                            {
                                name: "nginx",
                                image: "nginx",
                                ports: [ { containerPort: 80 } ]
                            }
                        ]
                    }
                }
            }
        };
        const service = {
            apiVersion: "v1",
            kind: "Service",
            metadata: { name: "nginx-service" },
            spec: {
                type: "LoadBalancer",
                ports: [ { port: 80, targetPort: 80 } ],
                selector: appLabel
            }
        };

        cluster.addManifest("nginx-manifest", service, deployment );

    }
}
