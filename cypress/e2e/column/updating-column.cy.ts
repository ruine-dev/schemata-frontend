describe('updating column', () => {
  beforeEach(() => {
    cy.visit('/');

    // Prepare table
    cy.getBySel('create-table-button').click();

    cy.getBySel('table-name-input').type('{enter}');

    // Prepare column
    cy.getBySel('table-node').realHover();

    cy.getBySel('create-column-button').click();

    cy.getBySel('column-name-textbox').type('{enter}');

    cy.getBySel('column-name').should('have.text', 'untitled');
  });

  context('can edit column by pressing "E"', () => {
    beforeEach(() => {
      cy.getBySel('column').type('e');

      cy.focused().clear().type('foo');
    });

    afterEach(() => {
      cy.getBySel('column-name').should('have.text', 'foo');
    });

    context('without changing data type', () => {
      afterEach(() => {
        cy.getBySel('column-type').should('have.text', 'VARCHAR');
      });

      context('left primary key unchecked', () => {
        afterEach(() => {
          cy.getBySel('column-key').should('not.have.text', 'Primary key');
        });

        it('pressing "Enter" to submit', () => {
          cy.focused().type('{enter}');
        });

        it('pressing "Escape" to submit', () => {
          cy.focused().type('{esc}');
        });
      });

      context('checked primary key', () => {
        beforeEach(() => {
          cy.getBySel('column-primary-key-checkbox').click();
        });

        afterEach(() => {
          cy.getBySel('column-key').should('have.text', 'Primary key');
        });

        it('pressing "Enter" after change focus to name input to submit', () => {
          cy.getBySel('column-name-textbox').type('{enter}');
        });

        it('pressing "Escape" to submit', () => {
          cy.focused().type('{esc}');
        });
      });
    });

    context('with changing data type', () => {
      beforeEach(() => {
        cy.getBySel('column-type-combobox').click();

        cy.getBySel('column-type-combobox-INTEGER').click();
      });

      afterEach(() => {
        cy.getBySel('column-type').should('have.text', 'INTEGER');
      });

      context('left primary key unchecked', () => {
        afterEach(() => {
          cy.getBySel('column-key').should('not.have.text', 'Primary key');
        });

        it('pressing "Enter" to submit', () => {
          cy.focused().type('{enter}');
        });

        it('pressing "Escape" to submit', () => {
          cy.focused().type('{esc}');
        });
      });

      context('checked primary key', () => {
        beforeEach(() => {
          cy.getBySel('column-primary-key-checkbox').click();
        });

        afterEach(() => {
          cy.getBySel('column-key').should('have.text', 'Primary key');
        });

        it('pressing "Enter" after change focus to name input to submit', () => {
          cy.getBySel('column-name-textbox').type('{enter}');
        });

        it('pressing "Escape" to submit', () => {
          cy.focused().type('{esc}');
        });
      });
    });
  });

  context('can edit column by clicking "Edit" button in column\'s context menu', () => {
    beforeEach(() => {
      cy.getBySel('column').rightclick();

      cy.getBySel('column-context-menu-edit').click();

      cy.focused().clear().type('foo');
    });

    afterEach(() => {
      cy.getBySel('column-name').should('have.text', 'foo');
    });

    context('without changing data type', () => {
      afterEach(() => {
        cy.getBySel('column-type').should('have.text', 'VARCHAR');
      });

      context('left primary key unchecked', () => {
        afterEach(() => {
          cy.getBySel('column-key').should('not.have.text', 'Primary key');
        });

        it('pressing "Enter" to submit', () => {
          cy.focused().type('{enter}');
        });

        it('pressing "Escape" to submit', () => {
          cy.focused().type('{esc}');
        });
      });

      context('checked primary key', () => {
        beforeEach(() => {
          cy.getBySel('column-primary-key-checkbox').click();
        });

        afterEach(() => {
          cy.getBySel('column-key').should('have.text', 'Primary key');
        });

        it('pressing "Enter" after change focus to name input to submit', () => {
          cy.getBySel('column-name-textbox').type('{enter}');
        });

        it('pressing "Escape" to submit', () => {
          cy.focused().type('{esc}');
        });
      });
    });

    context('with changing data type', () => {
      beforeEach(() => {
        cy.getBySel('column-type-combobox').click();

        cy.getBySel('column-type-combobox-INTEGER').click();
      });

      afterEach(() => {
        cy.getBySel('column-type').should('have.text', 'INTEGER');
      });

      context('left primary key unchecked', () => {
        afterEach(() => {
          cy.getBySel('column-key').should('not.have.text', 'Primary key');
        });

        it('pressing "Enter" to submit', () => {
          cy.focused().type('{enter}');
        });

        it('pressing "Escape" to submit', () => {
          cy.focused().type('{esc}');
        });
      });

      context('checked primary key', () => {
        beforeEach(() => {
          cy.getBySel('column-primary-key-checkbox').click();
        });

        afterEach(() => {
          cy.getBySel('column-key').should('have.text', 'Primary key');
        });

        it('pressing "Enter" after change focus to name input to submit', () => {
          cy.getBySel('column-name-textbox').type('{enter}');
        });

        it('pressing "Escape" to submit', () => {
          cy.focused().type('{esc}');
        });
      });
    });
  });

  context('can edit column by double clicking column', () => {
    beforeEach(() => {
      cy.getBySel('column').dblclick();

      cy.focused().clear().type('foo');
    });

    afterEach(() => {
      cy.getBySel('column-name').should('have.text', 'foo');
    });

    context('without changing data type', () => {
      afterEach(() => {
        cy.getBySel('column-type').should('have.text', 'VARCHAR');
      });

      context('left primary key unchecked', () => {
        afterEach(() => {
          cy.getBySel('column-key').should('not.have.text', 'Primary key');
        });

        it('pressing "Enter" to submit', () => {
          cy.focused().type('{enter}');
        });

        it('pressing "Escape" to submit', () => {
          cy.focused().type('{esc}');
        });
      });

      context('checked primary key', () => {
        beforeEach(() => {
          cy.getBySel('column-primary-key-checkbox').click();
        });

        afterEach(() => {
          cy.getBySel('column-key').should('have.text', 'Primary key');
        });

        it('pressing "Enter" after change focus to name input to submit', () => {
          cy.getBySel('column-name-textbox').type('{enter}');
        });

        it('pressing "Escape" to submit', () => {
          cy.focused().type('{esc}');
        });
      });
    });

    context('with changing data type', () => {
      beforeEach(() => {
        cy.getBySel('column-type-combobox').click();

        cy.getBySel('column-type-combobox-INTEGER').click();
      });

      afterEach(() => {
        cy.getBySel('column-type').should('have.text', 'INTEGER');
      });

      context('left primary key unchecked', () => {
        afterEach(() => {
          cy.getBySel('column-key').should('not.have.text', 'Primary key');
        });

        it('pressing "Enter" to submit', () => {
          cy.focused().type('{enter}');
        });

        it('pressing "Escape" to submit', () => {
          cy.focused().type('{esc}');
        });
      });

      context('checked primary key', () => {
        beforeEach(() => {
          cy.getBySel('column-primary-key-checkbox').click();
        });

        afterEach(() => {
          cy.getBySel('column-key').should('have.text', 'Primary key');
        });

        it('pressing "Enter" after change focus to name input to submit', () => {
          cy.getBySel('column-name-textbox').type('{enter}');
        });

        it('pressing "Escape" to submit', () => {
          cy.focused().type('{esc}');
        });
      });
    });
  });
});

export {};
