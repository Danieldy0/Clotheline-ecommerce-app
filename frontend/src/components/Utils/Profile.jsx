import React, { useEffect, useState, Fragment } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Dialog, Transition, TransitionChild, DialogPanel, DialogTitle } from '@headlessui/react'
import { UserIcon } from '@heroicons/react/24/solid'
import { ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import { UserPlusIcon } from '@heroicons/react/24/outline'
import LogDialog from './LogDialog'

function Profile({ scrolled }) {
  const [user, setUser] = useState(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('currentUser')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        setUser(null)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    setUser(null)
    setShowLogoutModal(true)
  }

  const closeLogoutModal = () => setShowLogoutModal(false)

  return (
    <>
      <Menu>
        <MenuButton
          className={`rounded-full border-2 p-2 transition-colors duration-300 ${scrolled ? 'border-black/60 dark:border-white/60 text-white dark:text-white' : 'border-black/60 dark:border-white/60 text-white dark:text-white'
            }`}
        >
          <UserIcon className="w-6 h-6 text-black dark:text-white" />
        </MenuButton>
        <MenuItems
          anchor="bottom"
          className="rounded-md border border-gray-200 p-2 bg-gray-800 text-white shadow-xl z-[9999]"
        >
          {user ? (
            <>
              <MenuItem>
                <div className="block px-2 py-1 font-bold">
                  {user.firstname} {user.lastname}
                </div>
              </MenuItem>
              <br />
              <MenuItem>
                <button
                  type="button"
                  onClick={() => setCartOpen(true)}
                  className="block w-full text-left px-2 py-1 hover:bg-gray-700 rounded transition-colors justify-between flex items-center"
                >
                  Cart
                  <ShoppingCartIcon className="w-6 h-6 text-white" />
                </button>
              </MenuItem>
              <MenuItem>
                <a href='#' className="block w-full text-left px-2 py-1 hover:bg-gray-700 rounded transition-colors justify-between flex">
                  Settings
                  <Cog6ToothIcon className="w-6 h-6 text-white" />
                </a>
              </MenuItem>
              <hr className="my-2 border-gray-700" />
              <MenuItem>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full text-left px-2 py-1 hover:bg-gray-700 rounded transition-colors justify-between flex"
                >
                  Log out
                  <ArrowRightOnRectangleIcon className="w-6 h-6 text-white" />
                </button>
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem>
                <a href="/signup" className="block px-2 py-1 hover:bg-gray-700 rounded transition-colors justify-between flex">
                  Sign Up
                  <UserPlusIcon className="w-6 h-6 text-white" />
                </a>
              </MenuItem>
              <MenuItem>
                <a href="/signin" className="block px-2 py-1 hover:bg-gray-700 rounded transition-colors justify-between flex">
                  Sign In
                  <ArrowLeftOnRectangleIcon className="w-6 h-6 text-white" />
                </a>
              </MenuItem>
            </>
          )}
        </MenuItems>
      </Menu>
      {showLogoutModal && (
        <LogDialog
          open={showLogoutModal}
          onClose={closeLogoutModal}
          variant="logout"
        />
      )}

      {/* Cart slide-in sidebar using Portal-powered Dialog to escape parent blur */}
      <Transition show={cartOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={() => setCartOpen(false)}>
          <TransitionChild
            as={Fragment}
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 transition-opacity" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <TransitionChild
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300 sm:duration-500"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-300 sm:duration-500"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <DialogPanel className="pointer-events-auto w-72 max-w-[85vw]">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-black shadow-xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">Cart</DialogTitle>
                        <button
                          type="button"
                          onClick={() => setCartOpen(false)}
                          className="p-1 rounded hover:bg-gray-100 text-gray-600 transition-colors dark:hover:bg-gray-800 dark:text-white"
                          aria-label="Close cart"
                        >
                          <XMarkIcon className="w-6 h-6" />
                        </button>
                      </div>
                      <div className="relative mt-4 flex-1">
                        <p className="text-sm text-gray-500 dark:text-white">Your cart is empty.</p>
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default Profile