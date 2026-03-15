import React, { useState } from 'react'
import { Field, Fieldset, Input, Label, Legend } from '@headlessui/react'
import bgImage from '../../assets/signup-bg.jpg'

function Form() {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [status, setStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstname, lastname }),
      })

      if (!response.ok) {
        throw new Error('Failed to create user')
      }

      setStatus('User created successfully')
      setFirstname('')
      setLastname('')
    } catch (error) {
      console.error(error)
      setStatus('Error creating user')
    }
  }

  return (
    <div className='flex items-center justify-center w-full px-4'>
      <div className='flex flex-row-reverse items-stretch max-w-4xl w-full bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/30'>
        <form onSubmit={handleSubmit} className="flex-1">
          <Fieldset className="h-full space-y-6 p-8 md:p-12 box-border flex flex-col justify-center">
            <Legend className="text-2xl font-semibold tracking-tight text-black dark:text-white">User details</Legend>
            <Field>
              <Label className="block text-sm font-medium text-black/60 dark:text-white/60">First name</Label>
              <Input
                className="mt-2 block bg-white/50 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-base w-full focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                name="firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </Field>
            <Field>
              <Label className="block text-sm font-medium text-black/60 dark:text-white/60">Last name</Label>
              <Input
                className="mt-2 block bg-white/50 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-base w-full focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                name="lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </Field>
            <button
              type="submit"
              className="mt-6 rounded-xl bg-black dark:bg-white text-white dark:text-black px-6 py-3 font-semibold hover:opacity-90 transition-opacity active:scale-[0.98]"
            >
              Sign Up
            </button>
            {status && <p className="mt-4 text-sm font-medium text-black/70 dark:text-white/70">{status}</p>}
          </Fieldset>
        </form>
        <div className='hidden md:block w-1/2 relative'>
          <img src={bgImage} alt="" className='absolute inset-0 w-full h-full object-cover' />
          <div className='absolute inset-0 bg-black/10' />
        </div>
      </div>
    </div>
  )
}

export default Form