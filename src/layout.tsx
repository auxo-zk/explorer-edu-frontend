import { AppStateProvider, IconUser, Layout, walletConfig, WalletProvider } from '@auxo-dev/frontend-common';
import { Outlet } from 'react-router-dom';
import { Campaign, Class, Dashboard, DataUsageRounded } from '@mui/icons-material';
import { QueryClient } from '@tanstack/react-query';

export const config = walletConfig('6482349197b073ab1d34e32ec4907c1d');
const queryClient = new QueryClient();

export default function AppLayout() {
    return (
        <WalletProvider wagmiConfig={config} queryClient={queryClient}>
            <AppStateProvider>
                <Layout
                    role="investor"
                    requiedLogin={false}
                    menu={[
                        {
                            icon: Class,
                            title: 'Courses',
                            url: '/courses',
                            children: [],
                        },
                        {
                            icon: Campaign,
                            title: 'Campaigns',
                            url: '/campaigns',
                            children: [],
                        },
                        {
                            icon: DataUsageRounded,
                            title: 'Portfolio',
                            url: '/portfolio',
                            children: [],
                        },
                    ]}
                >
                    <Outlet />
                </Layout>
            </AppStateProvider>
        </WalletProvider>
    );
}
