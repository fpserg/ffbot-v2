import express from 'express'
import { TOKEN, PORT } from './config.js'
import { Telegraf, session } from 'telegraf'
import { getMainMenu, yesNoKeyboard } from './keyboards.js'
//import { getMyTasks, addTask, deleteTask } from './db.js'
import { getMarketData } from './main.js'
import { getMults } from './multiples.js'
import QuickChart from 'quickchart-js'

const app = express()
const bot = new Telegraf(TOKEN)

bot.use(session())

bot.start(ctx => {
    ctx.replyWithHTML(
        'Hi! Send me a ticker',
        getMainMenu())
})

bot.hears('Мои задачи', async ctx => {
    const tasks = await getMyTasks()
    let result = ''

    for (let i = 0; i < tasks.length; i++) {
        result = result + `[${i+1}] ${tasks[i]}\n`
    }

    ctx.replyWithHTML(
        '<b>Список ваших задач:</b>\n\n'+
        `${result}`
    )
})

bot.hears('Удалить задачу', ctx => {
    ctx.replyWithHTML(
        'Введите фразу <i>"удалить `порядковый номер задачи`"</i>, чтобы удалить сообщение,'+
        'например, <b>"удалить 3"</b>:'
    )
})

bot.hears(/^удалить\s(\d+)$/, ctx => {
    const id = Number(+/\d+/.exec(ctx.message.text)) - 1
    deleteTask(id)
    ctx.reply('Ваша задача успешно удалена')
})

bot.hears('Смотивируй меня', ctx => {
    ctx.replyWithPhoto(
        'https://img2.goodfon.ru/wallpaper/nbig/7/ec/justdoit-dzhastduit-motivaciya.jpg',
        {
            caption: 'Не вздумай сдаваться!'
        }
    )
})

bot.on("text", async ctx => {
    if (!ctx.session) {
        ctx.session = {};
    };
    console.log(ctx.session);
    ctx.session.tickerText = ctx.message.text

    let ticker = await getMarketData(ctx.session.tickerText)
    //console.log(ticker.priceArray)
    //console.log(ticker.dateArray)

    ctx.replyWithHTML(
        `${ctx.session.tickerText.toUpperCase()}
${ticker.price}
${(ticker.mCap/1000000000).toFixed(1)} R bn
ADTV: ${(ticker.adtv/1000000).toFixed(1)} R mn`,
        yesNoKeyboard()
    )
})

bot.action(['chart', 'multiples'],  async ctx => {
    if (!ctx.session) {
        ctx.session = {};
    };

    //let ticker =  getMarketData(ctx.session.tickerText)
    
    if (ctx.callbackQuery.data === 'chart') {
        let ticker =  await getMarketData(ctx.session.tickerText)
        
        const myChart = new QuickChart();
          myChart
            .setConfig({
              type: 'line',
              data: { 
                  labels: ticker.dateArray, 
                  datasets: [
                    { 
                      data: ticker.priceArray,
                      fill: false
                    }
              ] },
              options: {
                  legend: { display: false },
                  scales: {
                      yAxes: {
                          gridLines: {
                              display: false
                          }
                      }
                  }
              }
            })
            .setWidth(640)
            .setHeight(480);

          // You can send the URL to someone...
          const chartImageUrl = myChart.getUrl();
          //console.log(chartImageUrl)

          // Or download to disk
          myChart.toFile('./mychart.png');

        ctx.replyWithPhoto(
            //'./mychart.png',
            chartImageUrl
        )
        
    } else {

        let t1 =  await getMarketData(ctx.session.tickerText)
        let t2 = await getMults(ctx.session.tickerText)
        
        let mc = t1.mCap/1000000
        let ev = t1.mCap/1000000 + t2.nd
        let evs1 = (ev/t2.s1).toFixed(1)
        if (evs1 <= 10){
            evs1 = " " + evs1
        }
        let evs2 = (ev/t2.s2).toFixed(1)
        if (evs2 <= 10){
            evs2 = " " + evs2
        }
        let evs3 = (ev/t2.s3).toFixed(1)
        if (evs3 <= 10){
            evs3 = " " + evs3
        }
        let eve1 = (ev/t2.e1).toFixed(1)
        if (eve1 <= 10){
            eve1 = " " + eve1
        }
        let eve2 = (ev/t2.e2).toFixed(1)
        if (eve2 <= 10){
            eve2 = " " + eve2
        }
        let eve3 = (ev/t2.e3).toFixed(1)
        if (eve3 <= 10){
            eve3 = " " + eve3
        }
        let pe1 = (mc/t2.n1).toFixed(1)
        if (pe1 <= 10){
            pe1 = " " + pe1
        }
            let pe2 = (mc/t2.n2).toFixed(1)
            if (pe2 <= 10){
                pe2 = " " + pe2
        }
            let pe3 = (mc/t2.n3).toFixed(1)
            if (pe3 <= 10){
                pe3 = " " + pe3
        }
        let dy1 = (t2.d1/t1.price*100).toFixed(1)
        if (dy1 <= 10){
            dy1 = " " + dy1
        }
        let dy2 = (t2.d2/t1.price*100).toFixed(1)
        if (dy2 <= 10){
            dy2 = " " + dy2
        }
        let dy3 = (t2.d3/t1.price*100).toFixed(1)
        if (dy3 <= 10){
            dy3 = " " + dy3
        }
        
        ctx.replyWithHTML(
            `<pre>
         |  24  |  25  |  26  
---------|------|------|------
EV/S     | ${evs1} | ${evs2} | ${evs3} 
---------|------|------|------
EV/EBITDA| ${eve1} | ${eve2} | ${eve3} 
---------|------|------|------
P/E      | ${pe1} | ${pe2} | ${pe3} 
---------|------|------|------
DY       | ${dy1}%| ${dy2}%| ${dy3}%
                </pre>`
        )
    }
    return
})

bot.launch()
app.listen(PORT, () => console.log(`My server is running on port ${PORT}`))