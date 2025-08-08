---
title: "Cómo arreglar el error \"Cannot find module @rollup\" en un proyecto de Vite"
pubDate: 2025-01-27T21:00:00Z
tags: ['vite']
---
Si has llegado hasta aquí, probablemente te has encontrado con una de las variantes de este error en la terminal al intentar ejecutar un proyecto de <a href="https://es.vite.dev/" target="_blank">Vite</a>.

## El error
```plaintext
Error: Cannot find module @rollup/rollup-linux-x64-gnu.
```

La parte interesante del mismo es lo que va a continuación.

```
npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828).
Please try npm i again after removing both package-lock.json and node_modules directory.
```

Pero antes de seguir ciegamente el consejo de borrar el archivo `package-lock.json` y el directorio `node_modules`, vamos a pararnos a analizar un momento la causa de este error y su contexto.

## Sobre RollUp
<a href="https://www.npmjs.com/package/rollup" target="_blank">RollUp</a>, el agrupador de módulos de JavaScript utilizado por Vite, dispone de binarios específicos para los principales sistemas operativos y arquitecturas.

Lo más probable es que estés trabajando en un proyecto como parte de un equipo de desarrolladores, donde cada uno utiliza un sistema operativo distinto. Algunos trabajarán sobre GNU Linux mientras que otros lo harán sobre MacOS o incluso Windows.

## La causa
La causa del error se debe a que el miembro del equipo que creó el proyecto trabaja sobre un sistema operativo distinto al que tu estás utilizando. Eso implica que el binario de RollUp que se instaló inicialmente en el proyecto fue el específico para el sistema operativo de ese miembro, que difiere del que puede ser utilizado por tu sistema.

Tener el archivo `package-lock.json` dentro del control de versiones se considera una buena práctica, ya que ayuda a que todo el equipo trabaje bajo las mismas versiones de las dependencias utilizadas en el proyecto. Por ello, borrarlo no sería la solución adecuada, dado que otro miembro del equipo volverá a encontrarse con dicho error, además de perder el control sobre las versiones instaladas del resto de dependencias.

## La solución
Para resolver el problema, lo que debes hacer es incluir los distintos binarios de RollUp que son utilizados por los diferentes miembros del equipo como dependencias opcionales del proyecto.

Bajo las entradas de `"dependencies"` y `"devDependencies"` del archivo `package.json` del proyecto puedes añadir una entrada como la de este ejemplo, con los binarios de RollUp para los sistemas operativos y arquitecturas más comunes.

**package.json**
```json
...
"optionalDependencies": {
  "@rollup/rollup-darwin-arm64": "^4.32.0",
  "@rollup/rollup-darwin-x64": "^4.32.0",
  "@rollup/rollup-linux-arm64-gnu": "^4.32.0",
  "@rollup/rollup-linux-x64-gnu": "^4.32.0",
  "@rollup/rollup-win32-arm64-msvc": "^4.32.0",
  "@rollup/rollup-win32-x64-msvc": "^4.32.0"
}
```

Si a algún miembro del equipo le sigue apareciendo el error, bastará con añadir a esa lista el binario específico para su sistema.

Con esto, el error queda solucionado y todo el equipo podrá ejecutar el proyecto.