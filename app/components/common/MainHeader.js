'use strict';

import React, { PropTypes } from 'react';
import {
  ToolbarAndroid,
  StyleSheet,
  Alert
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';
import Tabs from '../../constants/Tabs';

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: theme.primary,
    elevation: 2,
    height: 56,
  }
});

const iconColor = 'rgba(255, 255, 255, 0.93)';

const getActions = (tab) => {
  switch (tab) {
    case Tabs.FEED: {
      return [
        { title: 'City', id:'city', show: 'always', iconName: 'map', iconColor },
        { title: 'Sort', id:'sort', show: 'always', iconName: 'sort', iconColor }
      ]
    }
    case Tabs.CALENDAR:
    case Tabs.ACTION:
      return [{ title: 'City', id:'city', show: 'always', iconName: 'map', iconColor }]
    default:{
      return [];
    }
  }
};

const getElevation = (tab) => {
  switch (tab) {
    case Tabs.FEED:
    case Tabs.CALENDAR: {
      return 0;
    }
    default:{
      return 2;
    }
  }
};

var EventDetailToolbar = React.createClass({
  propTypes: {
    title: PropTypes.string,
    navigator: PropTypes.object.isRequired
  },

  onActionSelected(position) {
    //TODO switch toolbarActions[position]
    this.chooseCity();
  },

  chooseCity() {
    this.props.openCitySelection();
  },

  render() {
    const toolbarStyles = [styles.toolbar];

    const {
      backgroundColor,
      title,
      titleColor,
      currentTab,
      currentCity
    } = this.props;

    const elevation = getElevation(currentTab);
    if (backgroundColor) {
      toolbarStyles.push({ backgroundColor, elevation })
    }

    return (
      <Icon.ToolbarAndroid
        actions={getActions(currentTab)}
        logo={require('../../../assets/header/4.png')}
        // actions={toolbarActions} TODO - SHARE
        // navIcon={require('../../../assets/logo-for-header.png')}
        // navIconName={'arrow-drop-down'}
        // title={ currentCity || title  }
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
