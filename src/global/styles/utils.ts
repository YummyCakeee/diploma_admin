export const getColorWithOpacity = (
    color: string,
    opacity: number = 1.0
): string => {
    const opacityConverted = Number((opacity * 256).toFixed()).toString(16)
    console.log(color + opacityConverted)
    return color + opacityConverted
}