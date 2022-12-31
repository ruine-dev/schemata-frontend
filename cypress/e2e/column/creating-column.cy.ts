describe('creating column', () => {
  beforeEach(() => {
    cy.visit('/');

    // Prepare table
    cy.getBySel('create-table-button').click();

    cy.getBySel('submit-table').click();
  });

  context('can create column by clicking "Add Field" button', () => {
    beforeEach(() => {
      cy.getBySel('table-node').realHover();

      cy.getBySel('create-column-button').click();
    });

    context('without name', () => {
      afterEach(() => {
        cy.getBySel('column-name').should('have.text', 'untitled');
      });

      it('clicking "Save" button to submit', () => {
        cy.getBySel('submit-column').click();
      });

      it('pressing "Enter" to submit', () => {
        cy.focused().type('{enter}');
      });

      it('pressing "Escape" to submit', () => {
        cy.focused().type('{esc}');
      });
    });

    context('with custom name', () => {
      beforeEach(() => {
        cy.focused().type('foo');
      });

      afterEach(() => {
        cy.getBySel('column-name').should('have.text', 'foo');
      });

      it('clicking "Save" button to submit', () => {
        cy.getBySel('submit-column').click();
      });

      it('pressing "Enter" to submit', () => {
        cy.focused().type('{enter}');
      });

      it('pressing "Escape" to submit', () => {
        cy.focused().type('{esc}');
      });
    });
  });
});

export {};
