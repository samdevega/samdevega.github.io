---
title: "Advanced Laravel: Queues and Jobs"
pubDate: 2024-02-29T19:30:00Z
tags: ['laravel']
---
In Laravel we can delegate the execution of heavy tasks in time or resources to the background, preventing a web request from taking a long time. To do this we can use queued jobs.

## Queues
Queues in Laravel provide a unified API for different queuing systems such as AMAZON SQS, Redis or a relational database. The configuration is stored in the `config/queue.php` file.

If we want to use a database, we can run the following migration to create the necessary table:
```bash
php artisan queue:table
php artisan migrate
```
Additionally, we need to specify that we are going to use the database in the environment variable:
```bash
QUEUE_CONNECTION=database
```

## Jobs
A job is a task that we want to perform, in this case in the background. To create a job like `ProcessDeliveryNotes` in the `app/Jobs` directory we can use the following command:
```bash
php artisan make:job ProcessDeliveryNotes
```

The generated class implements the `ShouldQueue` interface, which allows it to be moved to a queue to execute asynchronously.
We can inject the necessary dependencies for the task in the class constructor and define the task to be performed in the `handle()` method.

**ProcessDeliveryNotes**
```php
class ProcessDeliveryNotes implements ShouldQueue
{
  use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

  public function __construct(public array $deliveryNotes)
  {}

  public function handle(): void
  {
    // Process the delivery notes
  }
}
```

To launch the job we use the static `dispatch()` method, passing as a parameter the list of delivery notes that we have defined in the constructor:
```php
use App\Jobs\ProcessDeliveryNotes;

...

ProcessDeliveryNotes::dispatch($deliveryNotes);
```

For more information about queued jobs we can consult the <a href="https://laravel.com/docs/11.x/queues" target="_blank">official documentation</a>.