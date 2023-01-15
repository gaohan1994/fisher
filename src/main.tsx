import { Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import { FisherLauncher } from './pages';
import './components/css/index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Fragment>
    <FisherLauncher />
  </Fragment>
);
