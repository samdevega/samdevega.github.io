---
title: "Vue: Pinia vs. Vuex"
pubDate: 2024-03-20T16:00:00Z
tags: ['vue']
---
On the one hand, Pinia, the current official state management library for Vue, was developed for Vue 3 and takes advantage of its reactivity system, making it intuitive and simple.  
On the other hand, Vuex, the previous official state management library, was developed for Vue 2 and uses the Flux pattern, proposed by Facebook and popularized by Redux.  
Many projects were build using Vuex, so it is important to know how it works and how it differs from Pinia.

## API & store structure

While Pinia prefers to use separated stores for each kind of data, Vuex uses a single store divided in modules for each kind of data.

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

While each store of Pinia has a state, getters and actions, each module of Vuex have a state, getters, actions and mutations.

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

Let's see a code example of both.

## Creating a store (setup) with Pinia
* `ref()` becomes `state`
* `computed()` becomes `getter`
* `function()` becomes `action`

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

## Accessing a Getter from the store with Pinia
**src/components/TodoList.js**
```javascript
import { storeToRefs } from 'pinia'
import { useTodosStore } from '../stores/todos'

<script setup>
  const { allTodos } = storeToRefs(useTodosStore())
</script>
```

## Accessing an Action from the store with Pinia
**src/components/Todo.js**
```javascript
import { useTodosStore } from '../stores/todos'

<script setup>
  const { doTodo } = useTodosStore()
</script>
```

## Creating a store with Vuex
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

## Accessing a Getter from the store with Vuex
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

## Accessing an Action from the store with Vuex
**src/components/Todo.js**
```javascript
import { useStore } from 'vuex'

<script setup>
function doTodo(todoId) {
  useStore().dispatch('todos/doTodo', todoId)
}
</script>
```

To learn more about them, we can consult the official documentation of <a href="https://pinia.vuejs.org/core-concepts/" target="_blank">Pinia</a> and <a href="https://vuex.vuejs.org/guide/" target="_blank">Vuex</a>.

## Conclusion
Defining and using a store with Pinia is simpler and more intuitive than doing it with Vuex. It also fits better with the reactivity of Vue 3 and the Composition API. Despite that, it is good to know how to work with Vuex because there are a lot of projects that were build with it and we could find ourselves in the situation of maintaining one of those projects.