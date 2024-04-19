---
title: "Vue: Pinia vs. Vuex"
pubDate: 2024-03-20T16:00:00Z
tags: ['vue']
---
Por un lado, Pinia, la actual biblioteca oficial de gestión de estado de Vue, fue desarrollada para Vue 3 y aprovecha su sistema de reactividad, haciéndola intuitiva y sencilla.  
Por otro lado, Vuex, la anterior biblioteca oficial de gestión de estado, fue desarrollada para Vue 2 y utiliza el patrón Flux, propuesto por Facebook y popularizado por Redux.  
Muchos proyectos fueron construidos usando Vuex, por lo que es importante saber cómo funciona y en qué difiere de Pinia.

## API y estructura de store

Mientras que Pinia prefiere utilizar stores separados para cada tipo de dato, Vuex utiliza un único store dividido en módulos para cada tipo de dato.

<div class="flex-container">
  <table>
    <thead>
      <tr>
        <th colspan="2">Pinia</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Store A</td>
        <td>Store B</td>
      </tr>
    </tbody>
  </table>
  <table>
    <thead>
      <tr>
        <th>Vuex</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          Store
          <table>
            <tbody>
              <tr>
                <td>Module A</td>
                <td>Module B</td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</div>

Mientras que cada store de Pinia tiene un estado, accesores y acciones, cada módulo de Vuex tiene un estado, accesores, acciones y mutaciones.

<div class="flex-container">
  <table>
    <thead>
      <tr>
        <th colspan="2">Pinia</th>
      <tr>
    </thead>
    <tbody>
      <tr>
        <td>
          Store A
          <table>
            <tbody>
              <tr>
                <td>State</td>
              </tr>
              <tr>
                <td>Getters</td>
              </tr>
              <tr>
                <td>Actions</td>
              </tr>
            </tbody>
          </table>
        </td>
        <td>
          Store B
          <table>
            <tbody>
              <tr>
                <td>State</td>
              </tr>
              <tr>
                <td>Getters</td>
              </tr>
              <tr>
                <td>Actions</td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
  <table>
    <thead>
      <tr>
        <th>Vuex</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          Store
          <table>
            <tbody>
              <tr>
                <td>
                  Module A
                  <table>
                    <tbody>
                      <tr>
                        <td>State</td>
                      </tr>
                      <tr>
                        <td>Getters</td>
                      </tr>
                      <tr>
                        <td>Actions</td>
                      </tr>
                      <tr>
                        <td>Mutations</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  Module B
                  <table>
                    <tbody>
                      <tr>
                        <td>State</td>
                      </tr>
                      <tr>
                        <td>Getters</td>
                      </tr>
                      <tr>
                        <td>Actions</td>
                      </tr>
                      <tr>
                        <td>Mutations</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</div>

Veamos un ejemplo de código de ambos.

## Creando un store (setup) con Pinia
* `ref()` se vuelve `state`
* `computed()` se vuelve `getter`
* `function()` se vuelve `action`

**src/stores/todos.js**
```javascript
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useTodosStore = defineStore('todos', function() {
  const todos = ref([
    { id: 1, text: 'Learn Vue', done: true },
    { id: 2, text: 'Learn Pinia', done: false },
    { id: 3, text: 'Learn Vuex', done: false }
  ])
  
  const allTodos = computed(function() {
    return todos.value
  })
  
  function doTodo(todoId) {
    todos.value = todos.value.reduce((todos, todo) => {
      if (todo.id === todoId) {
        todo = { ...todo, done: true }
      }
      todos.push(todo)
      return todos
    }, [])
  }

  return { todos, allTodos, doTodo }
})
```

**src/main.js**
```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

createApp(App)
  .use(createPinia())
  .mount('#app')
```

## Accediendo a un Getter desde el store con Pinia
**src/components/TodoList.js**
```javascript
import { storeToRefs } from 'pinia'
import { useTodosStore } from '../stores/todos'

<script setup>
  const { allTodos } = storeToRefs(useTodosStore())
</script>
```

## Accediendo a una Action desde el store con Pinia
**src/components/Todo.js**
```javascript
import { useTodosStore } from '../stores/todos'

<script setup>
  const { doTodo } = useTodosStore()
</script>
```

## Creando un store con Vuex
**src/store/index.js**
```javascript
import { createStore } from 'vuex'

export default createStore({
  modules: {
    todos: {
      namespaced: true,
      state: {
        todos: [
          { id: 1, text: 'Learn Vue', done: true },
          { id: 2, text: 'Learn Pinia', done: false },
          { id: 3, text: 'Learn Vuex', done: false }
        ],
      },
      getters: {
        allTodos(state) {
          return state.todos
        },
      },
      actions: {
        doTodo(context, todoId) {
          context.commit('doTodo', todoId)
        }
      },
      mutations: {
        doTodo(state, todoId) {
          state.todos = state.todos.reduce((todos, todo) => {
            if (todo.id === todoId) {
              todo = { ...todo, done: true }
            }
            todos.push(todo)
            return todos
          }, [])
        }
      },
    }
  }
})
```

**src/main.js**
```javascript
import { createApp } from 'vue'
import { useStore } from './store'
import App from './App.vue'
import store from './store'

createApp(App)
  .use(store)
  .mount('#app')
```

## Accediendo a un Getter desde el store con Vuex
**src/components/TodoList.js**
```javascript
import { computed } from 'vue'
import { useStore } from 'vuex'

<script setup>
const todos = computed(function() {
  return useStore().getters['todos/allTodos']
})
</script>
```

## Accediendo a una Action desde el store con Vuex
**src/components/Todo.js**
```javascript
import { useStore } from 'vuex'

<script setup>
function doTodo(todoId) {
  useStore().dispatch('todos/doTodo', todoId)
}
</script>
```

Para aprender más sobre ellos, podemos consultar la documentación oficial de <a href="https://pinia.vuejs.org/core-concepts/" target="_blank">Pinia</a> y <a href="https://vuex.vuejs.org/guide/" target="_blank">Vuex</a>.

## Conclusión
Definir y utilizar un store con Pinia es más sencillo e intuitivo que hacerlo con Vuex. También encaja mejor con la reactividad de Vue 3 y la Composition API. A pesar de ello, es bueno saber trabajar con Vuex porque hay muchos proyectos que se construyeron con él y podríamos encontrarnos en la situación de mantener uno de esos proyectos.