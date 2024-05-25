---
title: "Laravel: Testing"
pubDate: 2024-05-23T21:30:00Z
tags: ['laravel', 'testing']
---
Laravel is built supporting testing with <a href="https://pestphp.com/" target="_blank">Pest</a> and <a href="https://phpunit.de/index.html" target="_blank">PHPUnit</a> out of the box, including a `phpunit.xml` file.

A Laravel application contains two directories by default inside the `tests` folder. These are `Feature` and `Unit`.

On the one hand, unit tests focus in a single class and do not boot the Laravel application, so they have no access to the database or other services.

On the other hand, feature tests are focused on the interaction between several objects.

Laravel will use the `testing` environment and configure the session and cache to the `array` driver (in memory) by default when running tests, so they will not be persisted.

## Creating a test
We can use the the next artisan command to create a feature test.
```shell
php artisan make:test MyFeatureTest
```
If we pass the argument `--unit`, it will create a unit test instead.
```shell
php artisan make:test MyUnitTest --unit
```

## Writting a test
This is an example of a test written using Pest.
```php
test('example', function () {
  expect(false)->toBeTrue();
});
```
Pest also includes the `describe()` function for grouping related tests and the `it()` function for prefixing the test description, making our tests and their outputs more readable.
```php
describe('MyClass', function () {
  it('should do the thing', function () {
    expect(MyClass::doTheThing())
      ->toBeString()
      ->toBe('the_thing');
  });
});
```
We can check the full list of Pest expectations visiting its <a href="https://pestphp.com/docs/expectations" target="_blank">official documentation</a>.

Pest hooks can be used for setting up a test or a test suite. The available methods are `beforeEach()`, `afterEach()`, `beforeAll()` and `afterAll()`.
```php
describe('SomeModel', function () {
  beforeEach(function () {
    $this->someRepository = new SomeRepository();
  });

  it('should be created', function () {
    $someModel = $this->someRepository->create();

    expect($someModel)->toBeInstanceOf(SomeModel::class);
  });

  afterEach(function () {
    $this->someRepository->reset();
  });
});
```

## Using test doubles
Test doubles allow us to replace real implementations of the dependencies of a class in order to isolate its interactions. They are useful for unit tests or even integration tests when you do not want to work with the full chain of classes that interact in the whole process.

<a href="https://docs.mockery.io/en/latest/" target="_blank">Mockery</a> is the mocking library recommended by Pest.

We can install it using composer.
```shell
composer require mockery/mockery --dev
```

This is how we write a stub for a test.
```php
describe('SubscribedUsersCounter', () => {
  it('should count the number of subscribed users', () => {
    $subscribedUserStub = Mockery::mock(User::class);
    $subscribedUserStub->shouldReceive('isSubscribed')->andReturn(true);
    $subscribedUsersCounter = new SubscribedUsersCounter();
    
    expect($subscribedUsersCounter->count([ $subscribedUserStub ]))
      ->toBe(1);
  });
});
```

This is how we write a spy for a test.
```php
describe('Order', () => {
  it('should notify when it is processed', () => {
    $orderProcessedNotificationSpy = Mockery::spy(OrderProcessedNotification::class);
    $order = new Order();

    $order->process();

    $orderProcessedNotificationSpy
      ->shouldHaveReceived('toMail')
      ->once();
  });
});
```

## Running tests
We can use the next artisan command to run our tests.
```shell
php artisan test
```
We can specify the test suite that we want to run or if we want to stop the execution when a test fails.
```shell
php artisan test --testsuite=Feature --stop-on-failure
```
One of the greatest options is to run tests in parallel instead of running them sequentially, which is the default option. This will greatly speed up the execution.
```shell
php artisan test --parallel
```
We can use the `--coverage` option in order to know how much of our application code is covered by our tests.
```shell
php artisan test --coverage
```
Passing the `--min` option will make the test suite fail if the threshold is not met.
```shell
php artisan test --coverage --min=95.0
```
Passing the `--profile` option will show us a list with our ten slowest tests so we can try to improve their performance.
```shell
php artisan test --profile
```