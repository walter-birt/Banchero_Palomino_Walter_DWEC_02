import GastoCombustible from './gastoCombustible.js';
// ------------------------------ 1. VARIABLES GLOBALES ------------------------------
let tarifasJSON = null;
let gastosJSON = null;
let tarifasJSONpath = './json/tarifasCombustible.json';
let gastosJSONpath = './json/gastosCombustible.json';

// ------------------------------ 2. CARGA INICIAL DE DATOS (NO TOCAR!) ------------------------------
// Esto inicializa los eventos del formulario y carga los datos iniciales
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar los JSON cuando la página se carga, antes de cualquier interacción del usuario
    await cargarDatosIniciales();

    // mostrar datos en consola
    console.log('Tarifas JSON: ', tarifasJSON);
    console.log('Gastos JSON: ', gastosJSON);

    calcularGastoTotal();

    // Inicializar eventos el formularios
    document.getElementById('fuel-form').addEventListener('submit', guardarGasto);
});

// Función para cargar ambos ficheros JSON al cargar la página
async function cargarDatosIniciales() {

    try {
        // Esperar a que ambos ficheros se carguen
        tarifasJSON = await cargarJSON(tarifasJSONpath);
        gastosJSON = await cargarJSON(gastosJSONpath);

    } catch (error) {
        console.error('Error al cargar los ficheros JSON:', error);
    }
}

// Función para cargar un JSON desde una ruta específica
async function cargarJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Error al cargar el archivo JSON: ${path}`);
    }
    return await response.json();
}

// ------------------------------ 3. FUNCIONES ------------------------------
// Calcular gasto total por año al iniciar la aplicación
function calcularGastoTotal() {
    // array asociativo con clave=año y valor=gasto total
    let aniosArray = {
        2010: 0,
        2011: 0,
        2012: 0,
        2013: 0,
        2014: 0,
        2015: 0,
        2016: 0,
        2017: 0,
        2018: 0,
        2019: 0,
        2020: 0
    };
    gastosJSON.forEach(gasto => {
        const anio = new Date(gasto.date).getFullYear();

        if (anio>=2010 && anio <=2020) {
            aniosArray[anio] += gasto.precioViaje;
        }
    });

        // Mostrar los gastos totales en la interfaz
        mostrarGastosTotales(aniosArray);
}

function mostrarGastosTotales(aniosArray) {
    for (let anio in aniosArray) {
        document.getElementById(`gasto${anio}`).textContent = aniosArray[anio].toFixed(2);
    }
}

// guardar gasto introducido y actualizar datos
function guardarGasto(event) {
    event.preventDefault(); 

    // Obtener los datos del formulario
    const tipoVehiculo = document.getElementById('vehicle-type').value;
    const fecha = new Date(document.getElementById('date').value);
    const kilometros = Number(document.getElementById('kilometers').value);

     // Encontrar la tarifa correspondiente
     const anio = fecha.getFullYear();
     const tarifa = tarifasJSON.tarifas.find(t => t.anio === anio).vehiculos[tipoVehiculo];
     const precioViaje = tarifa * kilometros;


 
     // Crear el objeto GastoCombustible
     const nuevoGasto = new GastoCombustible(tipoVehiculo, fecha.toISOString(), kilometros, precioViaje);
     // Actualizar la interfaz del usuario
     mostrarGastoReciente(nuevoGasto);
     // Limpiar el formulario
     document.getElementById('fuel-form').reset(); 
}

// Función para visualizar datos recientes
function mostrarGastoReciente(gasto) {
     document.getElementById('expense-list').innerHTML+=`<li>${gasto.convertToJSON()}</li>`
     actualizarGastosTotales(gasto);

}

// Función para actualizar los gastos totales
function actualizarGastosTotales(gasto) {
    // Se agregan nuevos datos
    gastosJSON.push(gasto);

    // Actualizar el contenido del HTML
    calcularGastoTotal()
}

