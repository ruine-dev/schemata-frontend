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

    context('with custom name', () => {
      beforeEach(() => {
        cy.focused().type('foo');
      });

      afterEach(() => {
        cy.getBySel('table-name').should('have.text', 'foo');
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

  context('can create table by dragging "Add Table" button', () => {
    const dataTransfer = new DataTransfer();

    beforeEach(() => {
      cy.findByRole('button', { name: /Add Table/ }).trigger('dragstart', {
        dataTransfer,
      });

      cy.get('#canvas').trigger('drop', { dataTransfer }).trigger('dragend');
    });

    context('without name', () => {
      afterEach(() => {
        cy.getBySel('table-name').should('have.text', 'untitled');
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

    context('with custom name', () => {
      beforeEach(() => {
        cy.focused().type('foo');
      });

      afterEach(() => {
        cy.getBySel('table-name').should('have.text', 'foo');
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
});

export {};
