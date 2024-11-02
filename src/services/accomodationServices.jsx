import axios from "axios";

//obtenemos el token que se guarda en el sessionstorage
const token = sessionStorage.getItem('token_bookings')

const getAccomodations = async () => {
    try{

        const response = await axios.get("https://apibookingsaccomodations-production.up.railway.app/api/V1/accomodations", {
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
        const response = await axios.put(`https://apibookingsaccomodations-production.up.railway.app/api/V1/accomodation/${id}`, 
            updateData, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el alojamiento", error);
        throw error;
    }
};

export { getAccomodations,updateAccomodation }