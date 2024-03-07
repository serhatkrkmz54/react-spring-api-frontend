/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Anasayfa',
            items: [{ label: 'Admin Anasayfa', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Veriler',
            items: [
                { label: 'Futbolcular', icon: 'pi pi-fw pi-user', to: '/pages/players' },
                { label: 'Takımlar', icon: 'pi pi-fw pi-circle-fill', to: '/pages/teams' },
                { label: 'Ülkeler', icon: 'pi pi-fw pi-globe', to: '/pages/countries' },
                { label: 'Turnuvalar', icon: 'pi pi-fw pi-flag', to: '/pages/competitions' },
                { label: 'Ligler', icon: 'pi pi-fw pi-table', to: '/pages/leagues' },
            ]
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
