import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '../components/Login';
import Accomodations from '../components/Accomodations';
import ReservationsOverview from '../components/ReservationsOverview'; 
import Bookings from '../components/Reservations';
import NewAccommodation from '../components/NewAccomodation';

export default function Rutas() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/alojamientos' element={<Accomodations />} />
                <Route path='/reservaciones' element={<Bookings />} /> {/* Nueva ruta */}
                <Route path='/newalojamiento' element={<NewAccommodation/>}/>
            </Routes>
        </BrowserRouter>
    );
}


