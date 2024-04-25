---
title: "Laravel: Service Container"
pubDate: 2024-02-19T20:40:00Z
tags: ['laravel']
---
Laravel Service Container is a toolbox that makes it easier for us to access the different tools in our code. This is achieved through dependency injection and optionally with bindings.
Although Laravel already provides us in most cases with a zero-configuration resolution for dependency injection, there are two cases in which we will have to make use of the service container:
1. When we want to reference an interface in a route or the constructor of a class.
2. If we are writing a Laravel package to share with others, we may need to bind the services in our package.

We will commonly make use of the Service Container through a Service Provider, but we can access it outside of a provider by using the `App` facade.

One of the advantages of the Service Container is that it can give us the specific tool that we need to be able to perform a specific job, keeping the rest of the actors decoupled from the specification of said tool.
Continuing with the metaphor, let's imagine that we need to screw in a star head screw. This requires using a star screwdriver.
This toolbox allows us to define that when we ask for a screwdriver to screw in a star screw, it gives us a star screwdriver without having to specifically ask for it.

This is the case of binding interfaces to implementations.

## Example
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
If we access the endpoint `localhost:8000/example` with the browser, we effectively see that the result displayed is:
```
using a star screwdriver on a screw with a star head
```
The Service Container has resolved the instantiation of the specific class `StarScrewdriverService` although the controller knows only the interface `ScrewdriverService`, remaining decoupled.

Now, what if we need to bind two specific classes to the same interface, depending on the controller that is going to use dependency injection?  
This is the case of contextual binding.
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

## Other bindings
Other cases of binding in the Service Container are:
* Simple binding
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

* Binding a Singleton
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
If we want to bind a singleton if no other binding has been made for the given type, we use the `singletonIf()` method.  
If we want the binding to be resolved only once per life cycle of a request or job, we use the `scoped()` method.

* Binding an Instance
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
There are more cases of binding in the Service Container. You can consult them in <a href="https://laravel.com/docs/11.x/container#binding" target="_blank">the official documentation</a>.

## Conclusion
Laravel Service Container allows us to manage dependency injection globally in our application, centralizing binding declaration and dependency resolution.