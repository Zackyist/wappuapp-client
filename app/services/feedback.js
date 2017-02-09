import { Linking } from 'react-native';

const FEEDBACK_EMAIL_ADDRESS = 'wappu@futurice.com';
const FEEDBACK_EMAIL_SUBJECT = 'Whappu Feedback';

let feedbackUrl = 'mailto:' + FEEDBACK_EMAIL_ADDRESS;
// Subject (ID-hashtag to help searching from Flowdock inbox)
feedbackUrl += '?subject=' + FEEDBACK_EMAIL_SUBJECT;
// Body
feedbackUrl += '&body=';


// Send feedback via email
function sendFeedback() {
  const emailURL = feedbackUrl;

  // Ship it
  Linking.openURL(emailURL);
}

export default {
  sendFeedback,
}
