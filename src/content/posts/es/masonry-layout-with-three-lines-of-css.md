---
title: "Masonry Layout con tres líneas de CSS"
pubDate: 2025-06-04T22:30:00Z
tags: ['css']
---
El masonry layout consiste en un grupo de elementos de tamaño desigual, dispuestos de forma que no haya espacios desiguales. Un claro ejemplo es el menú Metro de Microsoft Windows.

El siguiente ejemplo de código muestra un conjunto de imágenes de diferentes tamaños.

```html
<div>
  <img src="https://picsum.photos/seed/random10/320/400.jpg" />
  <img src="https://picsum.photos/seed/random20/300/400.jpg" />
  <img src="https://picsum.photos/seed/random30/400/400.jpg" />
  <img src="https://picsum.photos/seed/random40/400/320.jpg" />
  <img src="https://picsum.photos/seed/random50/400/300.jpg" />
  <img src="https://picsum.photos/seed/random60/400/400.jpg" />
  <img src="https://picsum.photos/seed/random70/320/400.jpg" />
  <img src="https://picsum.photos/seed/random80/300/400.jpg" />
  <img src="https://picsum.photos/seed/random90/400/400.jpg" />
  <img src="https://picsum.photos/seed/random100/320/400.jpg" />
  <img src="https://picsum.photos/seed/random110/400/300.jpg" />
</div>
```

Así es como se ven inicialmente las imágenes en la pantalla:
![Ejemplo antes del CSS](/images/masonry_before.png)

Las tres líneas de CSS a aplicar son las propiedades `columns`, `gap` y `width`.

La propiedad abreviada de CSS `columns` establece la cantidad de columnas que se utilizarán al dibujar el contenido de un elemento, así como el ancho de esas columnas.

La propiedad abreviada de CSS `gap` define los espacios entre filas y columnas. Esta propiedad se aplica a contenedores multicolumna, flexibles y de cuadrícula.

La propiedad CSS `width` define el ancho de un elemento. Por defecto, define el ancho del área de contenido, pero si `box-sizing` se establece en `border-box`, define el ancho del área del borde.

```css
div {
  columns: 320px;
  gap: 4px;
}
img {
  width: 100%;
}
```

Se han utilizado esos valores por comodidad. `columns: 320px`, `gap: 4px` y `width: 100%` equivalen a las clases `columns-xs`, `gap-1` y `w-full` de Tailwind CSS. Los cuatro píxeles de separación es lo que aplica el navegador por defecto para separar las imágenes entre sí cuando no se aplica la propiedad `columns`. Dar un ancho del 100% a las imágenes hará que se adapten adecuadamente al ancho de su columna.

Ahora las imágenes se reordenan automáticamente para rellenar el espacio disponible entre ellas.

Así es como se ven las imágenes después de aplicarlas:
![Ejemplo tras el CSS en horizontal](/images/masonry_landscape.png)

El diseño incluso se adapta a diferentes tamaños y orientaciones de pantalla:
![Ejemplo tras el CSS en vertical](/images/masonry_portrait.png)

Gracias a los avances de CSS, un diseño complejo que antes requería múltiples líneas de CSS, además del uso de JavaScript, ahora se puede implementar con solo unas pocas líneas de CSS.