describe('copying table', () => {
  beforeEach(() => {
    cy.visit('/');

    // Prepare table
    cy.getBySel('create-table-button').click();

    cy.getBySel('table-name-input').type('{enter}');

    cy.getBySel('table-header').type('e');

    cy.focused().clear().type('foo{enter}');
  });

  afterEach(() => {
    cy.getBySel('table-node').should('have.length', 2);
    cy.getBySel('table-name').first().should('have.text', 'foo');
    cy.getBySel('table-name').last().should('have.text', 'foo');
  });

  context('can copy table by clicking "Copy" button in table header\'s context menu', () => {
    beforeEach(() => {
      cy.getBySel('table-header').rightclick();

      cy.getBySel('table-header-context-menu-copy').click();
    });

    it('paste by clicking "Paste" button in canvas\'s context menu', () => {
      cy.getBySel('canvas').rightclick();

      cy.getBySel('canvas-context-menu-paste').click();
    });

    it('paste by pressing "Ctrl + V"', () => {
      cy.get('body').type('{ctrl}v');
    });
  });

  context('can copy table by pressing "Ctrl + C" on table header', () => {
    beforeEach(() => {
      cy.getBySel('table-header').type('{ctrl}c');
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
