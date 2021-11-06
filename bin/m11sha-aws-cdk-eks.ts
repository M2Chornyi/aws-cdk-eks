#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EksStack } from '../lib/eks-stack';
import { K8sStack } from '../lib/k8s-stack';
import { HelmStack } from '../lib/helm-stack';

const app = new cdk.App();
const eksStack = new EksStack(app, 'EksCluster-1', {});
const k8sStack = new K8sStack(app,'K8sStack',{});
const helmStack = new HelmStack(app,'HelmStack',{});

k8sStack.addDependency(eksStack);
helmStack.addDependency(eksStack);