import React, { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { hexToHSL, hslToHex } from "global/styles/utils"
import ColorSlider from "../ColorSlider/ColorSlider"
import { Color } from "global/styles/constants"
import InputField from "../InputField/InputField"

const ColorPicker = ({
    color = Color.White,
    setColor,
}) => {
    const [hslColor, setHslColor] = useState(hexToHSL(color))
    const [colorFullSatLum, setColorFullSatLum] = useState(color)

    useEffect(() => {
        const newColor = hslToHex(hslColor.h, hslColor.s, hslColor.l, hslColor.o)
        if (newColor !== color)
        try {
            setColor(newColor)
        }catch{}
    }, [hslColor.h, hslColor.s, hslColor.l, hslColor.o])

    useEffect(() => {
        const newHsl = hexToHSL(color)
        if (newHsl.h !== hslColor.h || 
            newHsl.s !== hslColor.s ||
            newHsl.l !== hslColor.l ||
            newHsl.o !== hslColor.o)
            try {
            setHslColor(newHsl)
            }catch{}
    }, [color])

    const onColorInputFieldChange = (value) => {
        const hsl = hexToHSL(value)
        try{
        setHslColor(hsl)
        }catch{}
    }

    const onHueChange = (hue) => {
        try {
        setHslColor({ ...hslColor, h: hue })
        setColorFullSatLum(hslToHex(hue, 100, 50, 1))
        }catch{}
    }

    const onSaturationChange = (saturation) => {
        try{
        setHslColor({ ...hslColor, s: saturation })
        }catch{}
    }

    const onLuminenceChange = (luminance) => {
        try {
        setHslColor({ ...hslColor, l: luminance })
        }catch{}
    }

    const onOpacityChange = (opacity) => {
        try {
        setHslColor({ ...hslColor, o: opacity })
        }catch{}
    }

    return (
        <>
            <View
                style={styles.container}
            >
                <View
                    style={[
                        styles.colorPreview,
                        { backgroundColor: color }
                    ]}
                >
                </View>
                <View
                    style={styles.slidersContainer}
                >
                    <ColorSlider
                        value={hslColor.h}
                        onValueChange={onHueChange}
                        colors={[
                            '#ff0000',
                            '#ffff00',
                            '#00ff00',
                            '#00ffff',
                            '#0000ff',
                            '#ff00ff',
                            '#ff0000'
                        ]}
                        step={1}
                        minimumValue={0}
                        maximumValue={359}
                        style={styles.colorSliderContainer}
                    />
                    <ColorSlider
                        value={hslColor.s}
                        onValueChange={onSaturationChange}
                        colors={[
                            Color.Gray,
                            colorFullSatLum
                        ]}
                        step={1}
                        minimumValue={0}
                        maximumValue={100}
                        style={styles.colorSliderContainer}
                    />
                    <ColorSlider
                        value={hslColor.l}
                        onValueChange={onLuminenceChange}
                        colors={[
                            Color.Black,
                            colorFullSatLum,
                            Color.White
                        ]}
                        step={1}
                        minimumValue={0}
                        maximumValue={100}
                        style={styles.colorSliderContainer}
                    />
                    <ColorSlider
                        value={hslColor.o}
                        onValueChange={onOpacityChange}
                        colors={[
                            Color.None,
                            colorFullSatLum,
                        ]}
                        step={0.01}
                        minimumValue={0}
                        maximumValue={1}
                        style={styles.colorSliderContainer}
                    />
                </View>
                <View
                    style={styles.colorCodeContainer}
                >
                    <InputField
                        style={{ width: 100 }}
                        value={color}
                        onChange={onColorInputFieldChange}
                    />
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        padding: 5,
    },
    slidersContainer: {
        marginLeft: 20,
    },
    colorPreview: {
        width: 30,
        height: 30,
    },
    colorSliderContainer: {
        width: 200,
        marginVertical: 5,
        borderRadius: 10,
    },
    colorCodeContainer: {
        marginLeft: 5,
    }
})

export default ColorPicker