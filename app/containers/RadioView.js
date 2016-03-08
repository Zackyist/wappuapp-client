"use strict";

import React, {
    Component,
    StyleSheet,
    TouchableOpacity,
    Text,
    View
} from "react-native";
import { connect } from "react-redux";
import { AudioPlayer } from "../lib/audio";

class RadioView extends Component {
    constructor() {
        super();
        this._onToggleRadio = this._onToggleRadio.bind(this);
    }

    componentWillMount() {
        AudioPlayer.getStatus((error, status) => {
            error ? console.log("ERROR!", error) : console.log("status:", status);
        });
    }

    _onToggleRadio() {
        AudioPlayer.play();
    }

    render() {
        return (
            <View style={styles.background}>
                <TouchableOpacity
                    onPress={this._onToggleRadio}>
                    <Text style={styles.button}>Switch on</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1
    },
    button: {
        fontSize: 36
    }
});

const select = store => {
    return {
    }
};

export default connect(select)(RadioView);
