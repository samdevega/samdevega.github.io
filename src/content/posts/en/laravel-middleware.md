---
title: "Laravel: Middleware"
pubDate: 2024-02-23T20:00:00Z
tags: ['laravel']
---
In Laravel, a middleware allows us to inspect and filter an incoming HTTP request in our application.

We can use it to check if the user who launched the request is authenticated or if he or she has the corresponding permission for the action he or she is trying to carry out. If the user is authenticated and has the appropriate permission, the middleware allows the request to continue. Otherwise, the middleware may redirect the user or respond with an HTTP access prohibited status, depending on the case.

To create a middleware, we can use the artisan command:
```bash
php artisan make:middleware HandleAccess
```

This will create a new class `HandleAccess` in the `app/Http/Middleware` directory.

If we wanted to check that the user has a certain role to allow them to continue or block their request, the class could reflect logic like the following:

```php
class HandleAccess
{
    public function handle(Request $request, Closure $next, Role $role): Response
    {
        if (!auth()->user()->hasRole($role)) {
            abort(403, 'Forbidden');
        }
        return $next($request);
    }
}
```

If we want to apply this middleware globally for all requests in the application, we will add it to the `$middleware` property of the `app/Http/Kernel.php` class.

If we want to assign it to a certain route, we can do it as follows:
```php
use App\Http\Middleware\HandleAccess;

Route::get('/myroute', function () { ... })->middleware(HandleAccess::class . ':admin');
```
The `middleware()` method allows us to pass a list to assign more than one middleware to the same route.
We can pass parameters to the middleware by adding them after a colon `:`.

We can define an alias for our middleware and use that alias to assign it to a route.

**app/Http/Kernel.php**
```php
protected $middlewareAliases = [
    ...
    'access' => \App\Http\Middleware\HandleAccess::class,
];
```
```php
Route::get('/myroute', function () { ... })->middleware('access:admin');
```

We can also bundle middleware to easily apply them to a route:

**app/Http/Kernel.php**
```php
protected $middlewareGroups = [
    'web' => [
        ...
        'access' => \App\Http\Middleware\HandleAccess::class,
    ],
    'api' => [ ... ],
]
```
```php
Route::get('/myroute', function () { ... })->middleware('web:admin');
```

In some cases we may want to perform a task after sending the response of a request to the browser. For these cases, we can implement the `TerminableMiddleware` interface and use the `terminate()` method:
```php
class MyTerminableMiddleware implements TerminableMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    public function terminate(Request $request, Response $response): void
    {
        // Do the thing here.
    }
}
```

## Conclusion
Middleware is a tool that allows us to perform tasks before and after managing an HTTP request, allowing us to add security elements such as authentication or authorization in isolation to the processing logic of the request itself.