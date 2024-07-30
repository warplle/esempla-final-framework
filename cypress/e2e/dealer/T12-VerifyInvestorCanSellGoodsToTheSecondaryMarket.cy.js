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
const isinCodeGB = "MD4004" + generateRandomNumber(6);
const circulationTerm = "90 Day";
const nominalValue = "3" + generateRandomNumber(2);
const currentPrice = "1" + generateRandomNumber(2);
const currency = "MDL";
// const currency = SelectRandomCurrency();
// const issueDate = GenerateCurrentDateTime();
const couponRate = '7'; // governmentsBonds type
const indicativeVolume = "1" + generateRandomNumber(2);
const minimumOrderTB = "1" + generateRandomNumber(1);
const minimumOrderGB = "1" + generateRandomNumber(1);
const descriptionIncomeSourceField = generateRandomString(10) + " " + generateRandomString(10);

const saleVolumeTB = minimumOrderTB - 1;
const saleVolumeGB = minimumOrderGB - 1;

const activeTBUnits = minimumOrderTB - saleVolumeTB;
const activeGBUnits = minimumOrderGB - saleVolumeGB;

const sumOfferedTB = nominalValue * saleVolumeTB;
const sumOfferedGB = nominalValue * saleVolumeGB;

const amountAtPurchasing = currentPrice * minimumOrderTB;
const amountAtMaturityTB= nominalValue * minimumOrderTB; // amountAtMaturity => adica ceea ce primeste investorul la sfarsit
const amountAtMaturityGB = nominalValue * minimumOrderGB; // e nominalValue deoarece Government Bonds nu are camp Current Price


describe('Verify investor can sell goods to the secondary market', () => {

 // Cypress._.times(50, () => {
  
    //TREASURY BILLS
    it('Investor should be able to sell TREASURY BILLS to the secondary market', () => {

        cy.AdminSimpleLogin(adminBaseUrl, adminUserName, adminPassword);

       //Change language to EN
       cy.get('#languagesnavBarDropdown').click();
       //cy.get('[ng-reflect-jhi-active-menu="en"]').click();
       cy.contains('a', 'English').click();

        //----------------GENERATING TREASURY BILLS GS-------------------------------------------
        cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click(); // clicking on the "Government Securities" option
        cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.treasury"]').click();
        cy.get('#jh-create-entity').click(); // clicking on the [Add new] button

        cy.wait(500);

        // enter data in the fields
        cy.get('[data-cy="securitiesName"]').select('TREASURY_BILLS').invoke('change');

        cy.get('#field_isinCode').type(isinCodeTB);
        cy.SelectRandomCirculationTermTreasuryBills();
        //cy.get('.ng-input').type(circulationTerm);
        cy.get('#field_nominalValue').type(nominalValue);
        cy.get('#field_currentPrice').type(currentPrice);
        cy.get('#field_currency').select("MDL");
        cy.GenerateCurrentDateTimeIssueDateField();
        cy.wait(500);
        cy.ActivateSecondaryMarketSellTB();
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
        //cy.get('[ng-reflect-router-link="/subscription-calendar/announc"]').click(); // clicking on the upcoming calendar
        cy.wait(500);
        cy.get('img[src="content/images/subscription-calendar/subscription-calendar.svg"]').click();
        cy.contains("Upcoming subscriptions").click();
        //cy.contains("Upcoming subscriptions").eq(0).click();

        //---validating that GS is displayed in Upcoming Calendar
        const tableBody = cy.get('tbody');
        // Find the rows (td elements) containing the code
        const matchingCell = tableBody.find('td').contains(isinCodeTB);
        //-------------------LOG IN AS Investor to validate that GS appeared--------------------------



        //---------Change GS status to "STARTED"------------------------------------
        cy.visit(adminBaseUrl);

        cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click(); // clicking on the "Government Securities" drop-down
        cy.get('[routerlink="/government-securities-treasury"]').click(); // clicking no the Treasury Bills option

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
        //cy.get('#second_check').click();
        //cy.get('#third_check').click();
        //cy.get('#fouth_check').click();

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
        cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click(); // clicking on the "Government Securities" drop-down
        cy.get('[routerlink="/government-securities-treasury"]').click(); // clicking on the Treasury Bills option

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
            cy.wait(1000);
            cy.get('[alt="subscriptionCalendar.portfolio"]').click({force: true}); // clicking on the [Portofolio] TAB
            
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



          //---------------------REQUEST A QUOTE------------------------------------------//

          cy.InvestorRequestAQoute(isinCodeTB, saleVolumeTB);

          //---------------------REQUEST A QUOTE------------------------------------------//

          

          //----------------------Making an offer as a DEALER-----------------------------//

          //cy.setDealerCredentials(dealerIDNP, dealerPasword);

          cy.DealerSimpleLogIn(dealerBaseUrl);

          cy.wait(1000);
          cy.get('[ng-reflect-router-link="/price-quotes"]').click(); // clicking on the [Cotatii de pret] option/button

          cy.DealerOfferPrice(isinCodeTB, sumOfferedTB);

          //----------------------Making an offer as a DEALER-----------------------------//

          

          //---------------------------Validating the details of GS Transaction, validating Active/Blocked units of the QUOTE--------------------------

          cy.wait(1000);

          cy.visit(investorBaseUrl);

          cy.get('[jhitranslate="global.menu.subscriptionCalendar"]').eq(1).click(); // clicking on the subscription calendar

          cy.wait(500);
        
          cy.get('img[alt="subscriptionCalendar.portfolio"]').click(); // clicking on the ["Portofolio"] option/button
          cy.get('img[alt="subscriptionCalendar.portfolio"]').click(); // clicking on the ["Portofolio"] option/button

          const tableBody4 = cy.get('tbody');
           // Find the rows (td elements) containing the code
           const matchingCell4 = tableBody4.find('td').contains(isinCodeTB);
            // Get the first matching row
            const matchingRow4 = matchingCell4.parent();
            // Click the edit button within the first matching row (assuming button class is 'edit-btn')
            cy.wait(1000);
            matchingRow4.find('[jhitranslate="transactions.details"]').click(); // clicking on the Details button of transaction

            //validating data of GS transactions
            cy.get('.card-body').contains(isinCodeTB);
            cy.get('.card-body').contains(nominalValue);
            cy.log(`Amount TB at purchasing:`, amountAtPurchasing)
            //cy.get('.card-body').contains(amountAtPurchasing);
            cy.log(`Amount TB at maturity:`, amountAtMaturityTB);
            //cy.get('.card-body').contains(amountAtMaturityTB);
            cy.log(`Active TB units:`, activeTBUnits);
            cy.get('.card-body').contains(activeTBUnits);
            cy.log('TB Units for selling:', saleVolumeTB)
            cy.get('.card-body').contains(saleVolumeTB);

            //cy.get('[jhitranslate="transactions.moreDetails"]').eq(0).click(); // clicking on [More Details] button
            cy.get('.card-body').contains("More Details").click(); // clicking on the [More Detaisl] button 

            cy.get('.card-header').contains(isinCodeTB);

            //validating that orderKey is the same
            cy.then(() => {
              cy.log(`Display orderKey: `, orderKey)
              cy.get('.card-header').contains(orderKey);  
            });


            cy.get('.card-header').contains("Paid");

            
            cy.get('[jhitranslate="portofolio.priceQuotes"]').click(); // clicking on the ["Price Quotes"] TAB
            cy.get('.card-header').contains(sumOfferedTB); // validating the sum of units if its correct -> nominalValue * saleVolumeTB

            cy.get('[jhitranslate="offers.biddingOffer"]').click(); //clicking on the ["Bidding Offer"] button
            cy.get('.table').eq(1).contains(sumOfferedTB); // validating the  ["Bidding Offer"] details tab, sum of units if its correct -> nominalValue * saleVolumeTB

            //---------------------------Validating the details of GS Transaction, validating Active/Blocked units of the QUOTE--------------------------





           //step6
           //------------- LOGIN AS ADMIN TO VALIDATE THE PRICE QUOTE AND BIDDING OFFER FROM THE SECONDARY MARKET DROP-DOWN OPTION----------------------

            cy.visit(adminBaseUrl);

            cy.get('[jhitranslate="global.menu.admin.secondaryMarket"]').click(); // clicking on the ["Secondary Market"] option/button

            cy.get('[routerlink="/price-quote"]').click(); // clicking on the [Price Quote] option/button

            //validating data

            const tableBody5 = cy.get('tbody');
           // Find the rows (td elements) containing the code
           const matchingCell5 = tableBody5.find('td').contains(isinCodeTB);
            // Get the first matching row
            const matchingRow5 = matchingCell5.parent();
            // Click the edit button within the first matching row (assuming button class is 'edit-btn')
            cy.wait(1000);
            matchingRow5.find('[data-cy="entityDetailsButton"]').click(); // clicking on the Details button of Price Quote

            //validating General Details Price Quote

            //validating first table
            cy.get('.card-body').eq(0).contains(isinCodeTB);
            cy.get('.card-body').eq(0).contains(securityTreasuryBills);
            cy.get('.card-body').eq(0).contains(saleVolumeTB);

            //validating second table
            //cy.get('.card-body').eq(1).contains(securityTreasuryBills); // its "Treasury bills" thats why it fails
            cy.get('.card-body').eq(1).contains(nominalValue);

            
            // navigate to [Bidding Offer] tab
            cy.get('[jhitranslate="retailManagementApp.priceQuote.biddingOffers"]').click(); // clicking on the [Bidding Offer] TAB

            cy.get('.card-header').contains(sumOfferedTB); //validating Bidding Offer Price which is nominalValue(the sum of the units bought)
            cy.get('.card-header').contains(saleVolumeTB);
            cy.get('.card-header').contains("Submitted");

            // navigating to [Bidding Offers] details
            
            const tableBody6 = cy.get('tbody');
            // Find the rows (td elements) containing the code
            const matchingCell6 = tableBody6.find('td').contains(sumOfferedTB);
             // Get the first matching row
             const matchingRow6 = matchingCell6.parent();
             // Click the edit button within the first matching row (assuming button class is 'edit-btn')
             cy.wait(1000);
             matchingRow6.find('[jhitranslate="transactions.details"]').click(); // clicking on the Details button of Price Quote

             //validating Bidding Offer information table
              cy.get('.col-md-6').eq(0).contains(isinCodeTB);
              cy.get('.col-md-6').eq(0).contains(sumOfferedTB); // this is Bidding Offer Price
              cy.get('.col-md-6').eq(0).contains(saleVolumeTB);
              cy.get('.col-md-6').eq(0).contains("Submitted");


              // validating Price Quote information table
              cy.get('.col-md-6').eq(1).contains(securityTreasuryBills); // validating that is a Treasury Bills GS
              cy.get('.col-md-6').eq(1).contains(investorIDNP); // this is Bidding Offer Price
              cy.get('.col-md-6').eq(1).contains(saleVolumeTB);
              cy.get('.col-md-6').eq(1).contains("Active");


              
              //------------- LOGIN AS ADMIN TO VALIDATE THE PRICE QUOTE AND BIDDING OFFER FROM THE SECONDARY MARKET DROP-DOWN OPTION----------------------

    });


    //GOVERNMENT BONDS
    it('Investor should be able to sell GOVERNMENT BONDS to the secondary market', () => {


      //----------------GENERATING Government Bonds GS-------------------------------------------
      cy.AdminSimpleLogin(adminBaseUrl, adminUserName, adminPassword);

             //Language change
             cy.get('#languagesnavBarDropdown').click();
             //cy.get('[ng-reflect-jhi-active-menu="en"]').click();
             cy.contains('a', 'English').click();

      cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click(); // clicking on the "Government Securities" option
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
      cy.GenerateDateTimeCouponPaymentDates();
      cy.ActivateSecondaryMarketSellGB(); // putting the GS to sell to Secondary Market
      // de ales secondary market
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

      cy.wait(1000);

      cy.contains("Purchase VMS").click(); // clicking on the ["Subscription Calendar"] button/drop-down
      //cy.get('[ng-reflect-router-link="/subscription-calendar/announc"]').click(); // clicking on the upcoming calendar
      //cy.get('img[alt="subscriptionCalendar.title"]').eq(0).click(); //clicking on the Purchase VMS from the sidebar
      cy.get('img[alt="subscriptionCalendar.title"]').eq(0).click();
      cy.contains("Upcoming subscriptions").click();

      //---validating that GS is displayed in Upcoming Calendar
      const tableBody = cy.get('tbody');
      // Find the rows (td elements) containing the code
      const matchingCell = tableBody.find('td').contains(isinCodeGB);
      //-------------------LOG IN AS Investor to validate that GS appeared--------------------------



      //---------Change GS status to "STARTED"------------------------------------
      cy.visit(adminBaseUrl);

      cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click(); // clicking on the "Government Securities" drop-down
      cy.get('[routerlink="/government-securities-bonds"]').click(); // clicking on the Government Bonds option

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
      
      cy.InvestorBuyGSGovernmentBonds(isinCodeGB, indicativeVolume, couponRate, nominalValue);
      cy.SelectRandomIncomeSourceWhenBuyingAGS(descriptionIncomeSourceField);

      cy.get('#field_volume').clear().type(minimumOrderGB); // entering the minimum allowed quantity of activities we want to buy

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
      cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click(); // clicking on the "Governments Securities" drop-down
      cy.get('[routerlink="/government-securities-bonds"]').click(); // clicking on the Government Bonds option

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
          cy.get('[alt="subscriptionCalendar.portfolio"]').click();
          
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



        //---------------------REQUEST A QUOTE------------------------------------------//

        cy.InvestorRequestAQoute(isinCodeGB, saleVolumeGB);

        //---------------------REQUEST A QUOTE------------------------------------------//

        

        //----------------------Making an offer as a DEALER-----------------------------//

        //cy.setDealerCredentials(dealerIDNP, dealerPasword);

        cy.DealerSimpleLogIn(dealerBaseUrl);

        cy.wait(1000);
        cy.get('[ng-reflect-router-link="/price-quotes"]').click(); // clicking on the [Cotatii de pret] option/button

        cy.DealerOfferPrice(isinCodeGB, sumOfferedGB);
        





         //---------------------------Validating the details of GS Transaction, validating Active/Blocked units of the QUOTE--------------------------

         cy.wait(1000);

         cy.visit(investorBaseUrl);

         cy.get('[jhitranslate="global.menu.subscriptionCalendar"]').eq(1).click(); // clicking on the subscription calendar

         cy.wait(500);
       
         cy.get('[alt="subscriptionCalendar.portfolio"]').click(); // clicking on the ["Portofolio"] option/button
         cy.wait(500);
         cy.get('[alt="subscriptionCalendar.portfolio"]').click(); // clicking on the ["Portofolio"] option/button

         const tableBody4 = cy.get('tbody');
          // Find the rows (td elements) containing the code
          const matchingCell4 = tableBody4.find('td').contains(isinCodeGB);
           // Get the first matching row
           const matchingRow4 = matchingCell4.parent();
           // Click the edit button within the first matching row (assuming button class is 'edit-btn')
           cy.wait(1000);
           matchingRow4.find('[jhitranslate="transactions.details"]').click(); // clicking on the Details button of transaction

           //validating data of GS transactions
           cy.get('.card-body').contains(isinCodeGB);
           cy.get('.card-body').contains(nominalValue);
           cy.log(`Amount GB at maturity:` ,amountAtMaturityGB);
           //cy.get('.card-body').contains(amountAtMaturityGB);
           cy.log(`Active GB units`, activeGBUnits);
           cy.get('.card-body').contains(activeGBUnits);
           cy.log(`GB Units for selling:`, saleVolumeGB);
           cy.get('.card-body').contains(saleVolumeGB);

           //cy.get('[jhitranslate="transactions.moreDetails"]').eq(0).click(); // clicking on [More Details] button
           cy.get('.card-body').contains("More Details").click(); // clicking on the [More Detaisl] button 

           cy.get('.card-header').contains(isinCodeGB);

           //validating that orderKey is the same
           cy.then(() => {
             cy.log(`Display orderKey: `, orderKey)
             cy.get('.card-header').contains(orderKey);  
           });


           cy.get('.card-header').contains("Paid");

           
           cy.get('[jhitranslate="portofolio.priceQuotes"]').click(); // clicking on the ["Price Quotes"] TAB
           cy.get('.card-header').contains(sumOfferedGB); // validating the sum of units if its correct -> nominalValue * saleVolumeTB

           cy.get('[jhitranslate="offers.biddingOffer"]').click(); //clicking on the ["Bidding Offer"] button
           cy.get('.table').eq(1).contains(sumOfferedGB); // validating the  ["Bidding Offer"] details tab, sum of units if its correct -> nominalValue * saleVolumeTB

           //---------------------------Validating the details of GS Transaction, validating Active/Blocked units of the QUOTE--------------------------




           //step6
           //------------- LOGIN AS ADMIN TO VALIDATE THE PRICE QUOTE AND BIDDING OFFER FROM THE SECONDARY MARKET DROP-DOWN OPTION----------------------

           cy.visit(adminBaseUrl);

           cy.get('[jhitranslate="global.menu.admin.secondaryMarket"]').click(); // clicking on the ["Secondary Market"] option/button

           cy.get('[routerlink="/price-quote"]').click(); // clicking on the [Price Quote] option/button

           //validating data

           const tableBody5 = cy.get('tbody');
          // Find the rows (td elements) containing the code
          const matchingCell5 = tableBody5.find('td').contains(isinCodeGB);
           // Get the first matching row
           const matchingRow5 = matchingCell5.parent();
           // Click the edit button within the first matching row (assuming button class is 'edit-btn')
           cy.wait(1000);
           matchingRow5.find('[data-cy="entityDetailsButton"]').click(); // clicking on the Details button of Price Quote

           //validating General Details Price Quote

           //validating first table
           cy.get('.card-body').eq(0).contains(isinCodeGB);
           cy.get('.card-body').eq(0).contains(securityGovernmentBonds);
           cy.get('.card-body').eq(0).contains(saleVolumeGB);

           //validating second table
           //cy.get('.card-body').eq(1).contains(securityTreasuryBills); // its "Treasury bills" thats why it fails
           cy.get('.card-body').eq(1).contains(nominalValue);

           
           // navigate to [Bidding Offer] tab
           cy.get('[jhitranslate="retailManagementApp.priceQuote.biddingOffers"]').click(); // clicking on the [Bidding Offer] TAB

           cy.get('.card-header').contains(sumOfferedGB); //validating Bidding Offer Price which is nominalValue(the sum of the units bought)
           cy.get('.card-header').contains(saleVolumeGB);
           cy.get('.card-header').contains("Submitted");

           // navigating to [Bidding Offers] details
           
           const tableBody6 = cy.get('tbody');
           // Find the rows (td elements) containing the code
           const matchingCell6 = tableBody6.find('td').contains(sumOfferedGB);
            // Get the first matching row
            const matchingRow6 = matchingCell6.parent();
            // Click the edit button within the first matching row (assuming button class is 'edit-btn')
            cy.wait(1000);
            matchingRow6.find('[jhitranslate="transactions.details"]').click(); // clicking on the Details button of Price Quote

            //validating Bidding Offer information table
             cy.get('.col-md-6').eq(0).contains(isinCodeGB);
             cy.get('.col-md-6').eq(0).contains(sumOfferedGB); // this is Bidding Offer Price
             cy.get('.col-md-6').eq(0).contains(saleVolumeGB);
             cy.get('.col-md-6').eq(0).contains("Submitted");


             // validating Price Quote information table
             cy.get('.col-md-6').eq(1).contains(securityGovernmentBonds); // validating that is a Treasury Bills GS
             cy.get('.col-md-6').eq(1).contains(investorIDNP); // this is Bidding Offer Price
             cy.get('.col-md-6').eq(1).contains(saleVolumeGB);
             cy.get('.col-md-6').eq(1).contains("Active");

        
              //------------- LOGIN AS ADMIN TO VALIDATE THE PRICE QUOTE AND BIDDING OFFER FROM THE SECONDARY MARKET DROP-DOWN OPTION----------------------
          
  });
})
//});