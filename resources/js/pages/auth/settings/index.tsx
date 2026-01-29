import { LucideIcon } from 'lucide-react';
import React, { useState } from 'react';
import { IconType } from 'react-icons/lib';
import { MdSecurity } from 'react-icons/md';
import UserLayout from '../user-layout';
import Appearance from './appearance';
import UserPassord from './password';

type NavItem = {
    index: number;
    title: string;
    icon: LucideIcon | IconType | null;
};
export default function UserSettings() {
    const [showIndex, setShowIndex] = useState<number>(0);
    const [pageTitle, setPageTitle] = useState<string>('Paramètre');

    const contentDisplayed = [<UserPassord />, <Appearance />];
    const navItemsList: NavItem[] = [
        {
            title: 'Mot de passe',
            index: 0,
            icon: MdSecurity,
        },
        {
            title: 'Apparence',
            index: 1,
            icon: null,
        },
    ];
    const isActiveClass = '!text-app-blue border-b border-app-blue';
    function handleNavItemClic(e: React.MouseEvent, item: NavItem) {
        e.preventDefault();
        setShowIndex(item.index);
        setPageTitle(item.title);
    }
    return (
        <UserLayout title={pageTitle}>
            <div className="grid grid-cols-1 items-start justify-between gap-8 lg:grid-cols-12">
                <div className="border-b lg:col-span-4 lg:border-r lg:border-b-0">
                    <ul>
                        {navItemsList.map((item, idx) => {
                            const Icon = item.icon as
                                | LucideIcon
                                | IconType
                                | null;

                            return (
                                <button
                                    key={idx}
                                    className={`mb-4 flex items-center gap-2 text-sm text-gray-700 transition-colors hover:text-blue-600 ${
                                        item.index == showIndex
                                            ? isActiveClass
                                            : ''
                                    }`}
                                    onClick={(e) => handleNavItemClic(e, item)}
                                >
                                    {Icon && <Icon size={16} />}
                                    {item.title}
                                </button>
                            );
                        })}
                    </ul>
                </div>
                <div className="lg:col-span-8">
                    {contentDisplayed[showIndex]}
                </div>
            </div>
        </UserLayout>
    );
}
