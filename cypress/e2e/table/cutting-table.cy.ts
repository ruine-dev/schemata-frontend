describe('cutting table', () => {
  beforeEach(() => {
    cy.visit('/');

    // Prepare table
    cy.getBySel('create-table-button').click();

    cy.getBySel('table-name-input').type('{enter}');

    cy.getBySel('table-header').type('e');

    cy.focused().clear().type('foo{enter}');

    cy.getBySel('table-node').should('exist');
  });

  afterEach(() => {
    cy.getBySel('table-node').should('exist');
  });

  context('can cut table by clicking "Cut" button in table header\'s context menu', () => {
    beforeEach(() => {
      cy.getBySel('table-header').rightclick();

      cy.getBySel('table-header-context-menu-cut').click();

      cy.getBySel('table-node').should('not.exist');
    });

    it('paste by clicking "Paste" button in canvas\'s context menu', () => {
      cy.getBySel('canvas').rightclick();

      cy.getBySel('canvas-context-menu-paste').click();
    });

    it('paste by pressing "Ctrl + V"', () => {
      cy.get('body').type('{ctrl}v');
    });
  });

  context('can cut table by pressing "Ctrl + X" on table header', () => {
    beforeEach(() => {
      cy.getBySel('table-header').type('{ctrl}x');

      cy.getBySel('table-node').should('not.exist');
    });

    it('paste by clicking "Paste" button in canvas\'s context menu', () => {
      cy.getBySel('canvas').rightclick();

      cy.getBySel('canvas-context-menu-paste').click();
    });

    it('paste by pressing "Ctrl + V"', () => {
      cy.get('body').type('{ctrl}v');
    });
  });
});

export {};
