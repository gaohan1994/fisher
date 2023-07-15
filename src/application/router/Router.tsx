import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ComponentId } from '@FisherCore';
import { Game, Home } from '../game';
import { PageMining } from '../mining';
import { PageReiki } from '../reiki';
import { PageBattle } from '../battle';
import { PageMaster } from '../master';
import { PageForge } from '../forge';
import { PageCook } from '../cook';
import { PageBank } from '../bank';
import { PageBackpack } from '../backpack';
import { PageDungeon } from '../dungeon';

const getComponentPath = (componentId: ComponentId) => componentId.toLocaleLowerCase();

const router = createBrowserRouter([
  {
    path: '/fisher',
    element: <Game />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: getComponentPath(ComponentId.Master),
        element: <PageMaster />,
      },
      {
        path: getComponentPath(ComponentId.Backpack),
        element: <PageBackpack />,
      },
      {
        path: getComponentPath(ComponentId.Bank),
        element: <PageBank />,
      },
      {
        path: getComponentPath(ComponentId.Mining),
        element: <PageMining />,
      },
      {
        path: getComponentPath(ComponentId.Reiki),
        element: <PageReiki />,
      },
      {
        path: getComponentPath(ComponentId.Forge),
        element: <PageForge />,
      },
      {
        path: getComponentPath(ComponentId.Cook),
        element: <PageCook />,
      },
      {
        path: getComponentPath(ComponentId.Battle),
        element: <PageBattle />,
      },
      {
        path: getComponentPath(ComponentId.Dungeon),
        element: <PageDungeon />,
      },
    ],
  },
]);

const GameRouterProvider = () => <RouterProvider router={router} />;
export { GameRouterProvider };
