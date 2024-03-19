---
title: "Laravel Avanzado: Service Container"
pubDate: 2024-02-19T20:40:00Z
tags: ['laravel']
---
El contenedor de servicios de Laravel es una caja de herramientas que nos facilita el acceso a las diferentes herramientas de nuestro código. Esto se consigue mediante la inyección de dependencias y opcionalmente con enlaces.
Si bien Laravel ya nos provee en la mayoría de los casos con una resolución de cero configuración para la inyección de dependencias, hay dos casos en los que tendremos que hacer uso del contenedor de servicios:
1. Cuando queramos hacer referencia a una interfaz en una ruta o el constructor de una clase.
2. Si estamos escribiendo un paquete de Laravel para compartirlo con otros, puede que necesitemos enlazar los servicios de nuestro paquete.

Comúnmente haremos uso del contenedor de servicios a través de un proveedor de servicios, pero podemos acceder a él fuera de un proveedor mediante el uso de la fachada `App`.

Una de sus ventajas del contenedor de servicios es que puede darnos la herramienta específica que necesitamos para poder realizar un trabajo determinado, manteniendo al resto de los actores desacoplados de la especificación de dicha herramienta.  
Siguiendo con la metáfora, imaginemos que necesitamos enroscar un tornillo con cabezal de estrella. Esto requiere hacer uso de un destornillador de estrella.
Esta caja de herramientas nos permite definir que cuando pedimos un destornillador para enroscar un tornillo de estrella, nos de un destornillador de estrella sin tener que pedirlo específicamente.

Este es el caso de enlace de interfaces a implementaciones.

## Ejemplo
**app/Models/Screw.php**
```php
namespace App\Models;

interface Screw {
  public function head(): string;
}
```
**app/Models/StarScrew.php**
```php
namespace App\Models;

use App\Models\Screw;

class StarScrew implements Screw {
  public function head(): string {
    return 'star head';
  }
}
```
**app/Http/Services/ScrewdriverService.php**
```php
namespace App\Http\Services;

use App\Models\Screw;

interface ScrewdriverService {
  public function screwIn(Screw $screw): string;
}
```
**app/Http/Services/StarScrewdriverService.php**
```php
namespace App\Http\Services;

use App\Models\Screw;
use App\Http\Services\ScrewdriverService;

class StarScrewdriverService implements ScrewdriverService {
  public function screwIn(Screw $screw): string {
    return 'using a star screwdriver on a screw with a ' . $screw->head();
  }
}
```
**resources/views/service_container_example.blade.php**
```php
{{ $output }}
```
**app/Http/Controllers/ScrewdriverController.php**
```php
namespace App\Http\Controllers;

use App\Models\StarScrew;
use App\Http\Controllers\Controller;
use App\Http\Services\ScrewdriverService;
use Illuminate\View\View;

class ScrewdriverController extends Controller
{
  public function __construct(
    protected ScrewdriverService $screwdriverService
  ) {}

  public function screwInStarScrew(): View {
    $screw = new StarScrew();
    return view('service_container_example', [
      'output' => $this->screwdriverService->screwIn($screw)
    ]);
  }
}
```
**routes/web.php**
```php
use App\Http\Controllers\ScrewdriverController;
use Illuminate\Support\Facades\Route;

Route::get('/example', [ScrewdriverController::class, 'screwInStarScrew']);
```
**app/Providers/AppServiceProvider.php**
```php
namespace App\Providers;

use App\Http\Services\ScrewdriverService;
use App\Http\Services\StarScrewdriverService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider {
  public function register(): void
  {
      $this->app->bind(ScrewdriverService::class, StarScrewdriverService::class);
  }
}
```
Si accedemos con el navegador al endpoint `localhost:8000/example` vemos efectivamente que el resultado que se muestra es:
```
using a star screwdriver on a screw with a star head
```
El contenedor de servicios ha resuelto la instanciación de la clase específica `StarScrewdriverService` aunque el controlador conoce únicamente a la interfaz `ScrewdriverService`, manteniéndose desacoplado.

Ahora ¿Y si necesitamos enlazar dos clases específicas a una misma interfaz, en función del controlador que vaya a hacer uso de la inyección de dependencia?  
Este es el caso de enlace contextual.
```php
namespace App\Providers;

use App\Http\Controllers\AllenScrewdriverController;
use App\Http\Controllers\TorxScrewdriverController;
use App\Http\Controllers\ScrewdriverController;
use App\Http\Services\ScrewdriverService;
use App\Http\Services\AnotherScrewdriverService;
use App\Http\Services\StarScrewdriverService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider {
  public function register(): void
  {
    $this->app
      ->when(ScrewdriverController::class)
      ->needs(ScrewdriverService::class)
      ->give(function () {
        return new StarScrewdriverService();
      });
    
    $this->app
      ->when([AllenScrewdriverController, TorxScrewdriverController])
      ->needs(ScrewdriverService::class)
      ->give(function () {
        return new AnotherScrewdriverService();
      });
  }
}
```

## Otros enlaces
Otros casos de enlace en el contenedor de servicios son:
* Enlace simple
```php
namespace App\Providers;

use App\Services\AnotherService;
use App\Services\InjectableService;
use Illuminate\Contracts\Foundation\Application;

class AppServiceProvider extends ServiceProvider {
  public function register(): void
  {
    $this->app->bind(InjectableService::class, function (Application $app) {
        return new InjectableService($app->make(AnotherService::class));
    });
  }
}
```

* Enlace de singleton
```php
namespace App\Providers;

use App\Services\AnotherService;
use App\Services\InjectableService;
use Illuminate\Contracts\Foundation\Application;

class AppServiceProvider extends ServiceProvider {
  public function register(): void
  {
    $this->app->singleton(InjectableService::class, function (Application $app) {
        return new InjectableService($app->make(AnotherService::class));
    });
  }
}
```
Si queremos enlazar un singleton si no se ha hecho otro enlace para el tipo en cuestión, usamos el método `singletonIf()`.  
Si queremos que el enlace se resuelva una única vez por cada ciclo de vida de una petición o trabajo, usamos el método `scoped()`.

* Enlace de instancia
```php
namespace App\Providers;

use App\Services\AnotherService;
use App\Services\InjectableService;

class AppServiceProvider extends ServiceProvider {
  public function register(): void
  {
    $service = new InjectableService(new AnotherService); 
    $this->app->instance(InjectableService::class, $service);
  }
}
```
Existen más casos de enlace en el contenedor de servicios. Puedes consultarlos en <a href="https://laravel.com/docs/11.x/container#binding" target="_blank">la documentación oficial</a>.

## Conclusión
El contenedor de servicios de Laravel nos permite gestionar la inyección de dependencias a nivel global en nuestra aplicación, centralizando la declaración de enlaces y la resolución de dependencias.