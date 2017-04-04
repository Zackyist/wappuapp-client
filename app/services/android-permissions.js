import { PermissionsAndroid } from 'react-native';

async function requestLocationPermission(cb) {
  try {
    const granted = await PermissionsAndroid.requestPermission(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Whappu Location Permission',
        'message': 'Whappu needs access to location ' +
                   'to serve best possible experience.'
      }
    )
    if (granted) {
      console.log("You can use the Location")
      cb();
    } else {
      console.log("Location permission denied")
    }
  } catch (err) {
    console.warn(err)
  }
}

async function requestCameraPermission(cb) {
  try {
    const granted = await PermissionsAndroid.requestPermission(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        'title': 'Whappu Camera Permission',
        'message': 'Whappu needs access to camera ' +
                   'to post images to feed.'
      }
    )
    if (granted) {
      console.log("You can use the Camera")
      cb();
    } else {
      console.log("Camera permission denied")
    }
  } catch (err) {
    console.warn(err)
  }
}

export default {
  requestLocationPermission,
  requestCameraPermission
}
