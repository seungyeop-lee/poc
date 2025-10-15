import { createBrowserRouter } from 'react-router';
import RootPage from './pages/root/RootPage.tsx';
import ImageEditPage from './pages/image/ImageEditPage.tsx';
import VideoEditPage from './pages/video/VideoEditPage.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootPage,
  },
  {
    path: '/image',
    Component: ImageEditPage,
  },
  {
    path: '/video',
    Component: VideoEditPage,
  },
]);
