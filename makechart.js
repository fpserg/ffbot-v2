import ApexCharts from 'apexcharts'
import dom-to-image from 'dom-to-image'

export async function makeChart(val, xaxis){
  let div = document.createElement('div');
    div.setAttribute("id", "cht");

    document.body.appendChild(div);

    let div2 = document.createElement('div');
    div2.setAttribute("id", "out");

    document.body.appendChild(div2);

    let cht = document.getElementById("cht")
    let out = document.getElementById("out")

    let options = {
    chart: {
      type: 'area',
    },
    dataLabels: {
        enabled: false
    },
    colors: ['#ffa500'],
    series: [{
      name: 'price',
      data: val
    }],
    xaxis: {
      categories: xaxis,
      labels: {
        show: false
      }
    },
    yaxis: {
      decimalsInFloat: 0,
      labels: {
        style:{
          colors: ['#ffffff']
        }
      }
    },
    tooltip: {
      theme: 'dark'
    }
  }

  window.chart = new ApexCharts(cht, options);

  window.chart.render().then(function() {
    window.setTimeout(function() {
        window.chart.dataURI().then((uri) => {
          //out.innerHTML = `<img src ="${uri["imgURI"]}" />`
          console.log(uri["imgURI"])

        })
    }, 1000) 
  })

  }