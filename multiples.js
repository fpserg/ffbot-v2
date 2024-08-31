let nd
let s1, s2, s3, e1, e2, e3, n1, n2, n3, d1, d2, d3

export async function getMults(ticker){
  let database = "https://fpserg.github.io/coding-experiments/serg-bbg/v2/data.json";

  try {
    const response = await fetch(database);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const db = await response.json()

    const data = db[ticker.toUpperCase()];

   nd = data["net_debt_mn"]
   s1 = data["sales_1_mn"]
   s2 = data["sales_2_mn"]
   s3 = data["sales_3_mn"]
   e1 = data["ebitda_1_mn"]
   e2 = data["ebitda_2_mn"]
   e3 = data["ebitda_3_mn"]
   n1 = data["np_1_mn"]
   n2 = data["np_2_mn"]
   n3 = data["np_3_mn"]
   d1 = data["dps_1"]
   d2 = data["dps_2"]
   d3 = data["dps_3"]
    

    } catch (error) {
      console.error(error.message);
    }
  return {
    "nd": nd,
    "s1": s1,
    "s2": s2,
    "s3": s3,
    "e1": e1,
    "e2": e2,
    "e3": e3,
    "n1": n1,
    "n2": n2,
    "n3": n3,
    "d1": d1,
    "d2": d2,
    "d3": d3
  }
  }