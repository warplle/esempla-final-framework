import { getInvestorBaseUrl, getInvestorIDNP, getInvestorPassword,  generateRandomNumber, generateRandomString, generateRandomEmail, generateRandomBicCode,
generateRandomStringRU, generateRandomStringWithNumbers, generateRandomStringOnlyUpperCase, generateRandomStringOnlyLowerCase, getAdminBaseUrl, getAdminUserName, getAdminPassword } from '../../support/functions.js';

const investorBaseUrl = getInvestorBaseUrl();
const investorIDNP = getInvestorIDNP();
const investorPassword = getInvestorPassword();


describe('Verify investor can navigate through his tabs', () => {

    it('Investor should be able to navigate through his tabs', () => {

        // investor Login
        cy.setInvestorCredentials(investorIDNP, investorPassword);
        cy.InvestorLogin(investorBaseUrl);
        
        //-----Portofolio Tab-------------------
        //-----Transactions Tab-----------------
        //-----Transactions History Tab-------------
        //-----Profile Tab----------------------
       
        
    });
});