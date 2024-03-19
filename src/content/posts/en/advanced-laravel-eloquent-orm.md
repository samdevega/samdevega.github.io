---
title: "Advanced Laravel: Eloquent ORM"
pubDate: 2024-03-07T20:00:00Z
tags: ['laravel']
---
Eloquent, the ORM used by Laravel, has some features that can facilitate access to data under specific conditions.

## Eager Loading
Let's assume a relationship between users and videos, in which we want to obtain the users who have videos on the platform.

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

We can access users who have videos in the following way:
```php
use App\Models\User;

$usersWithVideos = User::with('videos')->get();
```

## Query Scopes
Suppose we want to obtain the videos that have been uploaded to the platform during this month. We can use query scope to define the logic within the model itself:

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
Events provide a simple form of the <a href="https://en.wikipedia.org/wiki/Observer_pattern" target="_blank">Observer</a> pattern. It allows us to subscribe and listen to events that occur in the application.

Eloquent models generate several events that allow us to hook at different moments in the life cycle of a model. Among them are:
* `retreived`: is launched every time an existing model is retrieved from the database.
* `created`: is launched every time a model is created.
* `updated`: is launched every time a model is updated.
* `saved`: is launched every time a model is created or updated.
* `deleted`: is launched every time a model is deleted.

We can consult the complete list of events in the <a href="https://laravel.com/docs/11.x/eloquent#events" target="_blank">official documentation</a>.

A typical event use case is to notify a user when something happens.

1. We create the notification that will be sent.  
The `toArray()` method indicates what data will be saved in the `notifications` table of the database.  
The `toMail()` method indicates the email message to be sent.  
The `via()` method indicates the channels through which the notification will be sent.

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

2. We create the event class. This should expect to receive an instance of the affected model through its constructor and has no further behavior.

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

3. We create the listener class for the event. The `handle()` method indicates what should happen when the event happens.

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

4. We define the `dispatchesEvents` property in the model in question, associating the event that we have created.

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

5. Finally, we register the event and its listener in the `EventServiceProvider` class.

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

With this, every time a new `Order` model is created, a notification will be created in the `notifications` table that can be displayed in the application and the corresponding email will also be sent.

## Conclusion
Laravel makes use of Eloquent ORM to provide us with great power when building applications with advanced features, saving us from having to implement a large amount of logic.
