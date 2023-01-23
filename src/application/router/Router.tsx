import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ComponentId } from '@FisherCore';
import { fuiRouteHandler } from '@Fui';
import { Game, Home } from '../game';
import { PageMining } from '../mining';
import { PageReiki } from '../reiki';
import { PageBattle } from '../battle';
import FisherCoreDemo from '../demo/FisherCoreDemo';
import { PageMaster } from '../master';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Game />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: fuiRouteHandler.getComponentRoute(ComponentId.Master)?.path,
        element: <PageMaster />,
      },
      {
        path: fuiRouteHandler.getComponentRoute(ComponentId.Mining)?.path,
        element: <PageMining />,
      },
      {
        path: fuiRouteHandler.getComponentRoute(ComponentId.Reiki)?.path,
        element: <PageReiki />,
      },
      {
        path: fuiRouteHandler.getComponentRoute(ComponentId.Forge)?.path,
        element: <PageMining />,
      },
      {
        path: fuiRouteHandler.getComponentRoute(ComponentId.Battle)?.path,
        element: <PageBattle />,
      },
      {
        path: 'demo',
        element: <FisherCoreDemo />,
      },
    ],
  },
]);

const GameRouterProvider = () => <RouterProvider router={router} />;
export { GameRouterProvider };
