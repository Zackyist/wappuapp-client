'use strict';

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  Linking,
  Image,
  Dimensions,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import _ from 'lodash';

import Icon from 'react-native-vector-icons/MaterialIcons';
import WebViewer from '../webview/WebViewer';
import Header from '../common/Header';
import PlatformTouchable from '../common/PlatformTouchable';
import theme from '../../style/theme';
import { fetchLinks } from '../../actions/profile';
import { openRegistrationView } from '../../actions/registration';

const {width} = Dimensions.get('window');
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
    padding:20,
    flexDirection:'row',
    backgroundColor:'#FFF',
  },
  listItem__hero:{
    paddingTop: 35,
    paddingBottom: 35,
  },
  listItemSeparator: {
    marginBottom: 15,
    elevation: 1,
    borderBottomWidth: 0,
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
    flex:1,
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
    backgroundColor: 'transparent'
  },
  avatarColumn: {
    width: 50,
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    left: -10,
    width: 40,
    height: 40,
    backgroundColor: theme.stable,
    borderRadius: 20,
  },
  listItemIconRight:{
    position: 'absolute',
    right: 0,
    color: '#aaa',
    top: 45,
  },
  listItemText:{
    color:'#000',
    fontSize:16,
  },
  listItemText__highlight: {
    color:theme.primary
  },
  listItemText__downgrade: {
    color:'#aaa'
  },
  listItemText__small: {
    fontSize:12,
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
    paddingTop: 25,
    paddingBottom: 30,
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

  renderLinkItem(item) {
    const linkItemStyles = [styles.listItemButton];

    if (item.separatorAfter || item.last) {
      linkItemStyles.push(styles.listItemSeparator)
    }

    return (
      <PlatformTouchable
        underlayColor={'#eee'}
        activeOpacity={0.6}
        delayPressIn={0}
        style={styles.listItemButton}
        onPress={() => item.onPress ? item.onPress() : this.onLinkPress(item.link, item.title, item.showInWebview)}>
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



  renderModalItem(item) {
    const currentTeam = _.find(this.props.teams.toJS(), ['id', this.props.selectedTeam]) || {name:''};

    return (
      <TouchableHighlight style={[styles.listItemButton, styles.listItemSeparator]} underlayColor={theme.primary}
        onPress={this.openRegistration}>
        <View style={[styles.listItem, styles.listItem__hero]}>
          <View style={styles.avatarColumn}>
            <View style={styles.avatar}>
              <Icon style={[styles.listItemIcon, styles.listItemIcon__hero]} name={item.icon} />
            </View>
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
      </TouchableHighlight>
    );
  }

  renderImageMadeByItem() {
    return (
      <View style={[styles.listItem, styles.listItemSeparator, styles.madeby]}>
        <Image resizeMode="contain" style={[styles.madebyIcon, {width: 45, height: 45}]} source={require('../../../assets/madeby/jayna.png')} />
        <Text style={styles.madebyText}>×</Text>
        <Image resizeMode="contain" style={[styles.madebyIcon, {top: 1, width: 70, height: 30}]} source={require('../../../assets/madeby/futurice.png')} />
        <Text style={styles.madebyText}>×</Text>
        <Image resizeMode="contain" style={[styles.madebyIcon, {top: 2, width: 108, height: 35 }]} source={require('../../../assets/madeby/ttyy.png')} />
      </View>
    )
  }

  @autobind
  renderItem(item) {
    if (item.link) {
      return this.renderLinkItem(item);
    } else if (item.type === 'IMAGES') {
      return this.renderImageMadeByItem();
    }
    return this.renderModalItem(item);
  }

  render() {
    const { name, links, terms } = this.props;

    const userItem = { title: name, icon: 'person-outline', link: '', rightIcon: 'create'};
    const listData = [userItem].concat(links.toJS(), [{ type: 'IMAGES' }], terms.toJS());

    return (
      <View style={styles.container}>
        <ListView style={[styles.scrollView]}
          dataSource={this.state.dataSource.cloneWithRows(listData)}
          renderRow={this.renderItem}
        />
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
    }
};

export default connect(select, mapDispatchToProps)(Profile);
