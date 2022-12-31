describe('updating column', () => {
  beforeEach(() => {
    cy.visit('/');

    // Prepare table
    cy.getBySel('create-table-button').click();

    cy.getBySel('submit-table').click();

    // Prepare column
    cy.getBySel('table-node').realHover();

    cy.getBySel('create-column-button').click();

    cy.getBySel('submit-column').click();

    cy.getBySel('column-name').should('have.text', 'untitled');
  });

  context('can edit column by clicking "Edit" button', () => {
    beforeEach(() => {
      cy.getBySel('column').realHover();

      cy.getBySel('edit-column-button').click();

      cy.focused().clear().type('foo');
    });

    it('clicking "Save" button to submit', () => {
      cy.getBySel('submit-column').click();

      cy.getBySel('column-name').should('have.text', 'foo');
    });

    it('pressing "Enter" to submit', () => {
      cy.focused().type('{enter}');

      cy.getBySel('column-name').should('have.text', 'foo');
    });

    it('pressing "Escape" to submit', () => {
      cy.focused().type('{esc}');

      cy.getBySel('column-name').should('have.text', 'foo');
    });
  });

  context('can edit column by pressing "E"', () => {
    beforeEach(() => {
      cy.getBySel('column').realPress('e');

      cy.focused().clear().type('foo');
    });

    it('clicking "Save" button to submit', () => {
      cy.getBySel('submit-column').click();

      cy.getBySel('column-name').should('have.text', 'foo');
    });

    it('pressing "Enter" to submit', () => {
      cy.focused().type('{enter}');

      cy.getBySel('column-name').should('have.text', 'foo');
    });

    it('pressing "Escape" to submit', () => {
      cy.focused().type('{esc}');

      cy.getBySel('column-name').should('have.text', 'foo');
    });
  });
});

export {};
