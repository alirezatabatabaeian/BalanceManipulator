import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type BalanceManipulatorConfig = {
    balance: number
};

export function balanceManipulatorConfigToCell(config: BalanceManipulatorConfig): Cell {
    return beginCell().storeCoins(config.balance).endCell();
}

export class BalanceManipulator implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) { }

    static createFromAddress(address: Address) {
        return new BalanceManipulator(address);
    }

    static createFromConfig(config: BalanceManipulatorConfig, code: Cell, workchain = 0) {
        const data = balanceManipulatorConfigToCell(config);
        const init = { code, data };
        return new BalanceManipulator(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendManipulateBalance(provider: ContractProvider, via: Sender, value: bigint, op: number, manipulator_coefficient: number) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(op, 32).storeUint(manipulator_coefficient, 64).endCell(),
        });
    }

    async get_jetton_balance(provider: ContractProvider) {
        const result = await provider.get('get_jetton_balance', []);
        return result.stack.readBigNumber();
    }


}
