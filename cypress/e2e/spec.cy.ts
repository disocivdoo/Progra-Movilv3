// describe('empty spec', () => {
//   it('passes', () => {
//     cy.visit('https://example.cypress.io')
//   })
// })

/*
Navegar hacia una página en específico:
   cy.visit('http://localhost:8100/').then(() => { ... });

Hacer clic en un botón, usando el texto del botón:
    cy.contains('Ingresa a tu cuenta').click();

Para hacer clic en un botón, usando el id del botón:
    cy.get('#salir').click();

Cambiar el valor de una caja de texto usando su id:
    cy.get('#correo').invoke('val', 'jperez@duocuc.cl');

Comparar el título de la página actual con un valor esperado:
  cy.get('ion-title').should('contain.text', 'Sistema de Asistencia DUOC');

Comparar el texto de un control HTML identificado por un id="#saludo":
  cy.get('#saludo').should('contain.text', '¡Bienvenido Juan Pérez González!');
*/

describe('Verificar mi aplicación', () => {

  // Se intentará navegar hacia la página de inicio con un correo inexistente, por lo que
  // será inutil probar si el saludo se le emite al usuario "Juan Pérez González".
  // En este caso se detectará un error y se mostrará un mensaje.

  it('Verificar login con credenciales incorrectas', () => {
    cy.visit('http://localhost:8100/').then(() => {
      cy.get('#correo').invoke('val', 'correo-inexistente@duocuc.cl');
      cy.get('#password').invoke('val', '1234');
      cy.contains('Ingresa a tu cuenta').click();
      cy.intercept('/home').as('route').then(() => {
          cy.get('ion-title').should('contain.text', 'Sistema de Asistencia DUOC');
          cy.get('#saludo').should('contain.text', '¡Bienvenido Juan Pérez González!');
      });
    });
  });


  // Se intentará navegar hacia la página de inicio con el correo "jperez@duocuc.cl", por lo que
  // la Aplicación debe probar si el saludo se le emite al usuario "Juan Pérez González".
  // En este caso debe pasar correctamente la prueba.

  it('Verificar login con credenciales correctas', () => {
    cy.wait(3000);
    cy.visit('http://localhost:8100/').then(() => {
      cy.get('#correo').invoke('val', 'jperez@duocuc.cl');
      cy.get('#password').invoke('val', '5678');
      cy.wait(3000);
      cy.contains('Ingresa a tu cuenta').click();
      cy.intercept('/home').as('route').then(() => {
          cy.wait(3000);
          cy.get('ion-title').should('contain.text', 'Sistema de Asistencia DUOC');
          cy.get('#saludo').should('contain.text', '¡Bienvenido Juan Pérez González!');
          cy.wait(3000);
          cy.contains('Salir').click();
      });
    });
  });

});