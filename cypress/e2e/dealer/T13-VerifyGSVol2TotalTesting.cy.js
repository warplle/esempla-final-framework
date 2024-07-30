import { getAdminBaseUrl, getAdminUserName, getAdminPassword, generateRandomNumber, generateRandomString, getDealerBaseUrl, getDealerIDNP, getDealerPassword,
    generateRandomEmail, generateRandomBicCode,generateRandomStringRU, generateRandomStringWithNumbers, generateRandomStringOnlyUpperCase, SelectRandomGSType,
     SelectRandomCurrency, GenerateFutureDateTimeIssueDateField, GenerateCurrentDateTimeMaturityDateField, GenerateCurrentDateTimeStartDateField,
    GenerateFutureDateTimeEndDateFieldGB, GenerateDateTimeCouponPaymentDatesGB, DeleteCreatedGSGovernmentBond, getInvestorIDNP, getInvestorPassword,
    getInvestorBaseUrl} from '../../../../qa/cypress/support/functions.js';


const adminBaseUrl = getAdminBaseUrl();
const adminUserName = getAdminUserName();
const adminPassword = getAdminPassword();
const investorBaseUrl = getInvestorBaseUrl();
const investorIDNP = getInvestorIDNP();
const investorPassword = getInvestorPassword();
const dealerBaseUrl = getDealerBaseUrl();
const dealerIDNP = getDealerIDNP();
const dealerPasword = getDealerPassword();
const securityTreasuryBills = "Treasury Bills";
const securityGovernmentBonds = "Government Bonds"
const isinCodeTB = "MD4003" + generateRandomNumber(6);
const isinCodeTB1 = "MD4003" + generateRandomNumber(6);
const isinCodeGB = "MD4004" + generateRandomNumber(6);
const isinCodeGB1 = "MD4004" + generateRandomNumber(6);
const circulationTerm = "90 Day";
const nominalValue = "3" + generateRandomNumber(2);
const currentPrice = "1" + generateRandomNumber(2);
const currency = "MDL";
// const currency = SelectRandomCurrency();
// const issueDate = GenerateCurrentDateTime();
const couponRate = '7'; // governmentsBonds type
const indicativeVolume = "1" + generateRandomNumber(2);
const minimumOrderTB = "1" + generateRandomNumber(1);
const minimurOrderTB1 = "1" + generateRandomNumber(1);
const minimumOrderGB = "1" + generateRandomNumber(1);
const minimumOrderGB1 = "1" + generateRandomNumber(1);

const descriptionIncomeSourceField = generateRandomString(10) + " " + generateRandomString(10);


describe('Verify GS2 Volume Total Testing', () => {

  
    //---------------------------------TREASURY BILLS-------------------------------------------------------------------------
    it('GS2 Volume Total Testing - Treasury Bills', () => {

        cy.AdminSimpleLogin(adminBaseUrl, adminUserName, adminPassword);

         //Change language to EN
       cy.get('#languagesnavBarDropdown').click();
       //cy.get('[ng-reflect-jhi-active-menu="en"]').click();
       cy.contains('a', 'English').click();


        //----------------GENERATING TREASURY BILLS GS-------------------------------------------
        cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click(); // clicking on the "Government Securities" option
        cy.get('[routerlink="/government-securities-treasury"]').click();
        cy.get('#jh-create-entity').click(); // clicking on the [Add new] button

        // enter data in the fields
        cy.get('#field_securitiesName').select('Treasury Bills').invoke('change');

        cy.get('#field_isinCode').type(isinCodeTB);
        cy.SelectRandomCirculationTermTreasuryBills();
        //cy.get('.ng-input').type(circulationTerm);
        cy.get('#field_nominalValue').type(nominalValue);
        cy.get('#field_currentPrice').type(currentPrice);
        cy.get('#field_currency').select("MDL");
        cy.GenerateCurrentDateTimeIssueDateField();
        // secondary market sell "NO"
        // mandatory Early Redemption "NO"
        cy.GenerateCurrentDateTimeStartDateFieldTB();
        cy.GenerateFutureDateTimeEndDateFieldTB();
        cy.get('#field_indicativeVolume').clear().type(indicativeVolume);
        cy.get('#field_minOrder').clear().type(minimumOrderTB);
        // fees applied "NO"

        cy.get('#save-entity').click();
         //----------------GENERATING TREASURY BILLS GS-------------------



         //------------------PUBLISH GS-----------------------------------
        cy.ViewDetailsCreatedTreasuryBills(securityTreasuryBills, isinCodeTB, nominalValue, currentPrice, indicativeVolume, minimumOrderTB);
        cy.AdminPublishGS();
        //cy.get('[ng-reflect-jhi-translate="retailManagementApp.GsPlacemen"]').eq(1).should('have.value', "Announced"); // validating Status in the GS Details
        cy.contains("Announced");
         //------------------PUBLISH GS-----------------------------------



        //-------------------LOG IN AS Investor to validate that GS appeared--------------------------
        cy.setInvestorCredentials(investorIDNP, investorPassword);
        cy.InvestorLogin(investorBaseUrl);

        cy.contains("Purchase VMS").click(); // clicking on the ["Subscription Calendar"] button/drop-down
        cy.wait(500);
        cy.get('img[src="content/images/subscription-calendar/subscription-calendar.svg"]').click();
        cy.contains("Upcoming subscriptions").click();

        //---validating that GS is displayed in Upcoming Calendar
        const tableBody = cy.get('tbody');
        // Find the rows (td elements) containing the code
        const matchingCell = tableBody.find('td').contains(isinCodeTB);
        //-------------------LOG IN AS Investor to validate that GS appeared--------------------------



        //---------Change GS status to "STARTED"------------------------------------
        cy.visit(adminBaseUrl);

        cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click(); // clicking on the Government Securities drop-down
        cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.treasury"]').click(); // clicking on the Treasury Bills option

        //---validating that GS is displayed in Upcoming Calendar
        const tableBody1 = cy.get('tbody');
        // Find the rows (td elements) containing the code
        const matchingCell1 = tableBody1.find('td').contains(isinCodeTB);

         // Get the first matching row
         const matchingRow1 = matchingCell1.parent();

         // Click the edit button within the first matching row (assuming button class is 'edit-btn')
         cy.wait(1000);
         matchingRow1.find('[data-cy="entityDetailsButton"]').click();
         cy.AdminChangeStatusGSToStarted();
        //---------Change GS status to "STARTED"------------------------------------



        //------------LOG IN as INVESTOR so that we can buy a GS----------------------
        cy.visit(investorBaseUrl);
        cy.get('[jhitranslate="global.menu.subscriptionCalendar"]').eq(1).click(); // clicking on the "Subscription Calendar" button
        
        cy.InvestorBuyGSTreasuryBills(isinCodeTB, indicativeVolume, currentPrice, nominalValue);
        cy.SelectRandomIncomeSourceWhenBuyingAGS(descriptionIncomeSourceField);

        cy.get('#field_volume').clear().type(minimumOrderTB); // entering the quantity of activities we want to buy

        //extracting the sum when buying, to validate it when looking at the transaction details of a Placement
        let purchaseAmountWhenBuying;

        cy.get('dt:contains("Purchase Amount (MDL)")')
        .next('dd') // Move to the next sibling (dd element) containing the value
        .then(($purchaseAmountElement) => {
          // Extract the text content using text()
          const purchaseAmountText = $purchaseAmountElement.text().trim();
      
          // Extract the whole number part using regular expression
          const wholeNumberRegex = /^\d+/; // Matches one or more digits at the beginning
          const wholeNumber = purchaseAmountText.match(wholeNumberRegex)[0];
      
          // Assign the whole number to purchaseAmountWhenBuying
          purchaseAmountWhenBuying = wholeNumber;
      
          cy.log('Purchase amount (whole number):', purchaseAmountWhenBuying);
        });
          
        


        cy.get('[jhitranslate="entity.action.continue"]').click(); // clicking on the [Continue] button

        //clicking on the checkboxes Terms & Conditions
        cy.get('#first_check').click();
        // cy.get('#second_check').click();
        // cy.get('#third_check').click();
        // cy.get('#fouth_check').click();

        cy.get('[jhitranslate="entity.action.confirm"]').click(); // clicking on the [Confirm] button

        cy.contains('Confirm Purchase Operation');
        cy.get('[jhitranslate="purchaseOrder.modal.confirmText"]').should('exist').should('be.visible');

        cy.get('[data-cy="entityConfirmButton"]').click(); // clicking on the confirm button for confirming the purchase operation

        //--validating the text after investor confirmed his purchase
        cy.get('[jhitranslate="purchaseOrder.paymentDescription"]')
        .should('contain', 'This order can be paid through the MPay payment service using the associated order key:');

        cy.get('[jhitranslate="purchaseOrder.paymentExpired"]')
        .should('contain', 'After the expiration time, the order becomes automatically invalid and cannot be paid. To make the payment, a new purchase order must be generated.');

        // extracting the order key from the element
        let orderKey;

        cy.get('div.d-flex.justify-content-center.align-items-center.fw-bold') // Selecting the div element with specific classes
          .find('span') // Finding the span element within the selected div
          .invoke('text') // Invoking the 'text' method to get the text content
          .then((text) => {
            orderKey = text.trim(); // Assign the extracted data to the variable
          })


        //---------------Simulating Pay Placement as Admin--------------------------------
        cy.visit(adminBaseUrl);
        cy.contains('Administration').click(); // clicking on the [Administration] tab
        
        cy.get('[href="/admin/m-integrations"]').click(); // clicking on the [M-M Integrations] option
        cy.get('#ngb-nav-1').click(); // clicking on the [MPay] option

        cy.get('[name="idnp"]').eq(2).click().then(() => {
            cy.get('[name="idnp"]').eq(2).type(orderKey); // type the orderKey after clicking
        });

        cy.get('[jhitranslate="entity.action.search"]').click(); // clicking on the [Search] button
        cy.get('[jhitranslate="backendApp.order.orderSimulatePay"]').click(); // simulating the Pay action as Admin

        cy.contains("200"); // validating response status
        cy.contains("OK"); // validating response status text

        //---------------Simulating Pay Placement as Admin--------------------------------



        //---------------Change Placement Status to 'CLOSED'---------------------------------
        cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click(); // clicking on the {"Governments Securities"} drop-down
        cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.treasury"]').click(); //clicking on the Treasury Bills option

           //---validating that GS is displayed in Upcoming Calendar
           const tableBody2 = cy.get('tbody');
           // Find the rows (td elements) containing the code
           const matchingCell2 = tableBody2.find('td').contains(isinCodeTB);
            // Get the first matching row
            const matchingRow2 = matchingCell2.parent();
            // Click the edit button within the first matching row (assuming button class is 'edit-btn')
            cy.wait(1000);
            matchingRow2.find('[data-cy="entityDetailsButton"]').click();
            cy.AdminChangeStatusGSToClosed();
          //---------------Change Placement Status to 'CLOSED'---------------------------------



          //----------------------ADMIN Activate GS-----------------------------------------

          cy.then(() => {
            // Ensure purchaseAmountWhenBuying has been assigned before calling the function
            // This executes once the previous command queue has been cleared
            cy.AdminActivateGSAndDistributeInPortofolio(isinCodeTB, purchaseAmountWhenBuying);
          });       

            // validating that the Placement appeared in Investor's Portofolio
            cy.visit(investorBaseUrl);
            cy.get('[jhitranslate="global.menu.subscriptionCalendar"]').eq(1).click(); // clicking on the "Subscription Calendar" button
            cy.wait(500);
            cy.get('[alt="subscriptionCalendar.portfolio"]').click({force: true}); // clicking on the [Portofolio] TAB
            cy.wait(500);
            cy.get('[alt="subscriptionCalendar.portfolio"]').click({force: true}); // clicking on the [Portofolio] TAB
            
            cy.wait(1000);
            //---validating that GS is displayed in Upcoming Calendar
           const tableBody3 = cy.get('tbody');
           // Find the rows (td elements) containing the code
           const matchingCell3 = tableBody3.find('td').contains(isinCodeTB);
            // Get the first matching row
            const matchingRow3 = matchingCell3.parent();
            // Click the edit button within the first matching row (assuming button class is 'edit-btn')
            cy.wait(1000);
            matchingRow3.find('[jhitranslate="transactions.details"]').click(); // clicking on the Details button of transaction

            cy.wait(1000);

            //extracting the sum when looking on the transaction's details, to validate that the amount is the same
            let purchaseAmountDetailsPortofolio;
            // Extracting the sum when looking at transaction details
              // Find the dt element containing "Purchase Amount (MDL)" label
              cy.get('dt:contains("Purchase Amount (MDL)")')
              .next('dd') // Move to the next sibling (dd element) containing the value
              .then(($purchaseAmountElement) => {
                // Extract the text content using text()
                const purchaseAmountText = $purchaseAmountElement.text().trim();
            
                // Extract only the purchase amount by splitting the text by newline and taking the first part
                purchaseAmountDetailsPortofolio = purchaseAmountText.split('\n')[0].trim();
            
                cy.log('Purchase amount when Buying:', purchaseAmountWhenBuying);
                cy.log('Purchase amount details Portofolio:', purchaseAmountDetailsPortofolio);

            }).then(() => {
               // expect(purchaseAmountWhenBuying).to.equal(purchaseAmountDetailsPortofolio); // asserting the values when buying and the value in transaction's details Portofolio
            });
          //----------------------ADMIN Activate GS-----------------------------------------


          //------------------------CHANGE STATUS GS TO BLOCKED--------------------------------

            cy.visit(adminBaseUrl); 
            cy.contains("Government Securities").click()
            cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.treasury"]').click(); // clicking on the Treasury Bills option

            // finding the isinCode created
            cy.wait(1000);
            //---validating that GS is displayed in Upcoming Calendar
           const tableBody4 = cy.get('tbody');
           // Find the rows (td elements) containing the code
           const matchingCell4 = tableBody4.find('td').contains(isinCodeTB);
            // Get the first matching row
            const matchingRow4 = matchingCell4.parent();
            // Click the edit button within the first matching row (assuming button class is 'edit-btn')
            cy.wait(1000);
            matchingRow4.find('[data-cy="entityDetailsButton"]').click(); // clicking on the Details button of transaction
      
            cy.AdminChangeStatusGSToBlocked(); // changing staus of GS to "BLOCKED"

            //------------------------CHANGE STATUS GS TO BLOCKED--------------------------------



            //--------------ADMIN CREATE SUBSCRIPTION REPORT-----------------------------------

            cy.AdminCreateSubscriptionReport();

            // extracting the Volumul la pretul de vanzare from report
            let volumulLaPretulDeVanzare;
            cy.get('tbody tr:nth-child(2) td:last-child').invoke('text').then((text) => {
                // Extract the text content from the last td element
                const valueText = text.trim();
                // Extract the whole part from the text
                const wholePart = valueText.split('.')[0];
                volumulLaPretulDeVanzare = wholePart;
            
                cy.log(`Purchase amount when Buying: ${purchaseAmountWhenBuying}`);
                cy.log(`Volumul la pretul de vanzare: ${wholePart}`);
                //expect(volumulLaPretulDeVanzare).to.equal(purchaseAmountWhenBuying); // validating the Volume price
              });

             //--------------ADMIN CREATE SUBSCRIPTION REPORT-----------------------------------


               

            cy.get('[jhitranslate="entity.action.cancel"]').click(); // clicking on the [Cancel] button

            cy.wait(1000);

            
            //----------------------------ADMIN CREATE PURCHASE ORDER REPORT-------------------------------

            cy.AdminCreatePurchaseOrdersReport();
            
            cy.wait(3500);

//            // Validate the purchaseOrdersReport
//             cy.window().then((win) => {
//             // Get the URL of the newly opened tab
//             const newTabUrl = win.location.href;

//             // Visit the new tab if the URL matches the expected pattern
//             if (newTabUrl.startsWith('https://cabinet.retail.esempla.systems/')) {
//             cy.visit(newTabUrl).then(() => {
//             // Assertions on the new tab
//             //cy.contains('div', /Raportul cu privire la plățile aferente ISIN MD1231243124/);


//             let sumaTotalaSprePlata;
//             cy.get('span').contains('Suma totală spre plată').parent().siblings().invoke('text').then((text) => {
//                 // Extract the text content from the sibling span element
//                 const valueText = text.trim();
//                 // Extract only the whole part of the value
//                 const wholePart = valueText.split('.')[0];
//                 sumaTotalaSprePlata = wholePart;

//                 cy.log(`Purchase amount when Buying: ${purchaseAmountWhenBuying}`);
//                 cy.log(`Suma totala spre plata: ${sumaTotalaSprePlata}`);

//                 expect(sumaTotalaSprePlata).to.equal(purchaseAmountWhenBuying); // validating the Volume price
//             });
//         });
//                 } else {
//                 // Handle if the URL doesn't match the expected pattern
//                 cy.log('Unexpected URL in the new tab:', newTabUrl);
//     }
// });

                //----------------------------ADMIN CREATE PURCHASE ORDER REPORT-------------------------------

    })

    // the maturity date will be generated from the beginining with 1 day before transaction so that we can create maturity report
    it('Admin should be able to generate PayOut report - Treasury Bills', () => {


        cy.AdminSimpleLogin(adminBaseUrl, adminUserName, adminPassword);

         //Change language to EN
       cy.get('#languagesnavBarDropdown').click();
       //cy.get('[ng-reflect-jhi-active-menu="en"]').click();
       cy.contains('a', 'English').click();


        //----------------GENERATING TREASURY BILLS GS-------------------------------------------
        cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click(); // clicking on the "Government Securities" option
        cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.treasury"]').click(); // clicking on the Goverments Bonds option
        cy.get('#jh-create-entity').click(); // clicking on the [Add new] button

        // enter data in the fields
        cy.get('#field_securitiesName').select('Treasury Bills').invoke('change');

        cy.get('#field_isinCode').type(isinCodeTB1);
        cy.SelectRandomCirculationTermTreasuryBills();
        //cy.get('.ng-input').type(circulationTerm);
        cy.get('#field_nominalValue').type(nominalValue);
        cy.get('#field_currentPrice').type(currentPrice);
        cy.get('#field_currency').select("MDL");
        cy.GenerateCurrentDateTimeIssueDateField();
        cy.GenerateNextDayDateTimeMaturityDateFieldTB();
        // secondary market sell "NO"
        // mandatory Early Redemption "NO"
        cy.GenerateCurrentDateTimeStartDateFieldTB();
        cy.GenerateFutureDateTimeEndDateFieldTB();
        cy.get('#field_indicativeVolume').clear().type(indicativeVolume);
        cy.get('#field_minOrder').clear().type(minimurOrderTB1);
        // fees applied "NO"

        cy.get('#save-entity').click();
         //----------------GENERATING TREASURY BILLS GS-------------------



         //------------------PUBLISH GS-----------------------------------
        cy.ViewDetailsCreatedTreasuryBills(securityTreasuryBills, isinCodeTB1, nominalValue, currentPrice, indicativeVolume, minimurOrderTB1);
        cy.AdminPublishGS();
        //cy.get('[ng-reflect-jhi-translate="retailManagementApp.GsPlacemen"]').eq(1).should('have.value', "Announced"); // validating Status in the GS Details
        cy.contains("Announced");
         //------------------PUBLISH GS-----------------------------------



        //-------------------LOG IN AS Investor to validate that GS appeared--------------------------
        cy.setInvestorCredentials(investorIDNP, investorPassword);
        cy.InvestorLogin(investorBaseUrl);

        cy.contains("Purchase VMS").click(); // clicking on the ["Subscription Calendar"] button/drop-down
        cy.wait(500);
        cy.get('img[src="content/images/subscription-calendar/subscription-calendar.svg"]').click();
        cy.contains("Upcoming subscriptions").click();

        //---validating that GS is displayed in Upcoming Calendar
        const tableBody = cy.get('tbody');
        // Find the rows (td elements) containing the code
        const matchingCell = tableBody.find('td').contains(isinCodeTB1);
        //-------------------LOG IN AS Investor to validate that GS appeared--------------------------



        //---------Change GS status to "STARTED"------------------------------------
        cy.visit(adminBaseUrl);

        cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click(); // clicking on the Governments Securities drop-down
        cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.treasury"]').click();

        //---validating that GS is displayed in Upcoming Calendar
        const tableBody1 = cy.get('tbody');
        // Find the rows (td elements) containing the code
        const matchingCell1 = tableBody1.find('td').contains(isinCodeTB1);

         // Get the first matching row
         const matchingRow1 = matchingCell1.parent();

         // Click the edit button within the first matching row (assuming button class is 'edit-btn')
         cy.wait(1000);
         matchingRow1.find('[data-cy="entityDetailsButton"]').click();
         cy.AdminChangeStatusGSToStarted();
        //---------Change GS status to "STARTED"------------------------------------



        //------------LOG IN as INVESTOR so that we can buy a GS----------------------
        cy.visit(investorBaseUrl);
        cy.get('[jhitranslate="global.menu.subscriptionCalendar"]').eq(1).click(); // clicking on the "Subscription Calendar" button
        
        cy.InvestorBuyGSTreasuryBills(isinCodeTB1, indicativeVolume, currentPrice, nominalValue);
        cy.SelectRandomIncomeSourceWhenBuyingAGS(descriptionIncomeSourceField);

        cy.get('#field_volume').clear().type(minimurOrderTB1); // entering the quantity of activities we want to buy

        //extracting the sum when buying, to validate it when looking at the transaction details of a Placement
        let purchaseAmountWhenBuying;

        cy.get('dt:contains("Purchase Amount (MDL)")')
        .next('dd') // Move to the next sibling (dd element) containing the value
        .then(($purchaseAmountElement) => {
          // Extract the text content using text()
          const purchaseAmountText = $purchaseAmountElement.text().trim();
      
          // Extract the whole number part using regular expression
          const wholeNumberRegex = /^\d+/; // Matches one or more digits at the beginning
          const wholeNumber = purchaseAmountText.match(wholeNumberRegex)[0];
      
          // Assign the whole number to purchaseAmountWhenBuying
          purchaseAmountWhenBuying = wholeNumber;
      
          cy.log('Purchase amount (whole number):', purchaseAmountWhenBuying);

        });
          
        


        cy.get('[jhitranslate="entity.action.continue"]').click(); // clicking on the [Continue] button

        //clicking on the checkboxes Terms & Conditions
        cy.get('#first_check').click();
        // cy.get('#second_check').click();
        // cy.get('#third_check').click();
        // cy.get('#fouth_check').click();

        cy.get('[jhitranslate="entity.action.confirm"]').click(); // clicking on the [Confirm] button

        cy.contains('Confirm Purchase Operation');
        cy.get('[jhitranslate="purchaseOrder.modal.confirmText"]').should('exist').should('be.visible');

        cy.get('[data-cy="entityConfirmButton"]').click(); // clicking on the confirm button for confirming the purchase operation

        //--validating the text after investor confirmed his purchase
        cy.get('[jhitranslate="purchaseOrder.paymentDescription"]')
        .should('contain', 'This order can be paid through the MPay payment service using the associated order key:');

        cy.get('[jhitranslate="purchaseOrder.paymentExpired"]')
        .should('contain', 'After the expiration time, the order becomes automatically invalid and cannot be paid. To make the payment, a new purchase order must be generated.');

        // extracting the order key from the element
        let orderKey;

        cy.get('div.d-flex.justify-content-center.align-items-center.fw-bold') // Selecting the div element with specific classes
          .find('span') // Finding the span element within the selected div
          .invoke('text') // Invoking the 'text' method to get the text content
          .then((text) => {
            orderKey = text.trim(); // Assign the extracted data to the variable
          })


        //---------------Simulating Pay Placement as Admin--------------------------------
        cy.visit(adminBaseUrl);
        cy.contains('Administration').click(); // clicking on the [Administration] tab
        
        cy.get('[href="/admin/m-integrations"]').click(); // clicking on the [M-M Integrations] option
        cy.get('#ngb-nav-1').click(); // clicking on the [MPay] option

        cy.get('[name="idnp"]').eq(2).click().then(() => {
            cy.get('[name="idnp"]').eq(2).type(orderKey); // type the orderKey after clicking
        });

        cy.get('[jhitranslate="entity.action.search"]').click(); // clicking on the [Search] button
        cy.get('[jhitranslate="backendApp.order.orderSimulatePay"]').click(); // simulating the Pay action as Admin

        cy.contains("200"); // validating response status
        cy.contains("OK"); // validating response status text

        //---------------Simulating Pay Placement as Admin--------------------------------



        //---------------Change Placement Status to 'CLOSED'---------------------------------
        cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click(); // clicking on the Govermnets Securities drop-down
        cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.treasury"]').click(); // clicking on the {"Governments Securities"} option

           //---validating that GS is displayed in Upcoming Calendar
           const tableBody2 = cy.get('tbody');
           // Find the rows (td elements) containing the code
           const matchingCell2 = tableBody2.find('td').contains(isinCodeTB1);
            // Get the first matching row
            const matchingRow2 = matchingCell2.parent();
            // Click the edit button within the first matching row (assuming button class is 'edit-btn')
            cy.wait(1000);
            matchingRow2.find('[data-cy="entityDetailsButton"]').click();
            cy.AdminChangeStatusGSToClosed();
          //---------------Change Placement Status to 'CLOSED'---------------------------------



          //----------------------ADMIN Activate GS-----------------------------------------

            
          cy.then(() => {
            // Ensure purchaseAmountWhenBuying has been assigned before calling the function
            // This executes once the previous command queue has been cleared
            cy.AdminActivateGSAndDistributeInPortofolio(isinCodeTB1, purchaseAmountWhenBuying);
          });

            // validating that the Placement appeared in Investor's Portofolio
            cy.visit(investorBaseUrl);
            cy.get('[jhitranslate="global.menu.subscriptionCalendar"]').eq(1).click(); // clicking on the "Subscription Calendar" button
            cy.wait(500);
            cy.get('[alt="subscriptionCalendar.portfolio"]').click({force: true}); // clicking on the [Portofolio] TAB
            cy.wait(500);
            cy.get('[alt="subscriptionCalendar.portfolio"]').click();
            
            cy.wait(1000);
            //---validating that GS is displayed in Upcoming Calendar
           const tableBody3 = cy.get('tbody');
           // Find the rows (td elements) containing the code
           const matchingCell3 = tableBody3.find('td').contains(isinCodeTB1);
            // Get the first matching row
            const matchingRow3 = matchingCell3.parent();
            // Click the edit button within the first matching row (assuming button class is 'edit-btn')
            cy.wait(1000);
            matchingRow3.find('[jhitranslate="transactions.details"]').click(); // clicking on the Details button of transaction

            cy.wait(1000);

            //extracting the sum when looking on the transaction's details, to validate that the amount is the same
            let purchaseAmountDetailsPortofolio;
            // Extracting the sum when looking at transaction details
              // Find the dt element containing "Purchase Amount (MDL)" label
              cy.get('dt:contains("Purchase Amount (MDL)")')
              .next('dd') // Move to the next sibling (dd element) containing the value
              .then(($purchaseAmountElement) => {
                // Extract the text content using text()
                const purchaseAmountText = $purchaseAmountElement.text().trim();
            
                // Extract only the purchase amount by splitting the text by newline and taking the first part
                purchaseAmountDetailsPortofolio = purchaseAmountText.split('\n')[0].trim();
            
                cy.log('Purchase amount when Buying:', purchaseAmountWhenBuying);
                cy.log('Purchase amount details Portofolio:', purchaseAmountDetailsPortofolio);

            }).then(() => {
                //expect(purchaseAmountWhenBuying).to.equal(purchaseAmountDetailsPortofolio); // asserting the values when buying and the value in transaction's details Portofolio
            });
          //----------------------ADMIN Activate GS-----------------------------------------


          //------------------------CHANGE STATUS Placement TO CLOSED--------------------------------


            cy.visit(adminBaseUrl); 
            cy.contains("Government Securities").click()
            cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.treasury"]').click();

            // finding the isinCode created
            cy.wait(1000);
            //---validating that GS is displayed in Upcoming Calendar
           const tableBody4 = cy.get('tbody');
           // Find the rows (td elements) containing the code
           const matchingCell4 = tableBody4.find('td').contains(isinCodeTB1);
            // Get the first matching row
            const matchingRow4 = matchingCell4.parent();
            // Click the edit button within the first matching row (assuming button class is 'edit-btn')
            cy.wait(1000);
            matchingRow4.find('[data-cy="entityDetailsButton"]').click(); // clicking on the Details button of transaction

            //------------------------CHANGE STATUS Placement TO CLOSED--------------------------------



            //------------------------CHANGE STATUS GS TO BLOCKED--------------------------------
            cy.AdminChangeStatusGSToBlocked(); // changing staus of GS to "BLOCKED"
            // probably need validation
            //------------------------CHANGE STATUS GS TO CLOSED--------------------------------


            //--------------ADMIN CREATE SUBSCRIPTION REPORT-----------------------------------

            cy.AdminCreateSubscriptionReport();

            // extracting the Volumul la pretul de vanzare from report
            // let volumulLaPretulDeVanzare;
            // cy.get('tbody tr:nth-child(2) td:last-child').invoke('text').then((text) => {
            //     // Extract the text content from the last td element
            //     const valueText = text.trim();
            //     // Extract the whole part from the text
            //     const wholePart = valueText.split('.')[0];
            //     volumulLaPretulDeVanzare = wholePart;
            
            //     cy.log(`Purchase amount when Buying: ${purchaseAmountWhenBuying}`);
            //     cy.log(`Volumul la pretul de vanzare: ${wholePart}`);
            //     expect(volumulLaPretulDeVanzare).to.equal(purchaseAmountWhenBuying); // validating the Volume price
            //   });

             //--------------ADMIN CREATE SUBSCRIPTION REPORT-----------------------------------


               

            cy.get('[jhitranslate="entity.action.cancel"]').click(); // clicking on the [Cancel] button

            cy.wait(1000);

            
            //----------------------------ADMIN CREATE PURCHASE ORDER REPORT-------------------------------

            cy.AdminCreatePurchaseOrdersReport();
            
            cy.wait(2000);

//            // Validate the purchaseOrdersReport
//             cy.window().then((win) => {
//             // Get the URL of the newly opened tab
//             const newTabUrl = win.location.href;

//             // Visit the new tab if the URL matches the expected pattern
//             if (newTabUrl.startsWith('https://cabinet.retail.esempla.systems/')) {
//             cy.visit(newTabUrl).then(() => {
//             // Assertions on the new tab
//             cy.contains('div', /Raportul cu privire la plățile aferente ISIN MD1231243124/);


//             let sumaTotalaSprePlata;
//             cy.get('span').contains('Suma totală spre plată').parent().siblings().invoke('text').then((text) => {
//                 // Extract the text content from the sibling span element
//                 const valueText = text.trim();
//                 // Extract only the whole part of the value
//                 const wholePart = valueText.split('.')[0];
//                 sumaTotalaSprePlata = wholePart;

//                 cy.log(`Purchase amount when Buying: ${purchaseAmountWhenBuying}`);
//                 cy.log(`Suma totala spre plata: ${sumaTotalaSprePlata}`);

//                 expect(sumaTotalaSprePlata).to.equal(purchaseAmountWhenBuying); // validating the Volume price
//             });
//         });
//                 } else {
//                 // Handle if the URL doesn't match the expected pattern
//                 cy.log('Unexpected URL in the new tab:', newTabUrl);
//     }
// });

                        const amountPayoutReport = nominalValue * minimurOrderTB1;
                         cy.log('Amount payout maturity sum:', amountPayoutReport); 
                         cy.AdminGeneratePayoutMaturityReport(amountPayoutReport);
                            
              cy.wait(1000);

                cy.get('[jhitranslate="global.menu.admin.paymentManagement"]').click(); // clicking on the [Payment Management] option/button

                cy.get('[jhitranslate="global.menu.entities.payouts"]').click(); // clicking on the [MPay Payouts] option/button

                // finding the isinCode created
            cy.wait(1000);
            //---validating that GS is displayed in Upcoming Calendar
           const tableBody5 = cy.get('tbody');
           // Find the rows (td elements) containing the code
           const matchingCell5 = tableBody5.find('td').contains(isinCodeTB1);
            // Get the first matching row
            const matchingRow5 = matchingCell5.parent().parent();
            // Click the edit button within the first matching row (assuming button class is 'edit-btn')
            cy.wait(1000);
            matchingRow5.find('[data-cy="entityDetailsButton"]').click(); // clicking on the Details button of transaction

            cy.wait(2000);

            // validating the payout data
            cy.contains(isinCodeTB1);
            cy.contains(investorIDNP);
            cy.contains(amountPayoutReport);


            //----------------------PAY GENERATED PAYOUT REPORT----------------------------------------------------------

            cy.get('[jhitranslate="global.menu.entities.payouts"]').click(); // clicking on the ["MPay Payouts"] option/button

            cy.get('[jhitranslate="global.menu.actions"]').eq(0).click(); // clicking on the [Actions] option/button

            cy.get('[jhitranslate="retailManagementApp.mpayPayout.pay"]').click();

            cy.get('#field_isinCode').clear().type(isinCodeTB1);

            cy.get('[data-cy="entityConfirmButton"]').click(); // clicking on the [Confirm] button 

            cy.get('[jhitranslate="global.menu.admin.paymentManagement"]').click()

            //cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click(); // navigate to Government Securities TAB
            cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.treasury"]').click(); // clicking on the Government Bonds option
            
            cy.wait(1000);
            //---validating that GS is displayed in Upcoming Calendar
           const tableBody6 = cy.get('tbody');
           // Find the rows (td elements) containing the code
           const matchingCell6 = tableBody6.find('td').contains(isinCodeTB1);
            // Get the first matching row
            let matchingRow6 = matchingCell6.parent();
            // Click the edit button within the first matching row (assuming button class is 'edit-btn')
            //cy.wait(1000);
            matchingRow6.contains("Redeemed"); // clicking on the Details button of transaction

            cy.wait(1000);

            matchingRow6 = matchingCell6.parent().parent();
            matchingRow6.find('[data-cy="entityDetailsButton"]').click();
            
            cy.contains("Redeemed");
            cy.contains(isinCodeTB1);
            //cy.contains(investorIDNP);

            cy.get('.nav-link').eq(6).click(); // clicking on the ["Transactions"] option/button

            cy.wait(1000);
            //---validating that GS is displayed in Upcoming Calendar
           const tableBody7 = cy.get('.card');
           // Find the rows (td elements) containing the code
           const matchingCell7 = tableBody7.find('td').contains(isinCodeTB1);
           cy.contains("Maturity");
           //cy.contains(amountPayoutReport);
            // Get the first matching row
            const matchingRow7 = matchingCell7.parent().parent();
            // Click the edit button within the first matching row (assuming button class is 'edit-btn')
            cy.wait(1000);
            matchingRow7.find('[jhitranslate="transactions.details"]').click(); // clicking on the Details button of transaction

            cy.get('.card-body').contains(isinCodeTB1); // Targets the element containing 'ISIN Code' within .card-body
            cy.get('.card-body').contains(nominalValue); // Targets the element containing 'Nominal Value (MDL)' within .card-body
            //cy.get('.card-body').contains(amountPayoutReport); // Targets the element containing 'Purchase Volume (units)' within .card-body
            cy.get('.card-body').contains(minimurOrderTB1);
           


                
})
//---------------------------------TREASURY BILLS-------------------------------------------------------------------------



//aici mam oprit la refactor


      //-------------------------------GOVERNMENTS BONDS------------------------------------------------------------------------
      // the maturity date will be generated from the beginining with 1 day before transaction so that we can create maturity report

      it('GS2 Volume Total Testing - Government Bonds', () => {


        //----------------GENERATING Government Bonds GS-------------------------------------------
        cy.AdminSimpleLogin(adminBaseUrl, adminUserName, adminPassword);

         //Change language to EN
       cy.get('#languagesnavBarDropdown').click();
       //cy.get('[ng-reflect-jhi-active-menu="en"]').click();
       cy.contains('a', 'English').click();

        cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click(); // clicking on the "Government Securities"  option
        cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.bonds"]').click();
        cy.get('#jh-create-entity').click(); // clicking on the [Add new] button

            // enter data in the fields
        cy.get('#field_securitiesName').select('Government Bonds');
        cy.get('#field_isinCode').type(isinCodeGB);
        cy.SelectRandomCirculationTermGovernmentBonds();
        //cy.get('.ng-input').type(circulationTerm);
        cy.get('#field_nominalValue').type(nominalValue);
        //cy.get('#field_currentPrice').type(currentPrice);
        cy.get('#field_currency').select("MDL");
        //cy.SelectRandomCurrency()
        cy.GenerateCurrentDateTimeIssueDateField();
        cy.get('#field_couponRate').type(couponRate, {force: true}); // se introduce singur sau introducem noi 
        cy.GenerateDateTimeCouponPaymentDates(); // ce data de introdus ?!!!
        // secondary market sell "NO"
        // mandatory Early Redemption "NO"
        cy.GenerateCurrentDateTimeStartDateFieldGB();
        cy.GenerateFutureDateTimeEndDateFieldGB();
        cy.get('#field_indicativeVolume').type(indicativeVolume);
        cy.get('#field_minOrder').clear().type(minimumOrderGB);
        // fees applied "NO"

        cy.get('#save-entity').click();
         //----------------GENERATING Government Bonds GS-------------------




         //------------------PUBLISH GS-----------------------------------
         cy.ViewDetailsCreatedGovernmentBonds(securityGovernmentBonds, isinCodeGB, nominalValue, indicativeVolume, minimumOrderGB);
         cy.AdminPublishGS();
         //cy.get('[ng-reflect-jhi-translate="retailManagementApp.GsPlacemen"]').eq(1).should('have.value', "Announced"); // validating Status in the GS Details
         cy.contains("Announced");
          //------------------PUBLISH GS-----------------------------------
 
 
 
         //-------------------LOG IN AS Investor to validate that GS appeared--------------------------
         cy.setInvestorCredentials(investorIDNP, investorPassword);
         cy.InvestorLogin(investorBaseUrl);
 
         cy.contains("Purchase VMS").click(); // clicking on the ["Purchase VMS"] from the header
         cy.wait(500);
         cy.get('[alt="subscriptionCalendar.title"]').click(); // clicking on the Purchase VMS drop-down
         cy.wait(500);
         cy.contains("Upcoming subscriptions").click(); // clicking on the upcoming calendar
 
         //---validating that GS is displayed in Upcoming Calendar
         const tableBody = cy.get('tbody');
         // Find the rows (td elements) containing the code
         const matchingCell = tableBody.find('td').contains(isinCodeGB);
         //-------------------LOG IN AS Investor to validate that GS appeared--------------------------
 
 
 
         //---------Change GS status to "STARTED"------------------------------------
         cy.visit(adminBaseUrl);
 
         cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click();
         cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.bonds"]').click();  
 
         //---validating that GS is displayed in Upcoming Calendar
         const tableBody1 = cy.get('tbody');
         // Find the rows (td elements) containing the code
         const matchingCell1 = tableBody1.find('td').contains(isinCodeGB);
 
          // Get the first matching row
          const matchingRow1 = matchingCell1.parent();
 
          // Click the edit button within the first matching row (assuming button class is 'edit-btn')
          cy.wait(1000);
          matchingRow1.find('[data-cy="entityDetailsButton"]').click();
          cy.AdminChangeStatusGSToStarted();
         //---------Change GS status to "STARTED"------------------------------------
 
 
 
         //------------LOG IN as INVESTOR so that we can buy a GS----------------------
         cy.visit(investorBaseUrl);
         cy.get('[jhitranslate="global.menu.subscriptionCalendar"]').eq(1).click(); // clicking on the "Subscription Calendar" button
         
         cy.InvestorBuyGSGovernmentBonds(isinCodeGB, couponRate, indicativeVolume, nominalValue);
         cy.SelectRandomIncomeSourceWhenBuyingAGS(descriptionIncomeSourceField);
 
         cy.get('#field_volume').clear().type(minimumOrderGB); // entering the quantity of activities we want to buy
 
         //extracting the sum when buying, to validate it when looking at the transaction details of a Placement
         let purchaseAmountWhenBuying;
 
         cy.get('dt:contains("Purchase Amount (MDL)")')
         .next('dd') // Move to the next sibling (dd element) containing the value
         .then(($purchaseAmountElement) => {
           // Extract the text content using text()
           const purchaseAmountText = $purchaseAmountElement.text().trim();
       
           // Extract the whole number part using regular expression
           const wholeNumberRegex = /^\d+/; // Matches one or more digits at the beginning
           const wholeNumber = purchaseAmountText.match(wholeNumberRegex)[0];
       
           // Assign the whole number to purchaseAmountWhenBuying
           purchaseAmountWhenBuying = wholeNumber;
       
           cy.log('Purchase amount (whole number):', purchaseAmountWhenBuying);
         });
           
         
 
 
         cy.get('[jhitranslate="entity.action.continue"]').click(); // clicking on the [Continue] button
 
         //clicking on the checkboxes Terms & Conditions
         cy.get('#first_check').click();
        //  cy.get('#second_check').click();
        //  cy.get('#third_check').click();
        //  cy.get('#fouth_check').click();
 
         cy.get('[jhitranslate="entity.action.confirm"]').click(); // clicking on the [Confirm] button
 
         cy.contains('Confirm Purchase Operation');
         cy.get('[jhitranslate="purchaseOrder.modal.confirmText"]').should('exist').should('be.visible');
 
         cy.get('[data-cy="entityConfirmButton"]').click(); // clicking on the confirm button for confirming the purchase operation
 
         //--validating the text after investor confirmed his purchase
         cy.get('[jhitranslate="purchaseOrder.paymentDescription"]')
         .should('contain', 'This order can be paid through the MPay payment service using the associated order key:');
 
         cy.get('[jhitranslate="purchaseOrder.paymentExpired"]')
         .should('contain', 'After the expiration time, the order becomes automatically invalid and cannot be paid. To make the payment, a new purchase order must be generated.');
 
         // extracting the order key from the element
         let orderKey;
 
         cy.get('div.d-flex.justify-content-center.align-items-center.fw-bold') // Selecting the div element with specific classes
           .find('span') // Finding the span element within the selected div
           .invoke('text') // Invoking the 'text' method to get the text content
           .then((text) => {
             orderKey = text.trim(); // Assign the extracted data to the variable
           })
 
 
         //---------------Simulating Pay Placement as Admin--------------------------------
         cy.visit(adminBaseUrl);
         cy.contains('Administration').click(); // clicking on the [Administration] tab
         
         cy.get('[href="/admin/m-integrations"]').click(); // clicking on the [M-M Integrations] option
         cy.get('#ngb-nav-1').click(); // clicking on the [MPay] option
 
         cy.get('[name="idnp"]').eq(2).click().then(() => {
             cy.get('[name="idnp"]').eq(2).type(orderKey); // type the orderKey after clicking
         });
 
         cy.get('[jhitranslate="entity.action.search"]').click(); // clicking on the [Search] button
         cy.get('[jhitranslate="backendApp.order.orderSimulatePay"]').click(); // simulating the Pay action as Admin
 
         cy.contains("200"); // validating response status
         cy.contains("OK"); // validating response status text
 
         //---------------Simulating Pay Placement as Admin--------------------------------
 
 
 
         //---------------Change Placement Status to 'CLOSED'---------------------------------
         cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click(); // clicking on the {"Governments Securities"} option
         cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.bonds"]').click();
 
            //---validating that GS is displayed in Upcoming Calendar
            const tableBody2 = cy.get('tbody');
            // Find the rows (td elements) containing the code
            const matchingCell2 = tableBody2.find('td').contains(isinCodeGB);
             // Get the first matching row
             const matchingRow2 = matchingCell2.parent();
             // Click the edit button within the first matching row (assuming button class is 'edit-btn')
             cy.wait(1000);
             matchingRow2.find('[data-cy="entityDetailsButton"]').click();
             cy.AdminChangeStatusGSToClosed();
           //---------------Change Placement Status to 'CLOSED'---------------------------------
 
 
 
           //----------------------ADMIN Activate GS-----------------------------------------
 
             
          cy.then(() => {
            // Ensure purchaseAmountWhenBuying has been assigned before calling the function
            // This executes once the previous command queue has been cleared
            cy.AdminActivateGSAndDistributeInPortofolio(isinCodeGB, purchaseAmountWhenBuying);
          });
 
             // validating that the Placement appeared in Investor's Portofolio
             cy.visit(investorBaseUrl);
             cy.get('[jhitranslate="global.menu.subscriptionCalendar"]').eq(1).click(); // clicking on the "Subscription Calendar" button
             cy.get('[alt="subscriptionCalendar.portfolio"]').click({force: true}); // clicking on the [Portofolio] TAB
             cy.wait(500);
             cy.get('[alt="subscriptionCalendar.portfolio"]').click({force: true}); // clicking on the [Portofolio] TAB
             
             cy.wait(1000);
             //---validating that GS is displayed in Upcoming Calendar
            const tableBody3 = cy.get('tbody');
            // Find the rows (td elements) containing the code
            const matchingCell3 = tableBody3.find('td').contains(isinCodeGB);
             // Get the first matching row
             const matchingRow3 = matchingCell3.parent();
             // Click the edit button within the first matching row (assuming button class is 'edit-btn')
             cy.wait(1000);
             matchingRow3.find('[jhitranslate="transactions.details"]').click(); // clicking on the Details button of transaction
 
             cy.wait(1000);
 
             //extracting the sum when looking on the transaction's details, to validate that the amount is the same
             let purchaseAmountDetailsPortofolio;
             // Extracting the sum when looking at transaction details
               // Find the dt element containing "Purchase Amount (MDL)" label
               cy.get('dt:contains("Purchase Amount (MDL)")')
               .next('dd') // Move to the next sibling (dd element) containing the value
               .then(($purchaseAmountElement) => {
                 // Extract the text content using text()
                 const purchaseAmountText = $purchaseAmountElement.text().trim();
             
                 // Extract only the purchase amount by splitting the text by newline and taking the first part
                 purchaseAmountDetailsPortofolio = purchaseAmountText.split('\n')[0].trim();
             
                 cy.log('Purchase amount when Buying:', purchaseAmountWhenBuying);
                 cy.log('Purchase amount details Portofolio:', purchaseAmountDetailsPortofolio);
 
             }).then(() => {
                 //expect(purchaseAmountWhenBuying).to.equal(purchaseAmountDetailsPortofolio); // asserting the values when buying and the value in transaction's details Portofolio
             });
           //----------------------ADMIN Activate GS-----------------------------------------
 
 
           //------------------------CHANGE STATUS Placement TO CLOSED--------------------------------
 
 
             cy.visit(adminBaseUrl); 
             cy.contains("Government Securities").click()
             cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.bonds"]').click();
 
             // finding the isinCode created
             cy.wait(1000);
             //---validating that GS is displayed in Upcoming Calendar
            const tableBody4 = cy.get('tbody');
            // Find the rows (td elements) containing the code
            const matchingCell4 = tableBody4.find('td').contains(isinCodeGB);
             // Get the first matching row
             const matchingRow4 = matchingCell4.parent();
             // Click the edit button within the first matching row (assuming button class is 'edit-btn')
             cy.wait(1000);
             matchingRow4.find('[data-cy="entityDetailsButton"]').click(); // clicking on the Details button of transaction
 
             //------------------------CHANGE STATUS Placement TO CLOSED--------------------------------
 
 
 
             //------------------------CHANGE STATUS GS TO BLOCKED--------------------------------
             cy.AdminChangeStatusGSToBlocked(); // changing staus of GS to "BLOCKED"
             // probably need validation
             //------------------------CHANGE STATUS GS TO CLOSED--------------------------------
 
 
             //--------------ADMIN CREATE SUBSCRIPTION REPORT-----------------------------------
 
             cy.AdminCreateSubscriptionReport();
 
             // extracting the Volumul la pretul de vanzare from report
             let volumulLaPretulDeVanzare;
             cy.get('tbody tr:nth-child(2) td:last-child').invoke('text').then((text) => {
                 // Extract the text content from the last td element
                 const valueText = text.trim();
                 // Extract the whole part from the text
                 const wholePart = valueText.split('.')[0];
                 volumulLaPretulDeVanzare = wholePart;
             
                 cy.log(`Purchase amount when Buying: ${purchaseAmountWhenBuying}`);
                 cy.log(`Volumul la pretul de vanzare: ${wholePart}`);
                 //expect(volumulLaPretulDeVanzare).to.equal(purchaseAmountWhenBuying); // validating the Volume price
               });
 
              //--------------ADMIN CREATE SUBSCRIPTION REPORT-----------------------------------
 
 
                
 
             cy.get('[jhitranslate="entity.action.cancel"]').click(); // clicking on the [Cancel] button
 
             cy.wait(1000);
 
             
             //----------------------------ADMIN CREATE PURCHASE ORDER REPORT-------------------------------
 
             cy.AdminCreatePurchaseOrdersReport();
             
             cy.wait(2000);
 
 //            // Validate the purchaseOrdersReport
 //             cy.window().then((win) => {
 //             // Get the URL of the newly opened tab
 //             const newTabUrl = win.location.href;
 
 //             // Visit the new tab if the URL matches the expected pattern
 //             if (newTabUrl.startsWith('https://cabinet.retail.esempla.systems/')) {
 //             cy.visit(newTabUrl).then(() => {
 //             // Assertions on the new tab
 //             //cy.contains('div', /Raportul cu privire la plățile aferente ISIN MD1231243124/);
 
 
 //             let sumaTotalaSprePlata;
 //             cy.get('span').contains('Suma totală spre plată').parent().siblings().invoke('text').then((text) => {
 //                 // Extract the text content from the sibling span element
 //                 const valueText = text.trim();
 //                 // Extract only the whole part of the value
 //                 const wholePart = valueText.split('.')[0];
 //                 sumaTotalaSprePlata = wholePart;
 
 //                 cy.log(`Purchase amount when Buying: ${purchaseAmountWhenBuying}`);
 //                 cy.log(`Suma totala spre plata: ${sumaTotalaSprePlata}`);
 
 //                 expect(sumaTotalaSprePlata).to.equal(purchaseAmountWhenBuying); // validating the Volume price
 //             });
 //         });
 //                 } else {
 //                 // Handle if the URL doesn't match the expected pattern
 //                 cy.log('Unexpected URL in the new tab:', newTabUrl);
 //     }
 // });
 
                 //----------------------------ADMIN CREATE PURCHASE ORDER REPORT-------------------------------
 
                 cy.wait(4000);
});
         
     
      it.only('Admin should be able to generate PayOut report - Government Bonds', () => {
     
     
             //----------------GENERATING Government Bonds GS-------------------------------------------
              cy.AdminSimpleLogin(adminBaseUrl, adminUserName, adminPassword);

              //Change language to EN
              cy.get('#languagesnavBarDropdown').click();
              //cy.get('[ng-reflect-jhi-active-menu="en"]').click();
              cy.contains('a', 'English').click();
     
             cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click(); // clicking on the "Government Securities"  option
             cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.bonds"]').click();
             cy.get('#jh-create-entity').click(); // clicking on the [Add new] button
     
                 // enter data in the fields
             cy.get('#field_securitiesName').select('Government Bonds');
             cy.get('#field_isinCode').type(isinCodeGB1);
             cy.SelectRandomCirculationTermGovernmentBonds();
             //cy.get('.ng-input').type(circulationTerm);
             cy.get('#field_nominalValue').type(nominalValue);
             //cy.get('#field_currentPrice').type(currentPrice);
             cy.get('#field_currency').select("MDL");
             //cy.SelectRandomCurrency()
             cy.GenerateCurrentDateTimeIssueDateField();
             cy.GenerateNextDayDateTimeMaturityDateFieldGB();
             cy.get('#field_couponRate').type(couponRate, {force: true}); // se introduce singur sau introducem noi 
             cy.GenerateNextDayDateTimeCouponPaymentDates(); // ce data de introdus ?!!!
             // secondary market sell "NO"
             // mandatory Early Redemption "NO"
             cy.GenerateCurrentDateTimeStartDateFieldGB();
             cy.GenerateFutureDateTimeEndDateFieldGB();
             cy.get('#field_indicativeVolume').type(indicativeVolume);
             cy.get('#field_minOrder').clear().type(minimumOrderGB1);
             // fees applied "NO"
     
             cy.get('#save-entity').click();
              //----------------GENERATING Government Bonds GS-------------------
     
     
     
     
     
     
             //------------------PUBLISH GS-----------------------------------
             cy.ViewDetailsCreatedGovernmentBonds(securityGovernmentBonds, isinCodeGB1, nominalValue, indicativeVolume, minimumOrderGB1);
             cy.AdminPublishGS();
             //cy.get('[ng-reflect-jhi-translate="retailManagementApp.GsPlacemen"]').eq(1).should('have.value', "Announced"); // validating Status in the GS Details
             cy.contains("Announced");
              //------------------PUBLISH GS-----------------------------------
     
     
     
             //-------------------LOG IN AS Investor to validate that GS appeared--------------------------
             cy.setInvestorCredentials(investorIDNP, investorPassword);
             cy.InvestorLogin(investorBaseUrl);
     
             cy.contains("Purchase VMS").click(); // clicking on the ["Subscription Calendar"] button/drop-down
             cy.get('[alt="subscriptionCalendar.title"]').click();
             cy.contains('Upcoming subscriptions').click(); // clicking on the upcoming calendar
             cy.wait(500);
             cy.contains('Upcoming subscriptions').click(); // clicking on the upcoming calendar
     
             //---validating that GS is displayed in Upcoming Calendar
             const tableBody = cy.get('tbody');
             // Find the rows (td elements) containing the code
             const matchingCell = tableBody.find('td').contains(isinCodeGB1);
             //-------------------LOG IN AS Investor to validate that GS appeared--------------------------
     
     
     
             //---------Change GS status to "STARTED"------------------------------------
             cy.visit(adminBaseUrl);
     
             cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click();
             cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.bonds"]').click();
     
             //---validating that GS is displayed in Upcoming Calendar
             const tableBody1 = cy.get('tbody');
             // Find the rows (td elements) containing the code
             const matchingCell1 = tableBody1.find('td').contains(isinCodeGB1);
     
              // Get the first matching row
              const matchingRow1 = matchingCell1.parent();
     
              // Click the edit button within the first matching row (assuming button class is 'edit-btn')
              cy.wait(1000);
              matchingRow1.find('[data-cy="entityDetailsButton"]').click();
              cy.AdminChangeStatusGSToStarted();
             //---------Change GS status to "STARTED"------------------------------------
     
     
     
             //------------LOG IN as INVESTOR so that we can buy a GS----------------------
             cy.visit(investorBaseUrl);
             cy.get('[jhitranslate="global.menu.subscriptionCalendar"]').eq(1).click(); // clicking on the "Subscription Calendar" button
             
             cy.InvestorBuyGSGovernmentBonds(isinCodeGB1, couponRate, indicativeVolume, nominalValue);
             cy.SelectRandomIncomeSourceWhenBuyingAGS(descriptionIncomeSourceField);
     
             cy.get('#field_volume').clear().type(minimumOrderGB1); // entering the quantity of activities we want to buy
     
             //extracting the sum when buying, to validate it when looking at the transaction details of a Placement
             let purchaseAmountWhenBuying;
     
             cy.get('dt:contains("Purchase Amount (MDL)")')
             .next('dd') // Move to the next sibling (dd element) containing the value
             .then(($purchaseAmountElement) => {
               // Extract the text content using text()
               const purchaseAmountText = $purchaseAmountElement.text().trim();
           
               // Extract the whole number part using regular expression
               const wholeNumberRegex = /^\d+/; // Matches one or more digits at the beginning
               const wholeNumber = purchaseAmountText.match(wholeNumberRegex)[0];
           
               // Assign the whole number to purchaseAmountWhenBuying
               purchaseAmountWhenBuying = wholeNumber;
           
               cy.log('Purchase amount (whole number):', purchaseAmountWhenBuying);
     
             });
               
             
     
     
             cy.get('[jhitranslate="entity.action.continue"]').click(); // clicking on the [Continue] button
     
             //clicking on the checkboxes Terms & Conditions
             cy.get('#first_check').click();
            //  cy.get('#second_check').click();
            //  cy.get('#third_check').click();
            //  cy.get('#fouth_check').click();
     
             cy.get('[jhitranslate="entity.action.confirm"]').click(); // clicking on the [Confirm] button
     
             cy.contains('Confirm Purchase Operation');
             cy.get('[jhitranslate="purchaseOrder.modal.confirmText"]').should('exist').should('be.visible');
     
             cy.get('[data-cy="entityConfirmButton"]').click(); // clicking on the confirm button for confirming the purchase operation
     
             //--validating the text after investor confirmed his purchase
             cy.get('[jhitranslate="purchaseOrder.paymentDescription"]')
             .should('contain', 'This order can be paid through the MPay payment service using the associated order key:');
     
             cy.get('[jhitranslate="purchaseOrder.paymentExpired"]')
             .should('contain', 'After the expiration time, the order becomes automatically invalid and cannot be paid. To make the payment, a new purchase order must be generated.');
     
             // extracting the order key from the element
             let orderKey;
     
             cy.get('div.d-flex.justify-content-center.align-items-center.fw-bold') // Selecting the div element with specific classes
               .find('span') // Finding the span element within the selected div
               .invoke('text') // Invoking the 'text' method to get the text content
               .then((text) => {
                 orderKey = text.trim(); // Assign the extracted data to the variable
               })
     
     
             //---------------Simulating Pay Placement as Admin--------------------------------
             cy.visit(adminBaseUrl);
             cy.contains('Administration').click(); // clicking on the [Administration] tab
             
             cy.get('[href="/admin/m-integrations"]').click(); // clicking on the [M-M Integrations] option
             cy.get('#ngb-nav-1').click(); // clicking on the [MPay] option
     
             cy.get('[name="idnp"]').eq(2).click().then(() => {
                 cy.get('[name="idnp"]').eq(2).type(orderKey); // type the orderKey after clicking
             });
     
             cy.get('[jhitranslate="entity.action.search"]').click(); // clicking on the [Search] button
             cy.get('[jhitranslate="backendApp.order.orderSimulatePay"]').click(); // simulating the Pay action as Admin
     
             cy.contains("200"); // validating response status
             cy.contains("OK"); // validating response status text
     
             //---------------Simulating Pay Placement as Admin--------------------------------
     
     
     
             //---------------Change Placement Status to 'CLOSED'---------------------------------
             cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click(); // clicking on the {"Governments Securities"} option
             cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.bonds"]').click();
     
                //---validating that GS is displayed in Upcoming Calendar
                const tableBody2 = cy.get('tbody');
                // Find the rows (td elements) containing the code
                const matchingCell2 = tableBody2.find('td').contains(isinCodeGB1);
                 // Get the first matching row
                 const matchingRow2 = matchingCell2.parent();
                 // Click the edit button within the first matching row (assuming button class is 'edit-btn')
                 cy.wait(1000);
                 matchingRow2.find('[data-cy="entityDetailsButton"]').click();
                 cy.AdminChangeStatusGSToClosed();
               //---------------Change Placement Status to 'CLOSED'---------------------------------
     
     
     
               //----------------------ADMIN Activate GS-----------------------------------------
     
                 
                cy.then(() => {
                // Ensure purchaseAmountWhenBuying has been assigned before calling the function
                // This executes once the previous command queue has been cleared
                cy.AdminActivateGSAndDistributeInPortofolio(isinCodeGB1, purchaseAmountWhenBuying);
                });
     
                 // validating that the Placement appeared in Investor's Portofolio
                 cy.visit(investorBaseUrl);
                 cy.get('[jhitranslate="global.menu.subscriptionCalendar"]').eq(1).click(); // clicking on the "Subscription Calendar" button
                 cy.get('[alt="subscriptionCalendar.portfolio"]').click({force: true}); // clicking on the [Portofolio] TAB
                 cy.wait(500);
                 cy.get('[alt="subscriptionCalendar.portfolio"]').click({force: true}); // clicking on the [Portofolio] TAB
                 
                 cy.wait(1000);
                 //---validating that GS is displayed in Upcoming Calendar
                const tableBody3 = cy.get('tbody');
                // Find the rows (td elements) containing the code
                const matchingCell3 = tableBody3.find('td').contains(isinCodeGB1);
                 // Get the first matching row
                 const matchingRow3 = matchingCell3.parent();
                 // Click the edit button within the first matching row (assuming button class is 'edit-btn')
                 cy.wait(1000);
                 matchingRow3.find('[jhitranslate="transactions.details"]').click(); // clicking on the Details button of transaction
     
                 cy.wait(1000);
     
                 //extracting the sum when looking on the transaction's details, to validate that the amount is the same
                 let purchaseAmountDetailsPortofolio;
                 // Extracting the sum when looking at transaction details
                   // Find the dt element containing "Purchase Amount (MDL)" label
                   cy.get('dt:contains("Purchase Amount (MDL)")')
                   .next('dd') // Move to the next sibling (dd element) containing the value
                   .then(($purchaseAmountElement) => {
                     // Extract the text content using text()
                     const purchaseAmountText = $purchaseAmountElement.text().trim();
                 
                     // Extract only the purchase amount by splitting the text by newline and taking the first part
                     purchaseAmountDetailsPortofolio = purchaseAmountText.split('\n')[0].trim();
                 
                     cy.log('Purchase amount when Buying:', purchaseAmountWhenBuying);
                     cy.log('Purchase amount details Portofolio:', purchaseAmountDetailsPortofolio);
     
                 }).then(() => {
                     //expect(purchaseAmountWhenBuying).to.equal(purchaseAmountDetailsPortofolio); // asserting the values when buying and the value in transaction's details Portofolio
                 });
               //----------------------ADMIN Activate GS-----------------------------------------
     
     
               //------------------------CHANGE STATUS Placement TO CLOSED--------------------------------
     
     
                 cy.visit(adminBaseUrl); 
                 cy.contains("Government Securities").click()
                 cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.bonds"]').click(); // clicking on the Government Bonds option
     
                 // finding the isinCode created
                 cy.wait(1000);
                 //---validating that GS is displayed in Upcoming Calendar
                const tableBody4 = cy.get('tbody');
                // Find the rows (td elements) containing the code
                const matchingCell4 = tableBody4.find('td').contains(isinCodeGB1);
                 // Get the first matching row
                 const matchingRow4 = matchingCell4.parent();
                 // Click the edit button within the first matching row (assuming button class is 'edit-btn')
                 cy.wait(1000);
                 matchingRow4.find('[data-cy="entityDetailsButton"]').click(); // clicking on the Details button of transaction
     
                 //------------------------CHANGE STATUS Placement TO CLOSED--------------------------------
     
     
     
                 //------------------------CHANGE STATUS GS TO BLOCKED--------------------------------
                 cy.AdminChangeStatusGSToBlocked(); // changing staus of GS to "BLOCKED"
                 // probably need validation
                 //------------------------CHANGE STATUS GS TO CLOSED--------------------------------
     
     
                 //--------------ADMIN CREATE SUBSCRIPTION REPORT-----------------------------------
     
                 cy.AdminCreateSubscriptionReport();
     
                 // extracting the Volumul la pretul de vanzare from report
                 // let volumulLaPretulDeVanzare;
                 // cy.get('tbody tr:nth-child(2) td:last-child').invoke('text').then((text) => {
                 //     // Extract the text content from the last td element
                 //     const valueText = text.trim();
                 //     // Extract the whole part from the text
                 //     const wholePart = valueText.split('.')[0];
                 //     volumulLaPretulDeVanzare = wholePart;
                 
                 //     cy.log(`Purchase amount when Buying: ${purchaseAmountWhenBuying}`);
                 //     cy.log(`Volumul la pretul de vanzare: ${wholePart}`);
                 //     expect(volumulLaPretulDeVanzare).to.equal(purchaseAmountWhenBuying); // validating the Volume price
                 //   });
     
                  //--------------ADMIN CREATE SUBSCRIPTION REPORT-----------------------------------
     
     
                    
     
                 cy.get('[jhitranslate="entity.action.cancel"]').click(); // clicking on the [Cancel] button
     
                 cy.wait(1000);
     
                 
                 //----------------------------ADMIN CREATE PURCHASE ORDER REPORT-------------------------------
     
                 cy.AdminCreatePurchaseOrdersReport();
                 
                 cy.wait(2000);
     
     //            // Validate the purchaseOrdersReport
     //             cy.window().then((win) => {
     //             // Get the URL of the newly opened tab
     //             const newTabUrl = win.location.href;
     
     //             // Visit the new tab if the URL matches the expected pattern
     //             if (newTabUrl.startsWith('https://cabinet.retail.esempla.systems/')) {
     //             cy.visit(newTabUrl).then(() => {
     //             // Assertions on the new tab
     //             cy.contains('div', /Raportul cu privire la plățile aferente ISIN MD1231243124/);
     
     
     //             let sumaTotalaSprePlata;
     //             cy.get('span').contains('Suma totală spre plată').parent().siblings().invoke('text').then((text) => {
     //                 // Extract the text content from the sibling span element
     //                 const valueText = text.trim();
     //                 // Extract only the whole part of the value
     //                 const wholePart = valueText.split('.')[0];
     //                 sumaTotalaSprePlata = wholePart;
     
     //                 cy.log(`Purchase amount when Buying: ${purchaseAmountWhenBuying}`);
     //                 cy.log(`Suma totala spre plata: ${sumaTotalaSprePlata}`);
     
     //                 expect(sumaTotalaSprePlata).to.equal(purchaseAmountWhenBuying); // validating the Volume price
     //             });
     //         });
     //                 } else {
     //                 // Handle if the URL doesn't match the expected pattern
     //                 cy.log('Unexpected URL in the new tab:', newTabUrl);
     //     }
     // });
     
     
     
     
                    const amountPayoutReport = nominalValue * minimumOrderGB1;
                    cy.log('Amount payout maturity sum:', amountPayoutReport); 

                    cy.AdminGeneratePayoutMaturityReport(amountPayoutReport); // generating PayOut Report
                                 
                   
     
                     cy.get('[jhitranslate="global.menu.admin.paymentManagement"]').click(); // clicking on the [Payment Management] option/button
     
                     cy.get('[jhitranslate="global.menu.entities.payouts"]').click(); // clicking on the [MPay Payouts] option/button
     
                     // finding the isinCode created
                 cy.wait(1000);
                 //---validating that GS is displayed in Upcoming Calendar
                const tableBody5 = cy.get('tbody');
                // Find the rows (td elements) containing the code
                const matchingCell5 = tableBody5.find('td').contains(isinCodeGB1);
                 // Get the first matching row
                 const matchingRow5 = matchingCell5.parent().parent();
                 // Click the edit button within the first matching row (assuming button class is 'edit-btn')
                 cy.wait(1000);
                 matchingRow5.find('[data-cy="entityDetailsButton"]').click(); // clicking on the Details button of transaction
     
                 cy.wait(2000);
     
                 // validating the payout data
                 cy.contains(isinCodeGB1);
                 cy.contains(investorIDNP);
                 cy.contains(amountPayoutReport);
     
     
                 //----------------------PAY GENERATED PAYOUT REPORT----------------------------------------------------------
     
                 cy.get('[jhitranslate="global.menu.entities.payouts"]').click(); // clicking on the ["MPay Payouts"] option/button
     
                 cy.get('[jhitranslate="global.menu.actions"]').eq(0).click(); // clicking on the [Actions] option/button
     
                 cy.get('[jhitranslate="retailManagementApp.mpayPayout.pay"]').click(); // clicking on the ["Pay test"] option/button
     
                 cy.get('#field_isinCode').clear().type(isinCodeGB1); // entering isinCode to pay the transaction
     
                 cy.get('[data-cy="entityConfirmButton"]').click(); // clicking on the [Confirm] button 


                 //cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click(); // navigate to Government Securities TAB
                 cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.bonds"]').click(); // clicking on the Government Bonds option
     
                 
                 cy.wait(1000);
                 //---validating that GS is displayed in Upcoming Calendar
                const tableBody6 = cy.get('tbody');
                // Find the rows (td elements) containing the code
                const matchingCell6 = tableBody6.find('td').contains(isinCodeGB1);
                 // Get the first matching row
                 let matchingRow6 = matchingCell6.parent();
                 // Click the edit button within the first matching row (assuming button class is 'edit-btn')
                 cy.wait(1000);
                 matchingRow6.contains("Redeemed");
     
                 cy.wait(1000);
     
                 matchingRow6 = matchingCell6.parent().parent();
                 matchingRow6.find('[data-cy="entityDetailsButton"]').click(); // clicking on the Details button of transaction

                 cy.wait(700);
                 
                 cy.contains(isinCodeGB1);
                 cy.contains("Redeemed");
                 //cy.contains(investorIDNP);
     
                 cy.get('.nav-link').eq(6).click(); // clicking on the ["Transactions"] option/button
     
                 cy.wait(1000);
                 //---validating that GS is displayed in Upcoming Calendar
                const tableBody7 = cy.get('.card');
                // Find the rows (td elements) containing the code
                const matchingCell7 = tableBody7.find('td').contains(isinCodeGB1);
                cy.contains("Maturity");
                //cy.contains(amountPayoutReport);
                 // Get the first matching row
                 const matchingRow7 = matchingCell7.parent().parent();
                 // Click the edit button within the first matching row (assuming button class is 'edit-btn')
                 cy.wait(1000);
                 matchingRow7.find('[jhitranslate="transactions.details"]').click(); // clicking on the Details button of transaction
     
                 cy.get('.card-body').contains(isinCodeGB1); // Targets the element containing 'ISIN Code' within .card-body
                 cy.get('.card-body').contains(nominalValue); // Targets the element containing 'Nominal Value (MDL)' within .card-body
                 //cy.get('.card-body').contains(amountPayoutReport); // Targets the element containing 'Purchase Volume (units)' within .card-body
                 cy.get('.card-body').contains(minimumOrderGB1);
     
     
});
//-------------------------------GOVERNMENTS BONDS------------------------------------------------------------------------








});






