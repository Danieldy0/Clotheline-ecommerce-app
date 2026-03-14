import React from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

function LogDialog({ open = true, onClose, userName, variant = 'login' }) {
  const isLogout = variant === 'logout'
  const title = isLogout ? 'Logged out' : 'Logged in successfully'
  const message = isLogout
    ? 'You have been logged out.'
    : userName ? `Welcome back, ${userName}.` : null

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 flex w-screen items-start justify-end p-4 bg-black/30">
        <DialogPanel className="max-w-lg space-y-4 rounded-lg border bg-white p-8 shadow-xl">
          <DialogTitle className="text-lg font-semibold">
            {title}
          </DialogTitle>
          {message && (
            <p className="text-gray-600">{message}</p>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
          >
            OK
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default LogDialog