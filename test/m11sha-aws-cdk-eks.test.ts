import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as M11ShaAwsCdkEks from '../lib/m11sha-aws-cdk-eks-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new M11ShaAwsCdkEks.M11ShaAwsCdkEksStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT));
});
