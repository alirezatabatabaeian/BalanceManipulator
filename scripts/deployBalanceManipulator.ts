import { toNano } from 'ton-core';
import { BalanceManipulator } from '../wrappers/BalanceManipulator';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const balanceManipulator = provider.open(BalanceManipulator.createFromConfig({}, await compile('BalanceManipulator')));

    await balanceManipulator.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(balanceManipulator.address);

    // run methods on `balanceManipulator`
}
