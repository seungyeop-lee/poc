import { createBrowserRouter } from 'react-router';
import HomePage from './pages/HomePage.tsx';
import ImageCropPage from './pages/ImageCropPage.tsx';
import VideoCropPage from './pages/VideoCropPage.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: HomePage,
  },
  {
    path: '/image-crop',
    Component: ImageCropPage,
  },
  {
    path: '/video-crop',
    Component: VideoCropPage,
  },
]);
