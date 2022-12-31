describe('updating schema', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.getBySel('schema-name').should('have.text', 'Untitled');
  });

  afterEach(() => {
    cy.getBySel('schema-name').should('have.text', 'Foo');
  });

  context('can edit schema by clicking "Change title" button', () => {
    beforeEach(() => {
      cy.getBySel('edit-schema-button').click();

      cy.focused().clear().type('Foo');
    });

    it('clicking "Save" button to submit', () => {
      cy.getBySel('submit-schema').click();
    });

    it('pressing "Enter" to submit', () => {
      cy.focused().type('{enter}');
    });
  });
});

export {};
