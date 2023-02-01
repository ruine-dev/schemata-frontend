describe('creating column', () => {
  beforeEach(() => {
    cy.visit('/');

    // Prepare table
    cy.getBySel('create-table-button').click();

    cy.getBySel('table-name-input').type('organizations{enter}');

    cy.getBySel('create-table-button').click();

    cy.getBySel('table-name-input').type('users{enter}');

    // Prepare column
    cy.getBySel('table-node').realHover();

    cy.getBySel('create-column-button').click();

    cy.getBySel('column-name-textbox').type('{enter}');

    cy.getBySel('column-name').should('have.text', 'untitled');
  });


});

export {};
