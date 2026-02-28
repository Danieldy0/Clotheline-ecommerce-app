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
    <div className='flex'>
      <form onSubmit={handleSubmit}>
        <Fieldset className="space-y-8 p-6 rounded-xl md:rounded-tr-none md:rounded-br-none border border-gray-200/80 bg-white/40 backdrop-blur-md shadow-xl box-border">
          <Legend className="text-lg font-bold">User details</Legend>
          <Field>
            <Label className="block">First name</Label>
            <Input
              className="mt-1 block bg-gray-400 rounded-full px-3 py-1.5 text-sm w-full"
              name="firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </Field>
          <Field>
            <Label className="block">Last name</Label>
            <Input
              className="mt-1 block bg-gray-400 rounded-full px-3 py-1.5 text-sm w-full"
              name="lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </Field>
          <button
            type="submit"
            className="mt-4 rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            Sign Up
          </button>
          {status && <p className="mt-2 text-sm text-gray-700">{status}</p>}
        </Fieldset>
      </form>
      <img src={bgImage} alt="" className='w-[450px] object-cover md:rounded-tr-2xl md:rounded-br-2xl md:block hidden' />
    </div>
  )
}

export default Form