import React, { useEffect, useState } from 'react';
import { cancelReservation } from '../services/loginServices';

const ReservationsOverview = ({ reservations }) => {
    const [reservationList, setReservationList] = useState(reservations || []);

    const handleCancel = async (reservationId) => {
        try {
            await cancelReservation(reservationId);
            // Actualizar la lista para eliminar la reservación cancelada
            setReservationList((prevList) =>
                prevList.filter((reservation) => reservation.id !== reservationId)
            );
            alert("Reservación cancelada exitosamente.");
        } catch (error) {
            alert("Hubo un error al cancelar la reservación.");
        }
    };

    return (
        <div>
            <h2>Lista de Reservaciones</h2>
            <ul>
                {reservationList.map((reservation) => (
                    <li key={reservation.id}>
                        <p>Nombre del huésped: {reservation.guestName}</p>
                        <p>Fecha de Check-In: {reservation.checkInDate}</p>
                        <p>Fecha de Check-Out: {reservation.checkOutDate}</p>
                        <button onClick={() => handleCancel(reservation.id)}>Cancelar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReservationsOverview;
