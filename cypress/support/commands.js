// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

//-----------------------------ADMIN(Operator)--------------------------------------------------------------------------------

// Cypress.Commands.add('setAdminCredentials', (userName, password) => {
//   Cypress.env('adminUsername', userName);
//   Cypress.env('adminPassword', password);
// }); // connected with 

// Cypress.Commands.add('AdminLogin', (baseUrl) => {

//   cy.visit(baseUrl);
//   cy.url().should('include', '/login?prefix=iamadmin');
//   cy.contains('Welcome back!');
//   cy.contains('Sign in to your account to continue');

//   // cy.origin('https://cabinet.retail.esempla.systems/login?prefix=iamadmin', () => {

//   // cy.url().should('include', '/login?prefix=iamadmin');
//   // cy.contains('Welcome back!');
//   // cy.contains('Sign in to your account to continue');

//   //   const adminUsername = Cypress.env('adminUserName');
//   //   const adminPassword = Cypress.env('adminPassword');
      
//   //     cy.get('#UsernamePassword').type(adminUsername);
//   //     cy.get('#Password').type(adminPassword);
//   //     cy.contains('button[type="submit"]').click(); // clicking on the [Sign in] button
//   //     cy.contains('Welcome, to Retail Management!');
//   //     cy.contains('You are logged in as user "Dumitru Virtosu".');
//   //   });
//   //     cy.get('#account-menu').should('contain', 'Administrator Administrator');

// });

Cypress.Commands.add('AdminSimpleLogin', (baseUrl, username, password) => {

    cy.visit(baseUrl);
    //cy.url().should('include', '/login?prefix=iamadmin');
    cy.contains('Welcome back!');
    cy.contains('Sign in to your account to continue');
    cy.wait(500);
    cy.get('#username').type(username);
    cy.wait(500);
    cy.get('#password').type(password);
    cy.get('button[type="submit"]').click(); // [Sign In] button
    //cy.contains('Welcome, to Retail Management!');
    //cy.contains('You are logged in as user "Administrator Administrator".');
});


Cypress.Commands.add('setAdminCredentials', (username, password) => {
  Cypress.env('originUserName', username);
  Cypress.env('originPassword', password);
}); // connected with the Admin Login command

Cypress.Commands.add('AdminLogin', (baseUrl) => {

  cy.visit(baseUrl);

  cy.contains('Welcome back!');

  cy.origin('https://cabinet.retail.esempla.systems/login?prefix=iamadmin', () => {

    const originUserName = Cypress.env('originUserName');
    const originPassword = Cypress.env('originPassword');
      
      cy.get('#UsernamePassword').type(originUserName);
      cy.get('#Password').type(originPassword);
      cy.contains('Sign in').click();
    });
      cy.get('#account-menu').should('contain', 'Administrator Administrator');

});


Cypress.Commands.add('DeleteCreatedBank', (IDNO) => {
    
    cy.get('[data-cy="entityCreateButton"]').should('contain', 'Add New'); // validating that user is redirected back to bank list
    
        const tableBody = cy.get('tbody');

        // Find the rows (td elements) containing the code
        const matchingCell = tableBody.find('td').contains(IDNO);

        // Get the first matching row
        const matchingRow = matchingCell.parent();

        // Click the edit button within the first matching row (assuming button class is 'edit-btn')
        matchingRow.find('[data-cy="entityDeleteButton"]').click();

        cy.get('#jhi-delete-cfCommercialBanks-heading').should('contain', 'Are you sure you want to delete Commercial Banks'); // validating delete action
        cy.get('button[data-cy="entityConfirmDeleteButton"]').click(); // clicking/confirming the delete action 

        cy.get('div.top.right ngb-alert.alert-success').should('contain', 'A Commercial Bank is deleted with identifier'); // validating delete action
});

Cypress.Commands.add('DeleteCreatedGsPlacement', (isinCode) => {
    
    cy.get('span[jhitranslate="entity.action.addnew"]').should('contain', 'Add new'); // validating that user is redirected back to bank list
    
        const tableBody = cy.get('tbody');

        // Find the rows (td elements) containing the code
        const matchingCell = tableBody.find('td').contains(isinCode);

        // Get the first matching row
        const matchingRow = matchingCell.parent();

        // Click the edit button within the first matching row
        matchingRow.find('button[data-cy="entityDeleteButton"]').click();

        cy.get('#jhi-delete-gsPlacement-heading').should('contain', 'Are you sure you want to delete Gs Placement'); // validating delete action
        cy.get('button[data-cy="entityConfirmDeleteButton"]').click(); // clicking/confirming the delete action 

        cy.get('.alert').should('exist').should('be.visible').should('not.be.empty'); // validating the confirmation message
        cy.contains('Gs Placements');
});

Cypress.Commands.add('ViewDetailsCreatedBank', (bic, idno, name, nameRu, nameEn, createDate, createBy, updateDate, updateBy, closeDate, comment) => {

    cy.get('span[jhitranslate="entity.action.addnew"]').should('contain', 'Add New'); // validating that user is redirected back to bank list
    
        const tableBody = cy.get('tbody');
        const matchingCell = tableBody.find('td').contains(idno);
        const matchingRow = matchingCell.parent();
        matchingRow.find('a[data-cy="entityDetailsButton"]').click(); // clicking on the [Details] button

                cy.get('.row-md') // validating the name of the fields
                .should('contain', 'Bic')
                .should('contain', 'Idno')
                .should('contain', 'Name')
                .should('contain', 'Name Ru')
                .should('contain', 'Name En')
                .should('contain', 'Create Date')
                .should('contain', 'Create By')
                .should('contain', 'Update Date')
                .should('contain', 'Update By')
                .should('contain', 'Close Date')
                .should('contain', 'Comment')

                cy.get('.row-md') // validating the user's input in the fields
                .should('contain', bic).should('exist').should('be.visible').should('not.be.empty')
                .should('contain', idno).should('exist').should('be.visible').should('not.be.empty')
                .should('contain', name).should('exist').should('be.visible').should('not.be.empty')
                .should('contain', nameRu).should('exist').should('be.visible').should('not.be.empty')
                .should('contain', nameEn).should('exist').should('be.visible').should('not.be.empty');
});

Cypress.Commands.add('ViewDetailsCreatedGsPlacement', ( title, isinCode, nominalValue, currentPrice, currency,
    interestRate, yieldValue, indicativeVolume, miminumOrder, maximumOrder, maximumOwnershipQt, couponPaymentsDate) => {

    cy.get('span[jhitranslate="entity.action.addnew"]').should('contain', 'Add new'); // validating that user is redirected back to bank list
    
        const tableBody = cy.get('tbody');
        const matchingCell = tableBody.find('td').contains(isinCode);
        const matchingRow = matchingCell.parent();
        matchingRow.find('a[data-cy="entityDetailsButton"]').click(); // clicking on the [Details] button

                cy.get('div[class="mt-2 tab-content"]') // validating the name of the fields
                .should('contain', 'Title')
                .should('contain', 'Type')
                .should('contain', 'Isin Code')
                .should('contain', 'Subscription Start Date')
                .should('contain', 'Subscription End Date')
                .should('contain', 'Nominal Value')
                .should('contain', 'Maturity Date')
                .should('contain', 'Circulation Term')
                .should('contain', 'Interest Rate')
                .should('contain', 'Current Price')
                .should('contain', 'Indicative Volume')
                .should('contain', 'Yield')
                .should('contain', 'Coupon Payment Dates')
                .should('contain', 'State')
                .should('contain', 'Minimum Order')
                .should('contain', 'Maximum Order')
                .should('contain', 'Maximum Ownership Qt')
                .should('contain', 'Currency')
                .should('contain', 'Secondary Market Sell')

                cy.get('.col-12') // validating the user's input in the fields
                //.should('contain', type).should('exist').should('be.visible').should('not.be.empty')
                .should('contain', title).should('exist').should('be.visible').should('not.be.empty')
                .should('contain', isinCode).should('exist').should('be.visible').should('not.be.empty')
                .should('contain', nominalValue).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', circulationTerm).should('exist').should('be.visible').should('not.be.empty')
                .should('contain', currentPrice).should('exist').should('be.visible').should('not.be.empty')
                .should('contain', currency).should('exist').should('be.visible').should('not.be.empty')
                .should('contain', interestRate).should('exist').should('be.visible').should('not.be.empty')
                .should('contain', yieldValue).should('exist').should('be.visible').should('not.be.empty')
                .should('contain', indicativeVolume).should('exist').should('be.visible').should('not.be.empty')
                .should('contain', miminumOrder).should('exist').should('be.visible').should('not.be.empty')
                .should('contain', maximumOrder).should('exist').should('be.visible').should('not.be.empty')
                .should('contain', maximumOwnershipQt).should('exist').should('be.visible').should('not.be.empty')
                .should('contain', couponPaymentsDate).should('exist').should('be.visible').should('not.be.empty');
});

Cypress.Commands.add('DisplayOnlyActiveFields', () => {
  
    cy.get('tbody').find('tr').each(($tr) => {
    const $button = $tr.find('button[ng-reflect-ng-class="btn-success"]');
    if ($button.length > 0) {
        const optionName = $tr.find('td').eq(0).find('span');
        const text = optionName.text().trim();
        cy.log(text);
    }
})
});

Cypress.Commands.add('SelectRandomGSType', () => {
  // Define available GS types
  const gstypes = {
    TREASURY_BILLS: 'TREASURY_BILLS',
    GOVERNMENT_BONDS: 'GOVERNMENT_BONDS',
  };

  // Click the dropdown element to open it
  cy.get('#field_securitiesName').invoke('click');

  // Get all options except the disabled "Select GS Type"
  cy.get('#field_securitiesName option:not([disabled])').then(($options) => {
    // Get a random index to select an option
    const randomIndex = Math.floor(Math.random() * $options.length);

    // Get the value of the randomly selected option
    const randomValue = $options.eq(randomIndex).val();

    // Select the option with the random value
    cy.get('#field_securitiesName').select(randomValue);
  });
});

Cypress.Commands.add('SelectRandomCirculationTermTreasuryBills', () => {
  // Define available circulation terms
  const circulationTerms = {
    "60 Day": '60 Day',
    "90 Day": '90 Day',
    "120 Day": '120 Day',
  };

  cy.wait(500);
  // Click the dropdown element to open it
  cy.get('.ng-input').eq(0).click();

  cy.wait(500);

  // Get all options except the disabled placeholder
  cy.get('.ng-dropdown-panel-items .ng-option').then(($options) => {
    // Get a random index to select an option
    const randomIndex = Math.floor(Math.random() * Object.keys(circulationTerms).length);

    // Get the value of the randomly selected option
    const randomKey = Object.keys(circulationTerms)[randomIndex];
    const randomValue = circulationTerms[randomKey];

    // Select the option with the random value
    cy.contains(randomKey).click();
  });
});

Cypress.Commands.add('SelectRandomCirculationTermGovernmentBonds', () => {
  // Define available circulation terms
  const circulationTerms = {
    "1 Year": '1 Year',
    "2 Year": '2 Year',
    "3 Year": '3 Year',
  };

  // Click the dropdown element to open it
  cy.get('.ng-input').eq(0).click();

  // Get all options except the disabled placeholder
  cy.get('.ng-dropdown-panel-items .ng-option').then(($options) => {
    // Get a random index to select an option
    const randomIndex = Math.floor(Math.random() * Object.keys(circulationTerms).length);

    // Get the value of the randomly selected option
    const randomKey = Object.keys(circulationTerms)[randomIndex];
    const randomValue = circulationTerms[randomKey];

    // Select the option with the random value
    cy.contains(randomKey).click();
  });
});

Cypress.Commands.add('SelectRandomCurrency', () => {
    // Enum for currency options
    const CurrencyOptions = {
      USD: 'USD',
      EUR: 'EUR',
      MDL: 'MDL'
    };
  
    // Get all the options within the dropdown
    cy.get('#field_currency').find('option').then(options => {
      // Filter out disabled option
      const filteredOptions = options.filter((index, element) => {
        return !element.disabled;
      });
  
      // Calculate the number of options
      const numOptions = filteredOptions.length;
  
      // Generate a random index between 0 and the number of options - 1
      const randomIndex = Math.floor(Math.random() * numOptions);
  
      // Get the value of the randomly selected option
      const selectedOptionValue = filteredOptions.eq(randomIndex).val();
  
      // Select the option by its value
      cy.get('#field_currency').select(selectedOptionValue);     
    });
  });

Cypress.Commands.add('RandomlyCheckboxClick', () => {
    // Generate a random boolean value (true or false)
    const shouldToggle = Math.random() < 0.5;
  
    // Check if the checkbox should be toggled
    if (shouldToggle) {
      // Click on the checkbox
      cy.get('#field_secondaryMarketSell').click();
    } else {
      // Leave the checkbox unchecked
      cy.get('#field_secondaryMarketSell').click();
    }
  });

  Cypress.Commands.add('GenerateCurrentDateTimeIssueDateField', () => {
    const now = new Date();
  
    // Format the date as "day/month/year"
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '');
    const currentDateTime = `${day}.${month}.${year}`;

    // Click on the input field to open the datepicker
    cy.get('.input-group > .btn').eq(0).click();

    // Click on the current date in the datepicker
    cy.get('.ngb-dp-day').contains(day).click();
    // Confirm that the date has been selected
    cy.get('#field_issueDate').should('have.value', currentDateTime);
});

Cypress.Commands.add('ActivateSecondaryMarketSellTB', () => {

    cy.get('[for="secondaryMarketSell1"]').click(); // clicking on the [Yes] button for Secondary Market Sell

    cy.wait(500);

    cy.get('.ng-input').eq(1).click(); // clicking on the Primary List Drop-down

    //cy.get('#SelectAll').click(); // clickig on the [Select All] option from the drop-down

    cy.contains("Select all").click();
});

Cypress.Commands.add('ActivateSecondaryMarketSellGB', () => {

  cy.get('[for="secondaryMarketSell1"]').click(); // clicking on the [Yes] button for Secondary Market Sell

  cy.get('.ng-input').eq(1).click(); // clicking on the Primary List Drop-down

  cy.wait(1000);

  //cy.get('#SelectAll').click(); // clickig on the [Select All] option from the drop-down

  cy.contains("Select all").click();
});

Cypress.Commands.add('GenerateNextDayDateTimeMaturityDateFieldTB', () => {
  const now = new Date();

  // Format the date as "day/month/year"
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate() +1).padStart(2, '0');
  const currentDateTime = `${day}.${month}.${year}`;

  // Click on the input field to open the datepicker
  //cy.get('.input-group > .btn').eq(1).click();

  cy.get('#field_maturityDate').clear().type(currentDateTime)

  // Click on the current date in the datepicker
  //cy.contains('.ngb-dp-day', day).click();

  // Confirm that the date has been selected
  cy.get('#field_maturityDate').should('have.value', currentDateTime);
});

Cypress.Commands.add('GenerateCurrentDayDateTimeMaturityDateFieldTB', () => {
  const now = new Date();

  // Format the date as "day/month/year"
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const currentDateTime = `${day}.${month}.${year}`;

  // Click on the input field to open the datepicker
  //cy.get('.input-group > .btn').eq(1).click();

  cy.get('#field_maturityDate').clear().type(currentDateTime)

  // Click on the current date in the datepicker
  //cy.contains('.ngb-dp-day', day).click();

  // Confirm that the date has been selected
  cy.get('#field_maturityDate').should('have.value', currentDateTime);
});

Cypress.Commands.add('GenerateNextDayDateTimeMaturityDateFieldGB', () => {
  const now = new Date();

  // Format the date as "day/month/year"
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate() + 1).padStart(2, '0');
  const currentDateTime = `${day}.${month}.${year}`;

  // Click on the input field to open the datepicker
  //cy.get('.input-group > .btn').eq(1).click();

  cy.get('#field_maturityDate').clear().type(currentDateTime)

  // Click on the current date in the datepicker
  //cy.contains('.ngb-dp-day', day).click();

  // Confirm that the date has been selected
  cy.get('#field_maturityDate').should('have.value', currentDateTime);
});

Cypress.Commands.add('GenerateCurrentDayDateTimeMaturityDateFieldGB', () => {
  const now = new Date();

  // Format the date as "day/month/year"
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const currentDateTime = `${day}.${month}.${year}`;

  // Click on the input field to open the datepicker
  //cy.get('.input-group > .btn').eq(1).click();

  cy.get('#field_maturityDate').clear().type(currentDateTime)

  // Click on the current date in the datepicker
  //cy.contains('.ngb-dp-day', day).click();

  // Confirm that the date has been selected
  cy.get('#field_maturityDate').should('have.value', currentDateTime);
});

  Cypress.Commands.add('GenerateCurrentDateTimeStartDateFieldTB', () => {

    const now = new Date();
  
    // Format the date as "day/month/year"
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentDateTime = `${day}.${month}.${year} ${hours}:${minutes}`;

    // Click on the input field to open the datepicker
    cy.get('.input-group > .btn').eq(2).click();

    // Click on the current date in the datepicker
    cy.get('.ngb-dp-day').contains(day).click();

    cy.get('#sidebar-action').click();

    // Confirm that the date has been selected
    //cy.get('#field_subscriptionStartDate').should('have.value', currentDateTime);
  
  });

  Cypress.Commands.add('GenerateFutureDateTimeEndDateFieldTB', () => {
  
    const now = new Date();

    // // Add 7 days to the current date to get a future date
     const futureDate = new Date(now);
     futureDate.setDate(futureDate.getDate() +5);
    
    // Format the date as "day/month/year"
    const year = now.getFullYear();
    const month = String(futureDate.getMonth() + 1).padStart(2, '0');
    const day = String(futureDate.getDate()).padStart(2, '');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const futureDateTime = `${day}.${month}.${year} ${hours}:${minutes}`;
    
    // Click on the input field to open the datepicker
    cy.get('#field_subscriptionEndDate > .input-group > .btn').click();

    // Click on the current date in the datepicker
    cy.contains('.btn-light', day).click();

    // Confirm that the date has been selected
    //cy.get('#field_subscriptionEndDate').should('have.value', futureDateTime);

    
});

Cypress.Commands.add('GenerateCurrentDateTimeStartDateFieldGB', () => {

  const now = new Date();

  // Format the date as "day/month/year"
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const currentDateTime = `${day}.${month}.${year} ${hours}:${minutes}`;

  // Click on the input field to open the datepicker
  cy.get('#field_subscriptionStartDate > .input-group > .btn').click();

  // Click on the current date in the datepicker
  cy.get('.ngb-dp-day').contains(day).click();

  cy.get('#sidebar-action').click();

  // Confirm that the date has been selected
  //cy.get('#field_subscriptionStartDate').should('have.value', currentDateTime);

});

Cypress.Commands.add('GenerateFutureDateTimeEndDateFieldGB', () => {

  const now = new Date();

  // // Add 7 days to the current date to get a future date
   const futureDate = new Date(now);
   futureDate.setDate(futureDate.getDate() + 15);
  
  // Format the date as "day/month/year"
  const year = now.getFullYear();
  const month = String(futureDate.getMonth() + 1).padStart(2, '0');
  const day = String(futureDate.getDate()).padStart(2, '');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const futureDateTime = `${day}.${month}.${year} ${hours}:${minutes}`;
  
  // Click on the input field to open the datepicker
  cy.get('#field_subscriptionEndDate > .input-group > .btn').click();

  // Click on the current date in the datepicker
  cy.contains('.ngb-dp-day', day).click();

  // Confirm that the date has been selected
  //cy.get('#field_subscriptionEndDate').should('have.value', futureDateTime);

  
});



Cypress.Commands.add('GenerateDateTimeCouponPaymentDates', () => {

  // Get the current date and time
  const now = new Date();

  // Add 7 days to the current date to get a future date
  const futureDate = new Date(now);
  futureDate.setDate(futureDate.getDate());

  // Format the future date as "YYYY-MM-DD HH:mm:ss"
  const year = futureDate.getFullYear();
  const month = String(futureDate.getMonth() + 5).padStart(2, '0'); // trebuie sa fie achitarea odata la jum de an
  const day = String(futureDate.getDate()).padStart(2, '0');
  const hours = String(futureDate.getHours()).padStart(2, '0');
  const minutes = String(futureDate.getMinutes()).padStart(2, '0');
  const seconds = String(futureDate.getSeconds()).padStart(2, '0');

  const futureDateTime = `${day}.${month}.${year}`;

  // Set the future date and time into the input field
  cy.get('#startDate').clear().type(futureDateTime);
});

Cypress.Commands.add('GenerateNextDayDateTimeCouponPaymentDates', () => {

  // created this method to simulate payout for Government Bonds, changed the value to be be less or equal with maturity date, so that the test can pass
  // in this case is equal to maturity date
  // Get the current date and time
  const now = new Date();

  // Add 7 days to the current date to get a future date
  const futureDate = new Date(now);
  futureDate.setDate(futureDate.getDate());

  // Format the future date as "YYYY-MM-DD HH:mm:ss"
  const year = futureDate.getFullYear();
  const month = String(futureDate.getMonth()).padStart(2, '0'); // trebuie sa fie achitarea odata la jum de an
  const day = String(futureDate.getDate() + 1).padStart(2, '0');
  const hours = String(futureDate.getHours()).padStart(2, '0');
  const minutes = String(futureDate.getMinutes()).padStart(2, '0');
  const seconds = String(futureDate.getSeconds()).padStart(2, '0');

  const futureDateTime = `${day}.${month}.${year}`;

  // Set the future date and time into the input field
  cy.get('#startDate').clear().type(futureDateTime);
});

Cypress.Commands.add('DeleteCreatedGSTreasuryBill', (isinCode) => {

  cy.get('#page-heading').should('contain', 'Government Securities');
  cy.get('.alert').should('contain', 'A new Government Securities is created with identifier');

        const tableBody = cy.get('tbody');

        // Find the rows (td elements) containing the code
        const matchingCell = tableBody.find('td').contains(isinCode);

        // Get the first matching row
        const matchingRow = matchingCell.parent();

        // Click the edit button within the first matching row (assuming button class is 'edit-btn')
        cy.wait(1000);
        matchingRow.find('button[data-cy="entityDeleteButton"]').click();

        cy.get('#jhi-delete-governmentSecuritiesNew-heading').should('contain', 'Are you sure you want to delete Government Securities'); // validating delete action
        cy.get('button[data-cy="entityConfirmDeleteButton"]').click(); // clicking/confirming the delete action 

        cy.get('div.top.right ngb-alert.alert-success').should('contain', 'A Government Securities is deleted with identifier'); // validating delete action


});

Cypress.Commands.add('ViewDetailsCreatedTreasuryBills', (securitiesNameTreasuryBills, isinCode,  nominalValue, currentPrice, indicativeVolume, minimumOrder) => {

  cy.get('#page-heading').should('contain', 'Government Securities');
  cy.get('.alert').should('contain', 'A new Government Securities is created with identifier');

        cy.wait(1000);
        const tableBody = cy.get('tbody');

        // Find the rows (td elements) containing the code
        const matchingCell = tableBody.find('td').contains(isinCode);

        // Get the first matching row
        const matchingRow = matchingCell.parent();

        // Click the edit button within the first matching row (assuming button class is 'edit-btn')
        
        matchingRow.find('[data-cy="entityDetailsButton"]').click(); // clicking on the [Details] button

       //Asserting the data of the created GS Treasury Bills

       cy.get('div[class="mt-2 tab-content"]') // validating the name of the fields
                .should('contain', 'Securities Name')
                .should('contain', 'ISIN Code')
                .should('contain', 'Circulation Term')
                .should('contain', 'Issue Date')
                .should('contain', 'Maturity Date')
                .should('contain', 'Nominal Value (MDL)')
                .should('contain', 'Current Price')
                .should('contain', 'Yield (%)')
                .should('contain', 'State')
                .should('contain', 'Currency')
                .should('contain', 'Mandatory Early Redemption')
                .should('contain', 'Secondary Market Sell')
                .should('contain', 'Subscription Start Date')
                .should('contain', 'Subscription End Date')
                .should('contain', 'Indicative Volume')
                .should('contain', 'Min Order')
                .should('contain', 'Max Order')
                .should('contain', 'Max Ownership')
                .should('contain', 'Fees Applied')

                
                cy.get('.col-12') // validating the user's input in the fields
                //.should('contain', type).should('exist').should('be.visible').should('not.be.empty')
                .should('contain', securitiesNameTreasuryBills).should('exist').should('be.visible').should('not.be.empty')
                .should('contain', isinCode).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', circulationTerm).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', issueDate).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', maturityDate).should('exist').should('be.visible').should('not.be.empty')
                .should('contain', nominalValue).should('exist').should('be.visible').should('not.be.empty')
                .should('contain', currentPrice).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', yieldValue).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', state).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', currency).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', mandatoryEarlyRedemption).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', secondaryMarketSell).should('exist').should('be.visible').should('not.be.empty')

                //.should('contain', subscriptionStartDate).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', subscriptionEndDate).should('exist').should('be.visible').should('not.be.empty')
                .should('contain', indicativeVolume).should('exist').should('be.visible').should('not.be.empty')
                .should('contain', minimumOrder).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', maximumOrder).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', maximumOwnership).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', stateField).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', feesApplied).should('exist').should('be.visible').should('not.be.empty');

});

Cypress.Commands.add('ViewDetailsCreatedGovernmentBonds', (securitiesNameGovernmenBonds, isinCode, nominalValue, indicativeVolume, minimumOrder) => {

  cy.get('#page-heading').should('contain', 'Government Securities');
  cy.get('.alert').should('contain', 'A new Government Securities is created with identifier');


        cy.wait(1000);
        const tableBody = cy.get('tbody');

        // Find the rows (td elements) containing the code
        const matchingCell = tableBody.find('td').contains(isinCode);

        // Get the first matching row
        const matchingRow = matchingCell.parent();

        // Click the edit button within the first matching row (assuming button class is 'edit-btn')
        matchingRow.find('[data-cy="entityDetailsButton"]').click(); // clicking on the [Details] button

       //Asserting the data of the created GS Treasury Bills

       cy.get('div[class="mt-2 tab-content"]') // validating the name of the fields
                .should('contain', 'Securities Name')
                .should('contain', 'ISIN Code')
                .should('contain', 'Circulation Term')
                .should('contain', 'Issue Date')
                .should('contain', 'Maturity Date')
                .should('contain', 'Nominal Value (MDL)')
                .should('contain', 'Coupon Rate (%)')
                //.should('contain', 'Yield')
                .should('contain', 'State')
                .should('contain', 'Currency')
                .should('contain', 'Mandatory Early Redemption')
                .should('contain', 'Secondary Market Sell')
                .should('contain', 'Subscription Start Date')
                .should('contain', 'Subscription End Date')
                .should('contain', 'Indicative Volume')
                .should('contain', 'Min Order')
                .should('contain', 'Max Order')
                .should('contain', 'Max Ownership')
                .should('contain', 'Fees Applied')

                
                cy.get('.col-12') // validating the user's input in the fields
                //.should('contain', type).should('exist').should('be.visible').should('not.be.empty')
                .should('contain', securitiesNameGovernmenBonds).should('exist').should('be.visible').should('not.be.empty')
                .should('contain', isinCode).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', circulationTerm).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', issueDate).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', maturityDate).should('exist').should('be.visible').should('not.be.empty')
                .should('contain', nominalValue).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', currentPrice).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', yieldValue).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', state).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', currency).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', mandatoryEarlyRedemption).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', secondaryMarketSell).should('exist').should('be.visible').should('not.be.empty')

                //.should('contain', subscriptionStartDate).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', subscriptionEndDate).should('exist').should('be.visible').should('not.be.empty')
                .should('contain', indicativeVolume).should('exist').should('be.visible').should('not.be.empty')
                .should('contain', minimumOrder).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', maximumOrder).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', maximumOwnership).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', stateField).should('exist').should('be.visible').should('not.be.empty')
                //.should('contain', feesApplied).should('exist').should('be.visible').should('not.be.empty');

});


Cypress.Commands.add('AdminPublishGS', () => {

  cy.get('[jhitranslate="global.menu.actions"]').eq(1).click(); // clicking on the [Actions] drop-down

    cy.get('[jhitranslate="entity.action.publishPlacement"]').click(); // publishing created GS Placement
    cy.get('[data-cy="entityConfirmButton"]').click(); // confirming publishing operation


});

Cypress.Commands.add('AdminChangeStatusGSToStarted', () => {

  cy.get('[jhitranslate="global.menu.actions"]').eq(0).click(); // clicking on the [Actions] drop-down

  cy.contains('Change Placement Status (only test)').click(); // clicking on the "Change Placement status (only test)" option

  cy.get('.ng-select-container').click(); // clicking on the [State] drop-down
  cy.contains("Started").click(); // clicking on the "Started" option
  //cy.get('div[class="ng-select-container ng-has-value"]').should('have.attr', 'ng-reflect-model', 'STARTED');
  cy.get('[data-cy="entityConfirmValidateButton"]').click(); // clicking on the [Save] button

  //cy.get('[ng-reflect-jhi-translate="retailManagementApp.GsPlacemen"]').should('have.value', "Started"); // validating Status in the GS Details

});

Cypress.Commands.add('AdminChangeStatusGSToClosed', () => {

  cy.get('[jhitranslate="global.menu.actions"]').eq(0).click(); // clicking on the [Actions] drop-down

  cy.contains('Change Placement Status (only test)').click(); // clicking on the "Change Placement status (only test)" option

  cy.get('.ng-select-container').click(); // clicking on the [State] drop-down
  cy.contains("Closed").click(); // clicking on the "Started" option
  //cy.get('div[class="ng-select-container ng-has-value"]').should('have.attr', 'ng-reflect-model', 'STARTED');
  cy.get('[data-cy="entityConfirmValidateButton"]').click(); // clicking on the [Save] button
});

Cypress.Commands.add('AdminChangeStatusGSToBlocked', () => {

  cy.get('[jhitranslate="global.menu.actions"]').eq(0).click(); // clicking on the [Actions (test)] drop-down

  cy.contains('Change GS Status (only test)').click(); // clicking on the "Change Placement status (only test)" option

  cy.get('.ng-select-container').click(); // clicking on the [State] drop-down
  cy.contains("Blocked").click(); // clicking on the "Started" option
  //cy.get('div[class="ng-select-container ng-has-value"]').should('have.attr', 'ng-reflect-model', 'STARTED');
  cy.get('[data-cy="entityConfirmValidateButton"]').click(); // clicking on the [Save] button

  cy.get('.card-body').contains("Blocked");
});

Cypress.Commands.add('AdminChangeStatusGSToInitiated', () => {

  cy.get('[jhitranslate="global.menu.actions"]').eq(0).click(); // clicking on the [Actions] drop-down

  cy.contains('Change Placement Status (only test)').click(); // clicking on the "Change Placement status (only test)" option

  cy.get('.ng-select-container').click(); // clicking on the [State] drop-down
  cy.contains("Initiated").click(); // clicking on the "Started" option
  //cy.get('div[class="ng-select-container ng-has-value"]').should('have.attr', 'ng-reflect-model', 'STARTED');
  cy.get('[data-cy="entityConfirmValidateButton"]').click(); // clicking on the [Save] button

  cy.get('div[class="btn-group dropdown"]').eq(1).click();
  cy.get('[ng-reflect-jhi-translate="entity.action.deletePlacement"]').click(); // clicking on the [Delete] button
  cy.get('[data-cy="entityConfirmDeleteButton"]').click(); // clickingon the [Delete] button to confirm the deleting procces
});

Cypress.Commands.add('AdminActivateGSAndDistributeInPortofolio', (isinCode, totalAmount) => {

  cy.get('[jhitranslate="global.menu.actions"]').eq(1).click(); // clicking on the [Actions] drop-down

  cy.contains('Activate GS (Distribute in Portfolio)').click(); // clicking on the "Activate GS (distribute in portfolio)" option

  cy.get('[data-cy="investorProfilesDeleteDialogHeading"]')
  .should('contain', "Confirm the distribution operation of GS"); // validating confirmation text of Publishing the GS

  cy.get('[jhitranslate="retailManagementApp.governmentSecuritiesNew.publish.confirmationMessage"]')
  .should('contain', "Please confirm if you are sure you want to distribute GS for ISIN " + isinCode + "." );

  cy.get('#field_amount').clear().type(totalAmount);

  cy.get('#jhi-confirm-delete-investorProfiles').click(); // clicking on the [Confirm] button

});

Cypress.Commands.add('AdminCreateSubscriptionReport', () => {

  cy.get('[jhitranslate="global.menu.actions"]').eq(1).click(); // clicking on the [Actions] drop-down

  cy.get('[jhitranslate="entity.action.reportSubscriptionResult"]').click(); // publishing created GS Placement
  //cy.get('[data-cy="entityConfirmButton"]').click(); // confirming publishing operation

  //cy.contains("Raportul privind rezultatele subscrierilor valorilor mobiliare de stat ");
});

Cypress.Commands.add('AdminCreatePurchaseOrdersReport', () => {

  cy.get('[jhitranslate="global.menu.actions"]').eq(1).click(); // clicking on the [Actions] drop-down

  cy.get('[jhitranslate="entity.action.reportGs"]').click(); // publishing created GS Placement
  //cy.get('[data-cy="entityConfirmButton"]').click(); // confirming publishing operation
});


Cypress.Commands.add('AdminGeneratePayoutMaturityReport', (purchaseAmountWhenBuying) => {

  cy.get('[jhitranslate="global.menu.actions"]').eq(1).click(); // clicking on the [Actions] drop-down

  cy.get('[jhitranslate="entity.action.generatePayout"]').click(); // generating Payout maturity report

  cy.get('#field_amount').clear().type(purchaseAmountWhenBuying);

  cy.get('#jhi-confirm-delete-investorProfiles').click(); // clicking on the [Confirm] button

});

Cypress.Commands.add('AdminGeneratePayoutBuyBack', (isinCode, amountAtBuyBackPayout) => {

  cy.get('[jhitranslate="global.menu.actions"]').eq(1).click(); // clicking on the ["Actions"] button

  cy.get('[jhitranslate="entity.action.generatePayoutBuyback"]').click(); // clicking on the [Generate payout (buy back)] button

  cy.contains('Please confirm if you are sure you want to generate payout for ISIN ' + isinCode + ".")

  cy.get('#field_amount').clear().type(amountAtBuyBackPayout);

  cy.get('[jhitranslate="entity.action.confirm"]').click();
});


Cypress.Commands.add('AdminPayBuyBackPayOut', (isinCode) => {

    cy.get('[jhitranslate="global.menu.actions"]').eq(0).click(); // clicking on the [Actions] button

    cy.get('[jhitranslate="retailManagementApp.mpayPayout.pay"]').click(); // clicking on the [Pay (test)] option/button

    cy.get('#field_isinCode').clear().type(isinCode);

    cy.get('#jhi-confirm-delete-investorProfiles').click(); // clicking on the [Confirm] button

    cy.wait(500);
    const tableBody8 = cy.get('tbody');
    // Find the rows (td elements) containing the code
    const matchingCell8 = tableBody8.find('td').contains(isinCode);
     // Get the first matching row
     const matchingRow8 = matchingCell8.parent().parent();
     // Click the edit button within the first matching row (assuming button class is 'edit-btn')
     matchingRow8.find('[data-cy="entityDetailsButton"]').click(); // clicking on the Details button of GS

     cy.contains("Paid");


});

Cypress.Commands.add('StateMakeBuyBackOfferToInvestor', (amountAtMaturity, minimumOrder) => {

  cy.get('[jhitranslate="global.menu.actions"]').eq(1).click(); // clicking on the [Actions] drop-down

  cy.get('[jhitranslate="entity.action.buyBack"]').click(); // publishing created GS Placement

  cy.get('#field_amount').clear().type(amountAtMaturity); // typing nominalValue of GS

  cy.get('#field_volume').clear().type(minimumOrder); // typing minumum allowed volume to buy

  

});




Cypress.Commands.add('GenerateFutureDateTimeBuyBackFieldTB', () => {

  const now = new Date();

  // // Add 7 days to the current date to get a future date
   const futureDate = new Date(now);
   futureDate.setDate(futureDate.getDate()); /////////////////////////////////// +5
  
  // Format the date as "day/month/year"
  const year = now.getFullYear();
  const month = String(futureDate.getMonth()).padStart(2, '0');
  const day = String(futureDate.getDate()).padStart(2, '');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const futureDateTime = `${day}.${month}.${year} ${hours}:${minutes}`;
  
  // Click on the input field to open the datepicker
  cy.get('[icon="calendar-alt"]').eq(1).click(); // clicking on the date-picker button

  // Click on the current date in the datepicker
  cy.contains('.ngb-dp-day', day).click();

  // Confirm that the date has been selected
  //cy.get('#field_subscriptionEndDate').should('have.value', futureDateTime);

  
});


Cypress.Commands.add('GenerateFutureDateTimeBuyBackFieldGB', () => {

  const now = new Date();

  // // Add 7 days to the current date to get a future date
   const futureDate = new Date(now);
   futureDate.setDate(futureDate.getDate() + 15);
  
  // Format the date as "day/month/year"
  const year = now.getFullYear();
  const month = String(futureDate.getMonth()).padStart(2, '0');
  const day = String(futureDate.getDate()).padStart(2, '');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const futureDateTime = `${day}.${month}.${year} ${hours}:${minutes}`;
  
  // Click on the input field to open the datepicker
  cy.get('#field_subscriptionEndDate > .input-group > .btn').click();

  // Click on the current date in the datepicker
  cy.contains('.ngb-dp-day', day).click();

  // Confirm that the date has been selected
  //cy.get('#field_subscriptionEndDate').should('have.value', futureDateTime);

  
});


Cypress.Commands.add('DeleteCreatedGSGovernmentBond', (isinCode) => {

        cy.get('#page-heading').should('contain', 'Government Securities');
        cy.get('.alert').should('contain', 'A new Government Securities is created with identifier');

        const tableBody = cy.get('tbody');

        // Find the rows (td elements) containing the code
        const matchingCell = tableBody.find('td').contains(isinCode);

        // Get the first matching row
        const matchingRow = matchingCell.parent();

        // Click the edit button within the first matching row (assuming button class is 'edit-btn')
        matchingRow.find('button[data-cy="entityDeleteButton"]').click();

        cy.get('#jhi-delete-governmentSecuritiesNew-heading').should('contain', 'Are you sure you want to delete Government Securities'); // validating delete action
        cy.get('button[data-cy="entityConfirmDeleteButton"]').click(); // clicking/confirming the delete action 

        cy.get('div.top.right ngb-alert.alert-success').should('contain', 'A Government Securities is deleted with identifier'); // validating delete action
    
});

Cypress.Commands.add('VerifyingInvestorTabsAsAdmin', (idnp) => {

  // selecting investor with a specified IDNP (Adrian Borcila)
  const tableBody = cy.get('tbody');
  const matchingCell = tableBody.find('td').contains(idnp);
  const matchingRow = matchingCell.parent().parent();
  matchingRow.find('a[data-cy="entityDetailsButton"]').click();

  //General Information Table
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.group.general"]').should('exist').should('be.visible').should('contain', 'General Information'); // validating table name text "General Information"

  cy.get('[jhitranslate="retailManagementApp.investorProfiles.idnp"]').should('exist').should('be.visible').should('contain', 'IDNP'); // idnp field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.lastName"]').should('exist').should('be.visible').should('contain', 'Last Name'); // lastName field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.firstName"]').should('exist').should('be.visible').should('contain', 'First Name'); // firstName field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.citizenship"]').should('exist').should('be.visible').should('contain', 'Citizenship'); // citizenship field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.birthDate"]').should('exist').should('be.visible').should('contain', 'Birth Date'); // birthDate field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.birthPlace"]').should('exist').should('be.visible').should('contain', 'Birth Place'); // birthPlace field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.state"]').should('exist').should('be.visible').should('contain', 'State'); // state field

  // Occupation Data Table
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.group.occupation"]').should('exist').should('be.visible').should('contain', 'Occupation Data'); // validating table name text "Occupation Date"

  cy.get('[jhitranslate="retailManagementApp.investorProfiles.userOccupation"]').should('exist').should('be.visible').should('contain', 'User Occupation'); //userOccupation field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.employmentOrganization"]').should('exist').should('be.visible').should('contain', 'Employment Organization'); // employmentOrganization field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.declaredEmplOrganization"]').should('exist').should('be.visible').should('contain', 'Declared Employment Organization'); // declaredEmplOrganization field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.jobTitle"]').should('exist').should('be.visible').should('contain', 'Job Title'); // jobTitle field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.incomeSource"]').should('exist').should('be.visible').should('contain', 'Income Source'); // incomeSource field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.pep"]').should('exist').should('be.visible').should('contain', 'PEP'); // pep field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.reasonOfPep"]').should('exist').should('be.visible').should('contain', 'PEP Reason'); // reasonOfPep field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.closePep"]').should('exist').should('be.visible').should('contain', 'Close PEP'); // closePep field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.commentClosePep"]').should('exist').should('be.visible').should('contain', 'Comment Close PEP'); // commentClosePep field

  // Document Table
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.group.document"]').should('exist').should('be.visible').should('contain', 'Document'); // validating table name text "Document"
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.docType"]').should('exist').should('be.visible').should('contain', 'Document Type'); // docType field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.docSeries"]').should('exist').should('be.visible').should('contain', 'Document Series'); // docSeries field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.docNumber"]').should('exist').should('be.visible').should('contain', 'Document Number'); // docNumber field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.docIssueDate"]').should('exist').should('be.visible').should('contain', 'Document Issue Date'); // docIssueDate field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.docExpiryDate"]').should('exist').should('be.visible').should('contain', 'Document Expiry Date'); // docExpiryDate field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.docIssueOrganization"]').should('exist').should('be.visible').should('contain', 'Document Issue Organization'); // docIssueOrganization field

  // Permanent and/or Residence Address Table
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.group.address"]').should('exist').should('be.visible').should('contain', 'Permanent and/or Residence Address'); // validating table text name "Permanent and / or Residence Address"

  cy.get('[jhitranslate="retailManagementApp.investorProfiles.addressLine"]').should('exist').should('be.visible').should('contain', 'Address'); // addressLine field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.addressLine2"]').should('exist').should('be.visible').should('contain', 'Address 2'); // addressLine2 field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.postalCode"]').should('exist').should('be.visible').should('contain', 'Postal Code'); // postalCode field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.localityName"]').should('exist').should('be.visible').should('contain', 'Locality Name'); // localityName field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.countryName"]').should('exist').should('be.visible').should('contain', 'Country Name'); // countryName field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.residenceCountry"]').should('exist').should('be.visible').should('contain', 'Residence Country'); // residenceCountry field


  // Bank Account Table
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.group.bank"]').should('exist').should('be.visible').should('contain', 'Bank Account'); // validating table text name "Bank Account"

  cy.get('[jhitranslate="retailManagementApp.investorProfiles.bankIban"]').should('exist').should('be.visible').should('contain', 'Bank IBAN'); // bankIban field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.bankCommercialBank"]').should('exist').should('be.visible').should('contain', 'Bank Commercial Bank'); // bankCommercialBank field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.bankIdno"]').should('exist').should('be.visible').should('contain', 'Bank IDNO'); // bankIdno field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.bankBic"]').should('exist').should('be.visible').should('contain', 'Bank BIC'); // bankBic field

  // Contact Table
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.group.contact"]').should('exist').should('be.visible').should('contain', 'Contact'); // validating table text name "Contact"

  cy.get('[jhitranslate="retailManagementApp.investorProfiles.phone"]').should('exist').should('be.visible').should('contain', 'Phone'); // phone field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.email"]').should('exist').should('be.visible').should('contain', 'Email'); // email field
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.declaration"]').should('exist').should('be.visible').should('contain', 'Declaration'); // declarationField


  //-----------Portofolio Tab-------------------------------------
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.detail.tabPortfolio"]').click(); // clicking on the "Portofolio" tab

  cy.get('[jhitranslate="portofolio.treasuryBonds"]').should('exist').should('be.visible').should('contain', 'Treasury Bills'); // validating "treasuryBonds" text
  cy.get('[jhitranslate="portofolio.governmentBonds"]').should('exist').should('be.visible').should('contain', 'Government Bonds'); // validating "GovernmentBonds" text
  cy.get('[jhitranslate="portofolio.total"]').should('exist').should('be.visible').should('contain', 'Total'); // validating "Total" text


  cy.get('[jhitranslate="portofolio.isinCode"]').should('exist').should('be.visible').should('contain', 'ISIN Code'); // isinCode field
  //cy.get('[jhitranslate="portofolio.transactionType"]').should('exist').should('be.visible').should('contain', 'Transaction Type'); // transactionType field
  cy.get('[jhitranslate="portofolio.volumeUnits"]').should('exist').should('be.visible').should('contain', 'Volume (units)'); // volumeUnits field
  cy.get('[jhitranslate="portofolio.sumMDL"]').should('exist').should('be.visible').should('contain', 'Sum (MDL)'); // volume(MDL) field
  cy.get('[jhitranslate="portofolio.yield"]').should('exist').should('be.visible').should('contain', 'Yield (%)');  // yield Field
  cy.get('[jhitranslate="transactions.maturityDate"]').should('exist').should('be.visible').should('contain', 'Maturity Date'); // maturityDate field
  cy.get('[jhitranslate="transactions.details"]').should('exist').should('be.visible').should('contain', 'Details'); // [Details] button

  // After clicking on the [Details] fields
  cy.get('[jhitranslate="transactions.details"]').eq(0).click(); // clicking on the [Details] button, first option

  cy.get('[jhitranslate="portofolio.isinCode"]').eq(1).should('exist').should('be.visible').should('contain', 'ISIN Code'); // isinCode field
  cy.get('[jhitranslate="portofolio.nominalValue"]').should('exist').should('be.visible').should('contain', 'Nominal Value (MDL)'); // nominalValue field
  cy.get('[jhitranslate="portofolio.issueDate"]').should('exist').should('be.visible').should('contain', 'Issue Date'); // issueDate field
  cy.get('[jhitranslate="portofolio.maturityDate"]').should('exist').should('be.visible').should('contain', 'Maturity Date'); //maturityDate field ??
  cy.get('[jhitranslate="portofolio.circulationTerm"]').should('exist').should('be.visible').should('contain', 'Circulation Term'); // circulationTerm field
  cy.get('[jhitranslate="portofolio.yield"]').should('exist').should('be.visible').should('contain', 'Yield (%)'); // yield field ??
  //cy.get('[jhitranslate="portofolio.couponPaymentDates"]').should('exist').should('be.visible').should('contain', 'Coupon Payment Dates'); // couponPaymentDates field
  cy.get('[jhitranslate="portofolio.sellingOnSecondaryMarket"]').should('exist').should('be.visible').should('contain', 'Selling on Secondary Market'); // sellingOnSecondaryMarket field
  cy.get('[jhitranslate="portofolio.purchaseVolume"]').should('exist').should('be.visible').should('contain', 'Purchase Volume (units)'); // purchaseVolume(units) field
  cy.get('[jhitranslate="portofolio.purchaseAmount"]').should('exist').should('be.visible').should('contain', 'Purchase Amount (MDL)'); // purchaseAmount(MDL) field
  cy.get('[jhitranslate="portofolio.amountMaturityMDL"]').should('exist').should('be.visible').should('contain', 'Amount at Maturity (MDL)'); // amountAtMaturity(MDL) field
  cy.get('[jhitranslate="portofolio.yield"]').should('exist').should('be.visible').should('contain', 'Yield (%)'); // yield field
  cy.get('[jhitranslate="portofolio.valueDate"]').should('exist').should('be.visible').should('contain', 'Value at Date'); // valueAtDate field
  //cy.get('[jhitranslate="portofolio.transactionInformation"]').should('exist').should('be.visible').should('contain', 'Transaction Information'); // transactionInformation field
  cy.get('[jhitranslate="portofolio.active"]').should('exist').should('be.visible').should('contain', 'Active'); // active field
  cy.get('[jhitranslate="portofolio.blocked"]').should('exist').should('be.visible').should('contain', 'Blocked'); // blocked field
  cy.get('[jhitranslate="portofolio.reasonBlocked"]').should('exist').should('be.visible').should('contain', 'Reason for Blocked'); // reasonForBlocked field


  //-----------Transactions Tab---------------------------------------------------------

  cy.get('[jhitranslate="retailManagementApp.investorProfiles.detail.tabTransactions"]').click(); // clicking on the "Transaction" tab

  cy.get('[jhitranslate="transactions.isinCode"]').should('exist').should('be.visible').should('contain', 'ISIN Code'); // isinCode field
  cy.get('[jhitranslate="transactions.transactionType"]').should('exist').should('be.visible').should('contain', 'Transaction Type'); // transactionType column
  cy.get('[jhitranslate="transactions.transactionDate"]').should('exist').should('be.visible').should('contain', 'Transaction Date'); // transactionDate column
  cy.get('[jhitranslate="transactions.transactionAmount"]').should('exist').should('be.visible').should('contain', 'Transaction Amount'); // transactionAmount column
  cy.get('[jhitranslate="transactions.referenceNumber"]').should('exist').should('be.visible').should('contain', 'Reference Number'); // referenceNumber column
  cy.get('[jhitranslate="transactions.status"]').should('exist').should('be.visible').should('contain', 'Status'); // status field
  cy.get('[jhitranslate="transactions.details"]').should('exist').should('be.visible').should('contain', 'Details'); // details column

  // Viewing details of a transactions
  cy.get('[jhitranslate="transactions.details"]').eq(0).click(); // clicking on the [Details] button, first option

  //cy.get('[jhitranslate="transactions.orderKey"]').should('exist').should('be.visible').should('contain', 'Order Key'); // orderKey field
  cy.get('[jhitranslate="transactions.securityName"]').should('exist').should('be.visible').should('contain', 'Security Name'); // securityName field
  cy.get('[jhitranslate="transactions.nominalValue"]').should('exist').should('be.visible').should('contain', 'Nominal Value (MDL)'); // nominalValue(MDL) field
  cy.get('[jhitranslate="transactions.issueDate"]').should('exist').should('be.visible').should('contain', 'Issue Date'); // issueDate field
  cy.get('[jhitranslate="transactions.maturityDate"]').should('exist').should('be.visible').should('contain', 'Maturity Date'); // maturityDate field
  cy.get('[jhitranslate="transactions.circulationTerm"]').should('exist').should('be.visible').should('contain', 'Circulation Term'); // circulationTerm field
  cy.get('[jhitranslate="transactions.couponRate"]').should('exist').should('be.visible').should('contain', 'Rate (%)'); // yield field
  cy.get('[jhitranslate="transactions.couponPaymentDates"]').should('exist').should('be.visible').should('contain', 'Coupon Payment Dates'); // couponPaymentDates field
  cy.get('[jhitranslate="transactions.sellingOnSecondaryMarket"]').should('exist').should('be.visible').should('contain', 'Selling on Secondary Market'); // sellingOnSecondaryMarket field
  cy.get('[jhitranslate="transactions.purchaseVolume"]').should('exist').should('be.visible').should('contain', 'Purchase Volume (units)'); // purchaseVolume(units) field
  cy.get('[jhitranslate="transactions.purchaseAmount"]').should('exist').should('be.visible').should('contain', 'Purchase Amount (MDL)'); // purchaseAmount(MDL) field
  cy.get('[jhitranslate="transactions.investor"]').should('exist').should('be.visible').should('contain', 'Investor Name (IDNP)'); // investorName(MDL) field
  cy.get('[jhitranslate="transactions.paymentBankAccount"]').should('exist').should('be.visible').should('contain', 'Investor IBAN'); // investorIBAN field
  cy.get('[jhitranslate="transactions.commercialBank"').should('exist').should('be.visible').should('contain', 'Commercial Bank'); // commercialBank field
  // cy.get('[jhitranslate="transactions.sourceOfFunds"]').should('exist').should('be.visible').should('contain', 'Source of Funds'); // sourceOfFunds field
  // cy.get('[jhitranslate="transactions.orderDueDate"]').should('exist').should('be.visible').should('contain', 'Order Due Date'); //orderDueDate field
  // cy.get('[jhitranslate="transactions.orderPaidAt"]').should('exist').should('be.visible').should('contain', 'Order Paid At'); // orderPaidAt field
  // cy.get('[jhitranslate="transactions.orderInvoiceNr"]').should('exist').should('be.visible').should('contain', 'Order Invoice ID'); // orderInvoiceID field


  //-------------History Tab------------------------------------------------------------
  
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.detail.tabHistory"]').click(); // clicking on the "History" tab

  cy.get('[jhitranslate="audits.table.header.date"]').should('exist').should('be.visible').should('contain', 'Date and time'); // dateAndTime column
  cy.get('[jhitranslate="audits.table.header.principal"]').should('exist').should('be.visible').should('contain', 'User'); // User column
  cy.get('[jhitranslate="audits.table.header.action"]').should('exist').should('be.visible').should('contain', 'Action'); // Action column
  cy.contains('Details').should('exist').should('be.visible').should('contain', 'Details'); //  // Details column
  //cy.get('[]').should('exist').should('be.visible').should('contain', '');


});

Cypress.Commands.add('CloseInvestorAccountAsAdmin', (idnp, reasonField) => {

        // selecting investor with a specified IDNP (Adrian Borcila)
        const tableBody = cy.get('tbody');
        const matchingCell = tableBody.find('td').contains(idnp);
        const matchingRow = matchingCell.parent().parent();
        matchingRow.find('a[data-cy="entityDetailsButton"]').click();

  cy.get('button[class="btn btn-sm btn-success"]').should('exist').should('be.visible').should('contain', 'Approve/Reject KYC'); // validating [Validate] button text
  cy.get('button[class="btn btn-sm btn-success"]').click(); // clicking on the [Validate] button

  cy.get('[data-cy="investorProfileValidateDialogHeading"]').should('exist').should('be.visible').should('contain', 'Confirm validate operation');
  cy.get('[jhitranslate="retailManagementApp.investorProfiles.validate.question"]').should('exist').should('be.visible').should('contain', 'Are you sure you want to validate Investor Profile');

  cy.get('[aria-autocomplete="list"]').click(); // clicking on the drop-down
  cy.contains('Closed').click(); // clicking on the "Closed" option
  cy.get('#field_reason').type(reasonField);

  cy.get('#jhi-confirm-validate-investorProfile').click(); // clicking on the [Save] button
  
  cy.url().should('include', '/investor-profiles'); // validating that user is redirected back to the investor profiles
  cy.contains('Investor Profile'); 

});

Cypress.Commands.add('SetInvestorProfileStatusBackToActiveAsAdmin', (idnp) => {

  //cy.get('[jhisortby="idnp"]').click(); //sorting ascending investor profiles
  //cy.get('[data-cy="entityDetailsButton"]').eq(0).click(); // clicking on the first investor from the list

   // selecting investor with a specified IDNP (Adrian Borcila)
   const tableBody = cy.get('tbody');
   const matchingCell = tableBody.find('td').contains(idnp);
   const matchingRow = matchingCell.parent().parent();
   matchingRow.find('a[data-cy="entityDetailsButton"]').click();

   cy.get('button[class="btn btn-sm btn-success"]').should('exist').should('be.visible').should('contain', 'Approve/Reject KYC'); // validating [Validate] button text
   cy.get('button[class="btn btn-sm btn-success"]').click(); // clicking on the [Validate] button

  cy.get('[data-cy="investorProfileValidateDialogHeading"]').should('exist').should('be.visible').should('contain', 'Confirm validate operation');

  cy.get('[aria-autocomplete="list"]').click(); // clicking on the drop-down
  cy.get('.ng-option').eq(2).click(); // clicking on the "Active" option

  cy.get('#jhi-confirm-validate-investorProfile').click(); // clicking on the [Save] button
  
  cy.url().should('include', '/investor-profiles'); // validating that user is redirected back to the investor profiles
  cy.contains('Investor Profile'); 

});

// ----------- Classifiers Commands---------------------------

Cypress.Commands.add('AddNewCirculationTerm', () => {
  
});

Cypress.Commands.add('AddNewCommercialBank', () => {

});

// -------------------- GS Management Commands--------------------

Cypress.Commands.add('AddNewGsPlacement', () => {
  
});

Cypress.Commands.add('AddNewCommercialBank', () => {
  
});


//-----------------------------INVESTOR--------------------------------------------------------------------------------

Cypress.Commands.add('setInvestorCredentials', (IDNP, password) => {
  Cypress.env('originIDNP', IDNP);
  Cypress.env('originPassword', password);
}); // connected with the InvestorRegistration  and Investor Login command


Cypress.Commands.add('InvestorRegistration', (baseUrl) => {

  cy.visit(baseUrl);
  
  cy.get('#navbarResponsive')
  .should('contain', 'About')
  .should('contain', 'Subscription calendar')
  .should('contain', 'Statistics')
  .should('contain', 'News')
  .should('contain', 'Contacts')
  //.should('containt', 'English')
  .should('contain', 'Authentication');
  
  cy.contains('Authentication').click();

  cy.origin('https://mpass.staging.egov.md/login/saml', () => {

    const originIDNP = Cypress.env('originIDNP');
    const originPassword = Cypress.env('originPassword');

    cy.get('.description-align').should('contain', 'Serviciul de autentificare și control al accesului');
    cy.contains('Selectați modalitatea de autentificare');
      
      cy.get('#UsernamePassword').type(originIDNP);
      cy.get('#Password').type(originPassword);
      cy.contains('Intră').click();
    });
      cy.get('#account-menu').should('contain', 'Doruc Stanislav');
});

Cypress.Commands.add('InvestorLogin', (baseUrl) => {

  cy.visit(baseUrl);

   //Change language to EN
   cy.get('#languagesnavBarDropdown').click();
   //cy.get('[ng-reflect-jhi-active-menu="en"]').click();
   cy.contains('a', 'English').click();

  cy.contains('Authentication').click();

  cy.origin('https://mpass.staging.egov.md/login/saml', () => {

    const originIDNP = Cypress.env('originIDNP');
    const originPassword = Cypress.env('originPassword');

    cy.get('.description-align').should('contain', 'Serviciul de autentificare și control al accesului');
    cy.contains('Selectați modalitatea de autentificare');
      
      cy.get('#UsernamePassword').type(originIDNP);
      cy.get('#Password').type(originPassword);
      cy.contains('Intră').click();
    });
      cy.get('#account-menu').should('contain', 'Doruc Stanislav');

});

Cypress.Commands.add('InvestorBuyGSTreasuryBills', (isinCode, indicativeVolume, currentPrice, nominalValue) => {

     //---validating that GS is displayed in Upcoming Calendar
     const tableBody = cy.get('tbody');
     // Find the rows (td elements) containing the code
     const matchingCell = tableBody.find('td').contains(isinCode);

      // Get the first matching row
      const matchingRow = matchingCell.parent().parent();

      // Click the edit button within the first matching row (assuming button class is 'edit-btn')
      cy.wait(1000);
      matchingRow.find('[jhitranslate="entity.action.buy"]').click(); // clicking on the [Buy] button

      //validating the page
      cy.url().should('contain', '/order'); // validating the url 
      
      cy.get('.card-body') // validating the GS details as Investor when he is trying to buy it
      .should('contain', isinCode)
      .should('contain', indicativeVolume)
      .should('contain', currentPrice)
      .should('contain', nominalValue);



});


Cypress.Commands.add('InvestorBuyGSGovernmentBonds', (isinCode, indicativeVolume, couponRate, nominalValue) => {

  //---validating that GS is displayed in Upcoming Calendar
  const tableBody = cy.get('tbody');
  // Find the rows (td elements) containing the code
  const matchingCell = tableBody.find('td').contains(isinCode);

   // Get the first matching row
   const matchingRow = matchingCell.parent().parent();

   // Click the edit button within the first matching row (assuming button class is 'edit-btn')
   cy.wait(1000);
   matchingRow.find('[jhitranslate="entity.action.buy"]').click(); // clicking on the [Buy] button

   //validating the page
   cy.url().should('contain', '/order'); // validating the url 
   
   cy.get('.card-body') // validating the GS details as Investor when he is trying to buy it
   .should('contain', isinCode)
   .should('contain', indicativeVolume)
   .should('contain', couponRate)
   .should('contain', nominalValue);



});

Cypress.Commands.add('SelectRandomDocType', () => {
  
  const DocumentTypes = {
    BULETIN: 'CA Buletin de identitate al cetăţeanului Republicii Moldova',
    PASAPORT: 'PA Paşaportul Cetăţeanului Republicii Moldova'
  };

     // Click the dropdown element to open it
  cy.get('#field_docType').click();

  // Get all options
  cy.get('.ng-option').then(($options) => {
    // Get a random index to select an option
    const randomIndex = Math.floor(Math.random() * Object.keys(DocumentTypes).length);

    // Get the key of the randomly selected option from the enum
    const randomDocumentTypeKey = Object.keys(DocumentTypes)[randomIndex];

    // Select the option with the random key
    cy.get('#field_docType').contains(DocumentTypes[randomDocumentTypeKey]).click({force:true});
  });
  
});

Cypress.Commands.add('SelectRandomIncomeSource', () => {

  const incomeOption = {
    ALLOCATIE: 'Alocație',
    SALARIU: 'Salariu',
    ALTE_SURSE: 'Alte surse',
    DONATIE: 'Donație',
    INVESTITII: 'Investiții'
  };
  
  // Click the dropdown element to open it
  cy.get('.ng-arrow-wrapper').click();
  
  // Get the currently selected option
  cy.get('.ng-select-container').then(($container) => {
    const selectedOption = $container.find('.label-span').text().trim();
    
    // Filter out the selected option from the available options
    const availableOptions = Object.values(incomeOption).filter(option => option !== selectedOption);
    
    // Get a random index to select an option from the available options
    const randomIndex = Math.floor(Math.random() * availableOptions.length);
  
    // Get the randomly selected option
    const randomOptionValue = availableOptions[randomIndex];
    
    // Click the randomly selected option
    cy.get('.ng-dropdown-panel').contains(randomOptionValue).click();
  });
});

Cypress.Commands.add('SelectRandomIncomeSourceWhenBuyingAGS', (descriptionIncomeSourceField) => {

  const incomeOption = {
    ALLOCATIE: 'Allowance',
    SALARIU: 'Salary',
    ALTE_SURSE: 'Other sources',
    DONATIE: 'Donation',
    INVESTITII: 'Investment'
  };
  
  // Click the dropdown element to open it
  cy.get('.ng-arrow-wrapper').click();
  
  // Get the currently selected option
  cy.get('.ng-select-container').then(($container) => {
    const selectedOption = $container.find('.label-span').text().trim();
    
    // Filter out the selected option from the available options
    const availableOptions = Object.values(incomeOption).filter(option => option !== selectedOption);
    
    // Get a random index to select an option from the available options
    const randomIndex = Math.floor(Math.random() * availableOptions.length);
  
    // Get the randomly selected option
    const randomOptionValue = availableOptions[randomIndex];
    
    // Click the randomly selected option
    cy.get('.ng-dropdown-panel').contains(randomOptionValue).click();

    // If the selected option is "Alte surse", display the field and type something into it
    if (randomOptionValue === 'Other sources') {
      cy.get('#field_incomeSourceDesc').type(descriptionIncomeSourceField);
    }
  });
});


Cypress.Commands.add('SelectRandomBankCommercialBank', () => {

  const bankOptions = {
    COMERTBANK : "(CMTBMD2X) BC'COMERTBANK'S.A.",
    COMERTBANK_CHISINAU : "(CMTBMD2X498) B.C.'COMERTBANK'S.A. suc.nr.1 Chisinau",
    COMERTBANK_BALTI : "(CMTBMD2X508) B.C.'COMERTBANK'S.A. suc.nr.2 Balti",
    COMERTBANK_CHISINAU_NR3 : "(CMTBMD2X511) B.C.'COMERTBANK'S.A. suc.nr.3 Chisinau",
    COMERTBANK_CHISINAU_NR4 : "(CMTBMD2X521) B.C.'COMERTBANK'S.A. suc.nr.4 Chisinau",
    ENERGBANK: "(ENEGMD22) B.C.'ENERGBANK'S.A.",
    ENERGBANK_CHISINAU: "(ENEGMD22409) B.C.'ENERGBANK'S.A. fil.'Ismail' Chisinau",
    ENERGBANK_BOTANICA: "(ENEGMD22858) B.C.'ENERGBANK'S.A. suc.'Botanica' Chisinau"
  };

  // Click the dropdown element to open it
  cy.get('[formcontrolname="bankCommercialBank"]').click();

  // Get the currently selected bank from the field
  cy.get('.ng-input > input').then(($input) => {
    const selectedBankInField = $input.val().trim();

    // Filter out the selected bank from the available banks
    const availableBanks = Object.values(bankOptions).filter(bank => bank !== selectedBankInField);

    // Get a random index to select a bank from the available banks
    const randomIndex = Math.floor(Math.random() * availableBanks.length);

    // Get the randomly selected bank
    const randomBankValue = availableBanks[randomIndex];

    // Click the randomly selected bank from the dropdown
    cy.get('.ng-dropdown-panel-items').contains(randomBankValue).click();

  });
});


Cypress.Commands.add('ActivateEmailCriticalField', (emailCriticalField) => {
  
      const tableBody = cy.get('tbody');

      // Find the rows (td elements) containing the code
      const matchingCell = tableBody.find('tr').contains(emailCriticalField);

      // Get the first matching row
      const matchingRow = matchingCell.parent().parent();

      // Click the edit button within the first matching row (assuming button class is 'edit-btn')
      const activateButton = matchingRow.find('[jhitranslate="retailManagementApp.msProfileEditManagement.state.activated"]').click();

      // would be good to make an assert on button, later(if its activated to deactivate it so that the test to pass)

      cy.get('[jhitranslate="entity.update.title"]').should('contain', 'Confirm update operation'); // confirmation pop-up heading
      cy.get('#deactivate-heading').should('contain', 'Vă rugăm să confirmați dacă sunteți sigur că doriți să actualizați starea campului '); // confirmation pop-up message

      cy.get('[data-cy="entityConfirmButton"]').click(); // clicking on the [Confirm] button
     // cy.get('[jhitranslate="retailManagementApp.msProfileEditManagement.state.activated"]')
      //.should('have.attr', 'class', 'btn btn-sm btn-rounded w-100 btn-success'); // validating that button status is activated

});

Cypress.Commands.add('DeactivateEmailCriticalField', (emailCriticalField) => {
  
  const tableBody = cy.get('tbody');

  // Find the rows (td elements) containing the code
  const matchingCell = tableBody.find('tr').contains(emailCriticalField);

  // Get the first matching row
  const matchingRow = matchingCell.parent().parent();

  // Click the edit button within the first matching row (assuming button class is 'edit-btn')
  const activateButton = matchingRow.find('[jhitranslate="retailManagementApp.msProfileEditManagement.state.deactivated"]').click();

  // would be good to make an assert on button, later(if its activated to deactivate it so that the test to pass)

  cy.get('[jhitranslate="entity.update.title"]').should('contain', 'Confirm update operation'); // confirmation pop-up headin
  cy.get('#activate-heading').should('contain', 'Vă rugăm să confirmați dacă sunteți sigur că doriți să actualizați starea campului '); // confirmation pop-up message

  cy.get('[data-cy="entityConfirmButton"]').click(); // clicking on the [Confirm] button

});

Cypress.Commands.add('ChangeInvestorProfileToActive', (lastName, birthPlace, userOccupation, employmentOrganization, jobTitle, 
  docSeries, docNumber, docIssueOrganization, addressLine, postalCode, localityName, //bankIban,
   phoneNumber, email) => {

 cy.contains('Investors').click(); // clicking on the "Investors" tab
 cy.get('[routerlink="/investor-profiles"]').click(); // clicking on the "All Investors" option

 cy.contains('Investor Profiles'); // validating that admin is on the "Investor profiles" page

 const tableBody = cy.get('tbody');

 // Find the rows (td elements) containing the code
 const matchingCell = tableBody.find('td').contains(lastName);

 // Get the first matching row
 const matchingRow = matchingCell.parent();

 // Click the edit button within the first matching row (assuming button class is 'edit-btn')
 matchingRow.find('a[data-cy="entityDetailsButton"]').should('be.visible').click();

 cy.contains(lastName); // validating that admin is on Investor's profile

 // validating the fields that were changed, first 2 tables
   cy.contains(birthPlace).should('exist').should('be.visible'); // birthPlace field
   cy.contains(userOccupation).should('exist').should('be.visible'); // userOccupation field
   cy.contains(employmentOrganization).should('exist').should('be.visible'); // employmentOrganization field
   cy.contains(jobTitle).should('exist').should('be.visible'); // jobTitle field
   

     // second 2 tables data
     //cy.contains(docType).should('exist'); // docType field
     cy.contains(docSeries).should('exist').should('be.visible'); // docSeries field
     cy.contains(docNumber).should('exist').should('be.visible'); // docNumber field
     cy.contains(docIssueOrganization).should('exist').should('be.visible'); // docIssueOrganization field
     cy.contains(addressLine).should('exist').should('be.visible'); // addressLine field
     cy.contains(postalCode).should('exist').should('be.visible'); // postalCode field
     cy.contains(localityName).should('exist').should('be.visible'); // localityName field

     cy.scrollTo('bottom'); // scrolling down
     cy.wait(500);

   // third 2 tables data
    //cy.contains(bankIban).should('exist');
    cy.contains(phoneNumber).should('exist');
    cy.contains(email).should('exist');

   cy.get('[ng-reflect-jhi-translate="global.boolean.true"]').should('contain', "Yes") // declaration field

    // cy.contains('Validate').click();
    // cy.get('.ng-input').click(); // clicking on the drop-down
    // cy.contains('Active').click();
    // cy.contains('Save').click();

});

Cypress.Commands.add("BankIbanDataInput", (bankIban) => {

  // Step 1: Click on the field formcontrolname="bankIban"
cy.get('[formcontrolname="bankIban"]').click();

// Step 2: Check if the dropdown is opened
cy.get('.ng-dropdown-panel-items.scroll-host').then(($dropdown) => {
    if ($dropdown.length > 0) {
        // Dropdown is open
        // Get all options within the dropdown
        cy.get('.ng-option.ng-option-marked').then(($options) => {
            // Step 3: Click randomly on an option
            const randomIndex = Math.floor(Math.random() * $options.length);
            cy.wrap($options[randomIndex]).click();
        });
    } else {
        // Dropdown is not open
        // Step 3: Input data from a variable
        cy.get('[formcontrolname="bankIban"]').type(data_variable);
    }
});

    
});


Cypress.Commands.add('InvestorRequestAQoute', (isinCode, saleVolume) => {


  cy.get('[href="/secondary-market"]').click(); // clicking on the secondary market option
  cy.wait(1000);
  cy.url().should('include', '/secondary-market');

  cy.wait(1000);

  cy.get('[jhitranslate="secondaryMarket.requestQuote.btnRequest"]', {timeout: 1000}).click({force: true}); // clicking on the [Request a quote] button
  cy.wait(1000);

    //cy.url().should('include', '/secondary-market/request-quote');
    //cy.get('[ng-reflect-placeholder="ISIN Code"]').type(isinCode); // entering isinCode to ISIN Code field

    // Click on the isinCode dropdown to open it
    cy.get('#field_isinCode').click();
    // Select the first option
    cy.get('.ng-option').first().click(); 




  cy.get('#field_saleVolume').clear().type(saleVolume); // entering all investor volume to sell 

  cy.get('#jhi-confirm').click(); // clicking on the [Confirm] button

  cy.get('[jhitranslate="secondaryMarket.requestQuote.confirmationText"]')
  .should('exist')
  .should('be.visible')
  .should('contain', "Your request will be sent to primary dealers. Are you sure you want to submit the price quote request?");

  cy.get('#jhi-confirm-delete-cfCountry').click(); // clicking on the [Yes] button

  // looking a the details of the quote we placed on market

   //---validating that GS is displayed in Upcoming Calendar
   const tableBody = cy.get('.table-margin-top');
   // Find the rows (td elements) containing the code
   const matchingCell = tableBody.find('td').contains(isinCode);
    // Get the first matching row
    const matchingRow = matchingCell.parent();
    // Click the edit button within the first matching row (assuming button class is 'edit-btn')
    cy.wait(1000);
    matchingRow.find('[jhitranslate="secondaryMarket.allBiddingOffers"]').click(); // clicking on the Bidding Offer button of quote

    //have to add validation of issue date, maturity datecirculation term here!!!

});

Cypress.Commands.add('InvestorAcceptBuyBackOffer', (isinCode, maxAllowedVolume) => {

  //saleVolume(units) filed on UI - is the minimuOrder in our case, cause we sale all units and state buyback all units because we simulate that maturity time came

  const tableBody6 = cy.get('tbody');
  // Find the rows (td elements) containing the code
  const matchingCell6 = tableBody6.find('td').contains(isinCode);
   // Get the first matching row
   const matchingRow6 = matchingCell6.parent().parent();
   // Click the edit button within the first matching row (assuming button class is 'edit-btn')
   matchingRow6.find('[jhitranslate="entity.action.accept"]').click(); // clicking on the [Accept] button for accepting buyback

   cy.contains(isinCode);

   cy.get('#field_sellVolume').clear().type(maxAllowedVolume); // entering the maxAllowedVolume(minimumOrder in our case) in the field

  cy.get('#jhi-confirm').click(); // clicking on the [Confirm] button

  cy.get('[jhitranslate="retailManagementApp.buybackOffer.acceptBuybackText"]')
  .should('exist')
  //.should('be.visible');

  cy.get('#jhi-confirm-delete-cfCountry').click(); // clicking on the [Yes] button

});



//------------------------DEALER Commands--------------------------------------------------//

Cypress.Commands.add('setDealerCredentials', (dealerUsername, dealerPassword) => {
  Cypress.env('originUserName', dealerUsername);
  Cypress.env('originPassword', dealerPassword);
}); // connected with the Admin Login command


Cypress.Commands.add('DealerSimpleLogIn', (baseUrl) => {

  cy.visit(baseUrl);
  cy.get('[class="btn btn-outline-primary rounded-pill"]').click(); // clicking on the [Authentication] button
  // cy.get('#username').type(dealerIDNP);
  // cy.get('#password').type(dealerPassword);

  // cy.get('[data-cy="accountMenu"]').click(); // clicking on account menu log out from another user
  // cy.get('#logout').click(); // clicking on log-out button

  // cy.visit(baseUrl);
  // cy.get('[class="btn btn-outline-primary rounded-pill"]').click(); // clicking on the [Authentication] button
  // cy.wait(500);

  // cy.origin('https://mpass.staging.egov.md', () => {

  //   cy.wait(1000);

  //   const dealerIDNP = Cypress.env('originUserName');
  //   const dealerPassword = Cypress.env('originPassword');

  //   cy.get('#UsernamePassword').type(dealerIDNP);
  // cy.wait(500);
  // cy.get('#Password').type(dealerPassword);
  // cy.contains('Intră').click(); // [Intră] button

  // //cy.contains('Bun venit, Retail Primary Dealers Portal!');
  // cy.contains('Ești autentificat cu numele de utilizator "Dumitru Virtosu".');

  })

// });

Cypress.Commands.add('DealerOfferPrice', (isinCode, nominalValue) => {

  //---validating that GS is displayed in Upcoming Calendar
  const tableBody = cy.get('.table-margin-top');
  // Find the rows (td elements) containing the code
  const matchingCell = tableBody.find('td').contains(isinCode);
   // Get the first matching row
   const matchingRow = matchingCell.parent();
   // Click the edit button within the first matching row (assuming button class is 'edit-btn')
   cy.wait(1000);
   matchingRow.find('[jhitranslate="priceQuote.offerAction"]').click(); // clicking on the Bidding Offer button of quote

   cy.url().should('include', '/price-quotes');

   cy.get('#field_bid').clear().type(nominalValue);

   cy.get('[jhitranslate="entity.action.submit"]').click(); // clicking on the [Confirm] button

   cy.get('[jhitranslate="priceQuote.modal.confirmText"]')
   .should('exist')
   .should('be.visible')
   .should('contain', "Sunteți sigur că doriți să confirmați operațiunea de propunere a ofertei în valoare de" + " " + nominalValue + " MDL?");

   cy.get('#jhi-confirm-purchase').click(); // clicking on the [Confirm] button pop-up


  

});


