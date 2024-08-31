import { Markup } from 'telegraf'

export function getMainMenu() {
    return Markup.keyboard([
        ['Мои задачи', 'Удалить задачу'],
        ['Смотивируй меня']
    ]).resize()
}

export function yesNoKeyboard() {
    return Markup.inlineKeyboard([
        Markup.button.callback('Chart', 'chart'),
        Markup.button.callback('Multiples', 'multiples')
    ], {columns: 2})
}