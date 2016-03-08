import React, { NetInfo } from "react-native";
import { AudioManager } from "NativeModules";

export class AudioPlayer {
    static start() {
        NetInfo.reachabilityIOS.fetch().done(() => {
            AudioPlayer.play();
        });
    }
    static play() {
        console.log("playing audio ...");
        AudioManager.play();
    }
    static stop() {
        console.log("stopping audio ...");
        AudioManager.stop();
    }
    static pause() {
        console.log("pausing audio ...");
        AudioManager.pause();
    }
    static resume() {
        console.log("resuming audio ...");
        AudioManager.resume();
    }
    static getStatus(callback) {
        console.log("getting status ...");
        if (callback && typeof callback === "function") {
            return AudioManager.getStatus(callback);
        }
    }
}
