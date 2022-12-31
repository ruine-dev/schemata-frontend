describe('deleting column', () => {
  beforeEach(() => {
    cy.visit('/');

    // Prepare table
    cy.getBySel('create-table-button').click();

    cy.getBySel('submit-table').click();

    // Prepare column
    cy.getBySel('table-node').realHover();

    cy.getBySel('create-column-button').click();

    cy.getBySel('submit-column').click();
  });

  afterEach(() => {
    cy.getBySel('column').should('not.exist');
  });

  it('can delete column by clicking "Delete" button', () => {
    cy.getBySel('column').realHover();

    cy.getBySel('delete-column-button').click();
  });

  it('can delete table by pressing "delete" button', () => {
    cy.getBySel('column').realPress('Delete');
  });
});

export {};
