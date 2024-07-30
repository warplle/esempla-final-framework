import { getInvestorBaseUrl, getInvestorIDNP, getInvestorPassword,  generateRandomNumber, generateRandomString, generateRandomEmail, generateRandomBicCode,
    generateRandomStringRU, generateRandomStringWithNumbers, generateRandomStringOnlyUpperCase, generateRandomStringOnlyLowerCase, getAdminBaseUrl, getAdminUserName,
     getAdminPassword, InvestorLogin } from '../../support/functions.js';

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


// the profile should be active(registration completed)
describe('Verify Investor can edit profile data', () => {

    //MCONNECT YES
    it('Investor should be able to edit profile with valid data in all fields, MConnect YES', () => {
        
        cy.setInvestorCredentials(investorIDNP, investorPassword);
        cy.InvestorLogin(investorBaseUrl);

        cy.get('a[ng-reflect-router-link="subscription-calendar,started"]').click(); // clicking subscription calendar option
        cy.wait(1000);
        cy.get('a[ng-reflect-router-link="/account/profile"]').eq(1).click(); // clicking on the "Profile" option
        cy.get('[data-cy="entityEditButton"]').click(); // clicking on the [Edit] button
        cy.get('[data-cy="entityConfirmDeleteButton"]').click(); // clicking on the [YES] button to extract from register

        //-----General Information section-------------
        cy.wait(4000);
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
        // let bankIbanOption;
        // cy.get('.ng-option').eq(1).then($option => {
        //     bankIbanOption = $option.text().trim();
        //     cy.get('.ng-option').eq(1).click();

        cy.BankIbanDataInput();

        cy.SelectRandomBankCommercialBank();

        //---Contact Information--------------
        cy.contains('Contact Information').click();
        cy.get('#field_email').clear().type(email);
        cy.get('#phone').clear().type(phoneNumber);

        //cy.get('[data-cy="declaration"]').click(); //clickig on the checkbox button
        cy.get('span[jhitranslate="entity.action.update"]').click(); // clicking on the [Update] button
        
        // Log in as Administrator(operator) to change the status to active
        cy.AdminSimpleLogin(adminBaseUrl, adminUsername, adminPassword);
        cy.ChangeInvestorProfileToActive(lastName, birthPlaceField, occupation, employmentOrganization, jobTitle, 
         docSeriesField, docNumberField, docIssueOrganization, addressLine, postalCode, localityName, //bankIbanOption,
          phoneNumber, email);
        });
    });

    // MCONNECT NO
    it('Investor should be able to edit profile with valid data in all fields, MConnect NO', () => {

        
        cy.setInvestorCredentials(investorIDNP, investorPassword);
        cy.InvestorLogin(investorBaseUrl);

        cy.get('a[ng-reflect-router-link="subscription-calendar,started"]').click(); // clicking subscription calendar option
        cy.wait(1000);
        cy.get('a[ng-reflect-router-link="/account/profile"]').eq(1).click(); // clicking on the "Profile" option
        cy.get('[data-cy="entityEditButton"]').click(); // clicking on the [Edit] button
        cy.get('[jhitranslate="entity.action.no"]').click(); // clicking on the [NO] button to extract from register

        //-----General Information section-------------
        cy.wait(4000);
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
        cy.wait(2000);
        cy.SelectRandomIncomeSource();
        cy.get('#field_employmentOrganization').clear().type(employmentOrganization);
        cy.get('#field_jobTitle').clear().type(jobTitle);

        //---Bank Account section-------
        cy.contains('Bank Account').click();

        //cy.get('[formcontrolname="bankIban"]').clear().type(bankIban);
        //cy.get('[formcontrolname="bankIban"]').click();

       //saving the option text to a variable, in most cases the user will have 1 bankIban
    //    let bankIbanOption;
    //    cy.get('.ng-option').eq(0).then($option => {
    //        bankIbanOption = $option.text().trim();
    //        cy.get('.ng-option').eq(0).click();

       cy.BankIbanDataInput(bankIban);

       cy.SelectRandomBankCommercialBank();

       //---Contact Information--------------
       cy.contains('Contact Information').click();
       cy.get('#field_email').clear().type(email);
       cy.get('#phone').clear().type(phoneNumber);

       //cy.get('[data-cy="declaration"]').click(); //clickig on the checkbox button
       cy.get('span[jhitranslate="entity.action.update"]').click(); // clicking on the [Update] button
       
       // Log in as Administrator(operator) to change the status to active
       cy.AdminSimpleLogin(adminBaseUrl, adminUsername, adminPassword);
       cy.ChangeInvestorProfileToActive(lastName, birthPlaceField, occupation, employmentOrganization, jobTitle, 
        docSeriesField, docNumberField, docIssueOrganization, addressLine, postalCode, localityName, //bankIban, 
        phoneNumber, email);
        
       });
