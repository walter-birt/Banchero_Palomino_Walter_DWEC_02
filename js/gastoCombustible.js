class GastoCombustible {
    constructor(vehicleType, date, kilometers, precioViaje) {
        this.vehicleType = vehicleType;
        this.date = date;
        this.kilometers = kilometers;
        this.precioViaje = precioViaje;
    }
    
    // Método para serializar el objeto a JSON
    convertToJSON() {
        return JSON.stringify({
            vehicleType: this.vehicleType,
            date: this.date,
            kilometers: this.kilometers,
            precioViaje: this.precioViaje
        });
    }
}

export default GastoCombustible;
