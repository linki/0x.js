import * as _ from 'lodash';
import * as Web3 from 'web3';
import {Web3Wrapper} from '../web3_wrapper';
import {AbiDecoder} from '../utils/abi_decoder';
import {
    ZeroExError,
    Artifact,
    LogWithDecodedArgs,
    RawLog,
    ContractEvents,
    SubscriptionOpts,
    IndexedFilterValues,
} from '../types';
import {utils} from '../utils/utils';

export class ContractWrapper {
    protected _web3Wrapper: Web3Wrapper;
    private _abiDecoder?: AbiDecoder;
    constructor(web3Wrapper: Web3Wrapper, abiDecoder?: AbiDecoder) {
        this._web3Wrapper = web3Wrapper;
        this._abiDecoder = abiDecoder;
    }
    protected async _getLogsAsync(address: string, eventName: ContractEvents, subscriptionOpts: SubscriptionOpts,
                                  indexFilterValues: IndexedFilterValues,
                                  abi: Web3.ContractAbi): Promise<LogWithDecodedArgs[]> {
        // TODO include indexFilterValues in topics
        const eventSignature = this._getEventSignatureFromAbiByName(abi, eventName);
        const filter = {
            fromBlock: subscriptionOpts.fromBlock,
            toBlock: subscriptionOpts.toBlock,
            address,
            topics: [this._web3Wrapper.keccak256(eventSignature)],
        };
        const logs = await this._web3Wrapper.getLogsAsync(filter);
        const logsWithDecodedArguments = _.map(logs, this._tryToDecodeLogOrNoOp.bind(this));
        return logsWithDecodedArguments;
    }
    protected _tryToDecodeLogOrNoOp(log: Web3.LogEntry): LogWithDecodedArgs|RawLog {
        if (_.isUndefined(this._abiDecoder)) {
            throw new Error(ZeroExError.NoAbiDecoder);
        }
        const logWithDecodedArgs = this._abiDecoder.tryToDecodeLogOrNoOp(log);
        return logWithDecodedArgs;
    }
    protected async _instantiateContractIfExistsAsync<A extends Web3.ContractInstance>(artifact: Artifact,
                                                                                       addressIfExists?: string,
                                                                                      ): Promise<A> {
        const contractInstance =
            await this._web3Wrapper.getContractInstanceFromArtifactAsync<A>(artifact, addressIfExists);
        return contractInstance;
    }
    protected _getEventSignatureFromAbiByName(abi: Web3.ContractAbi, eventName: ContractEvents): string {
        const eventAbi = _.filter(abi, {name: eventName})[0] as Web3.EventAbi;
        const types = _.map(eventAbi.inputs, 'type');
        const signature = `${eventAbi.name}(${types.join(',')})`;
        return signature;
    }
}
