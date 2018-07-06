import { JSDOM } from 'jsdom';

const defaultView = new JSDOM().window;

Object.assign(global, {
  document: defaultView.document,
  Element: defaultView.Element,
  location: defaultView.location,
  window: defaultView,
});

console.json = (...a) => a.forEach(o => console.log(JSON.stringify(o, null, 2)));
