'use strict';

import React, { PropTypes, Component } from 'react';

import {
  View,
  Text,
  ListView,
  Image,
  Platform,
  Dimensions,
  StyleSheet,
  BackAndroid,
  TouchableWithoutFeedback,
  Modal
} from 'react-native';
import moment from 'moment';
import location from '../../services/location';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EventListItem from '../calendar/EventListItem';
import { checkIn, closeCheckInView } from '../../actions/competition';
import { getCurrentCityName } from '../../concepts/city';

import CheckInButton from './CheckInButton';
import theme from '../../style/theme';
import * as CompetitionActions from '../../actions/competition';
const IOS = Platform.OS === 'ios';

const { width, height } = Dimensions.get('window');

class CheckInActionView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeContentWasFound: false,
      eventContent: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      })
    };
  }

  componentWillReceiveProps({events}) {
    this.getContent(events);
  }

  componentDidMount(){
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this.props.isCheckInViewOpen) {
        this.onCancel()
        return true;
      }
      return false;
    });
  }

  checkIn(eventId) {
    this.props.checkIn(eventId);
    this.props.closeCheckInView();
  }

  getContent(events) {
    const currentTime = moment();

    const activeEvents = events.filter((event) => {
      if (moment(event.get('startTime')).isBefore(currentTime) && moment(event.get('endTime')).isAfter(currentTime)) {
        return event;
      }
    });

    if (activeEvents.size > 0) {
      this.setState({
        eventContent: activeEvents,
        activeContentWasFound: true,
        dataSource: this.state.dataSource.cloneWithRows(activeEvents.toJS())
      });
    } else {
      this.setState({eventContent: events.get(0), activeContentWasFound: false});
    }
  }

  noActiveEventsView() {

    return (
      <View style={[styles.eventContainer, {paddingBottom: 90}]}>
        <Image style={{
          height: 200,
          width: 200,
          marginBottom: 10,
          backgroundColor: '#ddd',
          borderWidth: 6,
          borderColor: theme.primaryDarker,
          borderRadius: 100}}  source={require('../../../assets/sad-wappu-panda.png')}/>

        <Text style={{fontSize: 40, textAlign: 'center', color: theme.white}}>OH NO!</Text>
        <Text style={[styles.text]}>No ongoing events available in {this.props.city}.</Text>
        <Text style={[styles.text]}>Try again later.</Text>

        <TouchableWithoutFeedback onPress={this.props.closeCheckInView}>
          <View style={styles.cancelButton}>
            <Text style={{fontSize: 14, fontWeight: 'bold', color: theme.white}}>CLOSE</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderEventList() {
    return (
      <View style={styles.eventContainer}>
        <View style={styles.headerContainer}>
          <Icon name={'pin-drop'} style={{color: theme.white}} size={30}/>
          <Text style={styles.title}>CHECK IN</Text>
        </View>

        <View style={{height: 60}}>
          <Text style={[styles.text, {fontSize: 13, padding: 10}]}>You can only check-in to events if you are in the event area.</Text>
        </View>

        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderHeader={this.renderHeader}
          stickyHeaderIndices={[0]}
          renderSectionHeader={this.renderSectionHeader}
          renderRow={this.renderListItem.bind(this)}
          style={styles.listView}
        />

        <TouchableWithoutFeedback onPress={this.props.closeCheckInView}>
          <View style={styles.cancelButton}>
            <Text style={{fontSize: 14, fontWeight: 'bold', color: theme.white}}>CLOSE</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderListItem(item, sectionId, rowId) {
    const { userLocation, checkIn } = this.props;
    let validLocation = false;

    if ( userLocation && item.location ) {
      const distance = location.getDiscanceInMeters(userLocation, item.location);
      validLocation = item.radius > distance;
    }

    return (
      <View style={{marginBottom: 5}}>
        <EventListItem item={item} rowId={+rowId} hideStatus={true}/>
        <CheckInButton validLocation={validLocation} checkIn={() => this.checkIn(item.id)} />
      </View>);
  }

  renderHeader() {
    return (
      <View style={styles.listHeader}>
        <Text style={[styles.title, {fontSize: 20}]}>ONGOING</Text>
      </View>
    );

  }

  render() {

    const { isCheckInViewOpen, events } = this.props;

    if (!isCheckInViewOpen) {
      return false;
    }

    return (
      <Modal
        // onRequestClose={this.props.closeCheckInView}
        visible={isCheckInViewOpen}
        animationType={'slide'}
      >
        <View style={[styles.container, styles.modalBackgroundStyle]}>
          {this.state.activeContentWasFound ?
            this.renderEventList()
            :
            this.noActiveEventsView()}
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:30,
  },
  modalBackgroundStyle: {
    backgroundColor: theme.secondaryLight
  },
  eventContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    color: theme.light,
    fontWeight: 'bold',
    paddingLeft: 0,
    fontSize: 30,
  },
  text: {
    color: theme.light
  },
  header: {
    fontSize: 30,
    color: theme.light,
    textAlign: 'center'
  },
  listHeader: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: theme.primaryDarker,
    alignSelf: 'stretch',
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderColor: '#ddd'
  },
  cancelButton: {
    position: 'absolute',
    bottom: 20,
    left: width/2-60,
    padding: 5,
    paddingTop: 8,
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.grey,
    backgroundColor: theme.primary,
    width: 120,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: {
      height: 5,
      width: 0
    }
  },
  listView: {
    flexGrow: 1,
    marginTop: 0,
    marginBottom: 5,
  }
});

const mapDispatchToProps = {
  checkIn,
  closeCheckInView,
};

const select = store => {
  return {
    isCheckInViewOpen: store.competition.get('isCheckInViewOpen'),
    events: store.event.get('list'),
    city: getCurrentCityName(store),
    userLocation: store.location.get('currentLocation')
  };
};

export default connect(select, mapDispatchToProps)(CheckInActionView);
