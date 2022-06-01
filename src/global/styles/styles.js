import { StyleSheet } from "react-native";
import { Color } from "./constants";
import { getColorWithOpacity } from "./utils";

const globalStyles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: Color.SoftDarkBlue,
        width: '100%',
        flex: 1,
        color: Color.White,
        fontSize: 20,
    },
    text: {
        color: Color.White,
        fontSize: 16,
        fontFamily: ''
    },
    text_blocked: {
        color: Color.Gray
    },
    title: {
        color: Color.White,
        textAlign: "center",
        fontSize: 18,
        fontFamily: '',
        marginTop: 5,
        marginBottom: 10,
    },
    buttonPrimary: {
        textAlign: "center",
        backgroundColor: '#0e7b8c',
        borderWidth: 1,
        borderColor: getColorWithOpacity(Color.White, 0.4),
        height: 30,
        paddingHorizontal: 5,
        paddingVertical: 3,
        color: Color.White,
        borderRadius: 10,
        marginVertical: 5,
        marginHorizontal: 10,
    },
    button: {
        textAlign: "center",
        borderColor: getColorWithOpacity('#0e7b8c', 0.4),
        backgroundColor: '#094c577e',
        borderWidth: 1,
        height: 30,
        paddingHorizontal: 5,
        paddingVertical: 3,
        color: Color.White,
        borderRadius: 10,
        marginVertical: 5,
        marginHorizontal: 10,
    },
    buttonPressed: {
        backgroundColor: '#c7f8ff',
        color: '#0e7b8c',
    },
    buttonBlocked: {
        backgroundColor: '#62888c',
        color: '#b4b4b4',
    },
    pageTitle: {
        fontSize: 22,
        textAlign: "center",
        alignSelf: 'center',
        color: Color.White,
        marginTop: 10,
        marginBottom: 20,
    },
    drawerDark: {
        backgroundColor: "rgba(30, 45, 55, 0.95)"
    },
    centeredElement: {
        alignSelf: "center"
    },
    thisUserMessage: {
        backgroundColor: '#71B6C3'
    },
    thisUserMessageName: {
        color: 'rgb(130, 70, 140)'
    },
    otherUserMessage: {
        backgroundColor: '#3b5f66'
    },
    otherUserMessageName: {
        color: 'rgb(170, 110, 180)'
    },
})

export default globalStyles