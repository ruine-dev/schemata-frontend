describe('deleting column', () => {
  beforeEach(() => {
    cy.visit('/');

    // Prepare table
    cy.getBySel('create-table-button').click();

    cy.getBySel('table-name-input').type('{enter}');

    // Prepare column
    cy.getBySel('table-node').realHover();

    cy.getBySel('create-column-button').click();

    cy.getBySel('column-name-textbox').type('{enter}');
  });

  afterEach(() => {
    cy.getBySel('column').should('not.exist');
  });

  it('can delete table by pressing "delete" button', () => {
    cy.getBySel('column').type('{del}');
  });

  it('can delete column by clicking "Delete" button in column\'s context menu', () => {
    cy.getBySel('column').rightclick();

    cy.getBySel('column-context-menu-delete').click();
  });
});

export {};
