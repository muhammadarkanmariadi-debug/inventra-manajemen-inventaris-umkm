import React from 'react'
import Link from 'next/link'

import {
  HomeIcon,
  BoxIcon,
  UserIcon,
  Wallet,
  Tag,
  ChartArea,
  Settings,
  Users,
  Calculator,
  BarChart3,
  Package,
  Box
} from 'lucide-react'
import Image from 'next/image'

const Navbar = () => {
  const menu = {
    dashboard: [
      {
        icon: HomeIcon,
        label: 'Dashboard',
        href: '/'
      }
    ],

    inventory: [
      {
        icon: <BoxIcon />,
        label: 'Products',
        href: '/inventory/products'
      },
      {
        icon: <Tag />,
        label: 'Categories',
        href: '/inventory/categories'
      },
      {
        icon: <Package />,
        label: 'Stock Transactions',
        href: '/inventory/stock'
      }
    ],

    sales: [
      {
        icon: Wallet,
        label: 'Sales',
        href: '/sales'
      }
    ],

    finance: [
      {
        icon: <BarChart3 />,
        label: 'Finance',
        href: '/finance'
      }
    ],

    hpp: [
      {
        icon: Calculator,
        label: 'HPP',
        href: '/hpp'
      }
    ],

    userManagement: [
      {
        icon: Users,
        label: 'Users',
        href: '/users'
      }
    ],

    settings: [
      {
        icon: Settings,
        label: 'Settings',
        href: '/settings'
      }
    ]
  }

  return (
    <div className='shadow-lg px-4 py-11 w-80'>
      <div className='flex flex-col justify-between px-10'>
        <div className='flex items-center gap-5'>
          <Image
            src={'/assets/images/logo.png'}
            alt='Logo'
            width={40}
            height={40}
          />
          <div>
            <div className='font-semibold text-xl'>Inventra</div>
            <div className='font-small text-sm'>Your UMKM Solution</div>
          </div>
        </div>
        <div className='flex flex-col mt-10 font-semibold text-xl'>
          Inventory
          {menu.inventory.map((item, index) => (
            <Link
              className='flex items-center gap-3 bg-white hover:bg-[#4FD1C5] shadow-lg mt-10 p-3 rounded-xl font-semibold text-gray-400 hover:text-white text-sm transition-all'
              href={item.href}
              key={index}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
        <div className='flex flex-col mt-10 font-semibold text-xl'>
          Finance
          {menu.finance.map((item, index) => (
            <Link
              className='flex items-center gap-3 bg-white hover:bg-[#4FD1C5] shadow-lg mt-10 p-3 rounded-xl font-semibold text-gray-400 hover:text-white text-sm transition-all'
              href={item.href}
              key={index}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Navbar
