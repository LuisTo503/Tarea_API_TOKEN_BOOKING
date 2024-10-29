import React, { useState } from 'react';

const NewAccommodation = ({ onAdd }) => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newAccommodation = {
            name,
            location,
            price,
        };
        onAdd(newAccommodation);
        setName('');
        setLocation('');
        setPrice('');
    };

    return (
        <div>
            <h2>Add New Accommodation</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Location:</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Price:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Add Accommodation</button>
            </form>
        </div>
    );
};

export default NewAccommodation;
