describe('duplicating table', () => {
  beforeEach(() => {
    cy.visit('/');

    // Prepare table
    cy.getBySel('create-table-button').click();

    cy.getBySel('table-name-input').type('{enter}');

    cy.getBySel('table-header').type('e');

    cy.focused().clear().type('foo{enter}');
  });

  afterEach(() => {
    cy.getBySel('table-name').should('have.length', 2);
    cy.getBySel('table-name').first().should('have.text', 'foo');
    cy.getBySel('table-name').last().should('have.text', 'foo');
  });

  it('can duplicate table by pressing "Ctrl + D" on table header', () => {
    cy.getBySel('table-header').type('{ctrl}d');
  });
});

export {};
