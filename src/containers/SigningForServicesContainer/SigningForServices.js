import React from "react";
import { Text } from "react-native";
import PageTemplate from "components/PageTemplate/Pagetemplate";
import globalStyles from "global/styles/styles";
import Button from "components/Elements/Button/Button";
import axiosAPI from "utils/axios";

const onEatAssPress = () => {
    axiosAPI.get('todos/1').then(response => {
        alert(JSON.stringify(response.data))
    })
}


const SigningForServicesContainer = ({navigation}) => {
    return (
    <PageTemplate>
        <Text style={globalStyles.page_title}>Запись на услуги</Text>
        <Button
        title="Съесть жопу"
        onPress={onEatAssPress}
        />
    </PageTemplate>
    )
}


export default SigningForServicesContainer