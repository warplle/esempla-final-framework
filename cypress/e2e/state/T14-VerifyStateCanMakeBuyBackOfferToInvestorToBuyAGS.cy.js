import { getAdminBaseUrl, getAdminUserName, getAdminPassword, generateRandomNumber, generateRandomString, getDealerBaseUrl, getDealerIDNP, getDealerPassword,
    generateRandomEmail, generateRandomBicCode,generateRandomStringRU, generateRandomStringWithNumbers, generateRandomStringOnlyUpperCase, SelectRandomGSType,
     SelectRandomCurrency, GenerateFutureDateTimeIssueDateField, GenerateCurrentDateTimeMaturityDateField, GenerateCurrentDateTimeStartDateField,
    GenerateFutureDateTimeEndDateFieldGB, GenerateDateTimeCouponPaymentDatesGB, DeleteCreatedGSGovernmentBond, getInvestorIDNP, getInvestorPassword,
    getInvestorBaseUrl} from '../../support/functions.js';


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

const saleVolumeTB = minimumOrderTB - 1;
const saleVolumeGB = minimumOrderGB - 1;

const activeTBUnits = minimumOrderTB - saleVolumeTB;
const activeGBUnits = minimumOrderGB - saleVolumeGB;

const sumOfferedTB = nominalValue * saleVolumeTB;
const sumOfferedGB = nominalValue * saleVolumeGB;

const amountAtMaturityTB = currentPrice * minimumOrderTB;
const amountAtMaturityGB = nominalValue * minimumOrderGB; // e nominalValue deoarece Government Bonds nu are camp Current Price

const amountAtBuyBackPayoutTB = nominalValue * minimumOrderTB;
const amountAtBuyBackPayoutGB = nominalValue * minimumOrderGB;




describe('Verify state can make buy back offer to Investor to buy a GS', () => {

    // TREASURY BILLS
    it('State should be able to make buyback offer to buy a GS Treasury Bills from Investor', () => {


        cy.AdminSimpleLogin(adminBaseUrl, adminUserName, adminPassword);

        //Change language to EN
        cy.get('#languagesnavBarDropdown').click();
        //cy.get('[ng-reflect-jhi-active-menu="en"]').click();
        cy.contains('a', 'English').click();


        //----------------GENERATING TREASURY BILLS GS-------------------------------------------
        cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click(); // clicking on the "Government Securities" option
        cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.treasury"]').click(); // clicking on the Goverment Bonds option
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
        cy.GenerateNextDayDateTimeMaturityDateFieldTB();
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
        cy.get('[alt="subscriptionCalendar.title"]').click();
        cy.contains('Upcoming subscriptions').click(); // clicking on the upcoming calendar
        //cy.contains('Upcoming subscriptions').click(); // clicking on the upcoming calendar

        //---validating that GS is displayed in Upcoming Calendar
        const tableBody = cy.get('tbody');
        // Find the rows (td elements) containing the code
        const matchingCell = tableBody.find('td').contains(isinCodeTB);
        //-------------------LOG IN AS Investor to validate that GS appeared--------------------------



        //---------Change GS status to "STARTED"------------------------------------
        cy.visit(adminBaseUrl);

        cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click();
        cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.treasury"]').click(); // clicking on the Government Bonds option

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
        cy.contains('Purchase VMS').click(); // clicking on the "Subscription Calendar" button
        cy.wait(1000);
        cy.get('[alt="subscriptionCalendar.title"]').click(); // clicking on the Purchase VMS drop-down
        
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
        cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.treasury"]').click(); // clicking no the Government Bonds option

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
            cy.get('[jhitranslate="global.menu.subscriptionCalendar"]').click(); // clicking on the "Subscription Calendar" button
            cy.wait(2000);
            cy.get('[alt="subscriptionCalendar.portfolio"]').click({force: true}); // clicking on the [Portofolio] TAB
            //cy.contains("Portfolio").click();
            
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
                //expect(purchaseAmountWhenBuying).to.equal(purchaseAmountDetailsPortofolio); // asserting the values when buying and the value in transaction's details Portofolio
            });
          //----------------------ADMIN Activate GS-----------------------------------------


          //--------------ADMIN CREATE SUBSCRIPTION REPORT-----------------------------------

          cy.visit(adminBaseUrl); 
            cy.contains("Government Securities").click()
            cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.treasury"]').click();

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

            //----------------------------ADMIN CREATE PURCHASE ORDER REPORT-------------------------------


            //---------------------------STATE(Admin) MAKE BUY BACK OFFER TO INVESTOR----------------------

            cy.StateMakeBuyBackOfferToInvestor(nominalValue, minimumOrderTB);
            cy.contains("Please confirm if you are sure you want to buy back ISIN " + isinCodeTB + ".")

            cy.GenerateFutureDateTimeBuyBackFieldTB(); //entering the data in the [Acceptance date] field
            cy.get('[data-cy="entityConfirmButton"]').click(); 
            //---------------------------STATE(Admin) MAKE BUY BACK OFFER TO INVESTOR----------------------



            //--------------------------Navigating to INVESTOR profile to validate the BUY BACK OFFER----------------


            cy.visit(investorBaseUrl);
            cy.get('[jhitranslate="global.menu.subscriptionCalendar"]').eq(1).click(); // clicking on the "Subscription Calendar" button
            cy.wait(2000);
            cy.contains("Portfolio").click({force:true}); // clicking on the [Portofolio] TAB

            cy.wait(500);
             //---validating that GS is displayed in Upcoming Calendar
           const tableBody5 = cy.get('tbody');
           // Find the rows (td elements) containing the code
           const matchingCell5 = tableBody5.find('td').contains(isinCodeTB);
            // Get the first matching row
            const matchingRow5 = matchingCell5.parent();
            // Click the edit button within the first matching row (assuming button class is 'edit-btn')
            cy.wait(1000);
            matchingRow5.find('[jhitranslate="transactions.details"]').click(); // clicking on the Details button of transaction

            cy.wait(1000);

               //validating data of GS transactions
           cy.get('.card-body').contains(isinCodeTB);
           cy.get('.card-body').contains(nominalValue);
           cy.log(`Amount GB at maturity:` ,amountAtMaturityTB);
           //cy.get('.card-body').contains(amountAtMaturityTB);
           cy.log(`Active GB units`, activeTBUnits);
           cy.get('.card-body').contains(activeTBUnits);
           cy.log(`GB Units for selling:`, saleVolumeTB);
           cy.get('.card-body').contains(minimumOrderTB);// validating the total volum of purchased units which is the minimurOrder


           cy.get('.card-body').contains("More Details").click(); // clicking on the [More Details] button 

           cy.get('.card-header').contains(isinCodeTB);

           //validating that orderKey is the same
           cy.then(() => {
             cy.log(`Display orderKey: `, orderKey)
             cy.get('.card-header').contains(orderKey);  
           });


           cy.get('.card-header').contains("Paid");

           
           cy.get('[jhitranslate="portofolio.buybackOffers"]').click(); // clicking on the ["Buyback offers"] TAB
           cy.get('.card-header').contains(isinCodeTB);
           cy.get('.card-header').contains(securityTreasuryBills);
           cy.get('.card-header').contains(nominalValue);
           cy.get('.card-header').contains(minimumOrderTB);
           cy.get('.card-header').contains("Active");


           cy.InvestorAcceptBuyBackOffer(isinCodeTB, minimumOrderTB); // ACCEPTING BUYBACK OFFER

           //--------------------------Navigating to INVESTOR profile to validate the BUY BACK OFFER-----------------------------



           //------------------------_Validate data of GS BUYBACK AS ADMIN------------------------------------------------------

           cy.visit(adminBaseUrl);

           cy.get('[jhitranslate="global.menu.gsManagement"]').click(); // clicking on the ["GS Components"] option/button

           cy.get('[jhitranslate="global.menu.entities.buybackOffers"]').click(); // clicking on the [Buy Back Offers] option/button

           const tableBody6 = cy.get('tbody');
           // Find the rows (td elements) containing the code
           const matchingCell6 = tableBody6.find('td').contains(isinCodeTB);
            // Get the first matching row
            const matchingRow6 = matchingCell6.parent().parent();
            // Click the edit button within the first matching row (assuming button class is 'edit-btn')
            matchingRow6.find('[data-cy="entityDetailsButton"]').click(); // clicking on the Details button of Price Quote

            cy.wait(500);

            //validating General Details Price Quote

           //validating first table
           cy.get('.card-body').eq(0).contains(isinCodeTB);
           cy.get('.card-body').eq(0).contains(securityTreasuryBills);
           cy.get('.card-body').eq(0).contains(nominalValue);
           cy.get('.card-body').eq(0).contains(minimumOrderTB);

           //validating second table GS Information
           cy.get('.card-body').eq(1).contains(nominalValue);



           //-------------------CHANGE GS STATUS TO BLOCKED AS ADMIN-------------------------------------------------------------
           cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click(); // clicking on the [Government Securities] tab
           cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.treasury"]').click(); // clicking on the Government Bonds option

           const tableBody7 = cy.get('tbody');
           // Find the rows (td elements) containing the code
           const matchingCell7 = tableBody7.find('td').contains(isinCodeTB);
            // Get the first matching row
            const matchingRow7 = matchingCell7.parent();
            // Click the edit button within the first matching row (assuming button class is 'edit-btn')
            matchingRow7.find('[data-cy="entityDetailsButton"]').click(); // clicking on the Details button of GS


            cy.AdminChangeStatusGSToBlocked();

            //-------------------CHANGE GS STATUS TO BLOCKED AS ADMIN-------------------------------------------------------------

            

            //------------------ADMIN GENERATE PAYOUT BUYBACK ------------------------------------------------------------------------
            cy.AdminGeneratePayoutBuyBack(isinCodeTB, amountAtBuyBackPayoutTB);
            //------------------ADMIN GENERATE PAYOUT BUYBACK ------------------------------------------------------------------------




           //---------------------------ADMIN PAY BUYBACK PAYOUT GS----------------------------------------------------------------------

           cy.get('[jhitranslate="global.menu.admin.paymentManagement"]').click(); // clicking on the [Payment Management] option/button

           cy.get('[routerlink="/payouts"]').click(); // clicking on the [MPay Payouts] option/button


            const tableBody8 = cy.get('tbody');
           // Find the rows (td elements) containing the code
           const matchingCell8 = tableBody8.find('td').contains(isinCodeTB);
            // Get the first matching row
            const matchingRow8 = matchingCell8.parent().parent();
            // Click the edit button within the first matching row (assuming button class is 'edit-btn')
            //cy.contains(amountAtBuyBackPayoutTB);
            //matchingRow8.find('[data-cy="entityDetailsButton"]').click(); // clicking on the Details button of GS

            cy.AdminPayBuyBackPayOut(isinCodeTB);
             //---------------------------ADMIN PAY BUYBACK PAYOUT GS----------------------------------------------------------------------



            cy.get('[routerlink="/transactions"]').click();


            const tableBody9 = cy.get('tbody');
           // Find the rows (td elements) containing the code
           const matchingCell9 = tableBody9.find('td').contains(isinCodeTB);
            // Get the first matching row
            const matchingRow9 = matchingCell9.parent().parent();
            // Click the edit button within the first matching row (assuming button class is 'edit-btn')
            cy.contains("Buy Back");
            //cy.contains(amountAtBuyBackPayoutTB);
            matchingRow9.find('[data-cy="entityDetailsButton"]').click(); // clicking on the Details button of GS


            //Transaction information table
            cy.get('.card').eq(0).contains(isinCodeTB);
            cy.get('.card').eq(0).contains("Buy Back");
            cy.get('.card').eq(0).contains(minimumOrderTB);
            //cy.get('.card').eq(0).contains(amountAtBuyBackPayoutTB);

            //GS information table
            cy.get('.card').eq(1).contains(nominalValue);
            cy.get('.card').eq(1).contains("Treasury bills");

        
    });





    // GOVERNMENT BONDS
    it.only('State should be able to make buy back offer to buy a GS Government Bonds from Investor', () => {


      //----------------GENERATING Government Bonds GS-------------------------------------------
      cy.AdminSimpleLogin(adminBaseUrl, adminUserName, adminPassword);

      //Change language to EN
      cy.get('#languagesnavBarDropdown').click();
      //cy.get('[ng-reflect-jhi-active-menu="en"]').click();
      cy.contains('a', 'English').click();

      cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click(); // clicking on the "Government Securities"  drop-down
      cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.bonds"]').click(); // clicking on the Goverments Bonds option
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

        cy.contains("Purchase VMS").click(); // clicking on the ["Subscription Calendar"] button/drop-down
        cy.get('[alt="subscriptionCalendar.title"]').click();// clicking on the Purchase VMS drop-down
        cy.contains("Upcoming subscription").click(); // clicking on the upcoming calendar

        //---validating that GS is displayed in Upcoming Calendar
        const tableBody = cy.get('tbody');
        // Find the rows (td elements) containing the code
        const matchingCell = tableBody.find('td').contains(isinCodeGB);
        //-------------------LOG IN AS Investor to validate that GS appeared--------------------------



        //---------Change GS status to "STARTED"------------------------------------
        cy.visit(adminBaseUrl);

        cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click(); // clicking on the Govermnets Bonds drop-down
        cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.bonds"]').click(); // clicking on the Government Bonds option

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
        cy.contains('Purchase VMS').click(); // clicking on the "Subscription Calendar" button
        cy.wait(1000);
        cy.get('[alt="subscriptionCalendar.title"]').click(); // clicking on the Purchase VMS drop-down
        
        cy.InvestorBuyGSGovernmentBonds(isinCodeGB, indicativeVolume, couponRate, nominalValue);
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
        cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.bonds"]').click(); // clicking on the Government Bonds option

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
            cy.wait(2000);
            //cy.get('[ng-reflect-router-link="/portfolio"]').eq(1).click({force: true}); // clicking on the [Portofolio] TAB
            cy.contains("Portfolio").click();

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


          //--------------ADMIN CREATE SUBSCRIPTION REPORT-----------------------------------

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

            //----------------------------ADMIN CREATE PURCHASE ORDER REPORT-------------------------------


            //---------------------------STATE(Admin) MAKE BUY BACK OFFER TO INVESTOR----------------------

            cy.StateMakeBuyBackOfferToInvestor(nominalValue, minimumOrderGB); // putem schimba si pe minimumOrder in caz ca dorim sa cumparam toate activelee
            cy.contains("Please confirm if you are sure you want to buy back ISIN " + isinCodeGB + ".")

            cy.GenerateFutureDateTimeBuyBackFieldTB(); //entering the data in the [Acceptance date] field
            cy.get('[data-cy="entityConfirmButton"]').click(); 
            //---------------------------STATE(Admin) MAKE BUY BACK OFFER TO INVESTOR----------------------



            //--------------------------Navigating to INVESTOR profile to validate the BUY BACK OFFER----------------


            cy.visit(investorBaseUrl);
            cy.get('[jhitranslate="global.menu.subscriptionCalendar"]').eq(1).click(); // clicking on the "Subscription Calendar" button
            cy.wait(1500);
            cy.contains("Portfolio").click({force:true}); // clicking on the [Portofolio] TAB


             //---validating that GS is displayed in Upcoming Calendar
           const tableBody5 = cy.get('tbody');
           // Find the rows (td elements) containing the code
           const matchingCell5 = tableBody5.find('td').contains(isinCodeGB);
            // Get the first matching row
            const matchingRow5 = matchingCell5.parent();
            // Click the edit button within the first matching row (assuming button class is 'edit-btn')
            cy.wait(1000);
            matchingRow5.find('[jhitranslate="transactions.details"]').click(); // clicking on the Details button of transaction

            cy.wait(1000);

               //validating data of GS transactions
           cy.get('.card-body').contains(isinCodeGB);
           cy.get('.card-body').contains(nominalValue);
           cy.log(`Amount GB at maturity:` ,amountAtMaturityGB);
           //cy.get('.card-body').contains(amountAtMaturityGB);
           cy.log(`Active GB units`, activeGBUnits);
           cy.get('.card-body').contains(activeGBUnits);
           cy.log(`GB Units for selling:`, saleVolumeGB);
           cy.get('.card-body').contains(saleVolumeGB);


           cy.get('.card-body').contains("More Details").click(); // clicking on the [More Details] button 

           cy.get('.card-header').contains(isinCodeGB);

           //validating that orderKey is the same
           cy.then(() => {
             cy.log(`Display orderKey: `, orderKey)
             cy.get('.card-header').contains(orderKey);  
           });


           cy.get('.card-header').contains("Paid");

           
           cy.get('[jhitranslate="portofolio.buybackOffers"]').click(); // clicking on the ["Buyback offers"] TAB
           cy.get('.card-header').contains(isinCodeGB);
           cy.get('.card-header').contains(securityGovernmentBonds);
           cy.get('.card-header').contains(nominalValue);
           cy.get('.card-header').contains(minimumOrderGB);
           cy.get('.card-header').contains("Active");
           //--------------------------Navigating to INVESTOR profile to validate the BUY BACK OFFER-----------------------------


           cy.InvestorAcceptBuyBackOffer(isinCodeGB, minimumOrderGB); // ACCEPTING BUYBACK OFFER
            

           //------------------------_Validate data of GS BUYBACK AS ADMIN------------------------------------------------------

           cy.visit(adminBaseUrl);

           cy.get('[jhitranslate="global.menu.gsManagement"]').click(); // clicking on the ["GS Compononets"] option/button

           cy.get('[jhitranslate="global.menu.entities.buybackOffers"]').click(); // clicking on the [Buy Back Offers] option/button

           const tableBody6 = cy.get('tbody');
           // Find the rows (td elements) containing the code
           const matchingCell6 = tableBody6.find('td').contains(isinCodeGB);
            // Get the first matching row
            const matchingRow6 = matchingCell6.parent().parent();
            // Click the edit button within the first matching row (assuming button class is 'edit-btn')
            matchingRow6.find('[data-cy="entityDetailsButton"]').click(); // clicking on the Details button of Price Quote

            cy.wait(500);

            //validating General Details Price Quote

           //validating first table
           cy.get('.card-body').eq(0).contains(isinCodeGB);
           cy.get('.card-body').eq(0).contains(securityGovernmentBonds);
           cy.get('.card-body').eq(0).contains(nominalValue);
           cy.get('.card-body').eq(0).contains(minimumOrderGB);

           //validating second table GS Information
           cy.get('.card-body').eq(1).contains(nominalValue);


           





           //-------------------CHANGE GS STATUS TO BLOCKED AS ADMIN-------------------------------------------------------------
           cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click(); // clicking on the [Government Securities] tab
           cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.bonds"]').click(); // clicking on the Government Bonds option

           const tableBody7 = cy.get('tbody');
           // Find the rows (td elements) containing the code
           const matchingCell7 = tableBody7.find('td').contains(isinCodeGB);
            // Get the first matching row
            const matchingRow7 = matchingCell7.parent();
            // Click the edit button within the first matching row (assuming button class is 'edit-btn')
            matchingRow7.find('[data-cy="entityDetailsButton"]').click(); // clicking on the Details button of GS


            cy.AdminChangeStatusGSToBlocked();

            //-------------------CHANGE GS STATUS TO BLOCKED AS ADMIN-------------------------------------------------------------

            

            //------------------ADMIN GENERATE PAYOUT BUYBACK ------------------------------------------------------------------------
            cy.AdminGeneratePayoutBuyBack(isinCodeGB, amountAtBuyBackPayoutGB);
            //------------------ADMIN GENERATE PAYOUT BUYBACK ------------------------------------------------------------------------




           //---------------------------ADMIN PAY BUYBACK PAYOUT GS----------------------------------------------------------------------

           cy.get('[jhitranslate="global.menu.admin.paymentManagement"]').click(); // clicking on the [Payment Management] option/button

           cy.get('[routerlink="/payouts"]').click(); // clicking on the [MPay Payouts] option/button


            const tableBody8 = cy.get('tbody');
           // Find the rows (td elements) containing the code
           const matchingCell8 = tableBody8.find('td').contains(isinCodeGB);
            // Get the first matching row
            const matchingRow8 = matchingCell8.parent().parent();
            // Click the edit button within the first matching row (assuming button class is 'edit-btn')
            //cy.contains(amountAtBuyBackPayoutGB);
            //matchingRow8.find('[data-cy="entityDetailsButton"]').click(); // clicking on the Details button of GS

            cy.AdminPayBuyBackPayOut(isinCodeGB);
             //---------------------------ADMIN PAY BUYBACK PAYOUT GS----------------------------------------------------------------------



            cy.get('[routerlink="/transactions"]').click();


            const tableBody9 = cy.get('tbody');
           // Find the rows (td elements) containing the code
           const matchingCell9 = tableBody9.find('td').contains(isinCodeGB);
            // Get the first matching row
            const matchingRow9 = matchingCell9.parent().parent();
            // Click the edit button within the first matching row (assuming button class is 'edit-btn')
           cy.contains("Buy Back");
            //cy.contains(amountAtBuyBackPayoutGB);
            matchingRow9.find('[data-cy="entityDetailsButton"]').click(); // clicking on the Details button of GS


            //Transaction information table
            cy.get('.card').eq(0).contains(isinCodeGB);
            cy.get('.card').eq(0).contains("Buy Back");
            cy.get('.card').eq(0).contains(minimumOrderGB);
            //cy.get('.card').eq(0).contains(amountAtBuyBackPayoutGB);

            //GS information table
            cy.get('.card').eq(1).contains(nominalValue);
            cy.get('.card').eq(1).contains("Government bonds");

        
    });


});