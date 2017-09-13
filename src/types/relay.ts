import {SignedOrder} from './types';

/*
 * version: The API version to use. Defaults to 0
 */
export interface RelayOpts {
    version?: number;
}

export interface RelayerApiTokenTradeInfo {
    address: string;
    symbol: string;
    decimals: number;
    minAmount: string;
    maxAmount: string;
    precision: number;
}

export interface RelayerApiTokenTradeInfo {
    tokenA: RelayerApiTokenTradeInfo;
    tokenB: RelayerApiTokenTradeInfo;
}

export type OrderState = 'OPEN'|'EXPIRED'|'CLOSED'|'UNFUNDED';

export interface RelayerApiOrderResponse {
    signedOrder: SignedOrder;
    state: OrderState;
    pending: {
        fillAmount: BigNumber.BigNumber;
        cancelAmount: BigNumber.BigNumber;
    };
    remainingTakerTokenAmount: BigNumber.BigNumber;
}

export interface RelayerApiFeesRequest {
    maker: string;
    taker: string;
    makerTokenAddress: string;
    takerTokenAddress: string;
    makerTokenAmount: string;
    takerTokenAmount: string;
}

export interface RelayerApiFeesResponse {
    makerFee: string;
    takerFee: string;
    feesRecipient: string;
    takerToSpecify: string;
}
