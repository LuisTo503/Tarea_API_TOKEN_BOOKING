import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { login } from '../services/loginServices';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const loginForm = async (data) => {
        try {
            const response = await login(data);
            if (response?.token) {
                sessionStorage.setItem('token_bookings', response.token);
                Swal.fire({
                    title: 'Éxito!',
                    text: 'Inicio de sesión exitoso.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
                navigate('/alojamientos');
            } else {
                throw new Error('Credenciales inválidas');
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Ocurrió un error durante el inicio de sesión.',
                icon: 'error',
                confirmButtonText: 'Intenta de nuevo'
            });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100" style={{ backgroundImage: `url('https://res.cloudinary.com/dtbvpnqln/image/upload/v1730689640/couple-sitting-large-swing-bali_p6oytg.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="bg-white p-6 rounded shadow-md w-80 bg-opacity-80">
                <h1 className="text-2xl font-bold mb-6 text-center">Bienvenidos al Booking del Grupo #1</h1>
                <form onSubmit={handleSubmit(loginForm)}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo</label>
                        <input
                            type="email"
                            {...register('email', { required: 'El correo es obligatorio' })}
                            className={`mt-1 p-2 border rounded w-full ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            {...register('password', { required: 'La contraseña es obligatoria' })}
                            className={`mt-1 p-2 border rounded w-full ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>
                    <div>
                        <button type='submit' className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Iniciar sesión</button>
                    </div>
                </form>
            </div>
        </div>
    );
}