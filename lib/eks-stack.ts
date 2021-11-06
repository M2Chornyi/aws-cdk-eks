import * as cdk from '@aws-cdk/core';
import * as eks from '@aws-cdk/aws-eks';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';



export class EksStack extends cdk.Stack {
  public readonly cluster: eks.Cluster;


  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    let idMasterRole = this.stackName + "MastersRole";
    let idNodeGroupCapacity = this.stackName + "NodeGroup";


    const clusterMastersRole = new iam.Role(this, idMasterRole,{
      assumedBy: new iam.AccountRootPrincipal()
    });

    const cluster = new eks.Cluster(this, this.stackName, {
      version: eks.KubernetesVersion.V1_21,
      clusterName: this.stackName,
      defaultCapacity: 0,
      mastersRole: clusterMastersRole,
    });

    cluster.addNodegroupCapacity(idNodeGroupCapacity, {
      instanceTypes: [new ec2.InstanceType('t2.micro')],
      minSize: 2,
      desiredSize:2,
      maxSize:2,
      // diskSize: 100,
      amiType: eks.NodegroupAmiType.AL2_X86_64
    });

    new cdk.CfnOutput(this, 'clusterName', {
      value: cluster.clusterName,
      description: 'The name of the cluster',
      exportName: 'clusterName',
    });

    new cdk.CfnOutput(this, 'clusterRoleArn', {
      value: clusterMastersRole.roleArn,
      description: 'The ARN of the cluster role',
      exportName: 'clusterRoleArn',
    });
  }
}
