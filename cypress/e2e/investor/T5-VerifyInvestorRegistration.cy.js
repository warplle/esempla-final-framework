import { getAdminBaseUrl,getAdminUserName, getAdminPassword, getInvestorBaseUrl, getInvestorIDNP, getInvestorPassword,  generateRandomNumber, generateRandomString, generateRandomEmail, generateRandomBicCode,
    generateRandomStringRU, generateRandomStringOnlyLowerCase, generateRandomStringWithNumbers, generateRandomStringOnlyUpperCase } from '../../support/functions.js';


const adminBaseUrl = getAdminBaseUrl();
const adminUsername = getAdminUserName();
const adminPassword = getAdminPassword();
const investorBaseUrl = getInvestorBaseUrl();
const investorIDNP = getInvestorIDNP();
const investorPassword = getInvestorPassword();
const birthPlaceField = generateRandomStringOnlyUpperCase(7);
const docSeriesField = "A";
const docNumberField = "1" + generateRandomNumber(7);
const docIssueOrganization = '"URTSIGER"SIRC" SÎ"';
const addressLine = "str. " + generateRandomString(7) + " ." + generateRandomNumber(2);
const postalCode = generateRandomNumber(5);
const localityName = generateRandomStringOnlyUpperCase(7);
const occupation = generateRandomString(8) + generateRandomNumber(1);
const employmentOrganization = generateRandomStringOnlyUpperCase(10) + " S.R.L";
const jobTitle = generateRandomString(7) + "/ " + generateRandomString(10);
const bankIban = 'MD' + generateRandomNumber(2) + "ML" + generateRandomNumber(18);
const email = generateRandomStringOnlyLowerCase(5) + "@mail.md";
const phoneNumber = "68" + generateRandomNumber(6);
const lastName = "BORCILĂ";


describe('Verify Investor Account creation', () => {


    it.skip('Investor should be able to authenticate with valid data in all fields, with MConnect extracting option', () => {

        cy.setInvestorCredentials(investorIDNP, investorPassword);
        cy.InvestorRegistration(investorBaseUrl);

        cy.contains('Know Your Client - Registration Terms and Conditions');
        
        cy.url().should('include', '/kyc/terms');
        
        cy.get('.h2-custom')
        .should('exist')
        .should('be.visible')
        .should('contain', 'Terms and Conditions'); //validating the text

        cy.get('.p-custom')
        .should('exist')
        .should('be.visible')
        .should('contain', 'Please confirm that you have read and agree to the') // text validation
        
        cy.get('.form-check-label')
        .should('exist')
        .should('be.visible')
        .should('contain', 'I read and agree with the Terms and Conditions'); // checkbox text validation

        cy.get('#field_declaration').click(); // clicking on the checkbox 
        
        cy.get('.btn').click();

        cy.url().should('include', '/kyc/registration');

        //----------Investor entering data in the fields---------------

        //-----General Information section-------------
        cy.wait(5000);
        cy.get('#field_birthPlace').clear().type(birthPlaceField); // birthPlace
        cy.contains('Document').click();
        cy.SelectRandomDocType();
        cy.get('[data-cy="docIssueOrganization"]').click();
        cy.get('#field_docSeries').clear().type(docSeriesField);
        cy.get('#field_docNumber').clear().type(docNumberField);
        cy.get('#field_docIssueOrganization').clear().type(docIssueOrganization);

        //---Permanent/Residence Address section------------
        cy.contains('Permanent and / or Residence Address').click();
        cy.get('#field_addressLine').clear().type(addressLine);
        cy.get('#field_postalCode').clear().type(postalCode);
        cy.get('#field_localityName').clear().type(localityName);
        // Country Name option => Moldova(default)

        //---Occupation section-----------
        cy.contains('Occupation').click();
        cy.get('#field_userOccupation').clear().type(occupation);
        cy.wait(1000);
        cy.SelectRandomIncomeSource();
        cy.get('#field_employmentOrganization').clear().type(employmentOrganization);
        cy.get('#field_jobTitle').clear().type(jobTitle);

        //---Bank Account section-------
        cy.contains('Bank Account').click();

        // 
        cy.get('[formcontrolname="bankIban"]').click(); // clicking on the Bank Iban field
        //cy.get('.ng-option').eq(1).click(); //selecting second option available 

        //saving the option text to a variable, in most cases the user will have 1 bankIban
        let bankIbanOption;
        cy.get('.ng-option').eq(1).then($option => {
            bankIbanOption = $option.text().trim();
            cy.get('.ng-option').eq(1).click();

        cy.SelectRandomBankCommercialBank();

        //---Contact Information--------------
        cy.contains('Contact Information').click();
        cy.get('#field_email').clear().type(email);
        cy.get('#phone').clear().type(phoneNumber);

        cy.get('#field_declaration').click();
        cy.get('[ng-reflect-jhi-translate="entity.action.save"]').click(); // clicking on the [Save] button
        
        // Log in as Administrator(operator) to change the status to active
        cy.AdminSimpleLogin(adminBaseUrl, adminUsername, adminPassword);
        cy.ChangeInvestorProfileToActive(lastName, birthPlaceField, occupation, employmentOrganization, jobTitle, 
         docSeriesField, docNumberField, docIssueOrganization, addressLine, postalCode, localityName,
        bankIbanOption, phoneNumber, email);
        });        

    });
    
    it.skip('Investor should be able to authenticate with valid data in all fields, without MConnect extracting option', () => {


        cy.setInvestorCredentials(investorIDNP, investorPassword);
        cy.InvestorRegistration(investorBaseUrl);

        cy.contains('Know Your Client - Registration Terms and Conditions');
        
        cy.url().should('include', '/kyc/terms');
        
        cy.get('.h2-custom')
        .should('exist')
        .should('be.visible')
        .should('contain', 'Terms and Conditions'); //validating the text

        cy.get('.p-custom')
        .should('exist')
        .should('be.visible')
        .should('contain', 'Please confirm that you have read and agree to the') // text validation
        
        cy.get('.form-check-label')
        .should('exist')
        .should('be.visible')
        .should('contain', 'I read and agree with the Terms and Conditions'); // checkbox text validation

        cy.get('#field_declaration').click(); // clicking on the checkbox 
        
        cy.get('.btn').click();

        cy.url().should('include', '/kyc/registration');

        //----------Investor entering data in the fields---------------

        //-----General Information section-------------
        cy.wait(2000);
        cy.get('#field_birthPlace').clear().type(birthPlaceField); // birthPlace
        cy.contains('Document').click();
        cy.SelectRandomDocType();
        cy.get('[data-cy="docIssueOrganization"]').click();
        cy.get('#field_docSeries').clear().type(docSeriesField);
        cy.get('#field_docNumber').clear().type(docNumberField);
        cy.get('#field_docIssueOrganization').clear().type(docIssueOrganization);

        //---Permanent/Residence Address section------------
        cy.contains('Permanent and / or Residence Address').click();
        cy.get('#field_addressLine').clear().type(addressLine);
        cy.get('#field_postalCode').clear().type(postalCode);
        cy.get('#field_localityName').clear().type(localityName);
        // Country Name option => Moldova(default)

        //---Occupation section-----------
        cy.contains('Occupation').click();
        cy.get('#field_userOccupation').clear().type(occupation);
        cy.wait(1000);
        cy.SelectRandomIncomeSource();
        cy.get('#field_employmentOrganization').clear().type(employmentOrganization);
        cy.get('#field_jobTitle').clear().type(jobTitle);

        //---Bank Account section-------
        cy.contains('Bank Account').click();

        // 
        cy.get('[formcontrolname="bankIban"]').click(); // clicking on the Bank Iban field
        //cy.get('.ng-option').eq(1).click(); //selecting second option available 

        //saving the option text to a variable, in most cases the user will have 1 bankIban
        let bankIbanOption;
        cy.get('.ng-option').eq(1).then($option => {
            bankIbanOption = $option.text().trim();
            cy.get('.ng-option').eq(1).click();

        cy.SelectRandomBankCommercialBank();

        //---Contact Information--------------
        cy.contains('Contact Information').click();
        cy.get('#field_email').clear().type(email);
        cy.get('#phone').clear().type(phoneNumber);

        cy.get('#field_declaration').click();
        cy.get('[ng-reflect-jhi-translate="entity.action.save"]').click(); // clicking on the [Save] button
        
        // Log in as Administrator(operator) to change the status to active
        cy.AdminSimpleLogin(adminBaseUrl, adminUsername, adminPassword);
        cy.ChangeInvestorProfileToActive(lastName, birthPlaceField, occupation, employmentOrganization, jobTitle, 
         docSeriesField, docNumberField, docIssueOrganization, addressLine, postalCode, localityName,
        bankIbanOption, phoneNumber, email);
                
    })
})
});
