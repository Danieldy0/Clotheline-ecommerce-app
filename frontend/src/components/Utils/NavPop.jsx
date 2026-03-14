import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'

function NavPop() {
  return (
    <Popover className="relative">
      <PopoverButton className="hover:text-gray-400">Shop</PopoverButton>
      <PopoverPanel anchor="bottom" className="flex rounded-md border border-gray-200 p-5 bg-gray-800 text-white gap-15 shadow-xl z-[9999]">
        <div className='flex-col'>
          <h2 className='cursor-pointer font-bold'>Clothes</h2>
          <br />
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
        <div>
          <h2 className='cursor-pointer font-bold'>Sample</h2>
        </div>
      </PopoverPanel>
    </Popover>
  )
}

export default NavPop