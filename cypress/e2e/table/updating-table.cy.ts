describe('updating table', () => {
  beforeEach(() => {
    cy.visit('/');

    // Prepare table
    cy.getBySel('create-table-button').click();

    cy.getBySel('submit-table').click();

    cy.getBySel('table-name').should('have.text', 'untitled');
  });

  afterEach(() => {
    cy.getBySel('table-name').should('have.text', 'foo');
  });

  context('can rename table by clicking "Rename" button', () => {
    beforeEach(() => {
      cy.getBySel('table-header').realHover();

      cy.getBySel('rename-table-button').click();

      cy.focused().clear().type('foo');
    });

    it('clicking "Save" button to submit', () => {
      cy.getBySel('submit-table').click();
    });

    it('pressing "Enter" to submit', () => {
      cy.focused().type('{enter}');
    });

    it('pressing "Escape" to submit', () => {
      cy.focused().type('{esc}');
    });
  });

  context('can rename table by pressing "E"', () => {
    beforeEach(() => {
      cy.getBySel('table-header').type('e');

      cy.focused().clear().type('foo');
    });

    it('clicking "Save" button to submit', () => {
      cy.getBySel('submit-table').click();
    });

    it('pressing "Enter" to submit', () => {
      cy.focused().type('{enter}');
    });

    it('pressing "Escape" to submit', () => {
      cy.focused().type('{esc}');
    });
  });
});

export {};
