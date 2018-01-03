'use strict';

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import _ from 'lodash';

import Icon from 'react-native-vector-icons/MaterialIcons';
import WebViewer from '../webview/WebViewer';
import PlatformTouchable from '../common/PlatformTouchable';
import theme from '../../style/theme';
import { fetchLinks } from '../../actions/profile';
import { getCurrentCityName } from '../../concepts/city';
import { openRegistrationView } from '../../actions/registration';
import feedback from '../../services/feedback';
import UserAvatar from 'react-native-user-avatar';

const IOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.stable
  },
  scrollView:{
    flex: 1,
  },
  listItem: {
    flex:1,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: IOS ? theme.white : theme.transparent,
  },
  listItem__hero:{
    paddingTop: 35,
    paddingBottom: 35,
  },
  listItemSeparator: {
    marginBottom: 15,
    elevation: 1,
    borderBottomWidth: 0,
    backgroundColor: theme.white,
    borderBottomColor: '#eee',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 0
    },
  },
  listItemButton:{
    backgroundColor: IOS ? theme.transparent : theme.white,
    flex: 1,
    padding: 0,
  },
  listItemIcon: {
    fontSize: 22,
    color: theme.primary,
    alignItems: 'center',
    width: 50,
  },
  listItemIcon__hero: {
    top: 0,
    left: 9,
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
  },
  listItemSubtitle: {
    color: theme.subtlegrey,
    top: 1,
    fontSize: 13,
  },
  avatarColumn: {
    width: 50,
    right: 10,
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    left: -8,
    top: -1,
    width: 40,
    height: 40,
    backgroundColor: theme.stable,
    borderRadius: 20,
  },
  avatarInitialLetter: {
    backgroundColor: theme.primary
  },
  avatarText: {
    color: theme.accentLight,
    fontSize: 18,
  },
  listItemIconRight:{
    position: 'absolute',
    right: 0,
    color: '#aaa',
    top: 45,
  },
  listItemText:{
    color: '#000',
    fontSize: 16,
  },
  listItemText__highlight: {
    color:theme.primary
  },
  listItemText__downgrade: {
    color:'#aaa'
  },
  listItemText__small: {
    fontSize:13,
    paddingTop: 1,
  },
  listItemTitles: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  listItemBottomLine:{
    position:'absolute',
    right:0,
    left:70,
    bottom:0,
    height:1,
    backgroundColor:'#f4f4f4'
  },
  madeby: {
    padding: 7,
    backgroundColor: '#FFF',
    paddingTop: 12,
    paddingBottom: 17,
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center'
  },
  madebyIcon: {
    tintColor: theme.dark,
    width: 100,
    height: 20,
  },
  madebyText: {
    padding: 2,
    color: theme.primary,
    fontSize: 28,
    fontWeight: '300'
  }
});

class Profile extends Component {
  propTypes: {
    dispatch: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    links: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
    };
  }


  componentDidMount() {
    this.props.fetchLinks();
  }

  @autobind
  openRegistration() {
    this.props.openRegistrationView();
  }

  @autobind
  onLinkPress(url, text, openInWebview) {
    if (!url) {
      return;
    }
    if (!openInWebview) {
      Linking.openURL(url)
    } else {
      this.props.navigator.push({
        component: WebViewer,
        showName: true,
        name: text,
        url: url
      });

    }
  }

  renderLinkItem(item, index) {
    const linkItemStyles = [styles.listItemButton];

    if (item.separatorAfter || item.last) {
      linkItemStyles.push(styles.listItemSeparator)
    }

    return (
      <PlatformTouchable
        key={index}
        underlayColor={'#eee'}
        activeOpacity={0.6}
        delayPressIn={0}
        style={styles.listItemButton}
        onPress={() => item.mailto ? feedback.sendEmail(item.mailto) : this.onLinkPress(item.link, item.title, item.showInWebview)}>
        <View style={linkItemStyles}>
          <View style={styles.listItem}>
            <Icon style={styles.listItemIcon} name={item.icon} />
            <Text style={styles.listItemText}>{item.title}</Text>
            {!item.separatorAfter && !item.last && <View style={styles.listItemBottomLine} />}
          </View>
        </View>
      </PlatformTouchable>
    );
  }

  renderComponentItem(item, index) {
    const linkItemStyles = [styles.listItemButton];
    const { navigator } = this.props;
    const { component, title } = item;

    if (item.separatorAfter || item.last) {
      linkItemStyles.push(styles.listItemSeparator)
    }

    return (
      <PlatformTouchable
        key={index}
        underlayColor={'#eee'}
        activeOpacity={0.6}
        delayPressIn={0}
        style={styles.listItemButton}
        onPress={() => navigator.push({ name: title, component, showName: true })}>
        <View style={linkItemStyles}>
          <View style={styles.listItem}>
            <Icon style={styles.listItemIcon} name={item.icon} />
            <View style={styles.listItemTitles}>
              <Text style={styles.listItemText}>{item.title}</Text>
              {item.subtitle && <Text style={styles.listItemSubtitle}>{item.subtitle}</Text>}
            </View>
            {!item.separatorAfter && !item.last && <View style={styles.listItemBottomLine} />}
          </View>
        </View>
      </PlatformTouchable>
    );
  }



  renderModalItem(item, index) {
    const currentTeam = _.find(this.props.teams.toJS(), ['id', this.props.selectedTeam]) || {name:''};
    const hasName = !!item.title;
    //const avatarInitialLetters = hasName ? item.title.split(' ').slice(0, 2).map(t => t.substring(0, 1)).join('') : null;

    return (
      <View key={index} style={{flex:1}}>
        <PlatformTouchable delayPressIn={0} activeOpacity={0.8} onPress={this.openRegistration}>
            <View style={[styles.listItemButton, styles.listItemSeparator]}>
            <View style={[styles.listItem, styles.listItem__hero]}>
              <View style={styles.avatarColumn}>
              <UserAvatar name={hasName ? item.title : 'W A'}
                src={this.props.image_url} size={50} />
              </View>
              <View style={{flexDirection:'column',flex:1}}>
                {
                  item.title ?
                  <Text style={[styles.listItemText, styles.listItemText__highlight]}>
                    {item.title}
                  </Text> :
                  <Text style={[styles.listItemText, styles.listItemText__downgrade]}>
                    Unnamed Whappu user
                  </Text>
                }
                <Text style={[styles.listItemText, styles.listItemText__small]}>
                  {currentTeam.name}
                </Text>
              </View>
              <Icon style={[styles.listItemIcon, styles.listItemIconRight]} name={item.rightIcon} />
            </View>
          </View>
        </PlatformTouchable>
      </View>
    );
  }

  renderImageMadeByItem(index) {
    return (
      <View key={index}  style={[styles.listItemButton, styles.listItemSeparator, styles.madeby]}>
        <View style={[styles.listItem, styles.madeby]}>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.jayna.fi/')}>
            <Image resizeMode="contain" style={[styles.madebyIcon, {width: 50, height: 50}]} source={require('../../../assets/madeby/jayna.png')} />
          </TouchableOpacity>
          <Text style={styles.madebyText}>×</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://futurice.com/')}>
            <Image resizeMode="contain" style={[styles.madebyIcon, {top: 1, width: 88, height: 45}]} source={require('../../../assets/madeby/futurice.png')} />
          </TouchableOpacity>
          <Text style={styles.madebyText}>×</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://ttyy.fi/')}>
            <Image resizeMode="contain" style={[styles.madebyIcon, {top: 2, width: 54, height: 54 }]} source={require('../../../assets/madeby/ttyy-plain.png')} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  @autobind
  renderItem(item) {
    if (item.hidden) {
      return null;
    }

    const key = item.id || item.title;
    if (item.component) {
      return this.renderComponentItem(item, key);
    } else if (item.link || item.mailto) {
      return this.renderLinkItem(item, key);
    } else if (item.type === 'IMAGES') {
      return this.renderImageMadeByItem(key);
    }
    return this.renderModalItem(item, key);
  }

  render() {
    const { name, links, terms, cityName } = this.props;

    const linksForCity = links.toJS().map(link => {
      const showCity = link.showCity;
      if (showCity && (cityName || '').toLowerCase() !== showCity) {
        link.hidden = true;
      }
      return link;
    });

    const userItem = { title: name, icon: 'person-outline', rightIcon: 'create', id: 'user-edit'};
    const listData = [userItem].concat(linksForCity, [{ type: 'IMAGES', id: 'madeby' }], terms.toJS());

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {listData.map(this.renderItem)}
        </ScrollView>

      {/*
      <ListView style={[styles.scrollView]}
          dataSource={this.state.dataSource.cloneWithRows(listData)}
          renderRow={this.renderItem}
        />
      */}
      </View>
      );

  }
}

const mapDispatchToProps = { fetchLinks, openRegistrationView };

const select = store => {
  return {
      selectedTeam: store.registration.get('selectedTeam'),
      teams: store.team.get('teams'),
      name: store.registration.get('name'),
      links: store.profile.get('links'),
      terms: store.profile.get('terms'),
      image_url: store.registration.get('image_url'),
      cityName: getCurrentCityName(store)
    }
};

export default connect(select, mapDispatchToProps)(Profile);
