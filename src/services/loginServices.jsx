import axios from "axios";

//metodo para iniciar sesion
const login = async (user) => {
    try{
        //axios => es una libreria donde podemos hacer peticiones HTTP
        /**
         * Peticiones HTTP: GET, POST, PUT, DELETE, PATCH
         */
        const response = await axios.post("https://apibookingsaccomodations-production.up.railway.app/api/V1/login", user);
        return response.data;
    }catch(error){
        console.error("Error al autenticarse", error);
    }
}

const logout = () => {
    console.log("Has cerrado sesion");
}

// Función para cancelar una reservación
const cancelReservation = async (reservationId) => {
    const token = sessionStorage.getItem('token_bookings');
    try {
        const response = await axios.delete(`https://apibookingsaccomodations-production.up.railway.app/api/V1/reservations/${reservationId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error al cancelar la reservación", error);
        throw error;
    }
};


export { login, logout, cancelReservation }