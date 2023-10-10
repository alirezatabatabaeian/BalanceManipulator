import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { BalanceManipulator, BalanceManipulatorConfig } from '../wrappers/BalanceManipulator';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

const initial_data: BalanceManipulatorConfig = {
    balance: 100
};

describe('BalanceManipulator', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('BalanceManipulator');
    });

    let blockchain: Blockchain;
    let balanceManipulator: SandboxContract<BalanceManipulator>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        balanceManipulator = blockchain.openContract(BalanceManipulator.createFromConfig(initial_data, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await balanceManipulator.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: balanceManipulator.address,
            deploy: true,
            success: true,
        });
    });

    it('test manipulator', async () => {
        const deployer = await blockchain.treasury('deployer');
        let op: number = 10; // 10 : manipulate balance
        let manipulator_coefficient: number = 2; // double the balance

        let initial_balance = await balanceManipulator.get_jetton_balance();
        console.log(initial_balance);

        await balanceManipulator.sendManipulateBalance(deployer.getSender(), toNano('0.05'), op, manipulator_coefficient); // send manipulate balance message

        let new_balance = await balanceManipulator.get_jetton_balance();
        console.log(new_balance);
    });
});
