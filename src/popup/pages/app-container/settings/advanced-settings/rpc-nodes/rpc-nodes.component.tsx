import { setActiveRpc } from '@popup/actions/active-rpc.actions';
import { setErrorMessage } from '@popup/actions/message.actions';
import { setTitleContainerProperties } from '@popup/actions/title-container.actions';
import { RootState } from '@popup/store';
import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import Select, {
  SelectItemRenderer,
  SelectRenderer,
} from 'react-dropdown-select';
import { connect, ConnectedProps } from 'react-redux';
import ButtonComponent from 'src/common-ui/button/button.component';
import CheckboxComponent from 'src/common-ui/checkbox/checkbox.component';
import { InputType } from 'src/common-ui/input/input-type.enum';
import InputComponent from 'src/common-ui/input/input.component';
import { Rpc } from 'src/interfaces/rpc.interface';
import RpcUtils from 'src/utils/rpc.utils';
import './rpc-nodes.component.scss';

interface RpcListItem {
  label: string;
  value: string;
  rpc: Rpc;
}

const RpcNodes = ({
  activeRpc,
  setActiveRpc,
  setErrorMessage,
  setTitleContainerProperties,
}: PropsFromRedux) => {
  const allRpc = RpcUtils.getFullList();
  let displayedRpcs = allRpc;
  const [customRpcs, setCustomRpcs] = useState([] as Rpc[]);

  const [isAddRpcPanelDisplayed, setIsAddRpcPanelDisplayed] = useState(false);
  const [addRpcNodeUri, setAddRpcNodeUri] = useState('');
  const [addRpcNodeChainId, setAddRpcNodeChainId] = useState('');
  const [addRpcNodeTestnet, setAddRpcNodeTestnet] = useState(false);

  const [setNewRpcAsActive, setSetNewRpcAsActive] = useState(false);

  const [options, setOptions] = useState(
    allRpc.map((rpc) => {
      return {
        label: rpc.uri,
        value: rpc.uri,
        rpc: rpc,
      };
    }),
  );

  useEffect(() => {
    displayedRpcs = [...allRpc, ...customRpcs];
    setOptions(
      displayedRpcs.map((rpc) => {
        return {
          label: rpc.uri,
          value: rpc.uri,
          rpc: rpc,
        };
      }),
    );
  }, [customRpcs]);

  useEffect(() => {
    setTitleContainerProperties({
      title: 'popup_html_rpc_node',
      isBackButtonEnabled: true,
    });
    initCustomRpcList();
  }, []);

  const initCustomRpcList = async () => {
    setCustomRpcs(await RpcUtils.getCustomRpcs());
  };

  const handleItemClicked = (rpc: Rpc) => {
    setActiveRpc(rpc);
  };

  const deleteCustomRPC = (item: Rpc, event: BaseSyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log(activeRpc?.uri, item.uri, activeRpc?.uri === item.uri);
    const newRpcs = setCustomRpcs(RpcUtils.deleteCustomRpc(customRpcs, item));
    if (activeRpc?.uri === item.uri) {
      setActiveRpc(allRpc[0]);
    }

    return newRpcs;
  };

  const handleSaveNewRpcClicked = () => {
    if (
      !addRpcNodeUri.length ||
      (addRpcNodeTestnet && !addRpcNodeChainId.length)
    ) {
      setErrorMessage('popup_html_rpc_missing_fields');
      return;
    }
    if (displayedRpcs.find((rpc) => rpc.uri === addRpcNodeUri)) {
      setErrorMessage('popup_html_rpc_uri_already_existing');
      return;
    }

    const newCustomRpc = {
      uri: addRpcNodeUri,
      testnet: addRpcNodeTestnet,
      chainId: addRpcNodeChainId.length ? addRpcNodeChainId : undefined,
    };
    setIsAddRpcPanelDisplayed(false);
    RpcUtils.addCustomRpc(newCustomRpc);
    setCustomRpcs([...customRpcs, newCustomRpc]);
    if (setNewRpcAsActive) {
      setActiveRpc(newCustomRpc);
    }
  };

  const customLabelRender = (selectProps: SelectRenderer<RpcListItem>) => {
    return (
      <div
        className="selected-rpc-node-panel"
        onClick={() => {
          selectProps.methods.dropDown('close');
        }}>
        <div className="selected-rpc-node">
          {activeRpc && activeRpc?.uri && activeRpc.uri}
          {activeRpc?.testnet && <div>- TESTNET</div>}
        </div>
      </div>
    );
  };
  const customItemRender = (selectProps: SelectItemRenderer<RpcListItem>) => {
    return (
      <div
        className={`select-rpc-item ${
          activeRpc?.uri === selectProps.item.rpc.uri ? 'selected' : ''
        }`}
        onClick={() => {
          handleItemClicked(selectProps.item.rpc);
          selectProps.methods.dropDown('close');
        }}>
        <div className="rpc-name">
          {selectProps.item.label}{' '}
          {selectProps.item.rpc.testnet && <div>TESTNET</div>}
        </div>
        {!RpcUtils.isDefault(selectProps.item.rpc) && (
          <img
            src="/assets/images/clear.png"
            className="erase-button"
            onClick={($event) => {
              deleteCustomRPC(selectProps.item.rpc, $event);
              selectProps.methods.dropDown('close');
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="rpc-nodes-page">
      <p
        className="introduction"
        dangerouslySetInnerHTML={{
          __html: chrome.i18n.getMessage('popup_html_rpc_node_text'),
        }}></p>

      {activeRpc && options && (
        <div className="select-account-section">
          <Select
            values={[]}
            options={options}
            onChange={() => undefined}
            contentRenderer={customLabelRender}
            itemRenderer={customItemRender}
            className="select-rpc-node-select"
          />
        </div>
      )}

      {!isAddRpcPanelDisplayed && (
        <ButtonComponent
          label={'popup_html_add_rpc'}
          onClick={() => setIsAddRpcPanelDisplayed(true)}
        />
      )}

      {isAddRpcPanelDisplayed && (
        <div className="add-rpc-panel">
          <div className="add-rpc-caption">
            {chrome.i18n.getMessage('popup_html_add_rpc_text')}
          </div>
          <InputComponent
            type={InputType.TEXT}
            value={addRpcNodeUri}
            onChange={setAddRpcNodeUri}
            placeholder={'popup_html_rpc_node'}
            onEnterPress={handleSaveNewRpcClicked}
          />
          <CheckboxComponent
            title="TESTNET"
            checked={addRpcNodeTestnet}
            onChange={setAddRpcNodeTestnet}
            skipTranslation={true}></CheckboxComponent>
          {addRpcNodeTestnet && (
            <InputComponent
              type={InputType.TEXT}
              value={addRpcNodeChainId}
              onChange={setAddRpcNodeChainId}
              placeholder="Chain Id"
              skipTranslation={true}
              onEnterPress={handleSaveNewRpcClicked}
            />
          )}

          <CheckboxComponent
            title="popup_html_set_new_rpc_as_active"
            checked={setNewRpcAsActive}
            onChange={setSetNewRpcAsActive}></CheckboxComponent>

          <ButtonComponent
            label={'popup_html_save'}
            onClick={() => handleSaveNewRpcClicked()}
            fixToBottom
          />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return { activeRpc: state.activeRpc };
};

const connector = connect(mapStateToProps, {
  setActiveRpc,
  setErrorMessage,
  setTitleContainerProperties,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export const RpcNodesComponent = connector(RpcNodes);
