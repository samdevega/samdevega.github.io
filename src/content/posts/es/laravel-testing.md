---
title: "Laravel: Testing"
pubDate: 2024-05-23T21:30:00Z
tags: ['laravel', 'testing']
---
Laravel está diseñado para soportar tests con <a href="https://pestphp.com/" target="_blank">Pest</a> y <a href="https://phpunit.de/index.html" target ="_blank">PHPUnit</a> listo para usar, incluido un archivo `phpunit.xml`.

Una aplicación Laravel contiene dos directorios de forma predeterminada dentro de la carpeta `tests`. Estos son `Feature` y `Unit`.

Por un lado, los tests unitarios se enfocan en una sola clase y no arrancan la aplicación Laravel, por lo que no tienen acceso a la base de datos ni a otros servicios.

Por otro lado, los tests de características se centran en la interacción entre varios objetos.

Laravel utilizará el entorno `testing` y configurará la sesión y el caché en el controlador `array` (en memoria) de forma predeterminada cuando ejecute tests, por lo que no persistirán.

## Crear un test
Podemos usar el siguiente comando de artisan para crear un test de característica.
```shell
php artisan make:test MyFeatureTest
```
Si pasamos el argumento `--unit`, se creará un test unitario en su lugar.
```shell
php artisan make:test MyUnitTest --unit
```

## Escribir un test
Este es un ejemplo de un test escrito usando Pest.
```php
test('example', function () {
  expect(false)->toBeTrue();
});
```
Pest también incluye la función `describe()` para agrupar tests relacionados y la función `it()` para prefijar la descripción del test, haciendo que nuestros tests y sus resultados sean más legibles.
```php
describe('MyClass', function () {
  it('should do the thing', function () {
    expect(MyClass::doTheThing())
      ->toBeString()
      ->toBe('the_thing');
  });
});
```
Podemos consultar la lista completa de expectativas de Pest visitando su <a href="https://pestphp.com/docs/expectations" target="_blank">documentación oficial</a>.

Los hooks se pueden utilizar para configurar un test o un conjunto de tests. Los métodos disponibles son `beforeEach()`, `afterEach()`, `beforeAll()` y `afterAll()`.
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

## Usar test doubles
Los test doubles nos permiten reemplazar implementaciones reales de las dependencias de una clase para aislar sus interacciones. Son útiles para tests unitarios o incluso tests de integración cuando no se desea trabajar con la cadena completa de clases que interactúan en todo el proceso.

<a href="https://docs.mockery.io/en/latest/" target="_blank">Mockery</a> es la biblioteca de mocking recomendada por Pest.

Podemos instalarla utilizando composer.
```shell
composer require mockery/mockery --dev
```

Así es como escribimos un stub para un test.
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

Así es como escribimos un spy para un test.
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

## Ejecutar tests
Podemos usar el siguiente comando de artisan para ejecutar nuestros tests.
```shell
php artisan test
```
Podemos especificar el banco de test que queremos ejecutar o si queremos detener la ejecución cuando falla un test.
```shell
php artisan test --testsuite=Feature --stop-on-failure
```
Una de las mejores opciones es ejecutar los tests en paralelo en lugar de ejecutarlos secuencialmente, que es la opción por defecto. Esto agiliza enormemente la ejecución.
```shell
php artisan test --parallel
```
Podemos usar la opción `--coverage` con el fin de saber cuanto código de nuestra aplicación está cubierto por nuestros tests.
```shell
php artisan test --coverage
```
Pasar la opción `--min` hará que el banco de test falle si no se alcanza el umbral.
```shell
php artisan test --coverage --min=95.0
```
Pasar la opción `--profile` nos mostrará una lista con nuestros diez tests más lentos para que así podamos tratar de mejorar su rendimiento.
```shell
php artisan test --profile
```