---
title: "Laravel: Queues y Jobs"
pubDate: 2024-02-29T19:30:00Z
tags: ['laravel']
---
En Laravel podemos delegar la ejecución de tareas pesadas en tiempo o recursos a un segundo plano, evitando que una petición web se demore mucho tiempo. Para ello podemos valernos de los trabajos en cola (queued jobs).

## Queues
Las colas (queues) en Laravel proveen una API unificada para distintos sistemas de colas como AMAZON SQS, Redis o una base de datos relacional. La configuración se almacena en el archivo `config/queue.php`.

En caso de querer usar una base de datos, podemos ejecutar la siguiente migración para crear la tabla necesaria:
```bash
php artisan queue:table
php artisan migrate
```
Además, necesitamos especificar que vamos a usar la base de datos en la variable de entorno:
```bash
QUEUE_CONNECTION=database
```

## Jobs
Un trabajo (job) es una tarea que queremos realizar, en este caso en segundo plano. Para crear un trabajo como `ProcessDeliveryNotes` en el directorio `app/Jobs` podemos valernos del siguiente comando:
```bash
php artisan make:job ProcessDeliveryNotes
```

La clase generada implementa la interfaz `ShouldQueue`, que le permite ser movida a una cola para ejecutarse de forma asíncrona.  
Podemos inyectar las dependencias necesarias para la tarea en el constructor de la clase y definir la propia tarea a realizar en el método `handle()`.

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

Para lanzar el trabajo usamos del método estático `dispatch()`, pasándole por parámetro la lista de albaranes que hemos definido en el constructor:
```php
use App\Jobs\ProcessDeliveryNotes;

...

ProcessDeliveryNotes::dispatch($deliveryNotes);
```

Para más información sobre los queued jobs podemos consultar la <a href="https://laravel.com/docs/11.x/queues" target="_blank">documentación oficial</a>.