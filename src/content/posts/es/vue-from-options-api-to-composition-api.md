---
title: "Vue: De Options API a Composition API"
pubDate: 2024-03-19T16:00:00Z
tags: ['vue']
---
Composition API surge como una alternativa a la hora de escribir nuestros componentes en Vue. Difiere de la tradicional Options API de cara a solventar dos limitaciones que pueden llegar a surgir con esta última:

* Código que pertenece a una misma característica está dividido a lo largo de múltiples opciones.
* Reutilizar lógica entre componentes puede ser complicado o engorroso.

Para ello, Composition API agrupa las opciones `data()`, `computed`, `methods` y `watch` en un único método `setup()`.

La opción `data()` se reemplaza por `ref()` al asignar cualquier tipo de valor, pero se recomienda usar `reactive()` para objetos.

**Antes:**
```javascript
<script>
export default {
  data() {
    return {
      username: 'John Doe'
    }
  }
}
</script>
```
**Después:**
```javascript
<script>
import { ref } from 'vue'

export default {
  setup() {
    const username = ref('John Doe')

    return {
      username
    }
  }
}
</script>
```

Si queremos actualizar el valor de la propiedad `username`, podemos hacerlo así.
```javascript
username.value = 'Jane Doe'
```

Alternativamente, Vue nos permite usar la etiqueta `<script setup>` y omitir la llamada al método `setup()` dentro de un objeto `export default`.
```javascript
<script setup>
import { ref } from 'vue'

const username = ref('John Doe')
</script>
```

También podemos tener un objeto reactivo como propiedad. Usaremos el método `reactive()` en lugar de `ref()`.
```javascript
<script>
import { reactive } from 'vue'

export default {
  setup() {
    const user = reactive({
      age: 30,
      name: 'John Doe'
    })

    return {
      user: user
    }
  }
}
</script>
```
```javascript
<script setup>
import { reactive } from 'vue'

const user = reactive({
  age: 30,
  name: 'John Doe'
})
</script>
```

Para actualizar un valor del objeto lo haremos de esta manera.
```javascript
user.age = 30
user.name = 'Jane Doe'
```

También existen los métodos `toRef()` y `toRefs()`.  
`toRef()` se usa para crear una referencia reactiva a una sola propiedad de un objeto reactivo.  
Recibe dos argumentos, el objeto reactivo y el nombre de la propiedad.
```javascript
const age = toRef(user, 'age')

console.log(age.value) // 30
```
`toRefs()` se utiliza para crear referencias reactivas a todas las propiedades de un objeto reactivo.  
Recibe un único argumento, el objeto reactivo.  
Es útil cuando se desea desestructurar un objeto reactivo pero manteniendo la reactividad en las propiedades.
```javascript
const { age, name } = toRefs(user)

console.log(age.value) // 30
```

La opción `computed` se reemplaza por `computed()`.

**Antes:**
```javascript
<script>
export default {
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe'
    }
  },
  computed: {
    username() {
      return `${this.firstName} ${this.lastName}`
    }
  }
}
</script>
```
**Después:**
```javascript
<script setup>
import { computed, ref } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const username = computed(function() {
  return `${firstName.value} ${lastName.value}`
})
</script>
```

La opción `methods` se reemplaza por funciones regulares.

**Before:**
```javascript
<script>
export default {
  data() {
    return {
      age: 30
    }
  },
  methods: {
    grow() {
      this.age += 1
    }
  }
}
</script>
```
**Después:**
```javascript
<script setup>
import { ref } from 'vue'

const age = ref(30)

function grow() {
  age.value += 1
}
</script>
```

Por último, la opción `watch` se reemplaza por `watch()`.

**Before:**
```javascript
<script>
export default {
  data() {
    return {
      age: 30
    }
  },
  watch: {
    age(newValue, oldValue) {
      if (newValue > oldValue) {
        console.log('Got older')
      } else {
        console.log('Got younger')
      }
    }
  }
}
</script>
```
**Después:**
```javascript
<script setup>
import { ref, watch } from 'vue'

const age = ref(30)

watch(age, function(newValue, oldValue) {
  if (newValue > oldValue) {
    console.log('Got older')
  } else {
    console.log('Got younger')
  }
})
</script>
```