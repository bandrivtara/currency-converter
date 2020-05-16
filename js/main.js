let selectFromCurrency = document.querySelector('.select__from');
let selectToCurrency = document.querySelector('.select__to');
let inputFromCurrency = document.querySelector('.input__from');
let inputToCurrency = document.querySelector('.input__to');
let buttonRechangeCurrency = document.querySelector('.change-currency');

const getExchangeData = () => {
    fetch('https://api.nbp.pl/api/exchangerates/tables/a/')
        .then(resp => resp.json())
        .then(json => {
            let rates = json[0].rates;

            // create currency select
            rates.map(elem => {
                let fromOptionItems = document.createElement('option');
                fromOptionItems.value = elem.code;
                fromOptionItems.innerHTML = `${elem.code} (${elem.currency})`;

                let toOptionItems = document.createElement('option');
                toOptionItems.value = elem.code;
                toOptionItems.innerHTML = `${elem.code} (${elem.currency})`;

                selectFromCurrency.appendChild(fromOptionItems);
                selectToCurrency.appendChild(toOptionItems);
            })


            // calculate amount value
            let calculateAmount = () => {

                if (inputFromCurrency.value < 0) {      //amount validator
                    inputFromCurrency.value = 1
                }

                let currentInputValue = inputFromCurrency.value;

                selectedFromCurrency = selectFromCurrency.options[selectFromCurrency.selectedIndex].value;
                selectedToCurrency = selectToCurrency.options[selectToCurrency.selectedIndex].value;

                let selectedCurrencyRateTo = rates.filter(code => code.code === selectedToCurrency).map(rate => rate.mid)[0];
                let selectedCurrencyRateFrom = rates.filter(code => code.code === selectedFromCurrency).map(rate => rate.mid)[0];

                if (selectedFromCurrency === 'PLN') {
                    if (selectedToCurrency === 'PLN') {
                        let calculatedAmount = currentInputValue;
                        setCalculatedAmount(calculatedAmount);
                    } else {
                        let calculatedAmount = currentInputValue / selectedCurrencyRateTo;
                        setCalculatedAmount(calculatedAmount);
                    }
                } else if (selectedToCurrency === 'PLN') {
                    let calculatedAmount = currentInputValue * selectedCurrencyRateFrom;
                    setCalculatedAmount(calculatedAmount);
                } else {
                    let calculatedAmount = currentInputValue * selectedCurrencyRateFrom / selectedCurrencyRateTo;
                    setCalculatedAmount(calculatedAmount);
                }
            }

            let setCalculatedAmount = (calculatedAmount) => {
                inputToCurrency.value = calculatedAmount;
            }
            
            calculateAmount();

            //calculate on amount change
            inputFromCurrency.addEventListener('input', calculateAmount);


            // reselect currency
            selectFromCurrency.addEventListener('change', calculateAmount);
            selectToCurrency.addEventListener('change', calculateAmount)

            //change currency
            buttonRechangeCurrency.addEventListener('click', () => {
                let box = selectFromCurrency.value;
                selectFromCurrency.value = selectToCurrency.value;
                selectToCurrency.value = box;
                calculateAmount();
            })
        })
}


getExchangeData();