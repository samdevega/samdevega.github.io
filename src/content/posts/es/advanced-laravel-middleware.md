---
title: "Laravel Avanzado: Middleware"
pubDate: 2024-02-23T20:00:00Z
tags: ['laravel']
---
En Laravel, un middleware permite inspeccionar y filtrar una petición HTTP entrante en nuestra aplicación.

Podemos usarlo para comprobar si el usuario que ha lanzado la petición está autenticado o si posee el permiso correspondiente para la acción que intenta llevar a cabo. Si el usuario está autenticado y tiene el permiso oportuno, el middleware permite que la petición continúe. En caso contrario, el middleware podrá redirigir al usuario o responder con un estado HTTP de acceso prohibido, según el caso.

Para crear un middleware, podemos utilizar el comando de artisan
```bash
php artisan make:middleware HandleAccess
```

Esto creará una nueva clase `HandleAccess` en el directorio `app/Http/Middleware`.

Si quisiéramos comprobar que el usuario tiene un rol determinado para permitirle continuar o bloquear su petición, la clase podría reflejar una lógica como la siguiente:

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

Si queremos aplicar dicho middleware de forma global para todas las peticiones en la aplicación, lo añadiremos a la propiedad `$middleware` de la clase `app/Http/Kernel.php`.

Si queremos asignarlo a una ruta determinada, podemos hacerlo de la siguiente manera:
```php
use App\Http\Middleware\HandleAccess;

Route::get('/myroute', function () { ... })->middleware(HandleAccess::class . ':admin');
```
El método `middleware()` nos permite pasar una lista para asignar más de un middleware a una misma ruta.
Podemos pasar parámetros al middleware añadiéndolos tras dos puntos `:`.

Podemos definir un alias para nuestro middleware y utilizar dicho alias para asignarlo a una ruta.

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

También podemos agrupar middleware para aplicarlos fácilmente a una ruta:

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

En algunos casos podemos querer realizar una tarea tras enviar la respuesta de una petición al navegador. Para estos casos, podemos implementar la interfaz `TerminableMiddleware` y hacer uso del método `terminate()`:
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

## Conclusión
Los middleware son una herramienta que nos permite realizar tareas antes y después de gestionar una petición HTTP, permitiéndonos añadir elementos de seguridad como autenticación o autorización de forma aislada a la lógica de tratamiento de la propia petición.