# Proyecto de Computación en Internet III

## Integrantes del Grupo

- **Juan Felipe Madrid  - A00381242**
- **Luis Fernando Pinillos- A00381323**
- **Darwin andres Lenis - A00381657**

## Descripción del Proyecto

El proyecto es una API RESTful para la gestión de usuarios y comentarios, implementada en Node.js y TypeScript. Permite realizar operaciones CRUD (Crear, Leer, Actualizar y Eliminar) en usuarios y comentarios, gestionar la autenticación, y controlar roles específicos para restringir las acciones permitidas según el rol de cada usuario.

## Configuración del Proyecto

## Dependencias

Para garantizar un entorno de desarrollo consistente y eficiente, se emplearon diversos paquetes tanto para el entorno de producción como de desarrollo. Algunas de las dependencias utilizadas son:

- **Express**: Framework para Node.js utilizado para la creación del servidor y la gestión de rutas.
- **Mongoose**: Librería para la modelación de datos en MongoDB.
- **dotenv**: Paquete para gestionar variables de entorno.
- **bcryptjs**: Utilizado para la encriptación de contraseñas.
- **jsonwebtoken**: Implementación de tokens de autenticación.
- **Nodemon**: Herramienta para el desarrollo que reinicia automáticamente la aplicación cuando se detectan cambios en el código fuente.

## Configuración de la Base de Datos y Puertos de Ejecución

Para configurar el proyecto, es necesario crear un archivo `.env` , al nivel de `src`. Este archivo debe contener las siguientes variables de entorno:

### Variables de Entorno

- **`PORT=3000`**: Define el puerto en el que la aplicación se ejecutará. En este caso, se utiliza el puerto `3000`. Puedes modificar este valor según las necesidades de tu entorno.

- **`MONGO_URL=mongodb+srv://admin:admin@clusterdemots.crzue.mongodb.net/?retryWrites=true&w=majority&appName=ClusterDemoTS`**: Proporciona la URL de conexión a la base de datos MongoDB. Esta URL incluye las credenciales y el enlace al clúster donde se almacenan los datos. Asegúrate de proteger esta información y actualizarla si es necesario.

- **`JWT_SECRET=P1ni3sM1H1ij0`**: Especifica la clave secreta utilizada para la firma y verificación de los tokens JWT (JSON Web Tokens). Esta clave es crucial para garantizar la seguridad de los tokens y prevenir la falsificación.

## Notas Importantes

### Seguridad
No compartas el archivo `.env` en repositorios públicos ni en ningún otro lugar accesible para el público, ya que puede contener información sensible, como credenciales de bases de datos y claves de API.

### Autenticación y Autorización
Protege las rutas sensibles utilizando middleware de autenticación y control de acceso basado en roles. Asegúrate de que solo usuarios autorizados puedan realizar acciones críticas.

### Control de Dependencias
Usa un archivo `package-lock.json` o `yarn.lock` para fijar versiones de las dependencias y evitar posibles vulnerabilidades o problemas de compatibilidad en el entorno de producción.

### Manejo de Errores
Implementa un manejo de errores robusto para capturar y registrar excepciones de manera segura, evitando exponer información sensible en las respuestas API.


### Dependencias de Producción

```json
"dependencies": {
    "bcrypt": "^5.1.1",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "mongodb": "^6.8.0",
    "mongoose": "^8.5.2",
    "nodeapp": "file:",
    "zod": "^3.23.8"
}
```

### Dependencias de Desarrollo

```json
"devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/node": "^22.1.0",
    "nodemon": "^3.1.4",
    "ts-node": "^10.9.2",
    "typescript": "^5.5.4"
}
```

### Instalación

Para preparar el entorno de desarrollo, es fundamental instalar todas las dependencias necesarias. Esto se puede hacer ejecutando el siguiente comando:


```bash
npm install
```

Este comando se encargará de descargar y configurar automáticamente todos los paquetes requeridos para que el proyecto funcione de manera óptima.

## Ejecución del Proyecto

Para configurar y ejecutar este proyecto en su entorno local, siga los pasos:

1. **Clonar el repositorio:**
   - Inicie obteniendo una copia local del proyecto desde GitHub mediante el comando `git clone`. Esto descargará todos los archivos y recursos necesarios en su máquina.

2. **Acceder al directorio del proyecto:**
   - Después de clonar el repositorio, navegue hasta la carpeta correspondiente donde se almacenó el proyecto. Puede hacer esto utilizando comandos como `cd` en la terminal.

3. **Abrir la terminal en el directorio del proyecto:**
   - Asegúrese de estar en la raíz del proyecto dentro de la terminal. Desde aquí, podrá ejecutar todos los comandos necesarios para instalar dependencias y ejecutar la aplicación.

4. **Instalar dependencias:**
   - Antes de iniciar el servidor, es importante instalar todas las dependencias necesarias. Esto se logra ejecutando `npm install`, lo que descargará y configurará todas las bibliotecas y paquetes definidos en `package.json`.

5. **Iniciar el servidor en modo de desarrollo:**
   - Con todo configurado, inicie el servidor ejecutando `npm run dev`. Esto arrancará la aplicación en modo de desarrollo, permitiéndole realizar pruebas y ver los cambios en tiempo real.

```bash
   git clone https://github.com/darwinl-06/CRUD_usuarios_comentarios.git

   ```
   ```bash
   npx run dev
   ```

> **Nota:** Si se encuentra con un error relacionado con paquetes no encontrados, puede ser necesario ejecutar nuevamente `npm install` para asegurarse de que todos los paquetes requeridos estén instalados.

## Funcionalidad del Proyecto

El proyecto abarca varias funcionalidades clave, organizadas en dos áreas principales: **gestión de usuarios** y **gestión de comentarios**. A continuación, se detalla cada una de estas áreas:


# Gestión de Comentarios y Usuarios

## Gestión de Comentarios

- **Creación**: Los usuarios pueden agregar nuevos comentarios a cualquier entidad relevante (posts, productos, etc.).
- **Edición y Eliminación**: Los usuarios solo pueden modificar o eliminar sus propios comentarios.
- **Respuestas Anidadas**: Se permite crear hilos de conversación a través de respuestas a comentarios existentes.
- **Reacciones**: Los usuarios pueden expresar sus opiniones sobre los comentarios mediante reacciones (Like, Dislike, Love, etc.).

## Gestión de Usuarios

- **Roles**:
  - **Superadmin**: Acceso completo a todas las funcionalidades, incluyendo la gestión de otros usuarios.
  - **Usuario Regular**: Permisos limitados a sus propias acciones y visualización de usuarios autenticados.
  
- **Permisos**: Los permisos se definen claramente para cada rol, asegurando que los usuarios solo puedan realizar las acciones autorizadas.

### Middleware y Seguridad

Para garantizar la ejecución adecuada de las operaciones y la protección de los datos, se utilizan varios middleware:

- **Autorización de Acciones**: Este middleware controla y asegura que solo los usuarios con permisos adecuados puedan realizar ciertas acciones. Por ejemplo, un usuario puede eliminar sus propios comentarios, pero no tiene autorización para modificar o eliminar los comentarios de otros.
- **Autenticación con JWT**: Se utiliza JSON Web Tokens (JWT) para autenticar a los usuarios y proteger las rutas y operaciones del sistema. Los tokens JWT añaden una capa adicional de seguridad al verificar la identidad del usuario en cada solicitud.

Estas medidas aseguran que el sistema funcione de manera segura y eficiente, manteniendo los permisos adecuados y protegiendo la información de los usuarios.


### Nota
Se utilizo un solo archivo para las rutas de los usuarios y comentarios.

### Rutas de Usuarios (`users.router.ts`)

Estas rutas gestionan las operaciones relacionadas con los usuarios:

- `POST /login` - Iniciar sesión.
- `GET /id` - Obtener usuario por id.
- `GET /` - Obtener todos los usuarios.
- `GET /profile` - Comprobar que el usuario es existente.
- `POST /` - Crear un nuevo usuario.
- `PUT /:id` - Actualizar un usuario existente.
- `DELETE /:id` - Eliminar un usuario.

### Rutas de Comentarios  (`users.router.ts`) 

Estas rutas gestionan todas las operaciones relacionadas con los comentarios en la API:

### Nota:
Para facilitar la busqueda, muchos de los metodos se les pasa por parametro el id para no tener que hacerlo por la ruta, como ejemplo estan el put y el delete de los comentarios

- `GET /comments` - Obtener todos los comentarios.
- `POST /comments` - Crear un nuevo comentario.
- `PUT /comments` - Actualizar un comentario existente.
- `DELETE /comments` - Eliminar un comentario.

#### Comentarios Anidados

- `POST /comments/:commentId/replies/:replyId` - Crear un comentario anidado sobre un comentario añadido .
- `POST /comments/:commentId/replies/` - Crear el primer comentario anidado.
- `PUT /comments/:commentId/replies/:replyId` - Editar un comentario anidado.
- `DELETE /comments/:commentId/replies/:replyId` - Eliminar un comentario anidado.


#### Reacciones a Comentarios

- `POST /comments/:commentId/reaction` - Reaccionar a un comentario.
- `DELETE /:id/reactions/:reactionId` - Quitar una reacción de un comentario.

#### Reacciones a Comentarios Anidados

- `POST /comments/:commentId/reaction/:replyId` - Reaccionar a un comentario anidado.
- `DELETE /comments/:commentId/reaction/:reactionId/:replyId?` - Quitar una reacción de un comentario anidado.
- `Put /comments/:commentId/reaction/:reactionId/:replyId?` - Editar una reaccion de un comentario

---

### Resumen API RESTful

### Rutas de `users.router.ts`

| NAME                   | PATH                                            | HTTP VERB | PURPOSE                          |
|------------------------|-------------------------------------------------|-----------|----------------------------------|
| Login                  | `/login`                                        | POST      | Login                            |
| Get User by ID         | `/id`                                           | GET       | Get user by ID                   |
| Get Users              | `/`                                             | GET       | Get all users                    |
| Get Profile            | `/profile`                                      | GET       | Check if user exists             |
| Create User            | `/`                                             | POST      | Create a new user                |
| Update User            | `/:id`                                          | PUT       | Update a user                    |
| Delete User            | `/:id`                                          | DELETE    | Delete a user                    |
| Get Comments           | `/comments`                                     | GET       | Get all comments                 |
| Create Comment         | `/comments`                                     | POST      | Create a new comment             |
| Update Comment         | `/comments`                                     | PUT       | Update a comment                 |
| Delete Comment         | `/comments`                                     | DELETE    | Delete a comment                 |
| Create Nested Comment  | `/comments/:commentId/replies/:replyId`         | POST      | Create a nested comment          |
| Create First Nested Comment | `/comments/:commentId/replies/`            | POST      | Create the first nested comment  |
| Update Nested Comment  | `/comments/:commentId/replies/:replyId`         | PUT       | Edit a nested comment            |
| Delete Nested Comment  | `/comments/:commentId/replies/:replyId`         | DELETE    | Delete a nested comment          |
| React to Comment       | `/comments/:commentId/reaction`                 | POST      | React to a comment               |
| Unreact Comment        | `/:id/reactions/:reactionId`                    | DELETE    | Remove a reaction from a comment |
| React to Nested Comment | `/comments/:commentId/reaction/:replyId`        | POST      | React to a nested comment        |
| Unreact Nested Comment | `/comments/:commentId/reaction/:reactionId/:replyId?` | DELETE    | Remove a reaction from a nested comment |
| Edit Reaction to Nested Comment | `/comments/:commentId/reaction/:reactionId/:replyId?` | PUT | Edit a reaction to a nested comment |


## Dificultades y problemas Encontrados

Las mayores dificultades y problemas encontrados a la hora de realizar la solucion del proyecto fue la realizacion de los hilos de discusion en los comentarios. Esto se debe a que al tener en cuenta el funcionamiento de los hilos, el equipo propuso como solucion realizar las respuestas a estos comentarios de forma embebida, haciendo que se generaran muchos problemas a la hora de poder realizar la respuesta a una respuesta, cumpliendo asi con la generacion de hilos. La solucion encontrada fue realizar funciones recursivas, las cuales dejaron un problema, las respuestas a las respuestas tienen un limite, por lo que cuando se llega a este limite no se guardan mas respuestas de las respuestas.

## Conclusión

Este proyecto de CRUD de usuarios y comentarios ha sido una buena experiencia en el desarrollo de APIs RESTful, fortaleciendo nuestras habilidades en la gestión y persistencia de datos. A través de la implementación de características como la autenticación, la creación de roles específicos y las reacciones a comentarios, hemos abordado y superado desafíos complejos. El resultado es una API eficiente y escalable, que no solo maneja usuarios y comentarios de manera efectiva, sino que también se adapta a diversas necesidades en aplicaciones web.
