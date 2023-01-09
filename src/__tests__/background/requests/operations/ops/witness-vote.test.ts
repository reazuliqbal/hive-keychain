import { broadcastWitnessVote } from '@background/requests/operations/ops/witness-vote';
import { KeychainKeyTypesLC } from '@interfaces/keychain.interface';
import { HiveTxUtils } from 'src/utils/hive-tx.utils';
import witnessVoteMocks from 'src/__tests__/background/requests/operations/ops/mocks/witness-vote-mocks';
import userData from 'src/__tests__/utils-for-testing/data/user-data';
describe('witness-vote tests:\n', () => {
  const { methods, constants, spies } = witnessVoteMocks;
  const { requestHandler, data } = constants;
  methods.afterEach;
  methods.beforeEach;
  it('Must call getUserKey', async () => {
    await broadcastWitnessVote(requestHandler, data);
    expect(spies.getUserKey).toBeCalledWith(
      data.username!,
      KeychainKeyTypesLC.active,
    );
  });
  it('Must return error if no key on handler', async () => {
    const error = "Cannot read properties of undefined (reading 'toString')";
    const result = await broadcastWitnessVote(requestHandler, data);
    methods.assert.error(result, new TypeError(error), data, error);
  });
  it('Must return success when vote', async () => {
    const mHiveTxSendOp = jest
      .spyOn(HiveTxUtils, 'sendOperation')
      .mockResolvedValue(true);
    requestHandler.data.key = userData.one.nonEncryptKeys.active;
    const result = await broadcastWitnessVote(requestHandler, data);
    methods.assert.success(
      result,
      chrome.i18n.getMessage('bgd_ops_witness_voted', [data.witness]),
    );
    mHiveTxSendOp.mockRestore();
  });
  it('Must return success when unvote', async () => {
    const mHiveTxSendOp = jest
      .spyOn(HiveTxUtils, 'sendOperation')
      .mockResolvedValue(true);
    requestHandler.data.key = userData.one.nonEncryptKeys.active;
    data.vote = false;
    const result = await broadcastWitnessVote(requestHandler, data);
    methods.assert.success(
      result,
      chrome.i18n.getMessage('bgd_ops_witness_unvoted', [data.witness]),
    );
    mHiveTxSendOp.mockRestore();
  });
});
