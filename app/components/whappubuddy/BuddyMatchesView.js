'use strict';

// TODO: Implement redux
// TODO: Find solution to the async problem with showing profile pic and name

import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  ListView,
  ScrollView,
  ActivityIndicator,
  ActivityIndicatorIOS,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';

import _ from 'lodash';
import autobind from 'autobind-decorator';
import UserAvatar from 'react-native-user-avatar';
import BuddyView from '../../containers/BuddyView';
import BuddyChatView from './BuddyChatView';
import theme from '../../style/theme';

import {
  fetchingMatches,
  fetchingBuddy,
  updateDatasource,
  finishList
} from '../../actions/matches';


const isIOS = Platform === 'ios';

class BuddyMatches extends Component {

  constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      dataSource: dataSource.cloneWithRows([])
    }
  }


  propTypes: {
    matches: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    matchesFetched: PropTypes.bool.isRequired,
    errorMsg: PropTypes.string.isRequired,
    navigator: PropTypes.object.isRequired
  };

  openChat(item) {
    console.log('Avataan chatti... ', item)
    console.log(this.props.navigator)
    let routelist = this.props.navigator.getCurrentRoutes();
    console.log('routelist', routelist)
    return () => {
      this.props.navigator.push({
        component: BuddyChatView,
        // name: `${item.buddyName}`,
        passProps: {
          name: item
        }
      });
    };
  };

  getMatchDetails = (matches) => {
    _.forEach(matches, (match) => {
      this.props.fetchingBuddy(match.userId2);
    });
  }

  setDatasource = (source) => {

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(source)
    });
    this.props.finishList();
  };

  getDatasource = () => {

    this.props.updateDatasource(this.props.matchList, this.props.buddyList);
  };

  componentDidUpdate() {

    if (this.props.matchesFetched && !this.props.buddiesFetched) {
      this.getMatchDetails(this.props.matchList);
    }
    if (this.props.isLoading && this.props.matchesFetched && this.props.buddiesFetched) {
      this.getDatasource();
    }
    if (this.props.datasourceReady && !this.props.listReady) {
      this.setDatasource(this.props.datasource);
    }
  }

  propTypes: {
    matches: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    matchesFetched: PropTypes.bool.isRequired,
    errorMsg: PropTypes.string.isRequired,
    navigator: PropTypes.object.isRequired
  };

  openChat(item) {
    console.log('Avataan chatti... ', item)
    console.log(this.props.navigator)
    let routelist = this.props.navigator.getCurrentRoutes();
    console.log('routelist', routelist)
    return () => {
      this.props.navigator.push({
        component: BuddyChatView,
        // name: `${item.buddyName}`,
        passProps: {
          name: item
        }
      });
    };
  };

  getMatchDetails = (matches) => {
    _.forEach(matches, (match) => {
      this.props.fetchingBuddy(match.userId2);
    });
  }

  setDatasource = (source) => {

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(source)
    });
    this.props.finishList();
  };

  getDatasource = () => {

    this.props.updateDatasource(this.props.matchList, this.props.buddyList);
  };

  componentDidUpdate() {

    if (this.props.matchesFetched && !this.props.buddiesFetched) {
      this.getMatchDetails(this.props.matchList);
    }
    if (this.props.isLoading && this.props.matchesFetched && this.props.buddiesFetched) {
      this.getDatasource();
    }
    if (this.props.datasourceReady && !this.props.listReady) {
      this.setDatasource(this.props.datasource);
    }
  }

  componentDidMount() {
    
    this.props.fetchingMatches();
  }

  renderRow = (item) => {
    return (
      <TouchableOpacity onPress={this.openChat.bind(this, item)}>
        <View style={styles.containerStyle} >
          <UserAvatar
            name={item.buddyName}
            src={item.buddyImg}
            size={50}
          />
          <Text
            style={styles.containerNameStyle}
          >
            {item.buddyName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  componentDidMount() {

    this.props.fetchingMatches();
  }

  renderRow = (item) => {
    return (
      <TouchableOpacity onPress={this.openChat.bind(this, item)}>
        <View style={styles.containerStyle} >
          <UserAvatar
            name={item.buddyName}
            src={item.buddyImg}
            size={50}
          />
          <Text
            style={styles.containerNameStyle}
          >
            {item.buddyName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderSeparator = (sectionID, rowID) => {
    return <View key={`${sectionID}-${rowID}`} />
  }

  render() {

    return (
      <ScrollView style={styles.scrollStyle} >
        { !this.props.listReady ? (
          <View style={styles.activityStyle}>
            {!isIOS ? (
              <ActivityIndicator size='large' />
            ) : (
              <ActivityIndicatorIOS />
            )}
          </View>
        ) : (
        <ListView
          enableEmptySections
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderSeparator={this.renderSeparator}
        />
        )}
      </ScrollView>
    );
  }
}

const styles = {
  scrollStyle: {
    flex: 1
  },
  containerStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 60,
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 5,
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0,.2)'
  },
  containerNameStyle: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold'
  },
  activityStyle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  }
}



// BuddyMatches.propTypes = {
//   matches: PropTypes.array.isRequired,
//   isFetching: PropTypes.bool.isRequired,
//   errorMsg: PropTypes.string.isRequired
// };

const mapDispatchToProps = { fetchingMatches, fetchingBuddy, updateDatasource, finishList };

const mapStateToProps = store => {

  return {
    matchesFetched: store.matches.matchesFetched,
    buddiesFetched: store.matches.buddiesFetched,
    datasourceReady: store.matches.datasourceReady,
    listReady: store.matches.listReady,
    errorMsg: store.matches.errorMsg,
    buddyList: store.matches.buddyList,
    matchList: store.matches.matchList,
    datasource: store.matches.datasource,
    isLoading: store.matches.isLoading
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BuddyMatches);
