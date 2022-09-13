import tokensHistory from 'src/__tests__/popup/pages/app-container/home/tokens/tokens-history/mocks/tokens-history';
import alDiv from 'src/__tests__/utils-for-testing/aria-labels/al-div';
import assertion from 'src/__tests__/utils-for-testing/preset/assertion';
import config from 'src/__tests__/utils-for-testing/setups/config';
import { clickAwaitOnFound } from 'src/__tests__/utils-for-testing/setups/events';
config.byDefault();
const { methods, constants } = tokensHistory;
const { item, message } = constants;
describe('token-history-item.component tests:\n', () => {
  methods.afterEach;
  beforeEach(async () => {
    await tokensHistory.beforeEach();
  });
  it('Must open memo when clicked', async () => {
    await clickAwaitOnFound(
      alDiv.token.list.item.history.preFix + 'LEO',
      item.index,
    );
    assertion.getOneByText(message.item.miningLottery);
  });
});
