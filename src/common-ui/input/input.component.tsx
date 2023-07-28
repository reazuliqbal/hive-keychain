import { AutoCompleteValuesType } from '@interfaces/autocomplete.interface';
import React, { useEffect, useState } from 'react';
import { AutocompleteBox } from 'src/common-ui/autocomplete/autocomplete-box.component';
import { Icons, NewIcons } from 'src/common-ui/icons.enum';
import { SVGIcon } from 'src/common-ui/svg-icon/svg-icon.component';
import { InputType } from './input-type.enum';
import './input.component.scss';

interface InputProps {
  value: any;
  logo?: Icons | string | NewIcons;
  label?: string;
  placeholder: string;
  type: InputType;
  step?: number;
  min?: number;
  max?: number;
  skipLabelTranslation?: boolean;
  skipPlaceholderTranslation?: boolean;
  hint?: string;
  skipHintTranslation?: boolean;
  autocompleteValues?: AutoCompleteValuesType;
  translateSimpleAutoCompleteValues?: boolean;
  required?: boolean;
  hasError?: boolean;
  dataTestId?: string;
  disabled?: boolean;
  classname?: string;
  onChange: (value: any) => void;
  onEnterPress?(): any;
  rightActionClicked?(): any;
  rightActionIcon?: NewIcons;
}

const InputComponent = (props: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordDisplay, setPasswordDisplayed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return function cleanup() {
      setMounted(false);
    };
  });

  const handleOnBlur = () => {
    if (mounted) {
      setTimeout(() => setIsFocused(false), 200);
    }
  };
  const handleOnFocus = () => {
    setIsFocused(true);
  };

  return (
    <div className={`custom-input ${props.classname ?? ''}`}>
      {props.label && (
        <div className="label">
          {props.skipLabelTranslation
            ? props.label
            : chrome.i18n.getMessage(props.label)}{' '}
          {props.required ? '*' : ''}
          {props.hint && (
            <div className="hint">
              {props.skipHintTranslation
                ? props.hint
                : chrome.i18n.getMessage(props.hint)}
            </div>
          )}
        </div>
      )}
      <div className={`custom-input-content`}>
        <div
          className={`input-container ${props.logo ? 'has-logo' : 'no-logo'} ${
            props.type === InputType.PASSWORD ? 'password-type' : ''
          } ${isFocused ? 'focused' : ''}`}>
          <input
            data-testid={props.dataTestId}
            className={`${props.hasError ? 'has-error' : ''}`}
            type={
              props.type === InputType.PASSWORD && isPasswordDisplay
                ? InputType.TEXT
                : props.type
            }
            placeholder={`${
              props.skipPlaceholderTranslation
                ? props.placeholder
                : chrome.i18n.getMessage(props.placeholder)
            } ${props.required ? '*' : ''}`}
            value={props.value}
            step={props.step}
            min={props.min}
            max={props.max}
            onChange={(e) => props.onChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && props.onEnterPress) {
                props.onEnterPress();
              }
            }}
            onFocus={() => handleOnFocus()}
            onBlur={() => handleOnBlur()}
          />
          {props.type === InputType.PASSWORD && !isPasswordDisplay && (
            <SVGIcon
              icon={NewIcons.VISIBLE}
              className="input-img display-password right"
              onClick={() => setPasswordDisplayed(true)}
            />
          )}
          {props.type === InputType.PASSWORD && isPasswordDisplay && (
            <SVGIcon
              icon={NewIcons.HIDE}
              className="input-img display-password right"
              onClick={() => setPasswordDisplayed(false)}
            />
          )}
          {props.type !== InputType.PASSWORD &&
            props.value &&
            props.value.length > 0 && (
              <SVGIcon
                dataTestId="input-clear"
                icon={NewIcons.CLEAR_ALL}
                className="input-img erase right"
                onClick={() => props.onChange('')}
              />
            )}
          {(isFocused || true) && props.autocompleteValues && (
            <AutocompleteBox
              autoCompleteValues={props.autocompleteValues}
              handleOnChange={props.onChange}
              value={props.value}
            />
          )}
          {props.logo && (
            <SVGIcon icon={props.logo as NewIcons} className="input-img left" />
          )}
        </div>

        {props.rightActionClicked && props.rightActionIcon && (
          <div className="right-action">
            <div className="vertical-separator"></div>
            <SVGIcon
              data-testid="right-action"
              icon={props.rightActionIcon}
              onClick={props.rightActionClicked}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InputComponent;
