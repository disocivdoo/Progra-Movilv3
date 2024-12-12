describe('Pruebas de autenticación', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100');
  });

  // Test 2: Verificar login con credenciales incorrectas
  it('should show error with incorrect credentials', () => {
    cy.get('#userName').type('usuario_invalido@duocuc.cl');
    cy.get('#password').type('contraseña_incorrecta');
    cy.contains('Ingresar').click();
    cy.get('ion-toast').should('exist');
  });

  // Test 3: Verificar navegación a recuperación de contraseña
  it('should navigate to password recovery', () => {
    cy.contains('Olvidé mi contraseña').click();
    cy.url().should('include', '/correo');
  });

  // Test 4: Verificar navegación a registro
  it('should navigate to registration', () => {
    cy.contains('Registrarse').click();
    cy.url().should('include', '/register');
  });

  // Test 5: Verificar cierre de sesión
  it('should logout successfully', () => {
    // Primero hacer login
    cy.contains('Ingresar').click();
    
    // Luego hacer logout
    cy.get('ion-button[name="logout"]').click();
    cy.url().should('include', '/login');
  });

  // Test 6: Verificar redirección a login cuando no hay sesión
  it('should redirect to login when not authenticated', () => {
    cy.visit('http://localhost:8100/home'); // Visitar la página de inicio
    cy.url().should('include', '/login'); // Debería redirigir al login si no hay sesión
  });

  // Test 7: Verificar que el usuario es redirigido al login al intentar acceder a /home sin sesión
  it('should redirect to login if accessing home without being authenticated', () => {
    // Intentar acceder a la página de inicio sin estar autenticado
    cy.visit('http://localhost:8100/home');
    cy.url().should('include', '/login'); // Debe redirigir a login
  });
});
