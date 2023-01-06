describe('opening page', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.getBySel('schema-name').should('have.text', 'Untitled');
  });

  afterEach(() => {
    cy.getBySel('table-node').should('not.exist');
  });

  it('shows empty unnamed schema on opening link without schema params', () => {});

  it('shows empty unnamed schema on opening link without schema params even after creating table before', () => {
    cy.getBySel('create-table-button').click();

    cy.getBySel('table-name-input').type('{enter}');

    cy.getBySel('table-node').should('exist');

    cy.reload().wait(1000);
  });
});

export {};
