//Declaring the necessary DOM elements to ease the work ahead

const canvas = document.getElementById('chart');
const ctx = document.getElementById('chart').getContext('2d');
const textField = document.querySelector('.textField');
const buttons = document.querySelector('.buttons');
const yes = document.getElementById('Yes');
const no = document.getElementById('No');
const CSV = 'eurofxref-hist.csv';
let isListFilled = false;

//Setting up the page

function initialize(){
  canvas.style.display = 'none';
}

initialize();

//If the visitor does not wish to check any of the currencies' exchange rate

function chooseNo(){
  textField.style.display = 'none';
  buttons.style.display = 'none';
  const newDiv = document.createElement('div');
  newDiv.innerText = 'You have opted not to check the rates of any currency. Thank you for visiting us, anyways!';
  document.body.appendChild(newDiv);
}

no.addEventListener('click', chooseNo);

//The below functions are liable for the data handling. 
//The aim is to have a JS object where the keys are the currency names and the matching values are a list, which cannot contain anything but numeric data  


async function getFetchData(){
  const rawData = await fetch(CSV);
  const data = await rawData.text();
  const strings = data.split('\r\n');
  const arrays = strings.map(line => line.split(','));
  return arrays;
}

async function createDates(){
  const data = await getFetchData();
  const dateArray = [];
  for (let i = 1; i < data.length; ++i){
    dateArray.push(data[i][0]);
  }
  return dateArray;
}

function isThereNA(list, a){
  return list.indexOf(a) == -1;
}

async function getFigures(){
  const data = await getFetchData();
  const figuresObj = {};
  for (let i = 0; i < data[0].length; ++i){
    let tempArray = [];
    for (let j = 1; j < data.length; ++j){
      tempArray.push(data[j][i]);
    }
    if (true === isThereNA(tempArray, 'N/A')){
        figuresObj[data[0][i]] = tempArray;
      }
    }
    return figuresObj;
  }

//Creating choices the visitor can choose from

async function getTable(param){
  canvas.style.display = 'block';
  const data = await getFigures();
  const dates = await createDates();
  const buttons = document.querySelectorAll('.BTN');
  console.log(buttons);
  buttons.forEach(btn => btn.style.display = 'none');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates.reverse(),
      datasets: [{
        label: `Exchange rates for ${param.textContent}`,
        data: data[param.textContent],
        fill: false,
        borderColor: 'rgb(181, 134, 47)',
        tension: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

async function createButtons(){
  const data = await getFigures();
  isButtonsThere = true;
  textField.style.display = 'none';
  buttons.style.display = 'none';
  const currDiv = document.createElement('div');
  document.body.appendChild(currDiv);
  const keys = Object.keys(data).splice(1);
  keys.forEach(curr =>{
    const button = document.createElement('button');
    button.textContent = curr;
    button.className = 'BTN';
    button.style.backgroundColor = 'white';
    button.style.color = 'rgb(55, 57, 153)';
    button.onclick = () => getTable(button);
    currDiv.appendChild(button);
  })
  
}

yes.addEventListener('click', createButtons);
