import { format } from "date-fns"

export const identifierGenerator = (length = 8) => {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = ""
    for (let num = 0; num < length; num++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    const identifier = "FP" + format(new Date(), "yyyyMMdd") + id
    return identifier
}