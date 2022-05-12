import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import { Screen } from "components/AppNavigation/AppNavigation";

const useSettings = () => {
    const [name, setName] = useState()
    const [surname, setSurname] = useState()
    const [patronymic, setPatronymic] = useState()
    const [phone, setPhone] = useState()
    const [email, setEmail] = useState()
    const [masters, setMasters] = useState([])
    const [personalMaster, setPersonalMaster] = useState()
    const [userID, setUserID] = useState(1)
    const navigation = useNavigation()
    //  Получение данных из сервера...
    useEffect(() => {
        setName("Никита")
        setSurname("Пархоменко")
        setPatronymic("Андреевич")
        setPhone("+79307204347")
        setEmail("email@mail.ru")
        setMasters([
            'Ярослав', 'Дмитрий', 'Елена', 'Анастасия',
            'Константин', 'Павел', 'Ксения', 'Виктория'
        ])
        setPersonalMaster('Ксения')
    }, [userID])

    const onSignOut = () => {
        navigation.reset({
            index: 0, 
            routes: [{name: 'Registration'}]
        })
    }
    
    const onSaveInfo = () => {
        navigation.navigate(Screen.Home)
    }

    return {
        name,
        setName,
        surname,
        setSurname,
        patronymic,
        setPatronymic,
        phone,
        setPhone,
        email,
        setEmail,
        masters,
        personalMaster,
        setPersonalMaster,
        onSignOut,
        onSaveInfo
    }
}

export default useSettings