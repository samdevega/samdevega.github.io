---
title: "Gitignore global. Limpiar gitignore en repositorios"
pubDate: 2024-04-08T16:30:00Z
tags: ['git']
---

Solemos encontrar casos en los que el archivo `.gitignore` de un proyecto tiene muchas cosas que no están directamente relacionadas con el proyecto en sí sino con los entornos locales de los desarrolladores que trabajan en el proyecto. Esto incluye el archivo de índice del sistema de archivos de cada desarrollador, como el archivo `Thumbs.db` en Microsoft Windows o `.DS_Store` en Apple MacOS. El archivo de configuración del IDE o editor de código de cada desarrollador, por ejemplo el archivo `.idea` en IntelliJ Idea o el archivo `.vscode` en Microsoft Visual Studio Code e incluso una implementación de contenedor como el archivo `.docker-sync` en Docker.

Nuestros repositorios no deberían de tener que preocuparse por estas cosas. Aquí es donde entra en escena un gitignore global.

Primero, definimos un archivo global `.gitignore` en la ruta de inicio de nuestra máquina local para que esté en el mismo directorio que el archivo `.gitconfig`.   
La ruta de inicio es `%userprofile%` en Microsoft Windows y `~` en GNU Linux y Apple MacOS.  
Incluimos los nombres de los archivos a ignorar que no están relacionados con el proyecto en este archivo global `.gitignore`.

**.gitignore**

```bash
.docker-sync
.docker-sync.yml
.DS_Store
.idea
.phpintel
.phpunit.cache
.Thumbs.db
.vscode
```

Luego, agregamos una referencia a este archivo `.gitignore` en nuestro archivo local `.gitconfig`.

**.gitconfig**

```bash
[core]
  excludesfile = home/path/.gitignore
```

De ahora en adelante, no tendremos que preocuparnos de agregar todos esos nombres de archivos para cada repositorio y estos tendrán archivos `.gitignore` cuyo contenido sólo está relacionado con su código fuente. La "desventaja" de esta elección es que cada desarrollador tiene que implementar su propio gitignore global, por lo que no es la opción ideal para los perezosos.