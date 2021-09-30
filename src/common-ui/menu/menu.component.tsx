import { navigateTo } from '@popup/actions/navigation.actions';
import { RootState } from '@popup/store';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { PageTitleComponent } from 'src/common-ui/page-title/page-title.component';
import { MenuItem } from 'src/interfaces/menu-item.interface';
import './menu.component.scss';

interface MenuProps {
  title: string;
  isBackButtonEnable: boolean;
  menuItems: MenuItem[];
}

const Menu = ({
  title,
  isBackButtonEnable,
  menuItems,
  navigateTo,
}: PropsType) => {
  const handleMenuItemClick = (menuItem: MenuItem) => {
    if (menuItem.nextScreen) {
      navigateTo(menuItem.nextScreen);
    } else if (menuItem.action) {
      menuItem.action();
    }
  };

  return (
    <div className="menu-page">
      <PageTitleComponent
        title={title}
        isBackButtonEnabled={isBackButtonEnable}
      />
      <div className="menu">
        {menuItems.map((menuItem, index) => (
          <div
            key={index}
            className="menu-item"
            onClick={() => handleMenuItemClick(menuItem)}>
            <img
              className="icon"
              src={`/assets/images/${menuItem.icon}.png`}
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = `/assets/images/${menuItem.icon}.svg`;
              }}
            />
            <div className="menu-label">
              {chrome.i18n.getMessage(menuItem.label)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {};
};

const connector = connect(mapStateToProps, { navigateTo });
type PropsType = ConnectedProps<typeof connector> & MenuProps;

export const MenuComponent = connector(Menu);
