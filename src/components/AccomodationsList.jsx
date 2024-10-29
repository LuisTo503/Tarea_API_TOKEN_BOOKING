// src/components/AccommodationList.jsx
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { fetchAccommodations, deleteAccommodation } from '../services/api';

const AccommodationList = () => {
    const [accommodations, setAccommodations] = useState([]);

    useEffect(() => {
        const loadAccommodations = async () => {
            const data = await fetchAccommodations();
            setAccommodations(data);
        };
        loadAccommodations();
    }, []);

    const handleDelete = async (id) => {
        await deleteAccommodation(id);
        setAccommodations(accommodations.filter(acc => acc.id !== id));
    };

    return (
        <div>
            <h2>Lista de Alojamiento</h2>
            <ul>
                {accommodations.map((acc) => (
                    <li key={acc.id}>
                        {acc.name} - {acc.address}
                        <button onClick={() => handleDelete(acc.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AccommodationList;
