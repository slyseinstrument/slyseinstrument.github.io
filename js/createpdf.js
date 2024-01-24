function previewPDF() {
    let doc = createPDF()
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    document.getElementById('pdfFrame').src = pdfUrl;
}

function downloadPDF(){
    doc = createPDF()
    doc.save('pdf.pdf')
}

        // 'ADDENDUM FOR MERCHANT AGREEMENT ANNEX FEES 20231107/2',
function createPDF(){
    let positionY = 30;
    const doc = new jsPDF({format: 'a4'});
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(
        (localStorage.getItem('title') || "Title"),
        105, // This should be approximately the middle of an A4 page (210mm / 2)
        positionY,
        {
        align: 'center',
        }
    );

    positionY += 20;

    doc.text(
        '       1. Website(s):',
        25,
        positionY,
        {}
    );

    positionY += 10;
    // websites
    doc.autoTable({
        startY: positionY,
        head: [],
        body: websites_body,
        bodyStyles: { fillColor: false }, // No background color in body
        didDrawCell: (data) => {
            if (data.section === 'body') {
                doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
            }
        },
        margin: { left: 25}
    });
    text = `        2. FEES PAID TO THE SERVICE PROVIDER BY THE MERCHANT UNLESS OTHERWISE
SPECIFIED. ALL FEES AND CHARGES SET OUT BELOW BECOME DUE AND PAYABLE
BY THE MERCHANT AT THE TIME THE RELATED SERVICES ARE RENDERED OR
TRANSACTION PROCESSED BY THE SERVICE PROVIDER.`;
    positionY += 10 + (8 * websites_body.length)
    
    doc.text(
        text,
        25, 
        positionY
    )
    positionY += 22;
    text = `ALL THE MERCHANT’S TRANSACTIONS IN THE SERVICE PROVIDER ACCOUNTS
SHALL BE CONVERTED INTO EUROS AND ALL THE FOLLOWING CALCULATIONS
SHALL BE PERFORMED BASING ON THE CONVERSION RESULT.`;
    doc.text(
        text,
        25, 
        positionY
    )
    positionY += 20;
    // params
    let maintenance_body = [
        [2.1, 'Initial fee for consideration of the application for service and the accompanying documents of the Merchant', maintenanceFees.InitialFee],
        [2.2, 'Monthly fee for the maintenance of the system accepting the Cards', maintenanceFees.MonthlyMaintenance],
        [2.3, 'MID Registration (each)', maintenanceFees.MIDRegistration],
        [2.4, 'Annual Payment Gateway maintenance fee', maintenanceFees.AnnualMaintenance]
    ]
    doc.autoTable({
        startY: positionY,
        head: [['', 'Name of the Parameter', 'Value of the Parameter']],
        body: maintenance_body,
        bodyStyles: { fillColor: false }, 
        didDrawCell: (data) => {
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
            
        },
        headStyles: {
            fillColor: 'white',
            textColor: 'black'
        },
        columnStyles: {
            0: { cellWidth: 20},
            1: { cellWidth: 120},
            2: { halign: 'center' } // Align the third column (index 2) to the center
        },
        margin: { left: 25}
    });
    positionY += 50;
    bulleting = 1
    let commissions_body = [
        [3., 'Commissions: ', '', '']
    ];
    for (const paymentMethod in payment_methods) {
        commissions_body.push(["3." + bulleting, paymentMethod + ` Commision % rate for Card Payment by the currency and Fee for each successful Card Payment`, '% rate', 'Fee']);
        bulleting += 1;
        for (const currency in payment_methods[paymentMethod]) {
            const data = payment_methods[paymentMethod][currency];
            const rowHeader = currency;
            commissions_body.push(['',rowHeader + ' for FTD traffic', data.FTD[0], data.FTD[1]]);
            commissions_body.push(['',rowHeader + ' for STD traffic', data.WL[0], data.WL[1]]);
        }
    }

    doc.autoTable({
        startY: positionY,
        head: [],
        body: commissions_body,
        bodyStyles: { fillColor: false }, 
        didDrawCell: (data) => {
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);  
        },
        headStyles: {
            fillColor: 'white',
            textColor: 'black'
        },
        columnStyles: {
            0: { cellWidth: 20},
            1: { cellWidth: 120},
            2: { halign: 'center'},
            3: { halign: 'center'} 
        },
        margin: { left: 25}
    });
    
    other_fees_body = [
    ]
    for (let i = 0; i < 11; i++) {
        if(i == 11){
            bulleting += 11;
        }
        bul_num = bulleting + i
        other_fees_body.push(["3." + bul_num])
    }


    other_fees_body[0].push(...['Commission fee for OCT balance top up:',commissionFees.octBalanceTopUp]);
    other_fees_body[1].push(...['Commission fee for the declined transaction:',commissionFees.declinedTransaction]);
    other_fees_body[2].push(...['Commission fee for each refund:',commissionFees.refund]);
    other_fees_body[3].push(...['Commission fee per Retrieval Request',commissionFees.retrievalRequest]);
    other_fees_body[4].push(...['Commission fee for processing of each Chargeback:',commissionFees.chargeback]);
    other_fees_body[5].push(...['Commission fee per Pre-Arbitration, Pre- compliance/Compliance, Good Faith Letter, Arbitration (plus IPCO fee)',commissionFees.preArbitration]);
    other_fees_body[6].push(...['Commission fee for the SEPA Settlement to the Merchant’s account',commissionFees.sepaSettlement]);
    other_fees_body[7].push(...['Commission fee for the SWIFT Settlement to the Merchant’s account',commissionFees.swiftSettlement]);
    other_fees_body[8].push(...['Commission fee for the USDT Settlement to the Merchant’s account',commissionFees.usdtSettlement]);
    other_fees_body[9].push(...['Commission fee for the Settlement to the Merchant’s account, if the Settlement is done out of normal order',commissionFees.outOfNormalOrderSettlement]);
    other_fees_body[10].push(...['Monthly fee, it the monthly processing volume does not exceed the minimum threshold as specified in clause 3.3 of this Annex',commissionFees.monthlyFee]);

    positionY += 20 + (8 * commissions_body.length); 

    doc.autoTable({
        startY: positionY,
        head: [],
        body: other_fees_body,
        bodyStyles: {
            fillColor: false
        }, 
        didDrawCell: (data) => {
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);  
        },
        headStyles: {
            fillColor: 'white',
            textColor: 'black'
        },
        columnStyles: {
            0: { cellWidth: 20},
            1: { cellWidth: 120},
            2: { halign: 'center'}
        },
        margin: { left: 25}
    });
    positionY -= 160;
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    text = `N.B. Gateway ID number may change due to the technical reasons unilaterally at the discretion of the Service Provider.`
    doc.text(text,
             25,
             positionY
    )
    doc.setFontSize(11);
    doc.setFont('times', 'bold');
    text = '3. PARAMETERS NOT RELATED TO FEES'
    positionY += 20;
    doc.text(text,
             25,
             positionY
    )

    let headerParams = [
        ['', 'Name of the Parameter', 'Value of the Parameter']
    ]

    let limits = [
        ['', 'Transaction limits', 'Card Transaction', 'OCT'],
        ['4.1', 'Single transaction limit per Cardholder', notFees.SingleTransactionLimit, notFees.SingleOctLimit],
        ['4.2', 'Daily transaction limit per Cardholder', notFees.DailyTransactionLimit, notFees.DailyOctLimit],
        ['4.3', 'Monthly transaction limit per Cardholder', notFees.MonthlyTransactionLimit, notFees.MonthlyOctLimit]
    ]
    
    let not_fees_related = [
        ['4.4', 'Reporting Period', notFees.ReportingPeriod],
        ['4.5', 'Frequency with which the Service Provider will transfer the Settlement to the Merchant Account of the Merchant', notFees.SettlementFrequency],
        ['4.6', 'Minimum monthly processing volume threshold', notFees.MinimumThreshold],
        ['4.7', 'Minimum Settlement Amount', notFees.MinimumSettlementAmount],
        ['4.8', 'Currency for Settlement', notFees.SettlementCurrency],
        ['4.9', 'Amount of the Rolling Reserve and period of possession', notFees.AmountRollingReserve],
    ]
    positionY += 10;
    doc.autoTable({
        startY: positionY,
        head: [],
        body: headerParams,
        bodyStyles: {
            fillColor: false
        }, 
        didDrawCell: (data) => {
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);  
        },
        headStyles: {
            fillColor: 'white',
            textColor: 'black'
        },
        columnStyles: {
            0: { cellWidth: 20},
            1: { cellWidth: 70},
            2: { halign: 'center'}
        },
        margin: { left: 25}
    });
    positionY += 7.7;
    doc.autoTable({
        startY: positionY,
        head: [],
        body: limits,
        bodyStyles: {
            fillColor: false
        }, 
        didDrawCell: (data) => {
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);  
        },
        headStyles: {
            fillColor: 'white',
            textColor: 'black'
        },
        columnStyles: {
            0: { cellWidth: 20},
            1: { cellWidth: 70},
            2: { halign: 'center', cellWidth: 40.45},
            3: { halign: 'center', cellWidth: 40.45}
        },
        margin: { left: 25}
    });
    positionY += 29.8;
    doc.autoTable({
        startY: positionY,
        head: [],
        body: not_fees_related,
        bodyStyles: {
            fillColor: false
        }, 
        didDrawCell: (data) => {
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);  
        },
        headStyles: {
            fillColor: 'white',
            textColor: 'black'
        },
        columnStyles: {
            0: { cellWidth: 20},
            1: { cellWidth: 70},
            2: { halign: 'center'}
        },
        margin: { left: 25}
    });
    positionY += 90;
    doc.text(
        '4. Details and Signatures of the Parties:',
        105, // This should be approximately the middle of an A4 page (210mm / 2)
        positionY,
        {
        align: 'center',
        }
    );

    positionY += 10;
    doc.autoTable({
        startY: positionY,
        head: [[parties.ourCompany, parties.MerchantCompany]],
        body: [['', ''], ['Director: ' + (parties.ourDirector || ""), (parties.MerchantRepresenter || "Representer") + ": " + (parties.MerchantRepresenterName || "")]],
        bodyStyles: {
            fillColor: false
        }, 
        didDrawCell: (data) => {
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);  
        },
        headStyles: {
            fillColor: 'white',
            textColor: 'black',
            halign: 'center'
        },
        columnStyles: {
            0: { cellWidth: 70, minCellHeight: 20, valign: 'center'},
            1: { cellWidth: 70, minCellHeight: 20, valign: 'center'}
        },
        margin: { left: 40}
    });

    return doc
}


