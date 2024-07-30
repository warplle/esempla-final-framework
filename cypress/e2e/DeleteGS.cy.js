import { getAdminBaseUrl, getAdminUserName, getAdminPassword, generateRandomNumber, generateRandomString, getDealerBaseUrl, getDealerIDNP, getDealerPassword,
    generateRandomEmail, generateRandomBicCode,generateRandomStringRU, generateRandomStringWithNumbers, generateRandomStringOnlyUpperCase, SelectRandomGSType,
     SelectRandomCurrency, GenerateFutureDateTimeIssueDateField, GenerateCurrentDateTimeMaturityDateField, GenerateCurrentDateTimeStartDateField,
    GenerateFutureDateTimeEndDateFieldGB, GenerateDateTimeCouponPaymentDatesGB, DeleteCreatedGSGovernmentBond, getInvestorIDNP, getInvestorPassword,
    getInvestorBaseUrl} from '../../../qa/cypress/support/functions.js';


const adminBaseUrl = getAdminBaseUrl();
const adminUserName = getAdminUserName();
const adminPassword = getAdminPassword();
const investorBaseUrl = getInvestorBaseUrl();
const investorIDNP = getInvestorIDNP();
const investorPassword = getInvestorPassword();
const dealerBaseUrl = getDealerBaseUrl();
const dealerIDNP = getDealerIDNP();
const dealerPasword = getDealerPassword();

const isinCode = "MD12312" + generateRandomNumber(5);



describe('Delete GS', () => {

    it.skip('Delete gs', () => {
        
        cy.AdminSimpleLogin(adminBaseUrl, adminUserName, adminPassword);
        cy.contains("Government Securities").click();
        
        //---validating that GS is displayed in Upcoming Calendar
        const tableBody1 = cy.get('tbody');
        // Find the rows (td elements) containing the code
        const matchingCell1 = tableBody1.find('td');

         // Get the first matching row
         const matchingRow1 = matchingCell1.parent();

         // Click the edit button within the first matching row (assuming button class is 'edit-btn')
         cy.wait(1000);
         matchingRow1.find('[data-cy="entityDetailsButton"]').eq(0).click();

         cy.AdminChangeStatusGSToInitiated();
    });


    it('Data extracting', () => {

        cy.AdminSimpleLogin(adminBaseUrl, adminUserName, adminPassword);
         
            cy.contains("Government Securities").click()

            // finding the isinCode created
            cy.wait(1000);
            //---validating that GS is displayed in Upcoming Calendar
           const tableBody1 = cy.get('tbody');
           // Find the rows (td elements) containing the code
           const matchingCell1 = tableBody1.find('td').eq(0);
            // Get the first matching row
            const matchingRow1 = matchingCell1.parent();
            // Click the edit button within the first matching row (assuming button class is 'edit-btn')
            cy.wait(1000);
            matchingRow1.find('[data-cy="entityDetailsButton"]').click(); // clicking on the Details button of transaction

            //cy.get('[jhitranslate="global.menu.actions"]').eq(0).click(); // clicking on the [Actions (test)] drop-down

            cy.wait(1000);
            cy.AdminChangeStatusGSToBlocked(); // changing staus of GS to "BLOCKED"
            // probably need validation

            //cy.AdminCreateSubscriptionReport();

//             // Use cy.get() to target the specific span element containing the value you want to extract
// cy.get('span').contains('2604').invoke('text').then((text) => {
//     // Parse the text to extract only the whole part
//     const wholePart = parseInt(text);
//     // Log the result to the Cypress command log
//     cy.log(`Extracted value: ${wholePart}`);
//   });

  cy.AdminCreatePurchaseOrdersReport();
             

 
    })
});