---
title: "Hoja de trucos y alias de Git"
pubDate: 2024-10-04T22:25:00Z
tags: ['git']
---
Esta publicación presenta los comandos de Git más importantes y utilizados para una fácil referencia, además de algunos alias de Git útiles.

* [Configuración](#configuración)
* [Organización](#organización)
* [Escenario e instantánea](#escenario-e-instantánea)
* [Almacenar](#almacenar)
* [Rama y fusión](#rama-y-fusión)
* [Inspeccionar y comparar](#inspeccionar-y-comparar)
* [Compartir y actualizar](#compartir-y-actualizar)
* [Reescribir la historia](#reescribir-la-historia)
* [Alias ​​de Git útiles](#alias-de-git-útiles)

## Configuración
Asigna tu nombre de usuario globalmente.
```shell
git config --global user.name "[first_name last_name]"
```

Asigna tu dirección de email globalmente.
```shell
git config --global user.email "[email_address]"
```

Asigna un coloreado automático de la línea de comandos para revisar Git fácilmente.
```shell
git config --global color.ui auto
```

Lista todos tus alias de Git.
```shell
git config --get-regexp ^alias\.
```

## Organización
Inicializa un directorio existente como un repositorio de Git.
```shell
git init
```

Recupera un repositorio remoto vía URL.
```shell
git clone [url]
```

## Escenario e instantánea
Muestra los archivos modificados en el directorio de trabajo.
```shell
git status
```

Añade un archivo tal como está actualmente al escenario para tu siguiente commit.
```shell
git add [file]
```

Añade todos los archivos tal como están actualmente al escenario para tu siguiente commit.
```shell
git add .
```

Elimina un archivo del directorio actual y el repositorio, añadiendo al escenario la eliminación.
```shell
git rm [file]
```

Mueve o renombra un archivo o directorio en tu repositorio.
```shell
git mv [file_or_directory]
```

Pone un archivo fuera del escenario mientras mantiene los cambios en el directorio de trabajo.
```shell
git reset [file]
```

Pone todos los archivos fuera del escenario.
```shell
git reset .
```

Descarta los cambios hechos a un archivo.
```shell
git checkout [file_name]
```

Descarta los cambios hechos a todos los archivos.
```shell
git checkout .
```

Diferencia de qué ha cambiado pero no se ha añadido al escenario.
```shell
git diff
```

Diferencia de qué se ha añadido al escenario pero aún no está en un commit.
```shell
git diff --staged
```

Añade el contenido del escenario como una nueva instantánea.
```shell
git commit -m "[meaningful_message]"
```

## Almacenar

Almacena los cambios modificados y añadidos al escenario (pila)
```shell
git stash
```

Lista todos los cambios almacenados en orden de pila.
```shell
git stash list
```

Obtiene los archivos modificados de la cima de la pila.
```shell
git stash pop
```

Descarta los cambios desde la cima de la pila.
```shell
git stash drop
```

## Rama y fusión
Lista las ramas. Un asterisco aparecerá junto a la rama actual.
```shell
git branch
```

Crea una nueva rama en el commit actual.
```shell
git branch [branch_name]
```

Cambia a otra rama y revisa el directorio de trabajo.
```shell
git checkout [branch_name]
```

Crea una nueva rama y cambia a ella.
```shell
git checkout -b [branch_name]
```

Fusiona la historia de la rama especificada en la rama actual.
```shell
git merge [branch]
```

## Inspeccionar y comparar
Muestra el historico de commits para la rama actual.
```shell
git log
```

Muestra los commits en `branch_a` que no están en `branch_b`.
```shell
git log branch_b..branch_a
```

Muestra los commits que cambiaron un fichero, incluso a través de renombrados.
```shell
git log --follow [file]
```

Muestra la diferencia de qué hay en `branch_a` pero no hay en `branch_b`.
```shell
git diff branch_b..branch_a
```

Muestra los detalles del commit actual, incluyendo sus cambios.
```shell
git show
```

Muestra los detalles del commit especificado, incluyendo sus cambios.
```shell
git show [commit_sha]
```

## Compartir y actualizar
Añadir una URL de Git como un alias. El alias más común es `origin`.
```shell
git remote add [alias] [url]
```

Traer todas las ramas del repositorio remoto.
```shell
git fetch
```

Traer y fusionar los commits desde la rama remota.
```shell
git pull
```

Fusionar una rama remota con la rama actual para actualizarla.
```shell
git merge [alias]/[branch]
```

Empujar los commits de la rama local a la rama del repositorio remoto.
```shell
git push
```

Empujar los commits de la rama local a una nueva rama en el repositorio remoto.
```shell
git push -u [alias] [branch]
```

## Reescribir la historia
Aplicar los commits de la rama actual antes de la rama especificada.
```shell
git rebase [branch]
```

Limpiar el área de staging, reescribir el árbol de trabajo a partir del commit especificado (rollback)
```shell
git reset --hard [commit]
```

Incluir los cambios del escenario en el último commit.
```shell
git commit --amend
```

Hacer cambios en un commit pasado (no recomendado cuando hay más personas trabajando sobre la rama de la que viene el commit)
1. Hacer un rebase interactivo del commit a editar.
```shell
git rebase -i [commit_sha]~
```
2. Cambiar el commit que se desea editar de `pick` a `edit`.
```shell
edit 8a62da1 commit_to_edit
pick 9ee3178 next_commit
pick 9cca210 next_commit
```
3. Una vez hechos los cambios, añadirlos al escenario y realizar un `ammend`.
```shell
git add .
git commit --amend
```
4. Finalizar el rebase.
```shell
git rebase --continue
```
5. En caso de que se hubiese empujado al repositorio remoto anteriormente, habrá que forzar el nuevo empuje.
```shell
git push --force
```

## Alias ​​de Git útiles
Atajo para listar todos los alias.
```shell
git config --global alias.aliases "config --get-regexp '^alias\.'"
```

Atajo para listar todas las configuraciones globales.
```shell
git config --global alias.g "config --global -l"
```

Atajo de status.
```shell
git config --global alias.s "status"
```

Atajo de commit.
```shell
git config --global alias.c "commit -m"
```

Atajo de diff.
```shell
git config --global alias.d "diff"
```

Atajo de push.
```shell
git config --global alias.p "push"
```

Atajo de log con gráfico.
```shell
git config --global alias.l "log --graph --pretty=format:'%C(red)%h%C(reset) -%C(yellow)%d%C(reset) %s %C(green)(%cr) %C(magenta)<%an>%C(reset)' --abbrev-commit --date=relative"
```