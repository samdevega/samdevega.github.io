---
title: "Tests E2E en el flujo de trabajo de Integración Continua"
pubDate: 2024-04-09T21:00:00Z
tags: ['devops', 'testing']
---
La Integración Continua es la práctica de fusionar todas las copias de trabajo del desarrollador en una línea principal compartida.
End to End Testing es la metodología para garantizar que las aplicaciones se comporten como se espera. Se realiza desde la perspectiva del usuario final y simula un escenario lo más cercano posible a la realidad.

Hoy en día existen diversas plataformas que nos permiten automatizar los procesos de integración y despliegue para poner una aplicación en producción. En el siguiente ejemplo, veremos la combinación de Cypress, un framework de test E2E, con GitLab CI/CD.

## Escribiendo nuestro test E2E

Aquí tenemos un ejemplo de un test E2E escrito con Cypress.

```javascript
describe('User', () => {
  it('can log in', () => {
    cy.visit('/')
    cy.get('a[href="/login"]').click()
    cy.url({ timeout: 2000 }).should('be.equal', 'http://myapp.com/login')
    cy.get('input[name="email"]').click().focused().type.('user@mail.com')
    cy.get('input[name="password"]').click().focused().type.('user_pass')
    cy.intercept('POST', 'http://api.myapp.com/auth/login').as('loginRequest')
    cy.get('button[type="submit"]').click()
    cy.wait('@loginRequest')
    cy.url({ timeout: 2000 }).should('be.equal', 'http://myapp.com/dashboard')
  })
})
```

Estos son los pasos que hace el test anterior, línea por línea:
1. Abre la aplicación en la página de inicio.
2. Realiza un evento de clic en el elemento ancla que apunta a la página de inicio de sesión.
3. Afirma que navegó a la página de inicio de sesión después de 2 segundos para esperar a que se cargue la nueva página.
4. Escribe el valor `usuario@mail.com` en el elemento de entrada de correo electrónico presente en la página de inicio de sesión.
5. Escribe el valor `user_pass` en el elemento de entrada de contraseña presente en la página de inicio de sesión.
6. Se prepara para interceptar la solicitud que se enviará a la API cuando se envíe el formulario de inicio de sesión.
7. Realiza un evento de clic en el botón de envío del formulario de inicio de sesión.
8. Espera a que se envíe la solicitud interceptada.
9. Afirma que navegó a la página del panel después de 2 segundos para esperar a que se cargue la nueva página, que es el comportamiento esperado para un inicio de sesión exitoso.

Podemos obtener más información sobre Cypress visitando su <a href="https://docs.cypress.io/guides/getting-started/installing-cypress" target="_blank">documentación oficial</a>.

## Dockerizando nuestro test E2E

Suponiendo que tenemos nuestra instalación de Cypress con el test End to End anterior en el directorio `/e2e` de nuestro proyecto. Veamos cómo creamos contenedores para cada servicio a través de Docker Compose.

```yaml
services:
  database:
    image: registry.gitlab.com/company/myapp/database:latest
  api:
    image: registry.gitlab.com/company/myapp/api:preproduction
    depends_on:
      - database
  client:
    image: registry.gitlab.com/company/myapp/client:preproduction
    depends_on:
      - api
    healthcheck:
      test: curl --fail http://client || exit 1
      interval: 5s
      timeout: 5s
      retries: 5
  e2e:
    build:
      context: .
      dockerfile: Dockerfile.e2e
    depends_on:
      client:
        condition: service_healthy
    command: '--quiet --headless --browser chrome'
```

El archivo Docker Compose anterior crea cuatro contenedores para:
1. La base de datos.
2. La API.
3. La aplicación cliente.
4. Cypress con nuestro test E2E.

Cada contenedor depende del anterior para poder ejecutarse. Esto garantiza que el test no se ejecutará antes de que la aplicación cliente esté lista, la aplicación cliente tenga acceso a la API y la API tenga acceso a la base de datos.  
El test se ejecutará utilizando el navegador Chrome, en modo headless (sin UI) y omitiendo la verbosidad para un mayor rendimiento del proceso automatizado.

Este es el Dockerfile para el contenedor de Cypress.

```bash
FROM cypress/included:13.7.2

WORKDIR /e2e

COPY cypress /e2e/cypress/
COPY cypress.config.js /e2e/
```

## Integrando nuestro test E2E con GitLab CI/CD

Ahora veamos el contenido del archivo `.gitlab-ci.yml` presente en la raíz de nuestro proyecto. Este archivo contiene la configuración de nuestro pipeline de CI/CD.

```yaml
e2e_job:
  stage: e2e
  tags:
    - docker
  script:
    - bash docker-compose build
    - bash docker-compose run --rm e2e
    - bash docker-compose down
  rules:
    - if: '$CI_COMMIT_BRANCH =~ /^feature-|^main$/'
```

Esto creará una fase llamada `e2e` en nuestro pipeline con un job que ejecuta estos tres scripts cada vez que enviamos una confirmación a una rama con el patrón `feature-*` o a la rama `main` (útil al realizar un merge).  
El segundo script ejecutará el contenedor de Cypress, que ejecutará nuestro test E2E. Si el test falla, el job en la fase `e2e` también fallará, lo que nos impedirá pasar a la etapa de despliegue y protegerá el entorno.

Para obtener más información sobre GitLab CI/CD, podemos visitar su <a href="https://docs.gitlab.com/ee/ci/" target="_blank">documentación oficial</a>.