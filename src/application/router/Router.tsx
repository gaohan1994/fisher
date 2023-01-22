import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ComponentId } from '@FisherCore';
import { fuiRouteHandler } from '@Fui';
import { Game, Home } from '../game';
import { FuiMining } from '../mining';
import { FuiReiki } from '../reiki';
import { FuiBattle } from '../battle';

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
        path: fuiRouteHandler.getComponentRoute(ComponentId.Mining)?.path,
        element: <FuiMining />,
      },
      {
        path: fuiRouteHandler.getComponentRoute(ComponentId.Reiki)?.path,
        element: <FuiReiki />,
      },
      {
        path: fuiRouteHandler.getComponentRoute(ComponentId.Forge)?.path,
        element: <FuiMining />,
      },
      {
        path: fuiRouteHandler.getComponentRoute(ComponentId.Battle)?.path,
        element: <FuiBattle />,
      },
    ],
  },
]);

const GameRouterProvider = () => <RouterProvider router={router} />;
export { GameRouterProvider };
