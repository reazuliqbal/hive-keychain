import { LocalAccountListItem } from '@interfaces/list-item.interface';
import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import Select, {
  SelectItemRenderer,
  SelectRenderer,
} from 'react-dropdown-select';
import { ConnectedProps, connect } from 'react-redux';
import { NewIcons } from 'src/common-ui/icons.enum';
import { SVGIcon } from 'src/common-ui/svg-icon/svg-icon.component';
import { LocalAccount } from 'src/interfaces/local-account.interface';
import { loadActiveAccount } from 'src/popup/hive/actions/active-account.actions';
import { setInfoMessage } from 'src/popup/hive/actions/message.actions';
import { RootState } from 'src/popup/hive/store';
import './select-account-section.component.scss';

const SelectAccountSection = ({
  accounts,
  activeAccount,
  loadActiveAccount,
  setInfoMessage,
}: PropsFromRedux) => {
  const defaultOptions: LocalAccountListItem[] = [];

  useEffect(() => {
    setOptions(
      accounts.map((account: LocalAccount) => {
        return { label: account.name, value: account.name };
      }),
    );
    setSelectedLocalAccount(activeAccount.name!);
  }, [accounts, activeAccount]);

  const [options, setOptions] = useState(defaultOptions);
  const [selectedLocalAccount, setSelectedLocalAccount] = useState(
    accounts[0].name,
  );

  const handleItemClicked = (accountName: string) => {
    const itemClicked = accounts.find(
      (account: LocalAccount) => account.name === accountName,
    );
    loadActiveAccount(itemClicked!);
  };

  const customLabelRender = (
    selectProps: SelectRenderer<LocalAccountListItem>,
  ) => {
    return (
      <div
        className="selected-account-panel"
        onClick={() => {
          selectProps.methods.dropDown('close');
        }}>
        <img
          className="user-picture"
          src={`https://images.hive.blog/u/${selectedLocalAccount}/avatar`}
          onError={(e: any) => {
            e.target.onError = null;
            e.target.src = '/assets/images/accounts.png';
          }}
        />
        <div
          className="selected-account-name"
          data-testid="selected-account-name">
          {selectedLocalAccount}
        </div>
      </div>
    );
  };
  const customItemRender = (
    selectProps: SelectItemRenderer<LocalAccountListItem>,
  ) => {
    return (
      <div
        data-testid={`select-account-item-${selectProps.item.value}`}
        className={`select-account-item ${
          selectedLocalAccount === selectProps.item.value ? 'selected' : ''
        }`}
        onClick={() => {
          handleItemClicked(selectProps.item.value);
          selectProps.methods.dropDown('close');
        }}>
        <img
          className="user-picture"
          src={`https://images.hive.blog/u/${selectProps.item.label}/avatar`}
          onError={(e: any) => {
            e.target.onError = null;
            e.target.src = '/assets/images/accounts.png';
          }}
        />
        <div className="account-name">{selectProps.item.label}</div>
        {selectedLocalAccount === selectProps.item.value && (
          <SVGIcon icon={NewIcons.ACTIVE} className="active-icon" />
        )}
      </div>
    );
  };
  const copyUsernameToClipboard = (
    event: BaseSyntheticEvent,
    username: string,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    navigator.clipboard.writeText(username);
    setInfoMessage('popup_html_text_copied', [username]);
  };

  const customHandleRenderer = ({
    props,
    state,
    methods,
  }: SelectRenderer<LocalAccountListItem>) => {
    return (
      <SVGIcon
        className="custom-select-handle"
        icon={
          state.dropdown ? NewIcons.SELECT_ARROW_UP : NewIcons.SELECT_ARROW_DOWN
        }
      />
    );
  };

  const customDropdownRenderer = ({
    props,
    state,
    methods,
  }: SelectRenderer<LocalAccountListItem>) => {
    console.log(props, state, methods);
    return <div className="custom-select-dropdown"></div>;
  };

  return (
    <>
      {selectedLocalAccount && options && (
        <div className="select-account-section">
          <Select
            values={[selectedLocalAccount as any]}
            options={options}
            onChange={() => undefined}
            contentRenderer={customLabelRender}
            itemRenderer={customItemRender}
            className="select-account-select"
            dropdownHandleRenderer={customHandleRenderer}
            dropdownRenderer={customDropdownRenderer}
          />
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    accounts: state.accounts,
    activeAccount: state.activeAccount,
  };
};

const connector = connect(mapStateToProps, {
  loadActiveAccount,
  setInfoMessage,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export const SelectAccountSectionComponent = connector(SelectAccountSection);
