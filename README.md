# Reserva de Turnos

Este proyecto es una aplicación para gestionar reservas de turnos. Permite a los usuarios agregar, actualizar y eliminar reservas, así como ver una lista de reservas programadas. Está construido con Vue 3 y Pinia para la gestión del estado.

## Características

- **Agregar reservas**: Permite añadir nuevas reservas con nombre, fecha, hora de inicio y hora de finalización.
- **Actualizar reservas**: Permite modificar las reservas existentes.
- **Eliminar reservas**: Permite eliminar reservas programadas.
- **Visualización de reservas**: Muestra una lista de todas las reservas con detalles como nombre, fecha y horario.

## Tecnologías utilizadas

- **Vue 3**: Framework de JavaScript para construir la interfaz de usuario.
- **Pinia**: Biblioteca para la gestión del estado en Vue 3.
- **Moment.js**: Librería para el manejo de fechas y horas (puede ser reemplazada por `day.js` o `date-fns` si se prefiere).
- **CSS**: Estilos para la aplicación utilizando Flexbox para el diseño responsivo.

## Instalación

1. Clona este repositorio:

    ```bash
    git clone https://github.com/tu_usuario/reserva-turnos.git
    ```

2. Navega al directorio del proyecto:

    ```bash
    cd reserva-turnos
    ```

3. Instala las dependencias:

    ```bash
    npm install
    ```

4. Ejecuta el proyecto en modo de desarrollo:

    ```bash
    npm run serve
    ```

5. Abre tu navegador y visita `http://localhost:8080` para ver la aplicación en funcionamiento.

## Uso

- **Agregar una reserva**: Completa los campos de nombre, fecha, hora de inicio y hora de finalización, y haz clic en el botón "Guardar".
- **Actualizar una reserva**: Busca la reserva en la lista y utiliza la funcionalidad correspondiente para actualizarla.
- **Eliminar una reserva**: Usa el ícono de la papelera al lado de la reserva que deseas eliminar.

## Estructura del Proyecto

- `src/`
  - `components/`: Componentes Vue utilizados en la aplicación.
  - `store/`: Almacena el estado de las reservas utilizando Pinia.
  - `views/`: Vistas principales de la aplicación.
  - `App.vue`: Componente raíz.
  - `main.js`: Punto de entrada de la aplicación.



