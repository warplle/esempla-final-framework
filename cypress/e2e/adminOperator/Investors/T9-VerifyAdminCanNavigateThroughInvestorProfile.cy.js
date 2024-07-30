import { getAdminBaseUrl, getAdminUserName, getAdminPassword, generateRandomNumber, generateRandomString, generateRandomEmail, generateRandomBicCode,
    generateRandomStringRU, generateRandomStringWithNumbers, generateRandomStringOnlyUpperCase } from '../../../support/functions.js';

const baseUrl = getAdminBaseUrl();
const adminUserName = getAdminUserName();
const adminPassword = getAdminPassword();
const idnp = "2004028049502"; // Gheorhe Burduja


describe('Verify Admin can navigate through investor profile tabs', () => {

    // To make this test pass, investor should at least 1 entity in each category Portofolio, Transactions, History
    it('Admin should be able to navigate through investor profile tabs', () => {
        
        cy.AdminSimpleLogin(baseUrl, adminUserName, adminPassword);

          //Change language to EN
          cy.get('#languagesnavBarDropdown').click();
          //cy.get('[ng-reflect-jhi-active-menu="en"]').click();
          cy.contains('a', 'English').click();

        cy.get('[jhitranslate="global.menu.admin.investors"]').click(); //clicking on the "Investors" drop-down
        cy.get('[jhitranslate="global.menu.admin.investorsAll"]').click(); // clicking on the "All Investors" option
        //cy.get('[jhitranslate="retailManagementApp.investorProfiles.idnp"]').click();
        //cy.get('[data-cy="entityDetailsButton"]').eq(0).click(); // clicking on the first investor from the list
        cy.contains('Investor Profile');

        // Fields Validation
        cy.VerifyingInvestorTabsAsAdmin(idnp);
        
    });
});