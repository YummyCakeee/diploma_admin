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
            label: 'Записи на услуги',
            icon: () => ListIcon({color: Color.White}),
            screen: Screen.ServiceRecordsAdmin,
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