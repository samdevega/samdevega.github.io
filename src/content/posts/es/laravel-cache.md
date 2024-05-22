---
title: "Laravel: Caché"
pubDate: 2024-04-23T22:10:00Z
tags: ['laravel']
---
Algunas solicitudes en una aplicación pueden implicar la ejecución de tareas que requieren un uso intensivo de la CPU o que requieren mucho tiempo. Para estos casos, podemos almacenar en caché los datos resultantes durante algún tiempo para poder recuperarlos de manera rápida en solicitudes posteriores en lugar de tener que ejecutar la costosa tarea nuevamente para mejorar el rendimiento de la aplicación.

Laravel proporciona una API unificada para varios backends de caché como Memcached, Redis, DynamoDB, bases de datos relacionales o basadas en archivos. También tiene un controlador de caché null y de array que se puede utilizar como backend para pruebas automatizadas. Puede almacenar en caché varias cosas, como resultados de consultas de bases de datos o vistas renderizadas. Veamos un ejemplo que utiliza el controlador de caché de la base de datos.


## Ejemplo de uso del controlador de base de datos
Primero necesitamos crear una tabla de base de datos para contener los datos del caché. Si nuestra aplicación no contiene esta migración, podemos crearla y ejecutarla con los siguientes comandos de artisan.
```shell
php artisan make:cache-table

php artisan migrate
```

Luego podremos obtener una instancia de caché a través de la fachada Cache.
```php
use Illuminate\Support\Facades\Cache;
```

### Almacenar elementos en el caché
**Almacenar indefinidamente**
```php
Cache::put('key', 'value');

Cache::forever('key', 'value');
```
**Almacenar durante 10 segundos**
```php
Cache::put('key', 'value', $seconds = 10);
```
**Almacenar durante 10 minutoss usando DateTime**
```php
Cache::put('key', 'value', now()->addMinutes(10));
```
**Almacenar indefinidamente si no existe**
```php
Cache::add('key', 'value');
```
**Almacenar durante 10 segundos si no existe**
```php
Cache::add('key', 'value', $seconds = 10);
```

### Obtener elementos del caché
**Obtener**
```php
$value = Cache::get('key');
```
**Obtener un valor por defecto si el elemento no existe**
```php
$value = Cache::get('key', 'default');
```
**Obtener un elemento y guardarlo si no existe**
```php
$value = Cache::remember('key', $seconds, function () {
  return DB::table('some_table')->get();
})
```
**Obtener un elemento y guardarlo indefinidamente si no existe**
```php
$value = Cache::rememberForever('key', function () {
  return DB::table('some_table')->get();
})
```
**Obtener un elemento y borrarlo**
```php
$value = Cache::pull('key');
```

### Determinar la existencia de un elemento
```php
if (Cache::has('key')) {
  ...
}
```

### Borrar elementos del caché
```php
Cache::forget('key');
```
**Borrar el elemento pasando cero o un número negativo para los segundos de expiración**
```php
Cache::put('key', 'value', 0);

Cache::put('key', 'value', -5);
```
**Borrar todo el caché**
```php
Cache::flush();
```

### Aumentar / Disminuir elementos de valor entero
```php
Cache::increment('key', $amount);

Cache::decrement('key', $amount);
```

### Método auxiliar de caché
**Obtener el elemento**
```php
$value = cache('key');
```
**Almacenar indefinidamente**
```php
cache(['key' => 'value']);
```
**Almacenar durante 10 segundos**
```php
cache(['key' => 'value'], $seconds = 10);
```
**Almacenar durante 10 minutos usando DateTime**
```php
cache(['key' => 'value'], now()->addMinutes(10));
```

Cuando se llama al método auxiliar de caché sin ningún argumento, devuelve una instancia de la implementación `Illuminate\Contracts\Cache\Factory` que se puede usar para llamar a otros métodos.
```php
cache()->remember('key', $seconds, function() {
  return DB::table('some_table')->get();
});
```

Para aprender más sobre el caché en Laravel, podemos visitar la <a href="https://laravel.com/docs/11.x/cache" target="_blank">documentación oficial</a>.