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

      context('with default data type', () => {
        afterEach(() => {
          cy.getBySel('column-type').should('have.text', 'VARCHAR');
        });

        context('left primary key unchecked', () => {
          afterEach(() => {
            cy.getBySel('column-key').should('not.have.text', 'Primary key');
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

        context('checked primary key', () => {
          beforeEach(() => {
            cy.getBySel('column-primary-key-checkbox').click();
          });

          afterEach(() => {
            cy.getBySel('column-key').should('have.text', 'Primary key');
          });

          it('clicking "Save" button to submit', () => {
            cy.getBySel('submit-column').click();
          });

          it('pressing "Enter" after change focus to name input to submit', () => {
            cy.getBySel('column-name-textbox').type('{enter}');
          });

          it('pressing "Escape" to submit', () => {
            cy.focused().type('{esc}');
          });
        });
      });

      context('with custom data type', () => {
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

        context('checked primary key', () => {
          beforeEach(() => {
            cy.getBySel('column-primary-key-checkbox').click();
          });

          afterEach(() => {
            cy.getBySel('column-key').should('have.text', 'Primary key');
          });

          it('clicking "Save" button to submit', () => {
            cy.getBySel('submit-column').click();
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

    context('with custom name', () => {
      beforeEach(() => {
        cy.focused().type('foo');
      });

      afterEach(() => {
        cy.getBySel('column-name').should('have.text', 'foo');
      });

      context('with default data type', () => {
        afterEach(() => {
          cy.getBySel('column-type').should('have.text', 'VARCHAR');
        });

        context('left primary key unchecked', () => {
          afterEach(() => {
            cy.getBySel('column-key').should('not.have.text', 'Primary key');
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

        context('checked primary key', () => {
          beforeEach(() => {
            cy.getBySel('column-primary-key-checkbox').click();
          });

          afterEach(() => {
            cy.getBySel('column-key').should('have.text', 'Primary key');
          });

          it('clicking "Save" button to submit', () => {
            cy.getBySel('submit-column').click();
          });

          it('pressing "Enter" after change focus to name input to submit', () => {
            cy.getBySel('column-name-textbox').type('{enter}');
          });

          it('pressing "Escape" to submit', () => {
            cy.focused().type('{esc}');
          });
        });
      });

      context('with custom data type', () => {
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

        context('checked primary key', () => {
          beforeEach(() => {
            cy.getBySel('column-primary-key-checkbox').click();
          });

          afterEach(() => {
            cy.getBySel('column-key').should('have.text', 'Primary key');
          });

          it('clicking "Save" button to submit', () => {
            cy.getBySel('submit-column').click();
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
});

export {};
