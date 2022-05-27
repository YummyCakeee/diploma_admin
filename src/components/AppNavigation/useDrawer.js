import { useState } from "react";
import { HomeIcon, SettingsIcon, ScissorsIcon, TalkBubblesIcon, ListIcon } from "../Elements/Icons/Index";
import { Screen } from "./AppNavigation";

const useDrawer = () => {
    const [drawerItems, setDrawerItems] = useState([
        {
            label: 'Главная',
            icon: () => HomeIcon({color: '#fff'}),
            screen: Screen.Home,
            section: 'top',
        },
        {
            label: 'Записаться на услуги',
            icon: () => ScissorsIcon({color: '#fff'}),
            screen: Screen.SigningForServices,
            section: 'top',
        },
        {
            label: 'Мои записи',
            icon: () => ListIcon({color: '#fff'}),
            screen: Screen.ServiceRecords,
            section: 'top',
        },
        {
            label: 'Онлайн чат',
            icon: () => TalkBubblesIcon({ color: '#fff' }),
            screen: Screen.OnlineChatRoomList,
            section: 'top'
        },
        {
            label: 'Настройки',
            icon: () => SettingsIcon({color: '#fff'}),
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