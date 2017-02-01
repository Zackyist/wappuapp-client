const ROOT_URL = 'https://wappu.futurice.com';

const Terms = [
  {title: 'Source Code', link: `https://github.com/futurice/wappuapp-client`, icon: 'code', showInWebview: true},
  {title: 'from Tammerforce', link: `https://tammerforce.com`, icon: 'favorite-border', showInWebview: true},
  {title: 'Wanna work at Futurice?',
    link: 'http://futurice.com/careers?utm_source=wappuapp&utm_medium=app&utm_campaign=wappu2016',
    icon: 'send', separatorAfter: true},
  {title: 'Terms of Service', link: `${ROOT_URL}/terms`, icon: 'info-outline'},
  {title: 'Privacy', link: `${ROOT_URL}/privacy`, icon: 'lock-outline'},
  {title: 'Licenses', link: `${ROOT_URL}/licenses`, icon: 'help-outline', last: true},
];

export default {
  terms: Terms,
};
