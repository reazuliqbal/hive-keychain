import { AuthorityType } from '@hiveio/dhive';
import { removeKey, setAccounts } from '@popup/actions/account.actions';
import { loadActiveAccount } from '@popup/actions/active-account.actions';
import {
  addToLoadingList,
  removeFromLoadingList,
} from '@popup/actions/loading.actions';
import {
  setErrorMessage,
  setInfoMessage,
  setSuccessMessage,
} from '@popup/actions/message.actions';
import {
  goBack,
  navigateTo,
  navigateToWithParams,
} from '@popup/actions/navigation.actions';
import { Icons } from '@popup/icons.enum';
import { RootState } from '@popup/store';
import { Screen } from '@reference-data/screen.enum';
import React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import Icon, { IconType } from 'src/common-ui/icon/icon.component';
import { LocalAccount } from 'src/interfaces/local-account.interface';
import AccountUtils from 'src/utils/account.utils';
import './account-authorities-list-item.component.scss';

export interface AuthoritiesListItemProps {
  authority: AuthorityType;
  role: 'active' | 'posting';
}

const AccountAuthoritiesListItem = ({
  activeAccount,
  accounts,
  authority,
  role,
  setInfoMessage,
  navigateToWithParams,
  removeKey,
  goBack,
  loadActiveAccount,
  addToLoadingList,
  setSuccessMessage,
  setErrorMessage,
  removeFromLoadingList,
  navigateTo,
}: PropsType) => {
  const goTo = (accountName: string) => {
    chrome.tabs.create({ url: `https://hiveblocks.com/@${accountName}` });
  };

  const handleClickOnRemoveAccountAuth = async (
    authorizedAccountName: string,
  ) => {
    navigateToWithParams(Screen.CONFIRMATION_PAGE, {
      message: chrome.i18n.getMessage(
        'popup_html_confirm_remove_account_authority_message',
        [role, authorizedAccountName],
      ),
      fields: [
        { label: 'popup_html_username', value: `@${authorizedAccountName}` },
        { label: 'popup_html_role', value: `${role}` },
      ],
      title: 'popup_html_remove_account_authority',
      afterConfirmAction: async () => {
        addToLoadingList('html_popup_remove_authorized_account_operation');
        const copyActiveAccount = { ...activeAccount };
        copyActiveAccount.account[role] = {
          ...copyActiveAccount.account[role],
          account_auths: copyActiveAccount.account[role].account_auths.filter(
            (auth) => auth[0] !== authorizedAccountName,
          ),
        };
        try {
          let success = await AccountUtils.updateAccount(
            copyActiveAccount.name!,
            copyActiveAccount.account.active,
            copyActiveAccount.account.posting,
            copyActiveAccount.account.memo_key,
            copyActiveAccount.account.json_metadata,
            activeAccount.keys.active!,
          );
          console.log({ success });
          if (success) {
            navigateTo(Screen.SETTINGS_MANAGE_ACCOUNTS_AUTHORITIES, true);
            setSuccessMessage('popup_html_remove_account_authority_successful');
          } else {
            setErrorMessage('popup_html_remove_account_authority_fail');
          }
        } catch (err: any) {
          setErrorMessage(err.message);
        } finally {
          removeFromLoadingList(
            'html_popup_remove_authorized_account_operation',
          );
        }
      },
    });
  };

  return (
    <div className="account-authorities-list-item">
      <div className="top-panel">
        <div className="key-name">
          {chrome.i18n.getMessage(`popup_html_${role}`)}
        </div>
      </div>
      <div className="keys-panel">
        {authority.account_auths.length === 0 && (
          <div className="account-auths-list">
            {chrome.i18n.getMessage(
              'popup_html_manage_no_accounts_authorities',
            )}
          </div>
        )}
        {authority.account_auths.length > 0 && (
          <div className="account-auths-list">
            <div className="titles">
              <div className="title">
                {chrome.i18n.getMessage(
                  'popup_html_manage_account_authority_username_label',
                )}
              </div>
              <div className="title text-centered">
                {chrome.i18n.getMessage(
                  'popup_html_manage_account_authority_weight_label',
                )}
              </div>
            </div>
            {authority.account_auths.map((accountAuth, index) => {
              return (
                <div
                  className="item"
                  key={`account-auth-item-${accountAuth[0]}-${index}`}>
                  <div className="item-account-name">
                    <div>{accountAuth[0]}</div>
                    <div className="item-flex-justify-center">
                      <Icon
                        onClick={() => goTo(accountAuth[0])}
                        name={Icons.LINK}
                        type={IconType.OUTLINED}
                        additionalClassName="remove-button"
                      />
                    </div>
                  </div>
                  <div className="text-centered">{accountAuth[1]}</div>
                  <div className="buttons-item text-centered">
                    <Icon
                      onClick={() =>
                        handleClickOnRemoveAccountAuth(accountAuth[0])
                      }
                      name={Icons.DELETE}
                      type={IconType.OUTLINED}
                      additionalClassName="remove-button"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    accounts: state.accounts as LocalAccount[],
    activeAccount: state.activeAccount,
  };
};

const connector = connect(mapStateToProps, {
  setInfoMessage,
  setAccounts,
  navigateToWithParams,
  removeKey,
  goBack,
  loadActiveAccount,
  addToLoadingList,
  setSuccessMessage,
  setErrorMessage,
  removeFromLoadingList,
  navigateTo,
});
type PropsType = ConnectedProps<typeof connector> & AuthoritiesListItemProps;

export const AccountAuthoritiesListItemComponent = connector(
  AccountAuthoritiesListItem,
);
