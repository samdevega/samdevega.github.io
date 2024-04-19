---
title: "Vue: From Options API to Composition API"
pubDate: 2024-03-19T16:00:00Z
tags: ['vue']
---
Composition API arises as an alternative when writing our components in Vue. It differs from the traditional Options API in order to solve two limitations that may arise with the latter:

* Code that belongs to the same feature is divided across multiple options.
* Reusing logic between components can be complicated or cumbersome.

To do this, the Composition API groups the `data()`, `computed`, `methods` and `watch` options into a single `setup()` method.

The `data()` option is replaced by `ref()` when assigning any type of value but it is recommended to use `reactive()` for objects.

**Before:**
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
**After:**
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

If we want to update the value of the `username` property, we can do it like this.
```javascript
username.value = 'Jane Doe'
```

Alternatively, Vue allows us to use the `<script setup>` tag and skip calling the `setup()` method inside an `export default` object.
```javascript
<script setup>
import { ref } from 'vue'

const username = ref('John Doe')
</script>
```

We can have a reactive object as a property too. We will use the `reactive()` method instead of `ref()`.
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

To update a value of the object we will do it this way.
```javascript
user.age = 30
user.name = 'Jane Doe'
```

There are also the `toRef()` and `toRefs()` methods.  
`toRef()` is used to create a reactive reference to a single property of a reactive object.  
It takes two arguments, the reactive object and the property name.
```javascript
const age = toRef(user, 'age')

console.log(age.value) // 30
```
`toRefs()` is used to create reactive references to all properties of a reactive object.  
It takes a single argument, the reactive object.  
It is useful when you want to destructure a reactive object but maintaining reactivity on the properties.
```javascript
const { age, name } = toRefs(user)

console.log(age.value) // 30
```

The `computed` option is replaced by `computed()`.

**Before:**
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
**After:**
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

The `methods` option is replaced by regular functions.

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
**After:**
```javascript
<script setup>
import { ref } from 'vue'

const age = ref(30)

function grow() {
  age.value += 1
}
</script>
```

Lastly, the `watch` option is replaced by `watch()`.

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
**After:**
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