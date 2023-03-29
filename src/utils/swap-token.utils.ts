import { KeychainApi } from '@api/keychain';
import { Asset, ExtendedAccount } from '@hiveio/dhive';
import { ActiveAccount } from '@interfaces/active-account.interface';
import { TokenBalance } from '@interfaces/tokens.interface';
import Config from 'src/config';
import { BaseCurrencies } from 'src/utils/currency.utils';
import TokensUtils from 'src/utils/tokens.utils';
import TransferUtils from 'src/utils/transfer.utils';

export interface SwapStep {
  step: SwapStepType;
  estimate: number;
  startToken: string;
  endToken: string;
  provider: string;
}

export enum SwapStepType {
  DEPOSIT_TO_HIVE_ENGINE = 'DEPOSIT_TO_HIVE_ENGINE',
  WITHDRAWAL_FROM_HIVE_ENGINE = 'WITHDRAWAL_FROM_HIVE_ENGINE',
  CONVERT_INTERNAL_MARKET = 'CONVERT_INTERNAL_MARKET',
  SWAP_TOKEN = 'SWAP',
  BUY_ON_HIVE_ENGINE_MARKET = 'BUY_ON_HIVE_ENGINE_MARKET',
  SELL_ON_HIVE_ENGINE_MARKET = 'SELL_ON_HIVE_ENGINE_MARKET',
  BUY_ON_MARKET = 'BUY_ON_MARKET',
  SELL_ON_MARKET = 'SELL_ON_MARKET',
}

const getSwapTokenStartList = async (account: ExtendedAccount) => {
  let userTokenList: TokenBalance[] = await TokensUtils.getUserBalance(
    account.name,
  );
  userTokenList = userTokenList.filter(
    (token) => parseFloat(token.balance) > 0,
  );
  userTokenList = userTokenList.sort((a, b) =>
    b.symbol.toLowerCase() > a.symbol.toLowerCase() ? -1 : 1,
  );

  if (Asset.fromString(account.balance.toString()).amount > 0) {
    userTokenList.unshift({
      account: account.name,
      balance: Asset.fromString(account.balance.toString()).amount.toString(),
      symbol: BaseCurrencies.HIVE.toUpperCase(),
    } as TokenBalance);
  }
  if (Asset.fromString(account.hbd_balance.toString()).amount > 0) {
    userTokenList.unshift({
      account: account.name,
      balance: Asset.fromString(
        account.hbd_balance.toString(),
      ).amount.toString(),
      symbol: BaseCurrencies.HBD.toUpperCase(),
    } as TokenBalance);
  }

  return userTokenList;
};

const getSwapTokenEndList = () => {};

const getEstimate = async (
  startToken: string,
  endToken: string,
  amount: string,
) => {
  if (startToken && endToken && amount.length && parseFloat(amount) > 0) {
    const estimate = await KeychainApi.get(
      `token-swap/estimate/${startToken}/${endToken}/${parseFloat(amount)}`,
    );
    return estimate;
  }
};

const saveEstimate = async (
  steps: SwapStep[],
  slipperage: number,
  startToken: string,
  endToken: string,
  amount: number,
) => {
  return await KeychainApi.post(`token-swap/estimate/save`, {
    slipperage,
    steps,
    startToken,
    endToken,
    amount,
  });
};

const processSwap = async (
  estimate: SwapStep[],
  slipperage: number,
  activeAccount: ActiveAccount,
  startToken: string,
  endToken: string,
  amount: number,
) => {
  // const estimateId = await saveEstimate(
  //   estimate,
  //   slipperage,
  //   startToken,
  //   endToken,
  //   amount,
  // );
  const estimateId = 'todo';
  if (
    startToken === BaseCurrencies.HBD.toUpperCase() ||
    startToken === BaseCurrencies.HIVE.toUpperCase()
  ) {
    await TransferUtils.sendTransfer(
      activeAccount.name!,
      Config.swaps.swapAccount,
      `${amount.toFixed(3)} ${startToken}`,
      estimateId,
      false,
      0,
      0,
      activeAccount.keys.active!,
    );
  } else {
    const tokenInfo = await TokensUtils.getTokenInfo(startToken);
    await TokensUtils.sendToken(
      startToken,
      Config.swaps.swapAccount,
      `${amount.toFixed(tokenInfo.precision)}`,
      estimateId,
      activeAccount.keys.active!,
      activeAccount.name!,
    );
  }
};

export const SwapTokenUtils = {
  getSwapTokenStartList,
  getSwapTokenEndList,
  processSwap,
  getEstimate,
};
