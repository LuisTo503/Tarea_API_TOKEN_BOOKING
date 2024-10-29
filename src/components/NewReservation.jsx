// src/components/NewReservation.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { createReservation } from '../services/api';

const NewReservation = ({ onReservationCreated }) => {
    const [guestName, setGuestName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newReservation = {
            guestName,
            startDate,
            endDate,
        };
        await createReservation(newReservation);
        onReservationCreated();
    };

    return (
        <div>
            <h2>Nueva Reservación</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nombre del Huésped"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                />
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <button type="submit">Guardar</button>
            </form>
        </div>
    );
};

export default NewReservation;
