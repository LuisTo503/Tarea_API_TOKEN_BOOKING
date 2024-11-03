// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import { getBookings } from '../services/bookingServices'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css"
import dayjs from 'dayjs'

export default function Bookings() {
    const [bookings, setBookings] = useState([])
    //estado para verificar si el usuario esta autenticado
    const [isAuthenticated, setIsAuthenticated] = useState(false)
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
        switch (event.status) {
            case 'CONFIRMED':
                backgroundColor = '#dbebff';
                color = '#3555b9';
                break;
            case 'CANCELLED':
                backgroundColor = '#fee3e3';
                color = '#a63535';
                break;
            default:
                backgroundColor = 'gray';
        }
        return { style: { backgroundColor, color } };
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

    }, [])

    return (
        <div>
            {/** validamos si la persona esta autenticada */}
            {
                isAuthenticated ? (
                    <>
                        <h1>Lista de Reservaciones</h1>
                        <div style={{
                            height: "95vh",
                            width: "70vw"
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
        </div>
    )
}
