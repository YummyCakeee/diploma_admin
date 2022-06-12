export const phoneNumberFormatter = (value: string): string => {
    const cleanedUpNumber = value.replace(/(\+7)?\D*/g, '')
    const match = cleanedUpNumber
        .match(/^(\d{1,3})?(\d{1,3})?(\d{1,2})?(\d{1,2})?\d*$/)
    if (!match) return cleanedUpNumber
    const number = [
        '+7 ',
        match[1] ? `(${match[1]}` : '',
        match[2] ? `) ${match[2]}` : '',
        match[3] ? `-${match[3]}` : '',
        match[4] ? `-${match[4]}` : ''].join('');

    return number
}

export const simplePhoneNumberFormatter =
    (value: string): string =>
        '+' + value.replace(/\D*/g, '')

export const dateSwapYearAndMonthFormatter =
    (value: string, separator: string = '.'): string => {
        const match = value.match(/(\d*)[\-|/|\.](\d*)[\-|/|\.](\d*)/)
        if (!match) return value
        return match[3] + separator + match[2] + separator + match[1]
    }

export const toCanonicalDateFormatter = (
    date: string,
    time: string = '00:00',
): Date => new Date(date + 'T' + time.padStart(5, '0') + 'Z')

export const nameFormatter = (value: string): string =>
    value ?
        (value.charAt(0).toUpperCase() +
            value.slice(1).toLowerCase()).trim() :
        value

export const timeFormatter =
    (value: string): string => {
        const cleanedValue = value.replace(/\D*|:/g, '').substring(0, 4)
        const match = cleanedValue.match(/^(\d{2})(\d{1,2})$/)
        if (!match) return cleanedValue
        const timeValue = [
            match[1],
            match[2] ? 
            ':' + match[2] :
            ''
        ].join('')

        return timeValue
    }

export const numberFormatter = 
    (value: string): string => {
        const cleanedValue = value.replace(/^\.?[^\d\.]*/, '')
        const match = cleanedValue.match(/(\d+)(\.)?(\d*)/)
        if (!match) return cleanedValue
        const price = [
            match[1],
            match[2] ? 
            match[2] :
            '',
            match[3] ?
            match[3] :
            ''
        ].join('')
        return price
    }