// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import Login from './components/Login';
import AccommodationList from './components/AccommodationList';
import NewAccommodation from './components/NewAccommodation';
import Reservation from './components/Reservation';

const App = () => {
    const [accommodations, setAccommodations] = useState([]);
    const [selectedAccommodation, setSelectedAccommodation] = useState(null);

    const addAccommodation = (newAccommodation) => {
        setAccommodations([...accommodations, { ...newAccommodation, id: Date.now() }]);
    };

    const reserveAccommodation = (reservationDetails) => {
        console.log('Reservation Details:', reservationDetails);
        // Aquí puedes manejar la lógica de reservas
    };

    return (
        <div>
            <h1>Hotel Management</h1>
            <Login />
            <NewAccommodation onAdd={addAccommodation} />
            <AccommodationList accommodations={accommodations} onSelect={setSelectedAccommodation} />
            {selectedAccommodation && (
                <Reservation
                    accommodation={selectedAccommodation}
                    onReserve={reserveAccommodation}
                />
            )}
        </div>
    );
};

export default App;
