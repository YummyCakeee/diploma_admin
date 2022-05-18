export const SEND_MESSAGE = 'send_message' //   На сервер приходит новое сообщение от отправителя
export const NEW_MESSAGE = 'new_message'    //  Сервер возвращает новое сообщение всем пользователям, кроме отправителя
export const DELETE_MESSAGE = 'delete_message'  //  На сервер приходит id сообщения, которое нужно удалить
export const DELETED_MESSAGE = 'deleted_message'    //  Сервер возвращает id удалённого сообщения (всем пользователям)
export const LOAD_MESSAGES = 'load_messages'    //  Сервер возвращает сообщения из чата за определённый период date_1-date_2
export const LOAD_ALL_MESSAGES = 'load_all_messages'    //  Сервер возвращает все сообщения из чата