---
title: "Laravel: Cache"
pubDate: 2024-04-23T22:10:00Z
tags: ['laravel']
---
Some requests in an application can imply the execution of tasks that are CPU intensive or takes a lot of time to be done. For these cases, we can cache the resulting data for some time so it can be retrieved in a fast way on subsequent requests instead of having to execute the expensive task again in order to improve an application performance.

Laravel provides a unified API for various cache backends such as Memcached, Redis, DynamoDB, relational databases or file based. It also has an array and null cache driver that can be used as backends for automated tests. It can cache several things like database query results or rendered views. Let's see an example that uses the database cache driver.


## Example using database driver
First we need to create a database table to contain the cache data. If our application does not contain this migration, we can create it and run it with the following artisan commands.
```shell
php artisan make:cache-table

php artisan migrate
```

Then we will be able to obtain a cache instance through the Cache facade.
```php
use Illuminate\Support\Facades\Cache;
```

### Storing items in the cache
**Storing indefinitely**
```php
Cache::put('key', 'value');

Cache::forever('key', 'value');
```
**Storing during 10 seconds**
```php
Cache::put('key', 'value', $seconds = 10);
```
**Storing during 10 minutes using DateTime**
```php
Cache::put('key', 'value', now()->addMinutes(10));
```
**Storing indefinitely if not present**
```php
Cache::add('key', 'value');
```
**Storing during 10 seconds if not present**
```php
Cache::add('key', 'value', $seconds = 10);
```

### Retrieving items from the cache
**Retriving**
```php
$value = Cache::get('key');
```
**Retriving a default value if the item does not exist in the cache**
```php
$value = Cache::get('key', 'default');
```
**Retrieving the item and stores it if it does not exist**
```php
$value = Cache::remember('key', $seconds, function () {
  return DB::table('some_table')->get();
})
```
**Retrieving the item and stores it indefinitely if it does not exist**
```php
$value = Cache::rememberForever('key', function () {
  return DB::table('some_table')->get();
})
```
**Retrieving and deleting the item**
```php
$value = Cache::pull('key');
```

### Determining item existence
```php
if (Cache::has('key')) {
  ...
}
```

### Removing items from the cache
```php
Cache::forget('key');
```
**Removing the item by passing zero or negative number for expiration seconds**
```php
Cache::put('key', 'value', 0);

Cache::put('key', 'value', -5);
```
**Clear the entire cache**
```php
Cache::flush();
```

### Incrementing / Decrementing cached integer items
```php
Cache::increment('key', $amount);

Cache::decrement('key', $amount);
```

### Cache helper method
**Retrieving the item**
```php
$value = cache('key');
```
**Storing indefinitely**
```php
cache(['key' => 'value']);
```
**Storing during 10 seconds**
```php
cache(['key' => 'value'], $seconds = 10);
```
**Storing during 10 minutes using DateTime**
```php
cache(['key' => 'value'], now()->addMinutes(10));
```

When the cache helper method is called without any arguments, it returns an instance of the `Illuminate\Contracts\Cache\Factory` implementation that can be used to call other methods.
```php
cache()->remember('key', $seconds, function() {
  return DB::table('some_table')->get();
});
```

To learn more about Laravel Cache, we can visit the <a href="https://laravel.com/docs/11.x/cache" target="_blank">official documentation</a>.