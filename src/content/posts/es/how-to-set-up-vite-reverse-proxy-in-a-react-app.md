---
title: "Cómo configurar el proxy inverso de Vite en una aplicación React"
pubDate: 2025-02-01T12:15:00Z
tags: ['react', 'vite']
---
La configuración del proxy inverso de <a href="https://es.vite.dev" target="_blank">Vite</a> nos permite redireccionar las peticiones que coincidan con un patrón y dirigirlas hacia un servidor determinado. Esto es especialmente útil durante la etapa de desarrollo, dado que permite comunicar nuestra aplicación frontend con una API específica, como por ejemplo, un servidor mock utilizando <a href="https://mswjs.io/docs" target="_blank">Mock Service Worker</a> o una instancia local del proyecto backend.

A continuación vamos a ver un ejemplo de cómo realizar esta configuración.

Primero, definimos una variable de entorno que indica la dirección de la API con la que nos queremos comunicar.

**.env**
```shell
VITE_API_URL=http://localhost:3001
```

Luego configuramos el proxy inverso, utilizando la variable de entorno que acabamos de definir en una regla para redirigir todas las peticiones que comiencen por `/api` hacia la URL definida en la variable.

**vite.config.ts**
```typescript
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    ...
    server: {
      cors: false,
      open: '/',
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
```

Para mayor comodidad, podemos crear un cliente donde encapsular los usos de `fetch` para las peticiones que van a apuntar hacia la API.

**apiClient.ts**
```typescript
class APIClient {
  constructor(private baseURL: string) {}

  public async get(url: string) {
    return this.request(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  public async post(url: string, data: object) {
    return this.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  }

  private async request(url: string, options: object) {
    const response: Response = await fetch(`${this.baseURL}${url}`, options)

    if (!response.ok) {
      const error = new Error(`HTTP Error: ${response.status} ${response.statusText}\n${response.body}`)
      throw error
    }
    return response.json()
  }
}

export const apiClient = new APIClient('/api')
```

Como resultado, una petición hecha mediante este cliente hacia, por ejemplo, el endpoint `/login`, redirigirá la petición a la URL `http://localhost:3001/login`.

**HttpUserRepository**
```typescript
import { apiClient } from './apiClient'
import { LoginData, UserRepository, UserResponse } from './irrelevant'

class HttpUserRepository implements UserRepository {
  async login(data: LoginData) {
    return apiClient.post('/login', data)
  }
}
```

En el momento en que queramos que estas peticiones apunten hacia otra URL, únicamente deberemos actualizar el valor definido por la variable de entorno.

Para más información sobre el proxy inverso de Vite, podemos consultar la <a href="https://es.vite.dev/config/server-options.html#server-proxy" target="_blank">documentación oficial</a>.