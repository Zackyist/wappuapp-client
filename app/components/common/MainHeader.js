'use strict';

import React, { PropTypes } from 'react';
import {
  ToolbarAndroid,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';
import Tabs from '../../constants/Tabs';
import SortTypes from '../../constants/SortTypes';

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: theme.primary,
    elevation: 2,
    height: 56,
  }
});

const iconColor = 'rgba(255, 255, 255, 0.93)';

const getElevation = (tab) => {
  switch (tab) {
    case Tabs.FEED:
    case Tabs.FEELING:
    case Tabs.CALENDAR: {
      return 0;
    }
    default:{
      return 2;
    }
  }
};

const selectedActionText = '• '; //‣ • ● ♥

var EventDetailToolbar = React.createClass({
  propTypes: {
    title: PropTypes.string,
    navigator: PropTypes.object.isRequired
  },

  getActions(tab, sortType) {

    switch (tab) {
      case Tabs.FEED: {
        return [
          { title: 'City', id:'city', show: 'always', iconName: 'location-city', iconColor },
          { title: `${sortType === SortTypes.SORT_NEW ? selectedActionText : '  '} Newest`, id: SortTypes.SORT_NEW, show: 'never' },
          { title: `${sortType === SortTypes.SORT_HOT ? selectedActionText : '  '} Trending`, id: SortTypes.SORT_HOT, show: 'never' },
        ]
      }
      case Tabs.CALENDAR:
      case Tabs.ACTION:
      case Tabs.FEELING:
        return [{ title: 'City', id:'city', show: 'always', iconName: 'location-city', iconColor }]
      default:{
        return [];
      }
    }
  },

  onActionSelected(position) {
    // const { currentTab } === this.props;
    switch (position) {
      case 0: {
        this.props.toggleCityPanel();
        break;
      }

      case 1: {
        this.props.setFeedSortType(SortTypes.SORT_NEW);
        break;
      }
      case 2: {
        this.props.setFeedSortType(SortTypes.SORT_HOT);
        break;
      }

      default: {
        console.log('No action for this selection');
        break;
      }
    }
  },

  render() {
    const toolbarStyles = [styles.toolbar];

    const {
      backgroundColor,
      title,
      titleColor,
      currentTab,
      selectedSortType,
    } = this.props;

    const elevation = getElevation(currentTab);
    if (backgroundColor) {
      toolbarStyles.push({ backgroundColor, elevation })
    }

    return (
      <Icon.ToolbarAndroid
        actions={this.getActions(currentTab, selectedSortType)}
        logo={require('../../../assets/header/4.png')}
        // actions={toolbarActions} TODO - SHARE
        // navIcon={require('../../../assets/logo-for-header.png')}
        // navIconName={'arrow-drop-down'}
        // title={ currentCity || title  }
        overflowIconName={'sort'}
        title={null}
        onActionSelected={this.onActionSelected}
        onIconClicked={this.chooseCity}
        iconColor={theme.light}
        titleColor={titleColor || theme.light}
        style={toolbarStyles}
      />
    );
  }
});

export default EventDetailToolbar;
