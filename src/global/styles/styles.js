import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
    container: {
        backgroundColor: 'rgb(38, 35, 45)',
        width: '100%',
        height: '100%',
        color: 'white',
        fontSize: 200,
    },
    text: {
        color: 'white',
        fontSize: 16,
        fontFamily: ''
    },
    title: {
        color: 'white',
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
        color: 'white',
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
        color: '#fff',
        marginTop: 10,
        marginBottom: 20,
    },
    drawerDark: {
        backgroundColor: "rgba(50, 50, 60, 0.95)"
    },
    centeredElement: {
        alignSelf: "center"
    },
})

export default globalStyles