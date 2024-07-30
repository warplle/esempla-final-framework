import { getAdminBaseUrl, getAdminUserName, getAdminPassword, getInvestorIDNP, generateRandomNumber, generateRandomString, generateRandomEmail, generateRandomBicCode,
    generateRandomStringRU, generateRandomStringWithNumbers, generateRandomStringOnlyUpperCase } from '../../../support/functions.js';

const baseUrl = getAdminBaseUrl();
const adminUserName = getAdminUserName();
const adminPassword = getAdminPassword();
const idnp = getInvestorIDNP();
const reasonField = generateRandomString(25) + generateRandomString(25);


describe('Verify Admin can close investor account', () => {


    // Investor's profile should have status "Active" before running this test, otherwise the test will fail
    it('Admin should be able to close an investor account with status [Active]', () => {

        cy.AdminSimpleLogin(baseUrl, adminUserName, adminPassword);

         //Change language to EN
         cy.get('#languagesnavBarDropdown').click();
         //cy.get('[ng-reflect-jhi-active-menu="en"]').click();
         cy.contains('a', 'English').click();

        cy.contains('Investors').click(); //clicking on the "Investors" tab
        cy.get('[routerlink="/investor-profiles"]').click(); // clicking on the "All Investors" option
        //cy.get('[jhisortby="idnp"]').click(); //sorting ascending the investor profiles
        //cy.get('[data-cy="entityDetailsButton"]').eq(0).click(); // clicking on the first investor from the list
        cy.contains('Investor Profile');

        // Closing Investor Profile
        cy.CloseInvestorAccountAsAdmin(idnp,reasonField);

       // cy.get('[jhisortby="idnp"]').click(); //sorting ascending investor profiles
       
        // Set investor profile status back to "Active"
        cy.SetInvestorProfileStatusBackToActiveAsAdmin(idnp);
        
    });
});