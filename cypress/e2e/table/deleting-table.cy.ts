describe('deleting table', () => {
  beforeEach(() => {
    cy.visit('/');

    // Prepare table
    cy.getBySel('create-table-button').click();

    cy.getBySel('submit-table').click();
  });

  afterEach(() => {
    cy.getBySel('table-node').should('not.exist');
  });

  it('can delete table by clicking "Delete" button', () => {
    cy.getBySel('table-header').realHover();

    cy.getBySel('delete-table-button').click();
  });

  it('can delete table by pressing "delete" button', () => {
    cy.getBySel('table-header').type('{del}');
  });

  it('can delete table by clicking "Delete" button in table header\'s context menu', () => {
    cy.getBySel('table-header').rightclick();

    cy.getBySel('table-header-context-menu-delete').click();
  });
});

export {};
