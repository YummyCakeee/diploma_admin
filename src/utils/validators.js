export const phoneNumberValidator = (value) => 
    value && !/^(8|\+7)[ ]\(?\d{3}\)?[ ]?\d{3}[\-]?\d{2}[\-]\d{2}$/.test(value) ?
    'Введите корректный номер телефона' :
    undefined

export  const passwordValidator = (value) => {
    if (!value) return 'Введите пароль'
    if (value.length < 6) return 'Пароль должен быть длиннее 6 символов'

    return undefined
}