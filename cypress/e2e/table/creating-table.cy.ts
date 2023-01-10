describe('creating table', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  context('can create table by clicking "Add Table" button', () => {
    beforeEach(() => {
      cy.getBySel('create-table-button').click();
    });

    context('without name', () => {
      afterEach(() => {
        cy.getBySel('table-name').should('have.text', 'untitled');
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
        cy.getBySel('table-name').should('have.text', 'foo');
      });

      it('pressing "Enter" to submit', () => {
        cy.focused().type('{enter}');
      });

      it('pressing "Escape" to submit', () => {
        cy.focused().type('{esc}');
      });
    });
  });

  context('can create table by dragging "Add Table" button', () => {
    beforeEach(() => {
      const dataTransfer = new DataTransfer();

      cy.findByRole('button', { name: /Add Table/ }).trigger('dragstart', {
        dataTransfer,
      });

      cy.getBySel('canvas').trigger('drop', { dataTransfer }).trigger('dragend');
    });

    context('without name', () => {
      afterEach(() => {
        cy.getBySel('table-name').should('have.text', 'untitled');
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
        cy.getBySel('table-name').should('have.text', 'foo');
      });

      it('pressing "Enter" to submit', () => {
        cy.focused().type('{enter}');
      });

      it('pressing "Escape" to submit', () => {
        cy.focused().type('{esc}');
      });
    });
  });

  context('can create table by pressing "T"', () => {
    beforeEach(() => {
      cy.get('body').type('t');
    });

    context('without name', () => {
      afterEach(() => {
        cy.getBySel('table-name').should('have.text', 'untitled');
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
        cy.getBySel('table-name').should('have.text', 'foo');
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
