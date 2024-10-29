import React, { useState } from 'react';

const Reservation = ({ accommodation, onReserve }) => {
    const [guestName, setGuestName] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');

    const handleReserve = (e) => {
        e.preventDefault();
        const reservationDetails = {
            accommodationId: accommodation.id, // Suponiendo que cada alojamiento tiene un ID
            guestName,
            checkInDate,
            checkOutDate,
        };
        onReserve(reservationDetails);
        setGuestName('');
        setCheckInDate('');
        setCheckOutDate('');
    };

    return (
        <div>
            <h2>Reserve: {accommodation.name}</h2>
            <form onSubmit={handleReserve}>
                <div>
                    <label>Guest Name:</label>
                    <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Check-In Date:</label>
                    <input
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Check-Out Date:</label>
                    <input
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Reserve Now</button>
            </form>
        </div>
    );
};

export default Reservation;
