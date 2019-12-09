import * as ReactDOM from 'react-dom';
import routes from './App';
import './index.css';
//import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  routes,
  document.getElementById('app') as HTMLElement
);
//registerServiceWorker();
