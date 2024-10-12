---
title: "Aplicación multi-idioma con Laravel y React usando Inertia"
pubDate: 2024-10-12T12:15:00Z
tags: ['laravel', 'react']
---
Inertia es llamado el monolito moderno por sus creadores. Nos permite crear single-page applications sin mucha de la complejidad que este tipo de aplicaciones suelen implicar. Reemplaza una librería de enrutamiento, como React Router, y nos permite deshacernos de cualquier librería de gestión de estados como Redux, XState o Zustand.

Su adaptador oficial de lado servidor funciona con Laravel, pero hay varios adaptadores comunitarios para otros frameworks como Django, Go, Rails o Symfony.

También es compatible con los frameworks de lado cliente React, Svelte y Vue, por lo que es una gran opción para crear una aplicación web.

En este post, nos vamos a centrar en la combinación de Laravel y React usando Inertia.

## Instalación
Creamos un nuevo proyecto de Laravel mediante Composer.
```shell
composer create-project laravel/laravel multilanguage-app
```

Nos movemos al nuevo directorio del proyecto e instalamos Laravel Breeze, que es una implementación de todas las características de autenticación de Laravel y nos ofrece la posibilidad de tener React usando Inertia.
```shell
composer require laravel/breeze
```

Utilizamos su instalador CLI interactivo.
```shell
php artisan breeze:install
```

Seleccionamos las siguientes opciones.
```
Which Breeze stack would you like to install?
- React with Inertia

Would you like any optional features?
- Dark mode
- TypeScript
- ESLint with Prettier

Which testing framework do you prefer?
- Pest
```

Después de eso, tenemos un nuevo proyecto construido con Laravel y React usando Inertia, incluyendo un módulo de autenticación con páginas para registro, inicio de sesión, cierre de sesión y perfil de usuario.

## Textos estáticos
### Configuración de archivos de traducción
Ahora, profundicemos en la función multi-idioma. De manera predeterminada, la última versión de Laravel no publica archivos de traducción, por lo que primero debemos ejecutar el siguiente comando.
```shell
php artisan lang:publish
```

Genera el directorio `lang` en la raíz de nuestra aplicación. También genera un directorio `en` con algunos archivos PHP dentro, cada uno de ellos representando diferentes líneas de idioma para autenticación, paginación, etc.

El contenido de estos archivos son simplemente matrices asociativas, algunas de ellas con múltiples niveles. Por ejemplo:

**lang/en/validation.php**
```php
return [
  ...
  'password' => [
    'letters' => 'The :attribute field must contain at least one letter.',
    ...
  ],
  ...
];
```

Esta es la estructura tradicional de los archivos de traducción en Laravel. Cuando utilizamos Blade, el motor de plantillas incluido en Laravel, podemos imprimir un valor traducido simplemente haciendo referencia al archivo y a la clave o claves anidadas que apuntan a él.
```php
<p>
  {{ __('validation.password.letters', ['attribute' => 'password']) }}
</p>
```

Imprime
```html
<p>
  The password field must contain at least one letter.
</p>
```

Esta es una buena opción para tener diferentes valores para la misma clave en múltiples módulos y es útil cuando trabajamos con Blade, pero como queremos trabajar con React, convertir los archivos de traducción generados de PHP a JSON es la mejor opción.

Debemos ser conscientes de lo que esto significa. Las diferencias clave entre usar archivos PHP o JSON para traducciones en Laravel son:

* La estructura de ruta de archivo PHP es `lang/[idioma]/[módulo].php` (p. ej. `lang/en/validation.php`) mientras que la estructura de ruta de archivo JSON es `lang/[idioma].json` (p. ej. `lang/en.json`). No hay ningún archivo de módulo para el segundo.
* Laravel podrá obtener un valor de matrices de múltiples niveles en archivos PHP, pero no funcionará para archivos JSON. Los archivos JSON deben ser objetos de un solo nivel.

Entonces, ¿cómo podemos pasar de archivos PHP a archivos JSON sin tener que cambiar todos los textos de traducción a los que ya se hace referencia en nuestras vistas? Podemos hacerlo con este pequeño truco.

**lang/en/validation.php** (antes)
```php
return [
  ...
  'password' => [
    'letters' => 'The :attribute field must contain at least one letter.',
    ...
  ],
  ...
];
```

**lang/en.json** (después)
```json
{
  ...
  "validation.password.letters": "The :attribute field must contain at least one letter.",
  ...
}
```

La configuración del idioma predeterminado de nuestra aplicación está en el archivo `.env`.
```shell
APP_LOCALE=en
APP_FALLBACK_LOCALE=en
```

### Compartir datos de idioma con React
Tenemos que definir las propiedades que se van a compartir por defecto con React.  
Para ello, añadimos las siguientes líneas al middleware de Inertia.

**app/Http/Middleware/HandleInertiaRequests.php**
```php
...
public function share(Request $request): array
{
  return [
    ...
    'currentLanguage' => function ()
    {
      return app()->getLocale();
    },
    'languages' => function ()
    {
      return array_values(
        array_map(
          fn($langFile) => str_replace('.json', '', $langFile),
          array_diff(scandir(lang_path()), array('..', '.'))
        )
      );
    },
    'translations' => function ()
    {
      if (!file_exists(lang_path(app()->getLocale() . '.json'))) {
        return [];
      }

      return json_decode(file_get_contents(lang_path(app()->getLocale() . '.json')), true);
    },
  ];
}
```

El método `currentLanguage` devuelve el idioma actual que está configurado en la aplicación.  
El método `languages` devuelve una lista con todos los idiomas disponibles en la aplicación.  
El método `translations` devuelve las traducciones para el idioma actual.

### Cambiar el idioma
Crear un middleware para configurar el idioma actual.

**app/Http/Middleware/SetLanguage.php**
```php
namespace App\Http\Middleware;

use Inertia\Middleware;
use Closure;

class SetLanguage extends Middleware
{
  public function handle($request, Closure $next)
  {
    
    if (session()->has('language')) {
      app()->setLocale(session('language'));
    } else {
      app()->setLocale(config('app.locale'));
    }

    return $next($request);
  }
}
```

Registramos el middleware.

**bootstrap/app.php**
```php
return Application::configure(basePath: dirname(__DIR__))
  ...
  ->withMiddleware(function (Middleware $middleware) {
    $middleware->web(append: [
      ...
      \App\Http\Middleware\SetLanguage::class,
      ...
    ]);
  })
  ...
  ->create();
```

Creamos la ruta para cambiar el idioma.

**routes/web.php**
```php
...
Route::get('/language/{language}', function ($language) {
  Session()->put('language', $language);

  return redirect()->back();
})->name('language');
```

Creamos un hook de React para interactuar con los métodos de ayuda de idioma compartidos por el middleware de Inertia. Agregamos un método `t` con la misma firma que el popular conjunto de paquetes `i18next` y `react-i18next` para que sea fácil de usar por quienes han trabajado con ellos.

**resources/js/hooks/useLanguage.ts**
```javascript
import { type PageProps } from '@/types'
import { usePage } from '@inertiajs/react'

interface UseLanguage {
  currentLanguage: string
  languages: string[]
  t: (key: string, replace?: Record<string, string>) => string
}

const useLanguage = (): UseLanguage => {
  const { currentLanguage, languages, translations } = usePage<PageProps>().props

  const t = (key: string, replace?: Record<string, string>): string => {
    let translation = translations[key] ?? key

    if (replace !== undefined) {
      Object.keys(replace).forEach((key) => {
        translation = translation.replace(`:${key}`, replace[key])
      })
    }

    return translation
  }

  return {
    currentLanguage,
    languages,
    t
  }
}

export default useLanguage
```

Creamos un componente de React para cambiar el idioma.

**resources/js/Components/LanguageSelector.tsx**
```javascript
import { Link } from '@inertiajs/react'
import useLanguage from '@/hooks/useLanguage'

const LanguageSelector = (): JSX.Element => {
  const { currentLanguage, languages } = useLanguage()

  return (
    <div>
      <ul>
        {languages.map((language) => (
          <li key={language}>
            <Link
              href={route('language', [language])}
              className={currentLanguage === language && 'active'}
            >
              {language}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LanguageSelector
```

### Imprimir textos traducidos
Ahora podemos imprimir textos desde archivos de traducción en nuestros componentes React.

**resources/js/Components/TranslationExample.tsx**
```javascript
import useLanguage from '@/hooks/useLanguage'

const TranslationExample = (): JSX.Element => {
  const { t } = useLanguage()

  return (
    <p>
      {t('validation.password.letters', { attribute: 'password' })}
    </p>
  )
}

export default TranslationExample
```

Imprime
```html
<p>
  The password field must contain at least one letter.
</p>
```

## Textos dinámicos
Para trabajar con textos dinámicos, aquellos que necesitan ser modificados por un usuario, vamos a utilizar el popular proveedor de Laravel `spatie/laravel-translatable`.

Para instalarlo, simplemente ejecutamos el siguiente comando.
```shell
composer require spatie/laravel-translatable
```

### Hacer traducibles las propiedades del modelo
Necesitamos especificar las propiedades de nuestros modelos de Doctrine que serán traducibles.

**app/Models/Page.php**
```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Page extends Model
{
  use HasTranslations;

  protected $hidden = ['created_at', 'updated_at'];
  public $translatable = ['title'];
}
```

### Obtener todas las traducciones de las propiedades del modelo

El controlador de Laravel para editar.

**app/Http/Controllers/Admin/PageController.php**
```php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
  ...
  public function edit(Page $page): Response
  {
    if (!$page->exists()) {
      abort(404);
    }

    return Inertia::render('Admin/Page/Edit', [
      'title' => $page->getTranslations('title')
    ]);
  }
}
```

La ruta de Laravel para editar.

**routes/web.php**
```php
Route::middleware('auth')->prefix('admin')->group(function () {
  ...
  Route::get('/page/{page:slug}', [AdminPageController::class, 'edit'])->name('page.edit');
});
```

El componente de página React para editar.

**resources/js/Pages/Admin/Page/Edit.tsx**
```javascript
import { type FormEventHandler } from 'react'
import { useForm } from '@inertiajs/react'
import { type PageProps } from '@/types'
import useLanguage from '@/hooks/useLanguage'
import TranslatableTextInput from '@/Components/TranslatableTextInput'
import Button from '@/Components/Button'

type Translatable = Record<string, string>

const PageEdit = ({ title }: PageProps<{ title: Translatable }>): JSX.Element => {
  const { t } = useLanguage()
  const { data, setData, patch, errors, processing } = useForm({ title })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()

    patch(route('page.update'))
  }

  return (
    <main>
      <h1>Edit Page</h1>
      <form onSubmit={submit}>
        <label>Title</label>
        <TranslatableTextInput
          field='title'
          data={data.title}
          errors={errors}
          onChange={(value) => {
            setData('title', value)
          }}
        />
        <Button disabled={processing}>Save</Button>
      </form>
    </main>
  )
}

export default PageEdit
```

El componente de entrada de texto traducible de React.

**resources/js/Components/TranslatableTextInput.tsx**
```javascript
import { useState } from 'react'
import useLanguage from '@/hooks/useLanguage'
import TextInput from './TextInput'
import InputError from './InputError'

interface TranslatableTextInputProps {
  field: string
  data: Record<string, string>
  errors: Partial<Record<string, string>>
  onChange: (value: Record<string, string>) => void
}

const TranslatableTextInput = (props: TranslatableTextInputProps): JSX.Element => {
  const { field, data, errors, onChange } = props
  const { currentLanguage, languages } = useLanguage()
  const [selectedTab, setSelectedTab] = useState(currentLanguage)
  const languageTabs = languages.map((language) => (
    <li key={language}>
      <button
        type='button'
        className={selectedTab === language && 'active'}
        onClick={() => {
          setSelectedTab(language)
        }}
      >
        {language}
      </button>
    </li>
  ))

  const handleOnChange =
    (language: string) =>
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const updatedData = { ...data, [language]: event.target.value }
      onChange(updatedData)
    }

  return (
    <div>
      <ul>{languageTabs}</ul>
      {languages.map((language) => (
        <TextInput
          key={language}
          className={selectedTab !== language && 'hidden'}
          onChange={handleOnChange(language)}
          value={data[language]}
        />
      ))}
      {languages.map((language) => (
        <InputError key={language} message={errors[`${field}.${language}`]} />
      ))}
    </div>
  )
}

export default TranslatableTextInput
```

### Actualizar traducciones a las propiedades del modelo

La solicitud de Laravel para actualizar.

**app/Http/Requests/Admin/PageUpdateRequest.php**
```php
namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class PageUpdateRequest extends FormRequest
{
  public function rules(): array
  {
    return [
      'title.*' => ['required', 'string', 'max:255']
    ];
  }
}
```

El controlador de Laravel para actualizar.

**app/Http/Controllers/Admin/PageController.php**
```php
...
use App\Http\Requests\Admin\PageUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;

class PageController extends Controller
{
  ...
  public function update(PageUpdateRequest $request): RedirectResponse
  {
    $page = Page::where('slug', $request->slug)->first();
    $page->setTranslations('title', $request->title);
    $page->save();

    return Redirect::route('page.index');
  }
}
```

La ruta de Laravel para actualizar.

**routes/web.php**
```php
Route::middleware('auth')->prefix('admin')->group(function () {
  ...
  Route::patch('/page', [AdminPageController::class, 'update'])->name('page.update');
});
```

### Imprimir propiedades traducidas

El controlador de Laravel para imprimir.

**app/Http/Controllers/PageController.php**
```php
namespace App\Http\Controllers;

use App\Models\Page;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
  public function show(Page $page): Response
  {
    if (!$page->exists()) {
      abort(404);
    }

    return Inertia::render('Page', [
      'title' => $page->title
    ]);
  }
}
```

La ruta de Laravel para imprimir.

**routes/web.php**
```php
...
Route::get('/page/{page:slug}', [PageController::class, 'show'])->name('page.show');
```

El componente de página React para imprimir.

**resources/js/Pages/Page.tsx**
```javascript
interface PageProps {
  title: string
}

const Page = ({ title }: PageProps): JSX.Element => {
  return (
    <main>
      <h1>{title}</h1>
    </main>
  )
}

export default Page
```

## Conclusión
Podemos llegar a la conclusión de que esta solución tiene algunos puntos positivos.

1. Cuando llegue el momento en que necesitemos añadir un nuevo idioma a la aplicación, simplemente tendremos que crear su archivo JSON en el directorio `lang`. Una vez creado, el idioma estará disponible sin necesidad de tocar ninguna otra parte del código.

2. Otros desarrolladores pueden pasar directamente a imprimir traducciones de texto estático debido a las similitudes de la firma del hook con la de los paquetes React ampliamente conocidos. Y como no estamos usando esos paquetes, nuestra aplicación front es más pequeña.

3. Imprimir traducciones de texto dinámico es aún más fácil gracias al proveedor de traducciones de Laravel. Solo tenemos que devolver una propiedad del modelo a la aplicación front y ya está traducida.

4. Inertia nos permite construir una SPA de React sin tener que lidiar con algunas bibliotecas como React Router o Redux, reduciendo así su complejidad.

Para saber más sobre Inertia, podemos visitar su <a href="https://inertiajs.com/" target="_blank">sitio web oficial</a>.