import { LocalAccount } from '@interfaces/local-account.interface';
import { ActionType } from '@popup/actions/action-type.enum';
import { AppThunk } from '@popup/actions/interfaces';
import TransactionUtils from 'src/utils/transaction.utils';

export const initAccountTransactions =
  (accountName: string): AppThunk =>
  async (dispatch, getState) => {
    const memoKey = getState().accounts.find(
      (a: LocalAccount) => a.name === accountName,
    )!.keys.memo;
    const transactions = await TransactionUtils.getAccountTransactions(
      accountName,
      -1,
      memoKey,
    );

    dispatch({
      type: ActionType.INIT_TRANSACTIONS,
      payload: transactions,
    });
  };

export const fetchAccountTransactions =
  (accountName: string, start: number): AppThunk =>
  async (dispatch, getState) => {
    const memoKey = getState().accounts.find(
      (a: LocalAccount) => a.name === accountName,
    )!.keys.memo;
    const transactions = await TransactionUtils.getAccountTransactions(
      accountName,
      start,
      memoKey,
    );
    dispatch({
      type: ActionType.ADD_TRANSACTIONS,
      payload: transactions,
    });
  };
