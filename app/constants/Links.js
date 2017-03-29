import TermsView from '../components/terms/Terms';

const ROOT_URL = 'https://wappu.futurice.com';

const links = [
  {title: 'Fuksi Survival Kit', showCity: 'tampere', link: `https://ttyy.fi/me-ollaan-teekkareita/teekkarikulttuuri/wappu/fuksi-survival-kit/`, icon: 'local-hospital', showInWebview: true},
  {title: 'Feedback', mailto: 'wappu@futurice.com', icon: 'send'},
  {title: 'Source Code', link: `https://github.com/futurice/wappuapp-client`, icon: 'code', showInWebview: false},
  {title: 'from Tammerforce', showCity: 'tampere', link: `https://tammerforce.com`, icon: 'favorite-border', showInWebview: false},
  {title: 'Wanna work at Futurice?',
    link: 'http://futurice.com/careers?utm_source=wappuapp&utm_medium=app&utm_campaign=wappu2017',
    icon: 'star', separatorAfter: true}
];

const terms = [
  {title: 'Terms of Service', link: `${ROOT_URL}/terms`, icon: 'info-outline', component: TermsView, showInWebview: false},
  {title: 'Privacy', link: `${ROOT_URL}/privacy`, icon: 'lock-outline', showInWebview: false},
  {title: 'Licenses', link: `${ROOT_URL}/licenses`, icon: 'help-outline', showInWebview: false, last: true},
];



export default {
  links,
  terms,
};
