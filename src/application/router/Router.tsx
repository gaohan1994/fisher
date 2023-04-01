import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ComponentId } from '@FisherCore';
import { fuiRouteHandler } from '@Fui';
import { Game, Home } from '../game';
import { PageMining } from '../mining';
import { PageReiki } from '../reiki';
import { PageBattle } from '../battle';
import { PageMaster } from '../master';
import { PageForge } from '../forge';
import { PageCook } from '../cook';
import { PageBank } from '../bank';
import { PageBackpack } from '../backpack';

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
        path: fuiRouteHandler.getComponentRoute(ComponentId.Backpack)?.path,
        element: <PageBackpack />,
      },
      {
        path: fuiRouteHandler.getComponentRoute(ComponentId.Bank)?.path,
        element: <PageBank />,
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
        element: <PageForge />,
      },
      {
        path: fuiRouteHandler.getComponentRoute(ComponentId.Cook)?.path,
        element: <PageCook />,
      },
      {
        path: fuiRouteHandler.getComponentRoute(ComponentId.Battle)?.path,
        element: <PageBattle />,
      },
    ],
  },
]);

const GameRouterProvider = () => <RouterProvider router={router} />;
export { GameRouterProvider };
