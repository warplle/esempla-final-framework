import { getAdminBaseUrl, getAdminUserName, getAdminPassword, generateRandomNumber, generateRandomString, generateRandomEmail, generateRandomBicCode,
    generateRandomStringRU, generateRandomStringWithNumbers, generateRandomStringOnlyUpperCase, SelectRandomGSType, SelectRandomCurrency, 
    GenerateFutureDateTimeIssueDateField, GenerateCurrentDateTimeMaturityDateField, GenerateCurrentDateTimeStartDateField,
    GenerateFutureDateTimeEndDateFieldGB, GenerateDateTimeCouponPaymentDatesGB, DeleteCreatedGSGovernmentBond} from '../../../../support/functions.js';


const baseUrl = getAdminBaseUrl();
const adminUserName = getAdminUserName();
const adminPassword = getAdminPassword();
const isinCode = "MD4004" + generateRandomNumber(6);
const circulationTerm = "90 Day";
const nominalValue = "3" + generateRandomNumber(2);
const currentPrice = "1" + generateRandomNumber(2);
const currency = "MDL";
// const currency = SelectRandomCurrency();
// const issueDate = GenerateCurrentDateTime();
const couponRate = '7'; // governmentsBonds type
const indicativeVolume = "1" + generateRandomNumber(2);
const minimumOrder = "1" + generateRandomNumber(1);


    describe('Verify Admin can create a new GS Government Bonds', () => {

        it.only('Admin should be able to create new GS Government Bonds with valid data in all fields', () => {

        cy.AdminSimpleLogin(baseUrl, adminUserName, adminPassword);


        //Change language to EN
        cy.get('#languagesnavBarDropdown').click();
        //cy.get('[ng-reflect-jhi-active-menu="en"]').click();
        cy.contains('a', 'English').click();

        cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click(); // clicking on the "Government Securities"  drop-down
        cy.get('[routerlink="/government-securities-bonds"]').click(); // clicking on the "Government Securities" optin
        cy.get('#jh-create-entity').click(); // clicking on the [Add new] button

            // enter data in the fields
        cy.get('#field_securitiesName').select('Government Bonds');
        cy.get('#field_isinCode').type(isinCode);
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
        cy.get('#field_minOrder').type(minimumOrder);
        // fees applied "NO"

        cy.get('#save-entity').click();
        //cy.DeleteCreatedGSGovernmentBond(isinCode);

        cy.wait(500);
        const tableBody1 = cy.get('tbody');
        const matchingCell1 = tableBody1.find('td').contains(isinCode)

            
        });

        //Creating the entity via [Clone] button
        it('Admin should be able to create new GS Government Bonds with valid data in all fields', () => {

            cy.AdminSimpleLogin(baseUrl, adminUserName, adminPassword);

            //Change language to EN
            cy.get('#languagesnavBarDropdown').click();
            //cy.get('[ng-reflect-jhi-active-menu="en"]').click();
            cy.contains('a', 'English').click();
    
            cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click(); // clicking on the "Government Securities"  option
            cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.bonds"]').click();
            //cy.get('#jh-create-entity').click(); // clicking on the [Add new] button

            cy.wait(500);
            const tableBody = cy.get('tbody');
            const matchingCell = tableBody.find('td').contains("MD4004");
            const matchingRow = matchingCell.parent();
            matchingRow.find('[data-cy="entityCloneButton"]').click();
    
                // enter data in the fields
            //cy.get('#field_securitiesName').select('Government Bonds');
            cy.get('#field_isinCode').type(isinCode);
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
            cy.get('#field_indicativeVolume').clear().type(indicativeVolume);
            cy.get('#field_minOrder').clear().type(minimumOrder);
            // fees applied "NO"
    
            cy.get('#save-entity').click();
            //cy.DeleteCreatedGSGovernmentBond(isinCode);
    
            cy.wait(500);
            const tableBody1 = cy.get('tbody');
            const matchingCell1 = tableBody1.find('td').contains(isinCode)
    
                
            });
    });


