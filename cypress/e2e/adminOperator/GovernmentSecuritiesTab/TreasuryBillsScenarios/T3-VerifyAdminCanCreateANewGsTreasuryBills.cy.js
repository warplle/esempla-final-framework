import { getAdminBaseUrl, getAdminUserName, getAdminPassword, generateRandomNumber, generateRandomString, generateRandomEmail, generateRandomBicCode,
    generateRandomStringRU, generateRandomStringWithNumbers, generateRandomStringOnlyUpperCase, SelectRandomGSType, SelectRandomCurrency, 
    GenerateFutureDateTimeIssueDateField, GenerateCurrentDateTimeMaturityDateField, GenerateCurrentDateTimeStartDateFieldTB,
    GenerateFutureDateTimeEndDateFieldTB, DeleteCreatedGSTreasuryBill} from '../../../../support/functions.js';

const baseUrl = getAdminBaseUrl();
const adminUserName = getAdminUserName();
const adminPassword = getAdminPassword();
const isinCode = "MD4003" + generateRandomNumber(6);
const isinCode1 = "MD4003" + generateRandomNumber(6);
const circulationTerm = "90 Day";
const nominalValue = "3" + generateRandomNumber(2);
const currentPrice = "1" + generateRandomNumber(2);
const currency = "MDL";
// const currency = SelectRandomCurrency();
// const issueDate = GenerateCurrentDateTime();
// const maturityDate = GenerateCurrentDateTimeMaturityDate();
//const yieldData = '7'; // treasuryBills gs type
const couponRate = '7'; // governmentsBonds type
const indicativeVolume = "1" + generateRandomNumber(2);
const minimumOrder = "1" + generateRandomNumber(1);
//const maximumOrder = "1" + generateRandomNumber(1);
//const maximumOwnershipQuantity = "1" + generateRandomNumber(1);


describe('Verify Admin can create a new GS Treasury Bills', () => {

    // ---------Treasury Bills--------------------------------------------
    it.only('Admin should be able to create a new GS Treasury Bills with valid data in all fields', () => {
        
        cy.AdminSimpleLogin(baseUrl, adminUserName, adminPassword);

         //Language change
         cy.get('#languagesnavBarDropdown').click();
         //cy.get('[ng-reflect-jhi-active-menu="en"]').click();
         cy.contains('a', 'English').click();

        cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click(); // clicking on the "Government Securities" option
        cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.treasury"]').click();
        cy.get('#jh-create-entity').click(); // clicking on the [Add new] button

        // enter data in the fields
        cy.get('#field_securitiesName').select('TREASURY_BILLS').invoke('change');
        cy.get('#field_isinCode').type(isinCode);
        cy.SelectRandomCirculationTermTreasuryBills();
        //cy.get('.ng-input').type(circulationTerm);
        cy.get('#field_nominalValue').type(nominalValue);
        cy.get('#field_currentPrice').type(currentPrice);
        cy.get('#field_currency').select("MDL");
        //cy.SelectRandomCurrency()
        cy.GenerateCurrentDateTimeIssueDateField();
        //cy.get('#field_maturityDate').type('03.04.2024');
        //cy.GenerateCurrentDateTimeMaturityDateField();
        //cy.get('#field_yieldValue').type(yieldData, {force: true});
        // secondary market sell "NO"
        // mandatory Early Redemption "NO"
        cy.GenerateCurrentDateTimeStartDateFieldTB();
        cy.GenerateFutureDateTimeEndDateFieldTB();
        cy.get('#field_indicativeVolume').type(indicativeVolume);
        cy.get('#field_minOrder').type(minimumOrder);
        //cy.get('#field_maxOrder').type(maximumOrder);
        //cy.get('#field_maxOwnership').type(maximumOwnershipQuantity);
        // fees applied "NO"

        cy.get('#save-entity').click();
        //cy.DeleteCreatedGSTreasuryBill(isinCode);

        cy.wait(500);
        const tableBody1 = cy.get('tbody');
        const matchingCell1 = tableBody1.find('td').contains(isinCode)

    });


    // Creating entity via [Clone] button
//Cypress._.times(50, () => {
    // via cloning
    it('Admin should be able to create a new GS Treasury Bills with valid data in all fields', () => {
        
        cy.AdminSimpleLogin(baseUrl, adminUserName, adminPassword);

         //Language change
         cy.get('#languagesnavBarDropdown').click();
         //cy.get('[ng-reflect-jhi-active-menu="en"]').click();
         cy.contains('a', 'English').click();

        cy.get('[jhitranslate="global.menu.entities.governmentSecurities"]').click(); // clicking on the "Government Securities" option
        cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.sidebar.treasury"]').click();


        cy.wait(500);
        const tableBody = cy.get('tbody');
        const matchingCell = tableBody.find('td').contains("MD4003");
        const matchingRow = matchingCell.parent();
        matchingRow.find('[data-cy="entityCloneButton"]').click();



        // /cy.get('[ng-reflect-ngb-tooltip="Clone"]').click(); // clicking on the [Clone] button
        // cy.get('#jh-create-entity').click(); // clicking on the [Add new] button

        // enter data in the fields
        //cy.get('#field_securitiesName').select('TREASURY_BILLS').invoke('change');
        cy.get('#field_isinCode').type(isinCode1);
        cy.SelectRandomCirculationTermTreasuryBills();
        //cy.get('.ng-input').type(circulationTerm);
        cy.get('#field_nominalValue').clear().type(nominalValue);
        cy.get('#field_currentPrice').clear().type(currentPrice);
        cy.get('#field_currency').select("MDL");
        //cy.SelectRandomCurrency()
        cy.GenerateCurrentDateTimeIssueDateField();
        //cy.get('#field_maturityDate').type('03.04.2024');
        //cy.GenerateCurrentDateTimeMaturityDateField();
        //cy.get('#field_yieldValue').type(yieldData, {force: true});
        // secondary market sell "NO"
        // mandatory Early Redemption "NO"
        cy.GenerateCurrentDateTimeStartDateFieldTB();
        cy.GenerateFutureDateTimeEndDateFieldTB();
        cy.get('#field_indicativeVolume').clear().type(indicativeVolume);
        cy.get('#field_minOrder').clear().type(minimumOrder);
        //cy.get('#field_maxOrder').type(maximumOrder);
        //cy.get('#field_maxOwnership').type(maximumOwnershipQuantity);
        // fees applied "NO"

        cy.get('#save-entity').click();

        cy.wait(500);
        const tableBody1 = cy.get('tbody');
        const matchingCell1 = tableBody1.find('td').contains(isinCode)


    });
});
//});