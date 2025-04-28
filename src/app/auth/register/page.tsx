'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';

const Register: React.FC = () => {
  const router = useRouter();
  const [state, setState] = useState({ name: '', password: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.id]: event.target.value });
  }

  const registerHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(state),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Registration failed');
        return;
      }

      setIsLoading(false);
      // Registration successful
      // router.push('/auth/login'); // Redirect to login page
      toast.success('Registration successful'); 
    } catch (err) {
      setIsLoading(false);
      toast.error('Registration failed'); 
    }
  }

  return (
    <div className="login-container flex w-[100%] h-[80vh] justify-center items-center">
      <div className="login-form bg-white w-[350px] h-[400px] rounded-xl shadow-md">
        <h2 className='text-2xl font-bold text-center p-4'>Sign up</h2>
       
        <form className='flex flex-col gap-6 justify-center items-center p-4' onSubmit={registerHandler}>
          <div className='w-[100%]'>
            <input 
              type="text" 
              id="name" 
              value={state.name} 
              onChange={changeHandler} 
              className='border-2 border-gray-300 rounded-md p-2 w-[100%]' 
              placeholder='Name' 
            />
          </div>
          <div className='w-[100%]'>
            <input 
              type="email" 
              id="email" 
              value={state.email} 
              onChange={changeHandler} 
              className='border-2 border-gray-300 rounded-md p-2 w-[100%]' 
              placeholder='Email' 
            />
          </div>
          <div className='w-[100%]'>
            <input 
              type="password" 
              id="password" 
              value={state.password} 
              onChange={changeHandler} 
              className='border-2 border-gray-300 rounded-md p-2 w-[100%]' 
              placeholder='Password' 
            />
          </div>
          <div>
            <button  disabled={isLoading || state.name=='' || state.email=='' || state.password==''}
              type="submit" 
              className={` ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}  border-2 border-gray-300 rounded-md p-2 cursor-pointer bg-indigo-600 text-white`}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>

          
          </div>
          <div>
          <p className='text-center text-sm text-gray-500'> Already Registered? <Link href='/auth/login'>Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
