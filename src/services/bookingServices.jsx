import axios from "axios";

//obtenemos el token que se guarda en el sessionstorage
const token = sessionStorage.getItem('token_bookings')

const getBookings = async () => {
    try{

        const response = await axios.get("https://apibookingsaccomodations-production.up.railway.app/api/V1/bookings", {
            headers: {
                //agregamos el token para la autorizacion
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    }catch(error){
        console.error("Error al obtener los alojamientos", error);
    }
}

   // Método para actualizar un alojamiento en la API
   const updateAccomodation = async (id, updateData) => {
    try {
        const response = await axios.put(`https://apibookingsaccomodations-production.up.railway.app/api/V1/bookings/${id}`, 
            updateData, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al actualizar la reservación", error);
        throw error;
    }
};

export { getBookings,updateAccomodation }