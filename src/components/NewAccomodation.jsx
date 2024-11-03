import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';

export default function NewAccommodation() {
    const { register, handleSubmit } = useForm();

    const saveAccommodation = async (data) => {
        const token = sessionStorage.getItem('token_bookings');
        try {
            const response = await axios.post(
                "https://apibookingsaccomodations-production.up.railway.app/api/V1/accomodation",
                {
                    name: data.nombre,
                    description: data.descripcion,
                    address: data.direccion
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.status === 201) {
                console.log("Alojamiento guardado exitosamente!");
            }
        } catch (error) {
            console.error("Error al guardar el alojamiento:", error.response?.data || error.message);
            if (error.response?.data?.errors) {
                console.log("Errores de validación:", error.response.data.errors);
            }
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' , background:'white', color:'black'}}>
            <h1 style={{ textAlign: 'center' }}>Guardar un Alojamiento!!</h1>
            <form onSubmit={handleSubmit(saveAccommodation)}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="nombre">Nombre: </label>
                    <input
                        type="text"
                        placeholder="Favor ingresar el Nombre"
                        {...register('nombre', { required: true })}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="descripcion">Descripción: </label>
                    <textarea
                        placeholder="Favor ingresar una breve descripción"
                        {...register('descripcion', { required: true })}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="direccion">Dirección del lugar: </label>
                    <input
                        type="text"
                        placeholder="Favor ingresar la dirección del lugar"
                        {...register('direccion', { required: true })}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
                    Guardar
                </button>
            </form>
        </div>
    );
}
