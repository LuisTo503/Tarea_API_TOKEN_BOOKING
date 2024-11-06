// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import { getBookings } from '../services/bookingServices'
import { Link } from 'react-router-dom';
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs'
import axios from 'axios'

export default function Bookings() {
    const [bookings, setBookings] = useState([])
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    //estado para verificar si el usuario esta autenticado
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    //funciones para el manejo de popup
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { register, handleSubmit } = useForm();
    //inicializando calendario con formato dayJS
    const localizer = dayjsLocalizer(dayjs)

    //metodo para obtener la respuesta de la api
    const fetchData = async () => {
        const response = await getBookings() //si esto es un exito devolvera un arreglo de reservaciones
        setBookings(response);
    }

    //guardando las reservaciones
    const events = bookings.map((booking) => ({
        start: dayjs(booking.check_in_date).toDate(),
        end: dayjs(booking.check_out_date).toDate(),
        title: booking.accomodation,
        status: booking.status
    }));

    const eventPropGetter = (event) => {
        let backgroundColor = '';
        let color = '';
        let borderColor = '';
        switch (event.status) {
            case 'CONFIRMED':
                backgroundColor = '#dbebff';
                color = '#3555b9';
                borderColor = '#3555b9';
                break;
            case 'CANCELLED':
                backgroundColor = '#fee3e3';
                color = '#a63535';
                borderColor = '#a63535';
                break;
            default:
                backgroundColor = 'gray';
        }
        return { style: { backgroundColor, color, border: `1px solid ${borderColor}` } };
    };

    const saveBooking = async (data) => {
        const token = sessionStorage.getItem('token_bookings');
        try {
            const response = await axios.post(
                "https://apibookingsaccomodations-production.up.railway.app/api/V1/booking",
                {
                    booking: data.booking,
                    check_in_date: data.check_in_date,
                    check_out_date: data.check_out_date,
                    total_amount: data.total_amount,
                    accomodation_id: data.accomodation_id ,
                    user_id: data.user_id
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.status === 201) {
                fetchData();
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error("Error al guardar el alojamiento:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        //validamos si el token existe
        const session_token = sessionStorage.getItem('token_bookings');
        if (session_token) {
            setIsAuthenticated(true)
            //va poder visualizar los alojamientos
            fetchData()
        } else {
            setIsAuthenticated(false)
        }

    }, []);

    const handleOutsideClick = (event) => {
        if (isSidebarOpen && !event.target.closest('.sidebar')) {
            setIsSidebarOpen(false);
        }
    };

    const handelSelectEvent = (event) => {

    };

    const editar = async (id, initialData) => {
        const { value: formValues } = await Swal.fire({
            title: 'Editar Alojamiento',
            html:
                `Nombre:<input id="name" class="swal2-input" placeholder="Nombre" value="${initialData.name}">` +
                `Direccion:<input id="address" class="swal2-input" placeholder="Dirección" value="${initialData.address}">` +
                `Descripcion:<input id="description" class="swal2-input" placeholder="Descripción" value="${initialData.description}">`,
            focusConfirm: false,
            preConfirm: () => ({
                name: document.getElementById('name').value,
                address: document.getElementById('address').value,
                description: document.getElementById('description').value
            })
        });

        if (formValues) {
            try {
                await updateAccomodation(id, formValues);
                Swal.fire('Actualizado', 'El alojamiento ha sido actualizado exitosamente', 'success');
                fetchData();
            } catch (error) {
                Swal.fire('Error', 'Hubo un problema al actualizar el alojamiento', 'error');
            }
        }
    };

    return (
        <div
            className="flex h-screen bg-gray-800 overflow-hidden"
            onClick={handleOutsideClick}
        >
            {/* Sidebar */}
            <aside
                className={`sidebar w-64 bg-gray-800 text-white flex flex-col fixed inset-y-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-lg font-semibold text-center py-4 border-b border-gray-700">Panel de Control</div>
                <nav className="flex flex-col p-4 space-y-4">
                    <Link to="/alojamientos" className="flex items-center text-gray-200 hover:bg-gray-700 p-2 rounded">
                        <i className="fas fa-home mr-2"></i> Alojamientos
                    </Link>
                    
                    <Link to="/reservaciones" className="flex items-center text-gray-200 hover:bg-gray-700 p-2 rounded">
                        <i className="fas fa-calendar-alt mr-2"></i> Reservaciones
                    </Link>
                    
                    <button
                        className="mt-auto flex items-center text-gray-200 hover:bg-gray-700 p-2 rounded"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <i className="fas fa-sign-out-alt mr-2"></i> Cerrar Sidebar
                    </button>
                </nav>
            </aside>
            {/* Main content */}
            <main className="flex-1 bg-gray-100 overflow-y-auto">
                <div className="flex justify-between items-center p-4 bg-gray-200 border-b border-gray-300">
                    <h1 className="text-2xl font-bold">Reservación</h1>
                    <button
                        className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 md:hidden"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <i className="fas fa-bars"></i>
                    </button>
                    <button
                        className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 hidden md:block"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <i className="fas fa-plus mr-2"></i> Nueva Reservación
                    </button>
                </div>
            {/** validamos si la persona esta autenticada */}
            {
                isAuthenticated ? (
                    <>
                        <div style={{
                            height: "70vh",
                            width: "60vw"
                        }}>
                            <Calendar
                                localizer={localizer}
                                events={events}
                                eventPropGetter={eventPropGetter}
                            />
                        </div>
                        <div className="flex justify-start space-x-4 mb-4">
                            <div className="flex items-center space-x-2">
                                <span className="w-4 h-4 inline-block" style={{ backgroundColor: '#dbebff' }}></span>
                                <span>Confirmada</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="w-4 h-4 inline-block" style={{ backgroundColor: '#fef8c2' }}></span>
                                <span>Pendiente</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="w-4 h-4 inline-block" style={{ backgroundColor: '#fee3e3' }}></span>
                                <span>Cancelada</span>
                            </div>
                        </div>
                    </>
                ) : <h2>No estas autorizado, inicia sesion</h2>
            }
            {/* Modal para agregar nuevo alojamiento */}
            {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', background: 'white', color: 'black' }}>
                            <h1 style={{ textAlign: 'center' }}>Guardar una Reservación !</h1>
                            <form onSubmit={handleSubmit(saveBooking)}>
                                <div style={{ marginBottom: '15px' }}>
                                    <label htmlFor="booking">Booking: </label>
                                    <input
                                        type="text"
                                        placeholder="Ingresar clave de Booking"
                                        {...register('booking', { required: true })}
                                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <label htmlFor="check_in_date">Check In Date: </label>
                                    <input
                                        placeholder="Fecha de Ingreso"
                                        {...register('check_in_date', { required: true })}
                                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <label htmlFor="check_out_date">Check Out Date: </label>
                                    <input
                                        type="text"
                                        placeholder="Fecha de Salida"
                                        {...register('check_out_date', { required: true })}
                                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <label htmlFor="total_amount">Total Amount: </label>
                                    <input
                                        type="text"
                                        placeholder="Ingrese Costo Total"
                                        {...register('total_amount', { required: true })}
                                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <label htmlFor="accomodation_id">Accomodation ID: </label>
                                    <input
                                        type="text"
                                        placeholder="Ingrese Accomodation ID"
                                        {...register('accomodation_id', { required: true })}
                                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <label htmlFor="user_id">User ID: </label>
                                    <input
                                        type="text"
                                        placeholder="Ingrese ID de Usuario"
                                        {...register('user_id', { required: true })}
                                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    style={{ width: '45%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', marginBottom: '10px', marginRight: '10px'}}
                                >
                                    Guardar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    style={{ width: '45%', padding: '10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px' }}
                                >
                                    Cancelar
                                </button>
                            </form>
                        </div>
                    </div>
                )}

            </main>
        </div>
    )
}
