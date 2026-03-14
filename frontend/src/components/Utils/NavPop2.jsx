import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

function NavPop2() {
  return (
    <Disclosure>
      {({ open }) => (
        <>
            <DisclosureButton className="hover:text-gray-400 block text-left">
                <div className='flex justify-between'>
                    Shop
                    <ChevronDownIcon className={clsx('w-5', open && 'rotate-180')} />
                </div>
            </DisclosureButton>
            <DisclosurePanel className="flex-col rounded-md border-2 border-gray-300 p-2 bg-gray-700 text-white p-5 gap-15">
                <div className='flex-col'>
                    <h2 className='cursor-pointer font-bold'>Clothes</h2>
                    <br/>
                    <ul>
                        <li>
                            <a href="/" className='hover:underline underline-offset-5'>Top</a>
                        </li>
                        <li>
                            <a href="/" className='hover:underline underline-offset-5'>Pants</a>
                        </li>
                        <li>
                            <a href="/" className='hover:underline underline-offset-5'>Activewear</a>
                        </li>
                        <li>
                            <a href="/" className='hover:underline underline-offset-5'>Browse All</a>
                        </li>
                    </ul>
                </div>
                <br/>
                <div>
                    <h2 className='cursor-pointer font-bold'>Sample</h2>
                </div>
            </DisclosurePanel>
        </>
      )}
    </Disclosure>
  )
}

export default NavPop2