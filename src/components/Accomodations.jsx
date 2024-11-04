import React, { useEffect, useState } from 'react';
import { getAccomodations, updateAccomodation } from '../services/accomodationServices';
import Swal from 'sweetalert2';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useForm } from 'react-hook-form';
import axios from 'axios';

export default function Accomodations() {
    const [accomodations, setAccomodations] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
    const { register, handleSubmit } = useForm(); // Hooks de React Hook Form

    const fetchData = async () => {
        const response = await getAccomodations();
        setAccomodations(response);
    };

    // Guarda una nueva acomodación
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
                fetchData(); // Refresca la lista de alojamientos
                setIsModalOpen(false); // Cierra el modal
            }
        } catch (error) {
            console.error("Error al guardar el alojamiento:", error.response?.data || error.message);
            if (error.response?.data?.errors) {
                console.log("Errores de validación:", error.response.data.errors);
            }
        }
    };

    const editar = async (id, initialData) => {
        const { value: formValues } = await Swal.fire({
            title: 'Editar Alojamiento',
            html:
                `Nombre:<input id="name" class="swal2-input" placeholder="Nombre" value="${initialData.name}">` +
                `Direccion:<input id="address" class="swal2-input" placeholder="Dirección" value="${initialData.address}">` +
                `Descripcion:<input id="description" class="swal2-input" placeholder="Descripción" value="${initialData.description}">`,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    name: document.getElementById('name').value,
                    address: document.getElementById('address').value,
                    description: document.getElementById('description').value
                };
            }
        });

        if (formValues) {
            try {
                await updateAccomodation(id, formValues);
                Swal.fire('Actualizado', 'El alojamiento ha sido actualizado exitosamente', 'success');
                fetchData();
            } catch (error) {
                Swal.fire('Error', 'Hubo un problema al actualizar el alojamiento', 'error');
                console.error("Error en la actualización", error);
            }
        }
    };

    useEffect(() => {
        const session_token = sessionStorage.getItem('token_bookings');
        if (session_token) {
            setIsAuthenticated(true);
            fetchData();
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    return (
        <div className="flex h-screen bg-gray-800 overflow-hidden">
            {/* Sidebar */}
            <aside className={`w-64 bg-gray-800 text-white flex flex-col fixed inset-y-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}>
                <div className="text-lg font-semibold text-center py-4 border-b border-gray-700">Panel de Control</div>
                <nav className="flex flex-col p-4 space-y-4">
                    <a href="#alojamientos" className="flex items-center text-gray-200 hover:bg-gray-700 p-2 rounded">
                        <i className="fas fa-home mr-2"></i> Alojamientos
                    </a>
                    <a href="#reservaciones" className="flex items-center text-gray-200 hover:bg-gray-700 p-2 rounded">
                        <i className="fas fa-calendar-alt mr-2"></i> Reservaciones
                    </a>
                    <button className="mt-auto flex items-center text-gray-200 hover:bg-gray-700 p-2 rounded">
                        <i className="fas fa-sign-out-alt mr-2"></i> Cerrar Sesión
                    </button>
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 bg-gray-100 overflow-y-auto">
                {/* Barra superior */}
                <div className="flex justify-between items-center p-4 bg-gray-200 border-b border-gray-300">
                    <h1 className="text-2xl font-bold">Alojamientos</h1>
                    <button 
                        className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 hidden md:block"
                        onClick={() => setIsModalOpen(true)}> {/* Mostrar el modal */}
                        <i className="fas fa-plus mr-2"></i> Nuevo Alojamiento
                    </button>
                </div>

                {/* Lista de Alojamientos */}
                {isAuthenticated ? (
                    <div className="p-4">
                        <div className="space-y-4">
                            {accomodations.map((item) => (
                                <div key={item.id} className="flex text-left justify-between p-4 bg-white rounded-lg shadow-md">
                                    <div className="flex flex-col space-y-1">
                                        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                        <p className="text-sm text-gray-600"><i className="fas fa-map-marker-alt mr-2"></i>{item.address}</p>
                                        <p className="text-sm text-gray-600"><i className="fas fa-info-circle mr-2"></i>{item.description}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button 
                                            className="text-blue-500 hover:text-blue-700" 
                                            onClick={() => editar(item.id, { name: item.name, address: item.address, description: item.description })}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button 
                                            className="text-red-500 hover:text-red-700" 
                                            onClick={() => eliminar(item.id)}>
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <h2 className="text-center text-xl font-semibold text-gray-700">No estás autorizado, inicia sesión</h2>
                )}
            </main>

            {/* Modal para guardar un alojamiento */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', background: 'white', color: 'black' }}>
                        <h1 style={{ textAlign: 'center' }}>Guardar un Alojamiento</h1>
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
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)} // Cerrar el modal
                                style={{ width: '100%', padding: '10px', backgroundColor: '#002bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
                                Cancelar
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
