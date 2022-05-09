import { StyleSheet, Dimensions } from "react-native";
import { Color } from "./constants";

const globalStyles = StyleSheet.create({
    container: {
        backgroundColor: Color.SoftDarkBlue,
        width: '100%',
        height: '100%',
        color: Color.White,
        fontSize: 200,
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
        fontSize: 18,
        fontFamily: '',
        marginTop: 5,
        marginBottom: 10,
    },
    button: {
        textAlign: "center",
        backgroundColor: '#0e7b8c',
        height: 30,
        paddingHorizontal: 5,
        paddingVertical: 3,
        color: Color.White,
        borderRadius: 10,
        marginVertical: 5,
        marginHorizontal: 10,
    },
    button_pressed: {
        backgroundColor: '#c7f8ff',
        color: '#0e7b8c',
    },
    button_blocked: {
        backgroundColor: '#62888c',
        color: '#b4b4b4',
    },
    page_title: {
        fontSize: 22,
        alignSelf: 'center',
        color: Color.White,
        marginTop: 10,
        marginBottom: 20,
    },
    drawerDark: {
        backgroundColor: "rgba(50, 50, 60, 0.95)"
    },
    centeredElement: {
        alignSelf: "center"
    },
    thisUserMessage: {
        backgroundColor: '#71B6C3'
    },
    otherUserMessage: {
        backgroundColor: '#3b5f66'
    }
})

export default globalStyles