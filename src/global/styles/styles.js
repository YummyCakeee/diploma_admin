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
    hamburgerIcon: {
        marginTop: 23,
        marginLeft: 20,
        marginBottom: 15,
    },
    headerMenuButtonColor: {
        backgroundColor: 'rgb(30, 30, 30)'
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '400',
        color: '#fff',
        fontFamily: "Courgette-Regular"
    },  
    text: {
        color: Color.White,
        fontSize: 16,
        fontFamily: ''
    },
    textBlocked: {
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
    drawer: {
        backgroundColor: "rgba(30, 45, 55, 0.95)"
    },
    drawerItemContainer: {
        borderRadius: 15,
        paddingHorizontal: 5,
    },
    drawerItem: {
        color: 'rgb(200, 200, 200)',
        backgroundColor: 'rgba(150, 170, 180, 0.3)'
    },
    drawerItemSelected: {
        color: 'rgb(250, 250, 250)',
        backgroundColor: 'rgba(120, 220, 250, 0.7)'
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