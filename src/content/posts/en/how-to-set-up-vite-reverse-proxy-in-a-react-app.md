---
title: "How to set up Vite reverse proxy in a React app"
pubDate: 2025-02-01T12:15:00Z
tags: ['react', 'vite']
image:
  url: "/images/vite.jpg"
  alt: "Vite documentation website"
---
Configuring the <a href="https://vite.dev" target="_blank">Vite</a> reverse proxy allows us to redirect requests that match a pattern and direct them to a specific server. This is especially useful during the development stage, since it allows our frontend application to communicate with a specific API, such as a mock server using <a href="https://mswjs.io/docs" target="_blank">Mock Service Worker</a> or a local instance of the backend project.

Below we will see an example of how to configure this.

First, we define an environment variable that indicates the address of the API we want to communicate with.

**.env**
```shell
VITE_API_URL=http://localhost:3001
```

We then configure the reverse proxy, using the environment variable we just defined in a rule to redirect all requests starting with `/api` to the URL defined in the variable.

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

For convenience, we can create a client to encapsulate the uses of `fetch` for requests that will point to the API.

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

As a result, a request made through this client to, for example, the `/login` endpoint, will redirect the request to the URL `http://localhost:3001/login`.

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

When we want these requests to point to another URL, we only need to update the value defined by the environment variable.

For more information about Vite's reverse proxy, we can consult the <a href="https://vite.dev/config/server-options.html#server-proxy" target="_blank">official documentation</a>.