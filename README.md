# Pokédex Móvil

**Desarrollador:** Gabriel Tejeda
**Matrícula:** 347723

## Descripción breve de la aplicación
Aplicación móvil funcional tipo Pokédex que consume la PokéAPI. Este proyecto permite a los usuarios explorar un catálogo de Pokémon, ver sus detalles específicos, buscar por nombre, filtrar por tipos, guardar sus Pokémon favoritos de manera persistente y comparar las estadísticas base entre dos de ellos.

## Tecnologías utilizadas
* **Frontend:** React Native (con Expo)
* **Lenguaje:** TypeScript
* **Navegación:** React Navigation (Native Stack)
* **Peticiones HTTP:** Axios
* **Almacenamiento Local:** AsyncStorage (@react-native-async-storage/async-storage)
* **Gestor de paquetes:** pnpm

## Instrucciones de instalación
1. Clona este repositorio en tu máquina local:
   ```bash
   git clone https://github.com/DonVaderr/pokedex.git

2. Navega al directorio del proyecto:

    Bash
    cd pokedex-movil
    
3. Instala las dependencias necesarias utilizando pnpm:

    Bash
    pnpm install

Comando para ejecutar el proyecto
Para iniciar el servidor de desarrollo de Expo, ejecuta el siguiente comando:

    Bash
    pnpm start

Funcionalidades implementadas
Listado de Pokémon: Carga inicial de Pokémon interactivos.

Detalle de Pokémon: Pantalla con imagen oficial, tipos, peso, altura, habilidades y estadísticas base.

Búsqueda y Filtros: Búsqueda en tiempo real por nombre y filtrado por tipo consumiendo la API.

Sistema de Favoritos: Marcado de favoritos con persistencia de datos local (sobreviven al reiniciar la app).

Comparador de Pokémon: Pantalla dedicada para buscar dos Pokémon y enfrentar visualmente sus estadísticas base, resaltando al ganador por atributo.

UX / UI: Manejo de estados de carga, mensajes de error, estados de "sin resultados" y diseño adaptado a los márgenes seguros de los dispositivos (SafeArea).

