import { getAdminBaseUrl, getAdminUserName, getAdminPassword, generateRandomNumber, generateRandomString, generateRandomEmail, generateRandomBicCode,
    generateRandomStringRU, generateRandomStringWithNumbers, generateRandomStringOnlyUpperCase } from '../../../support/functions.js';

const baseUrl = getAdminBaseUrl();
const adminUserName = getAdminUserName();
const adminPassword = getAdminPassword();
const bic = "00" + generateRandomStringOnlyUpperCase(2) + generateRandomStringOnlyUpperCase(2) + generateRandomStringWithNumbers(2) + generateRandomNumber(3);
const IDNO = generateRandomNumber(13);
const name = generateRandomString(6) + " " + generateRandomString(7);
const nameRu = generateRandomStringRU(6) + " " + generateRandomStringRU(7);
const nameEn = generateRandomString(6) + " " + generateRandomString(7);
const bankCode = generateRandomString(2);
const bankCode1 = generateRandomString(2);


describe('Verify admin can create a new commercial bank', () => {

    it('Admin should be able to create a new valid bank with valid data in all fields', () => {
        
        cy.AdminSimpleLogin(baseUrl, adminUserName, adminPassword);

         //Language change
         cy.get('#languagesnavBarDropdown').click();
         //cy.get('[ng-reflect-jhi-active-menu="en"]').click();
         cy.contains('a', 'English').click();

        cy.contains('Classifiers').click(); // clicking on the "Classifiers" drop-down option
        cy.get('a[routerlink="/cf-commercial-banks"]').click();  // clicking on the "Cf Commercial Banks" option
        cy.get('#jh-create-entity').click(); // clicking on the [Add new] button

        // Entering data in the fields
        cy.get('#field_bic').type(bic);
        cy.get('#field_idno').type(IDNO);
        cy.get('#field_name').type(name);
        cy.get('#field_nameRu').type(nameRu);
        cy.get('#field_nameEn').type(nameEn);
        cy.get('#field_bankCode').type(bankCode);

        cy.get('#save-entity').click(); // clicking on the [Save] button 

        cy.get('.alert').should('contain', 'A new Commercial Bank is created with identifier');
        cy.get(':nth-child(2) > .page-link').click(); // page 1
        cy.get('[jhisortby="bic"] > .d-flex > .ng-fa-icon').click(); // sorting by Bic

        cy.DeleteCreatedBank(IDNO);
    });
});

    describe('Verify admin can view details of a commercial bank', () => {

        it('Admin should be able to view details of a valid bank', () => {
            
            cy.AdminSimpleLogin(baseUrl, adminUserName, adminPassword);

             //Language change
         cy.get('#languagesnavBarDropdown').click();
         //cy.get('[ng-reflect-jhi-active-menu="en"]').click();
         cy.contains('a', 'English').click();

    
            cy.contains('Classifiers').click(); // clicking on the "Classifiers" drop-down option
            cy.get('a[routerlink="/cf-commercial-banks"]').click();  // clicking on the "Cf Commercial Banks" option
            //cy.get('a[data-cy="entityDetailsButton"]').eq(1).click(); // clicking on the [Details] button

            cy.get('#jh-create-entity').click(); // clicking on the [Add new] button

            // Entering data in the fields
            cy.get('#field_bic').type(bic);
            cy.get('#field_idno').type(IDNO);
            cy.get('#field_name').type(name);
            cy.get('#field_nameRu').type(nameRu);
            cy.get('#field_nameEn').type(nameEn);
            cy.get('#field_bankCode').type(bankCode1);

            cy.get('#save-entity').click(); // clicking on the [Save] button 

            cy.get('.alert').should('contain', 'A new Commercial Bank is created with identifier');
            //cy.get(':nth-child(3) > .page-link').click(); // page 1
            cy.get('[jhisortby="bic"] > .d-flex > .ng-fa-icon').click(); // sorting by Bic // sorting by Bic

            cy.ViewDetailsCreatedBank(bic, IDNO, name, nameRu, nameEn); // validaing data of the createad bank

            cy.contains('Cf Commercial Banks');
            cy.get('button[data-cy="entityDetailsBackButton"]').should('exist').should('be.visible').should('contain', 'Back'); // [Back] button
            cy.get('span[jhitranslate="entity.action.edit"]').should('exist').should('be.visible').should('contain', 'Edit'); // [Edit] button
            cy.get('button[data-cy="entityDetailsBackButton"]').click(); // clicking on the [Back] button

            cy.DeleteCreatedBank(IDNO);
        });
    });

        // This test outputs the activated fields from the critical fields management option
        describe.skip('Output all activated options from critical fields management', () => {

            it('Output activated fields', () => {
                
                cy.AdminSimpleLogin(baseUrl, adminUserName, adminPassword);
        
                cy.contains('Administration').click(); // clicking on the "Administration" drop-down option
                cy.get('a[href="/profile-edit-management"]').click();  // clicking on the "Critical fields management" option

                // outputting the options that have status "Activated"
                cy.DisplayOnlyActiveFields();

  });
});