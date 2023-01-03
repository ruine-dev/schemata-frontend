describe('duplicating table', () => {
  beforeEach(() => {
    cy.visit('/');

    // Prepare table
    cy.getBySel('create-table-button').click();

    cy.getBySel('submit-table').click();

    cy.getBySel('table-header').type('e');

    cy.focused().clear().type('foo{enter}');
  });

  afterEach(() => {
    cy.getBySel('table-name').should('have.length', 2);
    cy.getBySel('table-name').first().should('have.text', 'foo');
    cy.getBySel('table-name').last().should('have.text', 'foo');
  });

  it('can duplicate table by clicking "Duplicate" button in table header\'s context menu', () => {
    cy.getBySel('table-header').rightclick();

    cy.getBySel('table-header-context-menu-duplicate').click();
  });
});

export {};
