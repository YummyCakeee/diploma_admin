import globalStyles from "global/styles/styles"
import React, { useState, useEffect } from "react"
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView
} from "react-native"
import LinearGradient from 'react-native-linear-gradient';

type richListProps = {
    items?: itemType[]
    onItemSelected: (item: itemType) => void,
    fields?: fieldType[],
}

type itemType = {
    text: string,
    tag: any
}

type fieldType = {
    name: string,
    title: string,
}

const RichList: React.FC<richListProps> = ({
    items = [],
    onItemSelected = () => { },
    fields = []
}) => {

    const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0)

    useEffect(() => {
        onItemPress(0)
    }, [items])

    const onItemPress = (index: number) => {
        setSelectedItemIndex(index)
        if (items && items.length)
            onItemSelected(items[index])
    }

    return (
        <View
            style={styles.container}
        >
            <View
                style={styles.section}
            >
                <ScrollView
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                >
                    {items?.map((elem, index) => (
                            <View
                                key={index}
                                style={styles.listItem}
                            >
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => onItemPress(index)}
                                >
                                    <Text
                                        style={[
                                            globalStyles.text,
                                            styles.listItemText,
                                            index === selectedItemIndex ?
                                                styles.listItemSelectedText :
                                                null
                                        ]}
                                    >
                                        {elem.text}
                                    </Text>
                                </TouchableOpacity>
                                {(index !== items.length - 1) && (
                                    <LinearGradient
                                        colors={[
                                            'rgba(100, 100, 100, 0)',
                                            'rgba(100, 100, 100, 1)',
                                            'rgba(100, 100, 100, 0)'
                                        ]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        locations={[0.0, 0.1, 1.0]}
                                        style={styles.listItemSplitter}
                                    />
                                )}
                            </View>
                        ))}
                </ScrollView>
            </View>
            <LinearGradient
                colors={[
                    'rgba(100, 100, 100, 0)',
                    'rgba(100, 100, 100, 1)',
                    'rgba(100, 100, 100, 0)'
                ]}
                style={styles.splitter}
            />
            <View
                style={styles.section}
            >
                <ScrollView
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                >
                    <View>
                        {fields?.map((elem, index) => (
                            <View
                                key={index}
                            >
                                <Text
                                    style={[
                                        globalStyles.text,
                                        styles.title
                                    ]}
                                >
                                    {elem.title}:
                                </Text>
                                <Text
                                    style={globalStyles.text}
                                >
                                    {items?.length ? items[selectedItemIndex]?.tag[elem.name] : ''}
                                </Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        paddingHorizontal: 5,
        marginTop: 10,
    },
    section: {
        height: 150,
        width: '50%',
        overflow: "hidden",
    },
    splitter: {
        width: 1,
        height: 150,
        marginHorizontal: 5,
    },
    listItem: {
        paddingVertical: 2,
    },
    listItemText: {
        color: 'gray',
        paddingBottom: 2,
    },
    listItemSelectedText: {
        color: 'white'
    },
    listItemSplitter: {
        height: 1,
        width: '100%'
    },
    title: {
        color: 'gray'
    },
})

export default RichList