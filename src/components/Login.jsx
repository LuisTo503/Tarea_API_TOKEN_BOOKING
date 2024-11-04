import React from 'react'
import { useForm } from 'react-hook-form'
import { login } from '../services/loginServices';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    //entrada de datos del formulario
    const { register, handleSubmit } = useForm()

    const navigate = useNavigate()

    //metodo para validar el usuario
    const loginForm = async (data) => {
        console.log(data); //{email, password}
        const response = await login(data);
        //validando la respuesta del login
        if(response?.token){
            //si esta autorizada, guardamos el token en el sessionstorage
            sessionStorage.setItem('token_bookings', response.token)
        }
        //redireccione a los alojamientos
        navigate('/alojamientos')
        console.log(response);
        
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center mb-6">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit(loginForm)}>
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo</label>
                <input 
                    type="email" 
                    {...register('email')} 
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Ingresa tu correo"
                />
            </div>
            <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input 
                    type="password" 
                    {...register('password')} 
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Ingresa tu contraseña"
                />
            </div>
            <div>
                <button 
                    type='submit' 
                    className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
                >
                    Iniciar sesión
                </button>
            </div>
        </form>
    </div>
</div>

    )
}
