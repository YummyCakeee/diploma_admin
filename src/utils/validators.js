export const phoneNumberValidator = (value) =>
    !/^(8|\+7)[ ]\(?\d{3}\)?[ ]?\d{3}[\-]?\d{2}[\-]\d{2}$/.test(value) ?
        'Введите корректный номер телефона' :
        undefined

export const passwordValidator = (value, allowEmpty = false) => {
    if (allowEmpty && !value) return undefined
    const minLength = 9
    if (!value) return 'Введите пароль'
    if (value.trim().length < minLength) return `Пароль должен быть длиннее ${minLength - 1} символов`
    return undefined
}

export const emailValidator = (value, allowEmpty = false) => {
    if (allowEmpty && !value) return undefined
    if (!value) return 'Укажите адрес эл. почты'
    if (!/^[A-z]{1}[A-z | \d | \.]{2,}@[A-z | \d]{2,}.[A-z]{2,3}$/.test(value)) return 'Введите корректный адрес эл. почты'
    return undefined
}

export const smsCodeValidator = (value) =>
    (!value || value.length !== 4) ?
        'Введите код из смс' :
        undefined

export const nameValidator = (value, allowEmpty = false) => {
    if (allowEmpty && !value) return undefined
    if (!value) return 'Укажите имя'
    if (value.match(/([^[a-z | a-яё]]*)/ig)) return `Имя должно содержать только символы русского или латинского алфавита`
    const minLength = 2
    if (value.trim().length < minLength) return `Имя должно быть длиннее ${minLength - 1} символа`
    return undefined
}

export const surnameValidator = (value, allowEmpty = false) => {
    if (allowEmpty && !value) return undefined
    if (!value) return 'Укажите фамилию'
    if (value.match(/([^[a-z | а-яё]]*)/ig)) return `Фамилия должна содержать только символы алфавита`
    const minLength = 2
    if (value.trim().length < minLength) return `Фамилия должна быть длиннее ${minLength - 1} символа`
    return undefined
}

export const patronymicValidator = (value, allowEmpty = false) => {
    if (allowEmpty && !value) return undefined
    if (!value) return 'Укажите отчество'
    if (value.match(/([^[a-z | а-яё]]*)/ig)) return `Отчество должно содержать только символы алфавита`
    const minLength = 2
    if (value.trim().length < minLength) return `Отчество должно быть длиннее ${minLength - 1} символа`
    return undefined
}

export const fieldNonEmptyValidator = (value) =>
    !value ? 'Поле обязательно к заполнению' : undefined

export const timeValidator = (value, allowEmpty = false, maxHours = 99, maxMinutes = 99) => {
    if (!value && allowEmpty) return undefined
    if (!value) return 'Укажите время'
    const match = value.match(/(\d{2}):(\d{2})/)
    if (!match) return 'Укажите время польностью'
    if (Number(match[1]) > maxHours) return `Количество часов должно быть не больше ${maxHours}`
    if (Number(match[2]) > maxMinutes) return `Количество минут должно быть не больше ${maxMinutes}`
    return undefined
}

export const priceValidator = (value, allowEmpty = false) => {
    if (!value && allowEmpty) return undefined
    if (!value) return 'Укажите стоимость'
    const match = value.match(/(\d+)(\.)?(\d*)/)
    if (!match || (match[2] && !match[3])) return 'Укажите корректную стоимость'
}