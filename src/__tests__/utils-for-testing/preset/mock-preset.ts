import KeychainApi from '@api/keychain';
import AccountUtils from 'src/utils/account.utils';
import ActiveAccountUtils from 'src/utils/active-account.utils';
import { HiveEngineConfigUtils } from 'src/utils/hive-engine-config.utils';
import HiveEngineUtils from 'src/utils/hive-engine.utils';
import HiveUtils from 'src/utils/hive.utils';
import LocalStorageUtils from 'src/utils/localStorage.utils';
import MkUtils from 'src/utils/mk.utils';
import ProposalUtils from 'src/utils/proposal.utils';
import ProxyUtils from 'src/utils/proxy.utils';
import RpcUtils from 'src/utils/rpc.utils';
import TransactionUtils from 'src/utils/transaction.utils';
import withFixedValues from 'src/__tests__/utils-for-testing/defaults/fixed';
import mocksDefault from 'src/__tests__/utils-for-testing/defaults/mocks';
import initialMocks from 'src/__tests__/utils-for-testing/defaults/noImplentationNeeded';
import mocksImplementation from 'src/__tests__/utils-for-testing/implementations/implementations';
import { MocksToUse } from 'src/__tests__/utils-for-testing/interfaces/mocks.interface';
/**
 * @param app.getExtendedAccount ExtendedAccount Used by refresh_account, loadActiveAccount. The main one to mock when using any process within the HomePage.
 * @param app.getAccount ExtendedAccount[] Used by processes as: add-by-auth.
 */
const setOrDefault = (toUse: MocksToUse) => {
  const {
    app,
    home,
    topBar,
    powerUp,
    walletHistory,
    tokens,
    proposal,
    chromeRunTime,
    keyChainApiGet,
  } = toUse;
  const {
    _app,
    _home,
    _walletHistory,
    _powerUp,
    _proposal,
    _tokens,
    _topBar,
    _chromeRunTime,
  } = mocksDefault._defaults;

  initialMocks.noImplentationNeeded();
  withFixedValues();
  LocalStorageUtils.getValueFromLocalStorage = jest
    .fn()
    .mockImplementation(
      (app && app.getValueFromLocalStorage) ?? _app.getValueFromLocalStorage,
    );
  RpcUtils.getCurrentRpc = jest
    .fn()
    .mockResolvedValue((app && app.getCurrentRpc) ?? _app.getCurrentRpc);
  ActiveAccountUtils.getActiveAccountNameFromLocalStorage = jest
    .fn()
    .mockResolvedValue(
      (app && app.getActiveAccountNameFromLocalStorage) ??
        _app.getActiveAccountNameFromLocalStorage,
    );
  AccountUtils.getAccount = jest
    .fn()
    .mockResolvedValue((app && app.getAccount) ?? _app.getAccount);
  AccountUtils.getRCMana = jest
    .fn()
    .mockResolvedValue((app && app.getRCMana) ?? _app.getRCMana);
  AccountUtils.getExtendedAccount = jest
    .fn()
    .mockResolvedValue(
      (app && app.getExtendedAccount) ?? _app.getExtendedAccount,
    );
  HiveUtils.getDelegatees = jest
    .fn()
    .mockResolvedValue(
      (powerUp && powerUp.getVestingDelegations) ??
        _powerUp.getVestingDelegations,
    );
  RpcUtils.checkRpcStatus = jest
    .fn()
    .mockResolvedValue((app && app.checkRpcStatus) ?? _app.checkRpcStatus);
  AccountUtils.hasStoredAccounts = jest
    .fn()
    .mockResolvedValue(
      (app && app.hasStoredAccounts) ?? _app.hasStoredAccounts,
    );
  MkUtils.getMkFromLocalStorage = jest
    .fn()
    .mockResolvedValue(
      (app && app.getMkFromLocalStorage) ?? _app.getMkFromLocalStorage,
    );
  AccountUtils.getAccountsFromLocalStorage = jest
    .fn()
    .mockResolvedValue(
      (app && app.getAccountsFromLocalStorage) ??
        _app.getAccountsFromLocalStorage,
    );
  ProxyUtils.findUserProxy = jest
    .fn()
    .mockResolvedValue((app && app.findUserProxy) ?? _app.findUserProxy);
  HiveUtils.getVP = jest.fn().mockReturnValue((app && app.getVP) ?? _app.getVP);
  HiveUtils.getVotingDollarsPerAccount = jest
    .fn()
    .mockReturnValue(
      (app && app.getVotingDollarsPerAccount) ??
        _app.getVotingDollarsPerAccount,
    );
  AccountUtils.getAccountValue = jest
    .fn()
    .mockReturnValue((home && home.getAccountValue) ?? _home.getAccountValue);
  chrome.runtime.getManifest = jest
    .fn()
    .mockReturnValue(
      (chromeRunTime && chromeRunTime.getManifest) ??
        _chromeRunTime.getManifest,
    );
  chrome.runtime.sendMessage =
    (chromeRunTime && chromeRunTime.sendMessage) ?? _chromeRunTime.sendMessage;
  KeychainApi.get = jest
    .fn()
    .mockImplementation((...args: any[]) =>
      mocksImplementation.keychainApiGet(args[0], keyChainApiGet?.customData),
    );
  ActiveAccountUtils.hasReward = jest
    .fn()
    .mockReturnValue((topBar && topBar.hasReward) ?? _topBar.hasReward);
  TransactionUtils.getAccountTransactions = jest
    .fn()
    .mockResolvedValue(
      (walletHistory && walletHistory.getAccountTransactions) ??
        _walletHistory.getAccountTransactions,
    );
  HiveEngineUtils.getUserBalance = jest
    .fn()
    .mockResolvedValue(
      (tokens && tokens.getUserBalance) ?? _tokens.getUserBalance,
    );
  HiveEngineUtils.getIncomingDelegations = jest
    .fn()
    .mockResolvedValue(
      (tokens && tokens.getIncomingDelegations) ??
        _tokens.getIncomingDelegations,
    );
  HiveEngineUtils.getOutgoingDelegations = jest
    .fn()
    .mockResolvedValue(
      (tokens && tokens.getOutgoingDelegations) ??
        _tokens.getOutgoingDelegations,
    );
  HiveEngineUtils.getAllTokens = jest
    .fn()
    .mockResolvedValue((tokens && tokens.getAllTokens) ?? _tokens.getAllTokens);
  HiveEngineUtils.getTokensMarket = jest
    .fn()
    .mockResolvedValue(
      (tokens && tokens.getTokensMarket) ?? _tokens.getTokensMarket,
    );
  //added getTokensHistory
  HiveEngineConfigUtils.getAccountHistoryApi().get = jest
    .fn()
    .mockResolvedValueOnce({
      data: (tokens && tokens.getTokenHistory) ?? _tokens.getTokenHistory,
    })
    .mockResolvedValueOnce({ data: [] });
  //to remove comments when tested.
  ProposalUtils.hasVotedForProposal = jest
    .fn()
    .mockResolvedValue(
      (proposal && proposal.hasVotedForProposal) ??
        _proposal.hasVotedForProposal,
    );
  ProposalUtils.voteForKeychainProposal = jest
    .fn()
    .mockResolvedValue(
      (proposal && proposal.voteForKeychainProposal) ??
        _proposal.voteForKeychainProposal,
    );
  ProposalUtils.isRequestingProposalVotes = jest
    .fn()
    .mockResolvedValue(
      (proposal && proposal.isRequestingProposalVotes) ??
        _proposal.isRequestingProposalVotes,
    );
};

export default { setOrDefault };