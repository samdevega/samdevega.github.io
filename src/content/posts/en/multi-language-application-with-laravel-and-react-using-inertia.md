---
title: "Multi-language application with Laravel and React using Inertia"
pubDate: 2024-10-12T12:15:00Z
tags: ['laravel', 'react']
---
Inertia is called the modern monolith by its creators. It allows us to create single-page applications without a lot of the complexity that these kind of apps use to involve. It replaces a routing library, such as React Router, and lets us get rid of any state management library such as Redux, XState or Zustand.

Its official server-side adapter works with Laravel, but there are several community adapters for other frameworks like Django, Go, Rails or Symfony.

It also supports React, Svelte and Vue client-side frameworks, so it is a great option for building a web application.

In this post, we are going to focus on the Laravel and React combo using Inertia.

## Installation
Create a new Laravel project via Composer.
```shell
composer create-project laravel/laravel multilanguage-app
```

Move to the new project directory and install Laravel Breeze, which is an implementation of all Laravel's authentication features and offers us the possibility to have React using Inertia.
```shell
composer require laravel/breeze
```

Use its interactive CLI installer.
```shell
php artisan breeze:install
```

Select the next options.
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

After that, we have a new project build with Laravel and React using Inertia, including an authentication module with pages for registration, login, logout and user profile.

## Static texts
### Translation files setup
Now lets get deep into the multi-language feature. By default, the latest version of Laravel does not publish translation files, so first we need to run the next command.
```shell
php artisan lang:publish
```

It generates the `lang` directory in the root of our application. It also generates an `en` directory with some PHP files inside of it, each of them representing different language lines for authentication, pagination, etc.

The content of these files are just associative arrays, some of them with multiple levels. E.g.

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

This is the traditional structure for translation files in Laravel. When we use Blade, the template engine included in Laravel, we can print a translated value just by referencing the file and the key or nested keys that point to it.
```php
<p>
  {{ __('validation.password.letters', ['attribute' => 'password']) }}
</p>
```

Prints
```html
<p>
  The password field must contain at least one letter.
</p>
```

This is a good option for having different values for the same key in multiple modules and it is handy when we are working with Blade, but since we want to work with React, converting the generated translation files from PHP to JSON is the best option.

We have to be conscious about what this means. The key differences between using PHP or JSON files for translations in Laravel are:

* PHP file path structure is `lang/[language]/[module].php` (E.g. `lang/en/validation.php`) while JSON file path structure is `lang/[language].json` (E.g. `lang/en.json`). There is no module file for the second one.
* Laravel will be able to get a value from multi-level arrays in PHP files, but it will not work for JSON files. JSON files must be single-level objects.

So, how can we move from PHP files to JSON files without having to change all the already referenced translation texts in our views? We can do it with this little trick.

**lang/en/validation.php** (before)
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

**lang/en.json** (after)
```json
{
  ...
  "validation.password.letters": "The :attribute field must contain at least one letter.",
  ...
}
```

The configuration for the default language of our application is in the `.env` file.
```shell
APP_LOCALE=en
APP_FALLBACK_LOCALE=en
```

### Sharing language data with React
We have to define the props that are going to be shared by default with React.  
In order to do it, we add the next lines to the Inertia middleware.

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

The `currentLanguage` method returns the current language that is set in the application.  
The `languages` method returns a list with all the available languages in the application.  
The `translations` method returns the translations for the current language.

### Changing the language
Create a middleware to set the current language.

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

Register the middleware.

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

Create the route for changing the language.

**routes/web.php**
```php
...
Route::get('/language/{language}', function ($language) {
  Session()->put('language', $language);

  return redirect()->back();
})->name('language');
```

Create a React hook for interacting with the language helpers shared by the Inertia middleware. We add a `t` method with the same signature than the popular `i18next` and `react-i18next` combo packages so it will be easy to use for those who have worked with them.

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

Create a React component for changing the language.

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

### Printing translated texts
Now we are able to print texts from translation files in our React components.

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

Prints
```html
<p>
  The password field must contain at least one letter.
</p>
```

## Dynamic texts
In order to deal with dynamic texts, those that need to be changeable by a user, we are going to use the popular Laravel vendor `spatie/laravel-translatable`.

To install it, just run the next command.
```shell
composer require spatie/laravel-translatable
```

### Making model properties translatable
We need to specify the properties of our Doctrine models that are going to be translatable.

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

### Getting all translations from model properties

The Laravel controller for editing.

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

The Laravel route for editing.

**routes/web.php**
```php
Route::middleware('auth')->prefix('admin')->group(function () {
  ...
  Route::get('/page/{page:slug}', [AdminPageController::class, 'edit'])->name('page.edit');
});
```

The React page component for editing.

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

The React translatable text input component.

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

### Updating translations to model properties

The Laravel request for updating.

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

The Laravel controller for updating.

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

The Laravel route for updating.

**routes/web.php**
```php
Route::middleware('auth')->prefix('admin')->group(function () {
  ...
  Route::patch('/page', [AdminPageController::class, 'update'])->name('page.update');
});
```

### Printing translated properties

The Laravel controller for printing.

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

The Laravel route for printing.

**routes/web.php**
```php
...
Route::get('/page/{page:slug}', [PageController::class, 'show'])->name('page.show');
```

The React page component for printing.

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

## Conclusion
We can come to the conclusion that this solution has some positive points.

1. When the time comes that we need to add a new language to the application, we simply need to create its JSON file in the `lang` directory. Once created, the language is available without needing to touch any other part of the code.

2. Other developers can go straight forward for printing static text translations due to the similarities of the hook signature with the one from the widely known React packages. And since we are not using those packages, our front application is smaller.

3. Printing dynamic text translations is even easier thanks to the Laravel translatable vendor. We just need to return a model property to the front application and it is already translated.

4. Inertia allows us to build a React SPA without having to deal with some libraries such as React Router or Redux, thus reducing its complexity.

To learn more about Inertia, we can visit its <a href="https://inertiajs.com/" target="_blank">official website</a>.