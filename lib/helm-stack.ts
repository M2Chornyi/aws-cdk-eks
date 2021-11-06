import * as cdk from "@aws-cdk/core";
import * as eks from "@aws-cdk/aws-eks";
import * as ec2 from "@aws-cdk/aws-ec2";



export class HelmStack extends cdk.Stack {
    private cluster : eks.Cluster;
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        let clusterName = cdk.Fn.importValue('clusterName').toString();
        let clusterMastersRole = cdk.Fn.importValue('clusterRoleArn').toString();

        const cluster = eks.Cluster.fromClusterAttributes(this, 'EksCluster-1', {
            clusterName: clusterName,
            kubectlRoleArn: clusterMastersRole,
        });


        new eks.HelmChart(this, 'NginxIngress', {
            cluster,
            chart: 'nginx-ingress',
            repository: 'https://helm.nginx.com/stable',
            namespace: 'kube-system'
        });


    }
}
