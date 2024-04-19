---
title: "Orientado a objetos: Ley de Demeter"
pubDate: 2019-03-17T20:20:50Z
tags: ['object-oriented']
---
## Sobre la Ley de Demeter

La *Ley de Demeter* (Law of Demeter en inglés) o LoD, también conocida como *Principio del menor conocimiento* (Principle of Least Knowledge) tiene como objetivo la reducción del acoplamiento y el incremento de la cohesión.

Enuncia lo siguiente:

* Cada unidad debe tener un limitado conocimiento sobre otras unidades y solo conocer aquellas unidades estrechamente relacionadas a la unidad actual.
* Cada unidad debe hablar solo a sus amigos y no hablar con extraños.
* Solo hablar con sus amigos inmediatos.

## Trasladando la Ley de Demeter a código

Para cumplir con dichas premisas a nivel de código, se parte de que un método sólo debería utilizar otros métodos de:

* La propia clase a la que pertenece.
* Un objeto creado por el propio método.
* Un objeto pasado como parámetro de entrada al propio método.
* Un objeto almacenado como variable a nivel de la propia clase (propiedad). 

Un método nunca debería utilizar otro método de un objeto retornado por sus colaboradores.

Veamos ahora cómo estas técnicas de refactoring nos ayudan a cumplir con dicha ley.

## Hide Delegate (ocultar delegado)

Es una técnica utilizada para mover características entre clases. Se utiliza cuando nos encontramos con el problema en que un objeto *Client* hace una llamada a un método de un objeto *Delegate*, que a su vez es una propiedad u objeto retornado por un objeto *Server*, de otra clase. Se estaría produciendo un incumplimiento de la *Ley de Demeter*.

![La Ley de Demeter 1](/images/law-of-demeter-1.jpg)

La forma correcta de proceder es crear en *Server* un método propio que internamente llame y retorne el comportamiento que *Client* necesita de *Delegate*. De esta forma, *Client* no es consciente en ningún momento de la existencia de *Delegate* y eliminamos así la dependencia entre estas dos clases, reduciendo el acoplamiento en nuestra aplicación. *Server* pasa a ser lo que se conoce como *Middle Man*. Un objeto de una clase intermedia que se encarga de comunicar las peticiones de una clase a otra, que es la tiene el comportamiento que buscamos para desarrollar la lógica deseada.

![La Ley de Demeter 2](/images/law-of-demeter-2.jpg)

La contra de esta técnica de refactorización es que para cada comportamiento que *Client* necesite de *Delegate*, tendremos que crear un método en *Server* que se encargue de la comunicación entre ambos.

Veamos ahora la técnica opuesta a *Hide Delegate*.

## Remove Middle Man (eliminar intermediario)

Partiendo del ejemplo anterior en *Hide Delegate*, *Client* requiere una lógica que se encuentra en *Delegate* y *Server* hace de *Middle Man* entre ambos.

Ahora bien, ya sea que nos encontremos en una etapa temprana del diseño de la aplicación o bien tras un tiempo de evolución en la misma mediante diferentes fases de refactoring, podemos encontrarnos con que un *Middle Man* carece de comportamiento propio y únicamente se encarga de delegar el trabajo a otras clases. Llegado este punto, debemos estudiar si realmente queremos que exista esta clase intermedia o si la eliminamos para reducir una complejidad innecesaria en el diseño de nuestra aplicación.

Para eliminar el *Middle Man*, debemos sustituir su dependencia por la de *Delegate* en la clase *Client*, cambiando todas las referencias al falso comportamiento del mismo por referencias al comportamiento final correspondiente en *Delegate*.

Algunos casos en los que podemos querer mantener la existencia de una clase *Middle Man* son:

* Si evita una interdependencia entre clases (reducir el acoplamiento)
* Sirve a la implementación de un patrón de diseño, como el *Proxy* o el *Decorator*.

## Conclusión

El uso de *Hide Delegate* y *Middle Man* permite cumplir con la *Ley de Demeter* y asegurarnos de que nuestro diseño mantenga una alta cohesión y un menor acoplamiento, si bien un uso excesivo de esta técnica puede resultar en un crecimiento desmesurado o quizá innecesario de la complejidad de nuestra aplicación, que podemos revertir mediante *Remove Middle Man*.

La forma de asegurar que la implementación de ambas técnicas es la mejor solución para cada caso en particular, así como del resto de la arquitectura resultante en nuestro diseño, no es otra que dedicar unas horas semanales a realizar una revisión del análisis de nuestro proyecto, con su correspondiente refactoring de considerarse necesario.

La reescritura habitual del código no sólo ayudará a que el diseño sea o se acerque lo máximo posible a ser la solución ideal en el momento en el que es escrito el código, sino que ayudará a que el mismo evolucione junto con nuestra lógica de negocio y maximizará la longevidad del proyecto.