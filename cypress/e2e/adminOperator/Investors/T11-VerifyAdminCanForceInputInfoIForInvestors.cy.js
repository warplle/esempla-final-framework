import { getAdminBaseUrl, getAdminUserName, getAdminPassword, generateRandomNumber, generateRandomString, generateRandomEmail, generateRandomBicCode,
    generateRandomStringRU, generateRandomStringWithNumbers, generateRandomStringOnlyUpperCase } from '../../../support/functions.js';

const baseUrl = getAdminBaseUrl();
const adminUserName = getAdminUserName();
const adminPassword = getAdminPassword();


describe('Verify Admin can force input info for investors', () => {

    // forcing investors to reenter their data
    it('Admin should be able to force input info for investors', () => {
        
        //need button [Terms and conditions] to appear for investor's profile
        
    });
});