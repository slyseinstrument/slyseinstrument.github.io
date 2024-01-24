const { jsPDF } = window.jspdf;



let website_index = 0;
localStorage.setItem('website_index', website_index);
let title = "";
let websites_body = [];
let paramValue = "-";

let commissionFees = {};

const propertiesToSetToDefault = [
    'octBalanceTopUp',
    'declinedTransaction',
    'refund',
    'retrievalRequest',
    'chargeback',
    'preArbitration',
    'sepaSettlement',
    'swiftSettlement',
    'usdtSettlement',
    'outOfNormalOrderSettlement',
    'monthlyFee'
];

for (const property of propertiesToSetToDefault) {
    commissionFees[property] = '-';
}

let parties = {}
let maintenanceFees = {}
let otherCommissionFees = {};
let notFees = {}



// let payment_methods = {
//     VISA: {
//         EUR: {
//             FTD: [1, 2],
//             WL: [3, 4]
//         }
//     },
//     MasterCard: {
//         USD: {
//             FTD: [5, 6],
//             WL: [7, 8]
//         }
//     }
// }

// let commissions_body = [
//     [3., 'Commissions: '], 
//     [3.1, VISA, 'rate', 'fee'],
//     [EUR FTD, 1, 2],
//     [EUR WL, 3,4],
//     [3.2, MasterCard, 'rate', 'fee'],
//     [USD FTD, 5, 6],
//     [USD WL, 7, 8]
// ]

let payment_methods = {};
const paymentMethodSelect = document.getElementById('paymentMethod');
const currencySelect = document.getElementById('currency');
const inputStep = document.getElementById('inputStep');

const selectedPaymentMethod = document.getElementById('selectedPaymentMethod');
const wlRateInput = document.getElementById('wlRate');
const wlFeeInput = document.getElementById('wlFee');
const ftdRateInput = document.getElementById('ftdRate');
const ftdFeeInput = document.getElementById('ftdFee');
const saveButton = document.getElementById('saveButton');

paymentMethodSelect.addEventListener('change', () => {
    const selectedMethod = paymentMethodSelect.value;
    selectedPaymentMethod.textContent = selectedMethod;
    currencyStep.style.display = 'block';
});

// Event listener for currencySelect
currencySelect.addEventListener('change', () => {
    inputStep.style.display = 'block';
});

saveButton.addEventListener('click', () => {
    const selectedMethod = paymentMethodSelect.value;
    const selectedCurrency = currencySelect.value;
    const wlRate = parseFloat(wlRateInput.value) || '-';
    const wlFee = parseFloat(wlFeeInput.value) || '-';
    const ftdRate = parseFloat(ftdRateInput.value) || '-';
    const ftdFee = parseFloat(ftdFeeInput.value) || '-';

    if (!(selectedMethod in payment_methods)) {
        payment_methods[selectedMethod] = {};
    }
    if (!(selectedCurrency in payment_methods[selectedMethod])) {
        payment_methods[selectedMethod][selectedCurrency] = {};
    }
    if (!(payment_methods[selectedMethod][selectedCurrency].WL === [wlRate, wlFee])){
        payment_methods[selectedMethod][selectedCurrency].WL = [wlRate, wlFee];
    }
    if (!(payment_methods[selectedMethod][selectedCurrency].FTD === [ftdRate, ftdFee])){
        payment_methods[selectedMethod][selectedCurrency].FTD = [ftdRate, ftdFee];
    }
    console.log(payment_methods)

    // Clear input values
    wlRateInput.value = '';
    wlFeeInput.value = '';
    ftdRateInput.value = '';
    ftdFeeInput.value = '';

    // Hide inputStep
    document.getElementById('currencyStep').style.display = 'none';
    inputStep.style.display = 'none';
    paymentMethodSelect.value = "";
    currencySelect.value = "";

    // Log the updated payment_methods object
    // console.log(payment_methods);
    previewPDF()
});


function addTitle(){
    const titleInput = document.getElementById('titleInput').value.trim();
    if(titleInput){
        localStorage.setItem('title', titleInput);
    }
    previewPDF()
}

function addWebsite() {
    const websiteInput = document.getElementById('websiteInput');
    const websiteValue = websiteInput.value.trim();
    if (websiteValue) {
        index = parseInt(localStorage.getItem('website_index')) + 1;
        websites_body.push([index, websiteValue]);
        websiteInput.value = ''; // Clear the input field
        localStorage.setItem('website_index', index);
        displayWebsites();
    }
    previewPDF()
}

// function addParam() {
//     const paramInput = document.getElementById('paramInput');
//     const value = paramInput.value.trim();
//     if (value) {
//         paramValue = value;
//         paramInput.value = ''; 
//     }
// }


// 
// Forms
//

const partiesForm = document.getElementById('partiesForm');
partiesForm.addEventListener('submit', function (e) {
    e.preventDefault();
    parties = {
        ourCompany: document.getElementById('ourCompany').value || '',
        ourDirector: document.getElementById('ourDirector').value || '',
        MerchantCompany: document.getElementById('MerchantCompany').value || '',
        MerchantRepresenter: document.getElementById('MerchantRepresenter').value || '',
        MerchantRepresenterName: document.getElementById('MerchantRepresenterName').value || '',
    }
    previewPDF()
});

const maintenanceForm = document.getElementById('maintenanceFeesForm');
maintenanceForm.addEventListener('submit', function (e) {
    e.preventDefault();
    maintenanceFees = {
        InitialFee: document.getElementById('InitialFee').value || '-',
        MonthlyMaintenance: document.getElementById('MonthlyMaintenance').value || '-',
        MIDRegistration: document.getElementById('MIDRegistration').value || '-',
        AnnualMaintenance: document.getElementById('AnnualMaintenance').value || '-'
    }
    previewPDF()
});


const commissionForm = document.getElementById('otherCommissionForm');
commissionForm.addEventListener('submit', function (e) {
    e.preventDefault();
    commissionFees = {
        octBalanceTopUp: document.getElementById('octBalanceTopUp').value || '-',
        declinedTransaction: document.getElementById('declinedTransaction').value || '-',
        refund: document.getElementById('refund').value || '-',
        retrievalRequest: document.getElementById('retrievalRequest').value || '-',
        chargeback: document.getElementById('chargeback').value || '-',
        preArbitration: document.getElementById('preArbitration').value || '-',
        sepaSettlement: document.getElementById('sepaSettlement').value || '-',
        swiftSettlement: document.getElementById('swiftSettlement').value || '-',
        usdtSettlement: document.getElementById('usdtSettlement').value || '-',
        outOfNormalOrderSettlement: document.getElementById('outOfNormalOrderSettlement').value || '-',
        monthlyFee: document.getElementById('monthlyFee').value || '-',
    }
    previewPDF()
});

const notfeesForm = document.getElementById('notFeesRelatedForm');
notfeesForm.addEventListener('submit', function (e) {
    e.preventDefault();
    notFees = {
        ReportingPeriod: "Every " + document.getElementById('ReportingPeriod').value + " days" || 'Every - days',
        SettlementFrequency: "Every " + document.getElementById('SettlementFrequency').value + " days" || 'Every - days',
        MinimumThreshold: document.getElementById('MinimumThreshold').value + ' EUR' || '- EUR',
        MinimumSettlementAmount: document.getElementById('MinimumSettlementAmount').value + ' EUR' || '- EUR',
        SingleTransactionLimit: document.getElementById('SingleTransactionLimit').value + ' EUR' || '- EUR',
        SingleOctLimit: document.getElementById('SingleOctLimit').value + ' EUR' || '- EUR',
        DailyTransactionLimit: document.getElementById('DailyTransactionLimit').value + ' EUR' || '- EUR',
        DailyOctLimit: document.getElementById('DailyOctLimit').value + ' EUR' || '- EUR',
        MonthlyTransactionLimit: document.getElementById('MonthlyTransactionLimit').value + ' EUR' || '- EUR',
        MonthlyOctLimit: document.getElementById('MonthlyOctLimit').value + ' EUR' || '- EUR',
        SettlementCurrency: document.getElementById('SettlementCurrency').value || '-',
        AmountRollingReserve: document.getElementById('AmountRollingReserve').value || '-',
    };
    previewPDF()
});


// Show added websites


function displayWebsites() {
    const websiteList = document.getElementById('websiteList');
    websiteList.innerHTML = ''; // Clear the list

    // Loop through the websites and create list items
    for (const website of websites_body) {
        const listItem = document.createElement('li');
        listItem.textContent = website[1]; // Display the website URL
        listItem.classList.add("list-group-item")
        listItem.classList.add('websites-item')
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.classList.add('btn-outline-secondary');
        deleteButton.classList.add('btn')
        deleteButton.classList.add('btn-sm')
        deleteButton.addEventListener('click', () => deleteWebsite(website[0])); // Pass the index to deleteWebsite function
        listItem.appendChild(deleteButton);
        websiteList.appendChild(listItem);
    }
}


function deleteWebsite(index) {
    websites_body = websites_body.filter((website) => website[0] !== index);
    localStorage.setItem('websites_body', JSON.stringify(websites_body)); // Store the updated list in local storage
    displayWebsites(); // Update the displayed list
    previewPDF()
}


document.getElementById('addTitleButton').addEventListener('click', addTitle);
document.getElementById('addWebsiteButton').addEventListener('click', addWebsite);






