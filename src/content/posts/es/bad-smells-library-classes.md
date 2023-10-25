---
title: "Malos olores: Clases Librería"
pubDate: 2019-03-20T18:44:47Z
tags: ['bad-smells']
---
Una aplicación moderna utilizará clases librería. En ocasiones estas nos ponen en un dilema. Queremos que la librería sea diferente, pero no queremos cambiarla. Incluso cuando es posible cambiar de librería, conlleva riesgos: Afecta a otros clientes y ello implica rehacer nuestros cambios para futuras versiones de la librería.

## Incomplete Library Class
### Síntomas

Estás utilizando una librería y hay una característica que te gustaría que tuviese.

### Qué hacer

* Contactar con el creador para ver si puede incorporar la característica.
* Si son sólo un par de métodos, usa *Introduce Foreign Method* en la clase cliente de la librería. Esto genera *Feature Envy* pero es insalvable.
* Si son bastantes métodos, usa *Introduce Local Extension* (creando una subclase de la librería para crear nuevas pseudolibrerías). Usa la nueva clase extendida para avanzar.
* Puedes decidir introducir una capa para envolver la librería.

### Recompensas

Reduce la duplicidad (cuando puedes reusar el código de la librería en lugar de implementarlo completamente desde cero).

### Contraindicaciones

Si varios proyectos incorporan una librería de formas incompatibles, puede suponer un trabajo extra el adaptarse a futuros cambios de la misma.