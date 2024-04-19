---
title: "E2E Testing in the Continuous Integration Workflow"
pubDate: 2024-04-09T21:00:00Z
tags: ['devops']
---
The Continuous Integration is the practice of merging all developer's working copies to a shared mainline.  
End to End Testing is the methodology for ensuring that applications behave as expected. It is done by the end user's perspective and simulates an scenario as close as possible to reality.

Nowadays there are several platforms that allow us to automate the integration and deployment processes to put an application into production. For the next example, we will see the combination of Cypress, an E2E testing framework, with GitLab CI/CD.

## Writing our E2E test

Here we have an example of an E2E test written with Cypress.

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

These are the steps that the previous test does, line by line:
1. Opens the app in the home page.
2. Performs a click event on the anchor element that points to the login page.
3. Asserts that it navigated to the login page after 2 seconds in order to wait for the new page to load.
4. Types the value `user@mail.com` in the email input element present in the login page.
5. Types the value `user_pass` in the password input element present in the login page.
6. Prepares to intercept the request that will be send to the API when the login form is submitted.
7. Performs a click event on the submit button of the login form.
8. Waits for the intercepted request to be send.
9. Asserts that it navigated to the dashboard page after 2 seconds in order to wait for the new page to load, which is the expected behavior for a successful login.

We can learn more about Cypress by visiting its <a href="https://docs.cypress.io/guides/getting-started/installing-cypress" target="_blank">official documentation</a>.

## Dockerizing our E2E test

Supposing that we have our Cypress installation with the previous End to End test in the `/e2e` directory of our project. Let's see how we create containers for each service through Docker Compose.

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

The previous Docker Compose file creates four containers for:
1. The database.
2. The API.
3. The client app.
4. Cypress with our E2E test.

Each container depends on the previous one in order to run. This ensures that the test is not going to run before the client app is ready, the client app has access to the API and the API has access to the database.  
The test will be executed using the Chrome browser, in headless mode (no UI) and skipping verbose for higher automated process performance.

This is the Dockerfile for the Cypress container.

```bash
FROM cypress/included:13.7.2

WORKDIR /e2e

COPY cypress /e2e/cypress/
COPY cypress.config.js /e2e/
```

## Integrating our E2E test with GitLab CI/CD

Now let's see the content of the `.gitlab-ci.yml` file present in the root of our project. This file contains the configuration for our CI/CD pipeline.

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

This will create an stage called `e2e` in our pipeline with a job that runs these three scripts every time we push a commit to a branch with the pattern `feature-*` or to the `main` branch (useful when performing a merge).  
The second script will run the Cypress container, which will run our E2E test. If the test fails, the job in the `e2e` stage will fail too, preventing us from moving into the deployment stage and will protect the environment.

For more information about GitLab CI/CD, we can visit its <a href="https://docs.gitlab.com/ee/ci/" target="_blank">official documentation</a>.