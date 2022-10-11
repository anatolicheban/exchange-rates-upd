const buttons = document.querySelectorAll(".button");
const input = document.querySelector(".app__input-field");
const body = document.querySelector('body')
const selects = document.querySelectorAll('.select')

let output = document.querySelector('.app__output-value')

let currentDate = new Date().toLocaleDateString()
document.querySelector('.app__output').dataset.day = `Курс станом на ${currentDate}`
//====================Получение курса валют===========================

async function getCourse() {
  let selectFrom = document.querySelectorAll('.select')[0].value
  let selectTo = document.querySelectorAll('.select')[1].value
  let symbol = selectTo === 'USD' ? '$' :
    selectTo === 'UAH' ? '₴' :
      selectTo === 'IDR' ? '₹' : '€';
  console.log('From: ', selectFrom);
  console.log('To: ', selectTo);

  let itemName = `${selectFrom} to ${selectTo}`
  console.log('Item name: ', itemName);


  let course

  if (sessionStorage.getItem(itemName)) {
    course = +sessionStorage.getItem(itemName)
    let result = Math.round(input.value * course * 1000) / 1000
    output.innerHTML = `${result} ${symbol}`
    return
  }

  let request = await fetch(`https://api.exchangerate.host/convert?from=${selectFrom}&to=${selectTo}`)
  const response = await request.json();
  if (response.success) {
    console.log(response);
    sessionStorage.setItem(itemName, response.result)
    let result = Math.round(input.value * response.result * 1000) / 1000
    output.innerHTML = `${result} ${symbol}`
  } else {
    console.log(response);
  }

}


//=======================Заполнение формы ввода============================

buttons.forEach((button) => {
  button.addEventListener("click", function (event) {
    event.preventDefault();
    if (!button.classList.contains("reset")) {
      input.value += this.innerText
      getCourse()
      removeOrAddZero()
      setResetState()
      console.log(input.value);
    } else if (button.classList.contains("reset")) {
      input.value = '0'
      getCourse()
      setResetState()
    }
  });
});

function setState(index, state) {
  if (input.classList.contains('focused')) {
    if (index >= 1 && index <= 9 && state === 'active') {
      buttons[index - 1].classList.add('active')
    } else if (index == 0 && state === 'active') {
      buttons[9].classList.add('active')
    } else if (index >= 1 && index <= 9 && state === 'default') {
      buttons[index - 1].classList.remove('active')
    } else if (index == 0 && state === 'default') {
      buttons[9].classList.remove('active')
    }
  }
}

window.addEventListener('keydown', function (event) {
  setState(Number(event.key), 'active')
})

window.addEventListener('keyup', function (event) {
  setState(Number(event.key), 'default')
})

//=========================Считаем денежки====================================


input.addEventListener('input', () => {
  getCourse()
  removeOrAddZero()
  setResetState()

})

selects.forEach(select => {
  select.addEventListener('input', () => {
    getCourse()
  })
})

//================

function setResetState() {
  if (input.value == '0') {
    document.querySelector('.reset').setAttribute('disabled', true)
  } else if (input.value[0] != '0' && input.value.length > 0) {
    document.querySelector('.reset').removeAttribute('disabled')
  }
}

window.addEventListener('load', () => {
  setResetState()
})

function removeOrAddZero() {
  if (input.value[0] === '0' && input.value.length > 1) {
    input.value = input.value.slice(1)
  } else if (input.value.length === 0) {
    input.value = '0'
  }
}

input.onfocus = function () {
  input.classList.add('focused')
}

input.onblur = function () {
  input.classList.remove('focused')
}



