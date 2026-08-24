import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import HomePage from '../pages/HomePage'
import CounterPage from '../pages/CounterPage'
import HooksPage from '../pages/HooksPage'
import UserPage from '../pages/UserPage'
import NotFoundPage from '../pages/NotFoundPage'
import AboutPage from '../pages/AboutPage'
import BasicHooksPage from '../pages/BasicHooksPage'
import ComponentCommunicationPage from '../pages/ComponentCommunicationPage'
import PerformancePage from '../pages/PerformancePage'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'basic-hooks',
        element: <BasicHooksPage />,
      },
      {
        path: 'hooks',
        element: <HooksPage />,
      },
      {
        path: 'communication',
        element: <ComponentCommunicationPage />,
      },
      {
        path: 'performance',
        element: <PerformancePage />,
      },
      {
        path: 'counter',
        element: <CounterPage />,
      },
      {
        path: 'user',
        element: <UserPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
], {
  basename,
})
