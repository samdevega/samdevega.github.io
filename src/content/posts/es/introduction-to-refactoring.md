---
title: 'Introducción al refactoring'
pubDate: 2019-03-15T18:48:02Z
tags: ['refactoring']
---
Comencemos por la definición. Más concretamente, la que puede encontrarse en <a href="https://es.wikipedia.org/wiki/Refactorizaci%C3%B3n" target="_blank">este artículo de Wikipedia</a>.

## La primera definición (no tan buena)

>“La refactorización es una técnica de la ingeniería de software para reestructurar un código fuente, alterando su estructura interna sin cambiar su comportamiento externo.”
>
>-- <cite>Wikipedia</cite>

La definición es correcta desde el punto de vista de un formador, alguien que **ya posee este conocimiento** que se quiere hacer llegar. Sin embargo, las palabras no transmiten nada más allá de lo que meramente expresan. Es decir, de ella podemos extraer:

* Técnica (La **acción**)
* Ingeniería de software (El **ámbito**)
* Reestructurar un código (El **qué**)
* Sin cambiar su comportamiento (El **cómo**)

Si nos paramos a pensar un momento y somos capaces de ponernos en el punto de vista de un aprendiz, seremos capaces de detectar en ella la ausencia de las dos partes verdaderamente importantes, las más esenciales para transmitir el concepto. Estas son el **por qué** y el **para**.

## La segunda definición (mucho mejor)

Veamos ahora por el contrario como es descrito el refactoring en la siguiente definición, extraída del libro *Refactoring Workbook*, escrito por William C. Wake.

>“La refactorización es el arte de mejorar el diseño de un código existente de una manera segura. Nos provee de formas para organizar un código problemático y nos da las pautas para mejorarlo.”
>
>-- <cite>William C. Wake</cite>

De ella seguimos extrayendo:
* La **acción**, de una forma quizá más acertada, enfocada a la artesanía en “el arte de”.
* El **ámbito**, en “el diseño de un código”.
* El **qué**, en “organizar un código”.
* El **cómo**, en “de una forma segura”.

Pero además tenemos:
* El **por qué**, en “código problemático”.
* El **para**, en “mejorar el diseño”.

## Conclusión

El fin de la refactorización es la mejora en el diseño del código existente.