describe('duplicating column', () => {
  beforeEach(() => {
    cy.visit('/');

    // Prepare table
    cy.getBySel('create-table-button').click();

    cy.getBySel('table-name-input').type('{enter}');

    cy.getBySel('table-header').type('e');

    cy.focused().clear().type('foo{enter}');

    cy.getBySel('table-node').type('{shift}{enter}');

    cy.focused().clear().type('bar{enter}');
  });

  afterEach(() => {
    cy.getBySel('column-name').should('have.length', 2);
    cy.getBySel('column-name').first().should('have.text', 'bar');
    cy.getBySel('column-name').last().should('have.text', 'bar');
  });

  it('can duplicate column by clicking "Duplicate" button in column\'s context menu', () => {
    cy.getBySel('column').rightclick();

    cy.getBySel('column-context-menu-duplicate').click();
  });
});

export {};
