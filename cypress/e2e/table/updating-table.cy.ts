describe('updating table', () => {
  beforeEach(() => {
    cy.visit('/');

    // Prepare table
    cy.getBySel('create-table-button').click();

    cy.getBySel('table-name-input').type('{enter}');

    cy.getBySel('table-name').should('have.text', 'untitled');
  });

  afterEach(() => {
    cy.getBySel('table-name').should('have.text', 'foo');
  });

  context('can rename table by pressing "E"', () => {
    beforeEach(() => {
      cy.getBySel('table-header').type('e');

      cy.focused().clear().type('foo');
    });

    it('pressing "Enter" to submit', () => {
      cy.focused().type('{enter}');
    });

    it('pressing "Escape" to submit', () => {
      cy.focused().type('{esc}');
    });
  });

  context('can rename table by clicking "Rename" button in table header\'s context menu', () => {
    beforeEach(() => {
      cy.getBySel('table-header').rightclick();

      cy.getBySel('table-header-context-menu-rename').click();

      cy.focused().clear().type('foo');
    });

    it('pressing "Enter" to submit', () => {
      cy.focused().type('{enter}');
    });

    it('pressing "Escape" to submit', () => {
      cy.focused().type('{esc}');
    });
  });

  context('can rename table by double clicking table header', () => {
    beforeEach(() => {
      cy.getBySel('table-header').dblclick();

      cy.focused().clear().type('foo');
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
