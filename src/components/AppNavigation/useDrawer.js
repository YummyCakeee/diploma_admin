import React, { useState } from "react";
import { HomeIcon, SettingsIcon, ScissorsIcon } from "../Elements/Icons/Index";

const useDrawer = () => {
    const [drawerItems, setDrawerItems] = useState([
        {
            label: 'Главная',
            icon: () => HomeIcon({color: '#fff'}),
            screen: 'Home',
            section: 'top',
        },
        {
            label: 'Записаться на услуги',
            icon: () => ScissorsIcon({color: '#fff'}),
            screen: 'SigningForServices',
            section: 'top',
        },
        {
            label: 'Настройки',
            icon: () => SettingsIcon({color: '#fff'}),
            screen: 'Settings',
            section: 'bottom',
        },
    ])
    return {
        drawerItems,
        setDrawerItems,
    }
}

export default useDrawer