import { Color } from "global/styles/constants"
import React, { useEffect, useRef, useState } from "react"
import {
    StyleProp,
    StyleSheet,
    View,
    Text,
    ViewStyle,
    Animated,
    TouchableOpacity
} from "react-native"
import { TriangleIcon } from 'components/Elements/Icons/Index'
import { withAnchorPoint } from 'react-native-anchor-point';
import globalStyles from "global/styles/styles";
import LinearGradient from "react-native-linear-gradient";
import { getColorWithOpacity } from "global/styles/utils";

type dropDownSectionProps = {
    title?: string,
    isOpen: boolean,
    onHeaderPress: () => void,
    onOpen: () => void,
    onClose: () => void,
    renderOnlyIfOpen: boolean,
    children: React.ReactChildren,
    style?: StyleProp<ViewStyle>,
    contentContainerStyle?: StyleProp<ViewStyle>
}

const DropDownSection: React.FC<dropDownSectionProps> = ({
    title,
    isOpen,
    onHeaderPress = () => { },
    onOpen = () => {},
    onClose = () => {},
    renderOnlyIfOpen = false,
    children,
    style,
    contentContainerStyle
}) => {

    const contentHeight = useRef(new Animated.Value(0)).current
    const triangleRotation = useRef(new Animated.Value(0)).current
    const [triangleRotationFormated, setTriangleRotationFormated] = useState<any>('0deg')
    const [isRenderChildren, setIsRenderChildren] = useState(true)
    const [isClosed, setIsClosed] = useState(isOpen)

    useEffect(() => {
        if (isOpen) {
            onOpen()
            showContent()
        }
        else {
            onClose()
            hideContent()
        }
    }, [isOpen])

    useEffect(() => {
        setTriangleRotationFormated(
            triangleRotation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '-180deg']
            }))
    }, [triangleRotation])

    useEffect(() => {
        if (renderOnlyIfOpen) {
            if (isClosed)
                setIsRenderChildren(false)
            else
                setIsRenderChildren(true)
        }
        else setIsRenderChildren(true)
    }, [isClosed, renderOnlyIfOpen])

    const showContent = () => {
        setIsClosed(false)
        Animated.timing(contentHeight, {
            toValue: 2000,
            duration: 300,
            useNativeDriver: false
        }).start()
        Animated.timing(triangleRotation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false
        }).start()
    }

    const hideContent = () => {
        Animated.timing(contentHeight, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false
        }).start(() => setIsClosed(true))
        Animated.timing(triangleRotation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false
        }).start()
    }

    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            const childrenProps = { isFocused: isOpen }
            return React.cloneElement(child, childrenProps);
        }
        return child;
    })

    return (
        <View
            style={styles.container}
        >
            <TouchableOpacity
                onPress={onHeaderPress}
                activeOpacity={1}
                style={[
                    styles.header,
                    style
                ]}
            >
                <Animated.View
                    style={
                        [withAnchorPoint(
                            { transform: [{ rotateZ: triangleRotationFormated }] },
                            { x: 0.5, y: 0.6 },
                            { width: 12, height: 12 }
                        ), styles.triangleContainer]
                    }>
                    <TriangleIcon
                        color={Color.LightGray}
                        width={12}
                        height={12}
                    />
                </Animated.View>
                <Text
                    style={[
                        globalStyles.text,
                        styles.headerTitle
                    ]}
                >
                    {title}
                </Text>
            </TouchableOpacity>
            <Animated.View
                style={[
                    styles.contentContainer,
                    { maxHeight: contentHeight },
                ]}
            >
                <View
                    style={[
                        styles.content,
                        contentContainerStyle
                    ]}
                >
                    {isRenderChildren && childrenWithProps}
                    <LinearGradient
                        colors={[
                            'rgba(100, 100, 100, 0)',
                            'rgba(150, 150, 150, 1)',
                            'rgba(100, 100, 100, 0)'
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.contentBottomBorder}
                    />
                </View>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%'
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Color.LightGray,
        backgroundColor: getColorWithOpacity(Color.Gray, 0.2),
        padding: 5,
    },
    headerTitle: {
        marginLeft: 10,
    },
    triangleContainer: {
        width: 12,
        height: 12,
    },
    contentContainer: {
        overflow: 'hidden',
    },
    content: {
        backgroundColor: getColorWithOpacity(Color.Gray, 0.1),
        paddingTop: 5,
        marginBottom: 5,
    },
    contentBottomBorder: {
        width: '100%',
        height: 1,
    },
})

export default DropDownSection