export const phoneNumberMask = (value: string): string => {
    const cleanedUpNumber = value.replace(/(\+7)?\D*/g, '')
    const match = cleanedUpNumber.match(/^(\d{1,3})?(\d{1,3})?(\d{1,2})?(\d{1,2})?\d*$/)
    if (!match) return cleanedUpNumber
    const number = [
        '+7 ', 
        match[1] ? `(${match[1]}` : '',
        match[2] ? `) ${match[2]}` : '',
        match[3] ? `-${match[3]}` : '',
        match[4] ? `-${match[4]}` : ''].join('');

    return number
}