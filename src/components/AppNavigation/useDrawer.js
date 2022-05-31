import { Color } from "global/styles/constants";
import { useState } from "react";
import { HomeIcon, SettingsIcon, ScissorsIcon, TalkBubblesIcon, ListIcon, AdminIcon } from "../Elements/Icons/Index";
import { Screen } from "./AppNavigation";

const useDrawer = () => {
    const [drawerItems, setDrawerItems] = useState([
        {
            label: 'Главная',
            icon: () => HomeIcon({color: Color.White}),
            screen: Screen.Home,
            section: 'top',
        },
        {
            label: 'Записаться на услуги',
            icon: () => ScissorsIcon({color: Color.White}),
            screen: Screen.SigningForServices,
            section: 'top',
        },
        {
            label: 'Мои записи',
            icon: () => ListIcon({color: Color.White}),
            screen: Screen.ServiceRecords,
            section: 'top',
        },
        {
            label: 'Онлайн чат',
            icon: () => TalkBubblesIcon({ color: Color.White }),
            screen: Screen.OnlineChat,
            section: 'top'
        },
        {
            label: 'Администрирование',
            icon: () => AdminIcon({color: Color.White}),
            screen: Screen.Administration,
            section: 'top'
        },
        {
            label: 'Настройки',
            icon: () => SettingsIcon({color: Color.White}),
            screen: Screen.Settings,
            section: 'bottom',
        },
    ])
    return {
        drawerItems,
        setDrawerItems,
    }
}

export default useDrawer