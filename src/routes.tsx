import { Navigate, useRoutes } from 'react-router-dom';
import AppLayout from './layout';
import ListCourses from './pages/ListCourses/ListCourses';
import ListCampaigns from './pages/ListCampaigns/ListCampaigns';
import DetailCourse from './pages/DetailCourse/DetailCourse';
import DetailCampaign from './pages/DetailCampaign/DetailCampaign';

export default function AppRouter() {
    return useRoutes([
        {
            path: '/',
            element: <AppLayout />,
            children: [
                {
                    path: 'courses',
                    element: <ListCourses />,
                },
                {
                    path: 'courses/:idCourse',
                    element: <DetailCourse />,
                },
                {
                    path: 'campaigns',
                    element: <ListCampaigns />,
                },
                {
                    path: 'campaigns/:idCampaign',
                    element: <DetailCampaign />,
                },
                {
                    path: '*',
                    element: <div>404</div>,
                },
                {
                    path: '',
                    element: <Navigate to={'/courses'} />,
                },
            ],
        },
    ]);
}
