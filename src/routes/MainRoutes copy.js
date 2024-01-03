import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';



const UpdateCompanyInfo = Loadable(lazy(() => import('views/sys/UpdateCompanyInfo')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/sys/UpdateCompanyInfo',
            element: <UpdateCompanyInfo />
        },
        {
            path: '/sample-page',
            element: <SamplePage />
        }
    ]
};

export default MainRoutes;
