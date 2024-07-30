import { getInvestorBaseUrl, getInvestorIDNP, getInvestorPassword,  generateRandomNumber, generateRandomString, generateRandomEmail, generateRandomBicCode,
    generateRandomStringRU, generateRandomStringWithNumbers, generateRandomStringOnlyUpperCase, generateRandomStringOnlyLowerCase, getAdminBaseUrl, getAdminUserName, getAdminPassword } from '../../support/functions.js';

const adminBaseUrl = getAdminBaseUrl();
const adminUsername = getAdminUserName();
const adminPassword = getAdminPassword();
const investorBaseUrl = getInvestorBaseUrl();
const investorIDNP = getInvestorIDNP();
const investorPassword = getInvestorPassword();
const birthPlaceField = generateRandomStringOnlyUpperCase(7);
const docSeriesField = "A";
const docNumberField = generateRandomNumber(8);
const docIssueOrganization = '"URTSIGER"SIRC" SÎ"';
const addressLine = "str. " + generateRandomString(7) + " ." + generateRandomNumber(2);
const postalCode = generateRandomNumber(5);
const localityName = generateRandomStringOnlyUpperCase(7);
const occupation = generateRandomString(8) + generateRandomNumber(1);
const employmentOrganization = generateRandomStringOnlyUpperCase(10) + " S.R.L";
const jobTitle = generateRandomString(7) + "/ " + generateRandomString(10);
const bankIban = 'MD' + generateRandomNumber(2) + "ML" + generateRandomNumber(18);
const email1 = generateRandomStringOnlyLowerCase(5) + "@mail.md";
const email2 = generateRandomStringOnlyLowerCase(5) + "@mail.md";
const phoneNumber = "68" + generateRandomNumber(6);
const lastName = "BORCILĂ";
const emailCriticalField = "Email";



describe('Verify "Pending Verify" status of Investor when critical field is activated', () => {

    // Admin(operator) should be able to activate a critical field, investor must edit it,
    // and admin to see the status of the investor's profile to be "Pending Verify" -> MConnect NO
    it('Investor should be able to update profile info when a critical field is activated, MConnect YES', () => {

        cy.AdminSimpleLogin(adminBaseUrl, adminUsername, adminPassword);
        cy.contains('Administration').click(); // clicking on the 'Administration' tab
        cy.get('[href="/profile-edit-management"]').click(); // clicking on the "Manage KYC Critical Fields"
        cy.url().should('include', '/profile-edit-management');
        cy.contains('Critical fields management'); // validating that Admin is on the critical fields management
        cy.ActivateEmailCriticalField(emailCriticalField);


        //-- Log In as Investor to change the critical field we activated
        cy.setInvestorCredentials(investorIDNP, investorPassword);
        cy.InvestorLogin(investorBaseUrl);

        // navigating to "Profile" tab
        cy.get('a[ng-reflect-router-link="subscription-calendar,started"]').click(); // clicking subscription calendar option
        cy.wait(1000);
        cy.get('a[ng-reflect-router-link="/account/profile"]').eq(1).click(); // clicking on the "Profile" option
        cy.get('[data-cy="entityEditButton"]').click(); // clicking on the [Edit] button
        cy.get('[data-cy="entityConfirmDeleteButton"]').click(); // clicking on the [YES] button to extract from register
        cy.wait(2000);
        cy.url().should('include', '/kyc/registration');

        //navigating to the "Contact Information" form
        cy.contains('Contact Information').click();
        cy.get('#field_email').clear().type(email1);
        cy.get('span[jhitranslate="entity.action.update"]').click(); // clicking on the [Update] button

        cy.wait(500);
        cy.visit(adminBaseUrl); // cause we logged in in the beggining of the test we dont need to do it twice, we just visit the baseUrl

        //navigating to "All Investors" option

        cy.contains('Investors').click(); // clicking on the "Investors" tab
        cy.get('[routerlink="/investor-profiles"]').click(); // clicking on the "All Investors" option
        cy.contains('Investor Profiles'); // validating that admin is on the "Investor profiles" page
        const tableBody = cy.get('tbody');
        const matchingCell = tableBody.find('td').contains(lastName);
        const matchingRow = matchingCell.parent();
        matchingRow.find('a[data-cy="entityDetailsButton"]').should('be.visible').click();
        cy.contains(lastName); // validating that admin is on Investor's profile

        // validating "Pending Verify" status and email(critical field that was changed) and also changing it to "Active"

        cy.contains('Pending Verification');
        cy.scrollTo('bottom'); // scrolling down
        cy.contains(email1).should('exist');

        // changing profile status to "Active"
        cy.scrollTo('top'); // scrolling top
        cy.get('[icon="user-check"]').click(); // clicking on the [Validate] button
        cy.get('#jhi-validate-investorProfile-heading').should('contain', 'Are you sure you want to validate Investor Profile ');
        cy.get('#field_state').click(); // clicking on the drop-down
        cy.contains('Active').click(); // clicking on the "Active" option
        cy.get('[data-cy="entityConfirmValidateButton"]').click(); //clicking on the [Save] button
        // later to add that the user's State field is Active !!!

        // deactivating critical field to "Deactivated" status
        cy.wait(2000);
        cy.contains('Administration').click(); // clicking on the Administration tab
        cy.get('[routerlink="profile-edit-management"]').click(); // clicking on the KYC Critical Fields option
        cy.DeactivateEmailCriticalField(emailCriticalField);

    });

     // Admin(operator) should be able to activate a critical field, investor must edit it, 
     // and admin to see the status of the investor's profile to be "Pending Verify" -> MConnect NO
    it('Investor should be able to update profile info when a critical field is activated, MConnect NO', () => {

        cy.AdminSimpleLogin(adminBaseUrl, adminUsername, adminPassword);
        cy.contains('Administration').click(); // clicking on the 'Administration' tab
        cy.get('[href="/profile-edit-management"]').click(); // clicking on the "Manage KYC Critical Fields"
        cy.url().should('include', '/profile-edit-management');
        cy.contains('Critical fields management'); // validating that Admin is on the critical fields management
        cy.ActivateEmailCriticalField(emailCriticalField);


        //-- Log In as Investor to change the critical field we activated
        cy.setInvestorCredentials(investorIDNP, investorPassword);
        cy.InvestorLogin(investorBaseUrl);

        // navigating to "Profile" tab
        cy.get('a[ng-reflect-router-link="subscription-calendar,started"]').click(); // clicking subscription calendar option
        cy.wait(1000);
        cy.get('a[ng-reflect-router-link="/account/profile"]').eq(1).click(); // clicking on the "Profile" option
        cy.get('[data-cy="entityEditButton"]').click(); // clicking on the [Edit] button
        cy.get('.btn-outline-cancel').click(); // clicking on the [NO] button to extract from register
        cy.wait(2000);
        cy.url().should('include', '/kyc/registration');

        //navigating to the "Contact Information" form
        cy.contains('Contact Information').click();
        cy.get('#field_email').clear().type(email2);
        cy.get('span[jhitranslate="entity.action.update"]').click(); // clicking on the [Update] button

        cy.wait(500);
        cy.visit(adminBaseUrl); // cause we logged in in the beggining of the test we dont need to do it twice, we just visit the baseUrl

        //navigating to "All Investors" option
        cy.contains('Investors').click(); // clicking on the "Investors" tab
        cy.get('[routerlink="/investor-profiles"]').click(); // clicking on the "All Investors" option
        cy.contains('Investor Profiles'); // validating that admin is on the "Investor profiles" page
        const tableBody = cy.get('tbody');
        const matchingCell = tableBody.find('td').contains(lastName);
        const matchingRow = matchingCell.parent();
        matchingRow.find('a[data-cy="entityDetailsButton"]').should('be.visible').click();
        cy.contains('Pending Verification'); // validating the status "Pending Verify" with the list of all Investors

        // validating "Pending Verify" status and email(critical field that was changed) and also changing it to "Active"
        cy.scrollTo('bottom'); // scrolling down
        cy.contains(email2).should('exist').should('be.visible'); // validating the email in the full investor info, "Contact" table

        // full investor profile data, changing profile status to "Active"
        cy.scrollTo('top'); // scrolling top
        cy.contains('Pending Verification'); // validating the profile status in the "General Information" table
        cy.get('[icon="user-check"]').click(); // clicking on the [Validate] button
        cy.get('#jhi-validate-investorProfile-heading').should('contain', 'Are you sure you want to validate Investor Profile ');
        cy.get('#field_state').click(); // clicking on the drop-down
        cy.contains('Active').click(); // clicking on the "Active" option
        cy.get('[data-cy="entityConfirmValidateButton"]').click(); //clicking on the [Save] button
        // later to add that the user's State field is Active !!!

        // deactivating critical field to "Deactivated" status
        cy.wait(2000);
        cy.contains('Administration').click(); // clicking on the Administration tab
        cy.get('[routerlink="profile-edit-management"]').click(); // clicking on the KYC Critical Fields option
        cy.DeactivateEmailCriticalField(emailCriticalField);
        
    });

});