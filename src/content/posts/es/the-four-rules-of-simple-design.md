---
title: 'Las cuatro reglas del diseño simple'
pubDate: 2025-08-11T16:30:00Z
tags: ['software-design']
---
La simplicidad en el diseño de software resulta en un código más limpio, un mantenimiento más sencillo y aplicaciones más intuitivas.

Las cuatro reglas del diseño simple, propuestas por Kent Beck, creador de la metodología de _Extreme Programming_ (XP), están diseñadas para ayudar a los desarrolladores a centrarse en lo más importante y evitar la complejidad innecesaria en su código. Esto es, diseñar el software manteniendo el foco en el principio _Keep It Simple, Stupid!_ (KISS). Estas cuatro reglas, en orden de prioridad, son las siguientes:

## 1. Pasa todos los tests

La simplicidad significa funcionalidad. Si el código no funciona como se espera, otros aspectos como la elegancia o el minimalismo no importan. Por tanto, un diseño solo es simple si supera todos los tests.

Esta regla también enfatiza la importancia de la metodología _Test-Driven Development_ (TDD), donde escribir tests antes de escribir código garantiza que solo se escriba lo necesario para que el software funcione.

Sus beneficios son:

* **Asegura la calidad**. Superar las pruebas garantiza que el software funcione correctamente.
* **Evita la sobreingeniería**. Cuando las pruebas dictan el diseño, es menos probable que los desarrolladores añadan complejidad innecesaria para satisfacer requisitos indefinidos.

## 2. Revela la intención

Un diseño simple es aquel en el que el código comunica la intención del desarrollador. Al leer el código, debe quedar claro de inmediato qué hace y por qué. El código que expresa intención evita trucos, construcciones complejas o patrones oscuros, en favor de una lógica directa y comprensible. Cualquier desarrollador que no haya escrito el código debería ser capaz de leerlo y comprenderlo como si fuera una historia de un libro. Por esta razón, el uso de algunas funciones, como la reflexión, solo debe emplearse cuando sea, con diferencia, la mejor opción.

Esta regla enfatiza que el código se escribe para que lo lean los humanos, no solo para que lo ejecuten las máquinas. Si un fragmento de código es difícil de entender o requiere mucha documentación para explicar su propósito, entonces no es simple. Un código claro y conciso permite que otros comprendan la lógica con un mínimo esfuerzo, reduciendo la carga cognitiva.

En lo que respecta a los comentarios, su objetivo no debe ser explicar lo que hace el código, este debe ser autoexplicativo. Los comentarios deben reservarse para casos puntuales en los que se desee aclarar las motivaciones detrás de una decisión de negocio, no el comportamiento o el estado del código.

Sus beneficios son:

* **Mejor colaboración**. Cuando el código expresa claramente su intención, la colaboración entre equipos es más fácil, ya que los desarrolladores pueden comprender rápidamente el propósito de las diferentes partes del código fuente. Esto facilita la transferencia de conocimiento y permite la rotación de miembros del equipo sin afectar excesivamente la productividad.
* **Depuración y refactorización más rápidas**. Comprender la intención del código facilita la corrección de errores o la refactorización del sistema sin introducir errores.

## 3. Sin duplicación de lógica

Este no es otro que el conocido principio del diseño de software, _Don't Repeat Yourself_ (DRY). La duplicación en el código genera redundancia, mayores costos de mantenimiento y una mayor probabilidad de errores. El diseño simple busca eliminar la duplicación innecesaria abstrayendo la funcionalidad común en componentes o funciones compartidas. Esta regla promueve la modularidad y la reutilización, dos aspectos cruciales de un software limpio y fácil de mantener.

Cuando una característica o comportamiento se duplica en varias partes del sistema, se crea la posibilidad de que aparezcan inconsistencias. Corregir un error o cambiar el comportamiento en un punto puede no solucionarlo en todos, lo que genera confusión y errores. Por el contrario, cuando el sistema está diseñado para minimizar la duplicación, los cambios son más fáciles de gestionar y el software se mantiene flexible ante cambios futuros.

Esta regla es al comportamiento lo que el concepto _Single Source Of Truth_ (SSOT) o _Single Point Of Truth_ (SPOT) es al estado.

Sus beneficios son:

* **Mantenimiento más sencillo**. Los cambios solo deben realizarse una vez, lo que reduce el riesgo de errores.
* **Legibilidad mejorada**. El código es más claro y fácil de seguir cuando no hay repeticiones innecesarias.

## 4. Menor número de elementos posible

Debe evitarse la tendencia a añadir características o funcionalidades innecesarias que no contribuyen a los objetivos principales del software. Cada función o componente de un sistema debe tener un propósito claro: satisfacer una necesidad y aportar valor. De lo contrario, debe eliminarse.

Esta regla anima a los desarrolladores a centrarse en lo que importa. Los reta a priorizar las partes más esenciales del sistema y a evitar distraerse con características no esenciales o una arquitectura excesiva. El objetivo es implementar solo lo necesario para resolver el problema en cuestión y nada más.

Cuando esta regla se aplica al desarrollo de funcionalidades, se traduce en el principio _You Aren't Gonna Need It_ (YAGNI).

Sus beneficios son:

* **Menor complejidad**. Eliminar funcionalidades innecesarias mantiene el diseño ágil y enfocado.
* **Costo reducido**. Menos funcionalidades implican menos tiempo dedicado a su desarrollo y mantenimiento.

## Conclusión

Estas cuatro reglas, como el objetivo que persiguen, son a su vez simples. Son sencillas de aplicar, recordar e interiorizar. Seguirlas nos asegura que el código resultante cumplirá con la simplicidad de diseño necesaria para que sea mantenible y escalable en el tiempo. Son un recurso indispensable que todo desarrollador debería tener en su caja de herramientas.

Más sobre:
* <a href="https://es.wikipedia.org/wiki/Kent_Beck" target="_blank">Kent Beck</a>
* <a href="https://es.wikipedia.org/wiki/Programaci%C3%B3n_extrema" target="_blank">Extreme Programming (XP)</a>
* <a href="https://es.wikipedia.org/wiki/Principio_KISS" target="_blank">Keep It Simple, Stupid! (KISS)</a>
* <a href="https://es.wikipedia.org/wiki/Desarrollo_guiado_por_pruebas" target="_blank">Test-Driven Development (TDD)</a>
* <a href="https://es.wikipedia.org/wiki/No_te_repitas" target="_blank">Don't Repeat Yourself (DRY)</a>
* <a href="https://en.wikipedia.org/wiki/Single_source_of_truth" target="_blank">Single Source of Truth (SSOT) / Single Point Of Truth (SPOT)</a>
* <a href="https://es.wikipedia.org/wiki/YAGNI" target="_blank">You Aren't Gonna Need It (YAGNI)</a>