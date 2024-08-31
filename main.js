//import { getJSON } from 'simple-get-json'

let mdjson

export async function getMarketData(ticker) {
  let marketdata = `https://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities/${ticker}.json`;

  let hist = `https://iss.moex.com/iss/history/engines/stock/markets/shares/securities/${ticker}.json`;
  
  let price;
  let mCap;
  let adtv;
  let histArray;
  let priceArray;
  let dateArray;

  try {
    const response = await fetch(marketdata);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const md = await response.json()

  const data = md["marketdata"]["data"][0]; 
    price = data[12];
    mCap = data[50];
    
    
  } catch (error) {
    console.error(error.message);
  }
  
  try {
    const response = await fetch(hist);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const hsjson = await response.json()

    let ltm = hsjson["history.cursor"]["data"][0][1] - 65;

    if (ltm < 0) {
      ltm = 0
      };

    let histLTM = `${hist}?start=${ltm}`;

    try {
      const response1 = await fetch(histLTM);
        if (!response1.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const histLTMjson = await response1.json()

        histArray = histLTMjson["history"]["data"];

        let sumVal = 0

        for (let i=0; i<histArray.length;i++)
      {
        sumVal += histArray[i][5]
      }

      adtv = sumVal/histArray.length;

      priceArray = []

      for (let i=0; i<histArray.length;i++)
      {
        priceArray.push(histArray[i][11])
      }

      dateArray = []

      for (let i=0; i<histArray.length;i++)
      {
        dateArray.push(histArray[i][1])
      }


      } catch (error) {
        console.error(error.message);
      }
      
  } catch (error) {
    console.error(error.message);
  }

  return {"price": price, "mCap": mCap, "adtv": adtv, "priceArray": priceArray, "dateArray": dateArray}
}