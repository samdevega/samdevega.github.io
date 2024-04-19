---
title: "Laravel Avanzado: Eloquent ORM"
pubDate: 2024-03-07T20:00:00Z
tags: ['laravel']
---
Eloquent, el ORM usado por Laravel, dispone de algunas características que pueden facilitarnos el acceso a los datos bajo condiciones concretas.

## Eager Loading
Supongamos una relación entre usuarios y vídeos, en la que queremos obtener los usuarios que poseen vídeos en la plataforma.

**User.php**
```php
namespace App\Models;

use App\Models\Video;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Model
{
  public function videos(): HasMany
  {
    return $this->hasMany(Video::class);
  }
}
```

**Video.php**
```php
namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Video extends Model
{
  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }
}
```

Podemos acceder a los usuarios que tienen vídeos de la siguiente manera:
```php
use App\Models\User;

$usersWithVideos = User::with('videos')->get();
```

## Query Scopes
Supongamos que queremos obtener los vídeos que han sido subidos a la plataforma durante el presente mes. Podemos hacer uso de query scope para definir la lógica dentro del propio modelo:

**Video.php**
```php
namespace App\Models;
 
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
  ...

  public scopeCurrentMonth(Builder $query): void
  {
    $query
      ->where('created_at', '>=', now()->firstOfMonth())
      ->where('created_at', '<', now()->lastOfMonth());
  }
}
```
```php
use App\Models\Video;

$newestVideos = Video::query()->currentMonth()->get();
```

## Events
Los eventos proveen una forma simple del patrón <a href="https://es.wikipedia.org/wiki/Observer_(patr%C3%B3n_de_dise%C3%B1o)" target="_blank">Observer</a>. Nos permite suscribir y escuchar a eventos que ocurren en la aplicación.

Los modelos de Eloquent generan varios eventos que nos permiten enganchar en los distintos momentos del ciclo de vida de un modelo. Entre ellos están:
* `retreived`: se lanza cada vez que un modelo existente es recuperado de la base de datos.
* `created`: se lanza cada vez que un modelo es creado.
* `updated`: se lanza cada vez que un modelo es actualizado.
* `saved`: se lanza cada vez que un modelo es creado o actualizado.
* `deleted`: se lanza cada vez que un modelo es borrado.

Podemos consultar la lista completa de eventos en la <a href="https://laravel.com/docs/11.x/eloquent#events" target="_blank">documentación oficial</a>.

Un caso de uso típico de evento es notificar a un usuario cuando algo sucede.

1. Creamos la notificación que será enviada.  
El método `toArray()` indica qué datos se guardarán en la tabla `notifications` de la base de datos.  
El método `toMail()` indica el mensaje de email que se enviará.  
El método `via()` indica los canales por los que se enviará la notificación.

**app/Notifications/OrderCreatedNotification.php**
```php
namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class OrderCreatedNotification extends Notification implements ShouldQueue
{
  use Queueable;

  public function __construct(public Order $order)
  {}

  public function toArray(object $notifiable): array
  {
    return [
      'order_id' => $this->order->id,
    ];
  }

  public function toMail(object $notifiable): MailMessage
  {
    $url = url('/orders/' . $this->order->id);

    return (new MailMessage)
      ->greeting('New Order Created')
      ->line('There is a new order to be processed.')
      ->line('The client will be notified once the order is processed and the products are sent.')
      ->action('View order', $url);
  }

  public function via()
  {
    return ['database', 'mail'];
  }
}
```

2. Creamos la clase del evento. Esta debería esperar recibir una instancia del modelo afectado a través de su constructor y no tiene mayor comportamiento.

**app/Events/OrderCreated.php**
```php
namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderCreated
{
  use Dispatchable, InteractsWithSockets, SerializesModels;

  public function __construct(public Order $order)
  {}
}
```

3. Creamos la clase listener para el evento. El método `handle()` indica qué debe pasar cuando sucede el evento.

**app/Listeners/SendOrderCreatedNotification.php**
```php
namespace App\Listeners;

use App\Events\OrderCreated;
use App\Notifications\OrderCreatedNotification;

class SendOrderCreatedNotification
{
  public function __construct()
  {}

  public function handle(OrderCreated $event): void
  {
    $event->order->seller->notify(new OrderCreatedNotification($event->order));
  }
}
```

4. Definimos la propiedad `dispatchesEvents` en el modelo en cuestión, asociando el evento que hemos creado.

**app/Models/Order.php**
```php
namespace App\Models;

use App\Events\OrderCreated;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
  public function buyer(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  public function seller(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  protected $dispatchesEvents = [
    'created' => OrderCreated::class,
  ];
}
```

5. Por último, registramos el evento y su listener en la clase `EventServiceProvider`.

**app/Providers/EventServiceProvider.php**
```php
namespace App\Providers;

use App\Events\OrderCreated;
use App\Listeners\SendOrderCreatedNotification;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
  protected $listen = [
    OrderCreated::class => [
        SendOrderCreatedNotification::class,
    ],
  ];
}
```

Con esto, cada vez que se cree un nuevo modelo de `Order`, se creará una notificación en la tabla `notifications` que podrá ser mostrada en la aplicación y además se enviará el email correspondiente.

## Conclusión
Laravel hace uso de Eloquent ORM para facilitarnos una gran potencia a la hora de construir aplicaciones de características avanzadas, ahorrándonos el tener que implementar una gran cantidad de lógica.
