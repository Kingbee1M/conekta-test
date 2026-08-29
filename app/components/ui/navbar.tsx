'use client'
import Image from "next/image"
import logo from '../../../public/svg/logo-enhanced.svg'
import Link from "next/link"
import { IoMdMenu, IoMdClose } from "react-icons/io"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { IoIosNotificationsOutline } from "react-icons/io"
import { MdPersonOutline } from "react-icons/md"
import { useGetUnreadCountQuery } from "@/shared/service/notification.socket"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Consumes RTK Query endpoint; automatically refetched when WS invalidates 'UnreadCount' tag
  const { data: unreadData } = useGetUnreadCountQuery()
  const hasUnread = (unreadData?.count ?? 0) > 0

  const navs = [
    { title: 'Discover', link: '/discover' },
    { title: 'Finance', link: '/find-artisan' },
    { title: 'Manage', link: '/housing-hub' },
    { title: 'Impact', link: '/housing-hub' },
    { title: 'Invest', link: '/housing-hub' },
  ]

  return (
    <header className="fixed top-3 inset-x-0 z-50 flex justify-center px-4">
      <nav
        className={`
          w-full max-w-6xl border-primary-green border
          bg-slate-100/80 backdrop-blur-md
          rounded-2xl lg:rounded-full
          p-1.5 lg:px-4 lg:py-1.5
          flex flex-col lg:flex-row lg:items-center lg:justify-between
          transition-all duration-300 ease-in-out shadow-sm
          ${isOpen ? 'max-h-96' : 'max-h-12 lg:max-h-14'}
          overflow-hidden
        `}
      >
        {/* Brand / Logo */}
        <div className="flex justify-between items-center w-full lg:w-auto">
          <Link href="/home" className="flex items-center gap-2 pl-2">
            <Image
              src={logo}
              alt="logo"
              width={22}
              height={22}
              className="w-auto h-5"
              priority
            />
            Conekta
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="lg:hidden p-1 text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
          >
            {isOpen ? <IoMdClose className="text-lg" /> : <IoMdMenu className="text-lg" />}
          </button>
        </div>

        {/* Navigation Items + Actions pushed to the right */}
        <div
          className={`
            ${isOpen ? 'flex mt-3 flex-col gap-3' : 'hidden lg:flex lg:flex-row lg:items-center lg:ml-auto lg:gap-3'}
            transition-all duration-300
          `}
        >
          {/* Navigation Pill Capsule */}
          <ul className="flex flex-col lg:flex-row items-center bg-slate-200/60 rounded-xl lg:rounded-full p-1 gap-0.5 w-full lg:w-auto">
            {navs.map((nav, index) => {
              const isActive = pathname === nav.link
              return (
                <li key={index} className="w-full lg:w-auto">
                  <Link
                    href={nav.link}
                    className={`
                      block text-center px-3.5 py-1 text-[11px] font-medium rounded-lg lg:rounded-full transition-all duration-200
                      ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-xs border-slate-200 border'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }
                    `}
                  >
                    {nav.title}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Action Icons */}
          <div
            className={`
              flex items-center justify-center gap-1.5
              ${isOpen ? 'pt-2 border-t border-slate-200' : ''}
            `}
          >
            <Link
              href="/notification"
              className="relative p-1.5 bg-slate-200/60 hover:bg-slate-200 text-slate-700 rounded-full transition-colors shadow-xs"
            >
              {/* Render dot conditionally when unread notifications count > 0 */}
              {hasUnread && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#00AC72] ring-2 ring-white animate-pulse" />
              )}
              <IoIosNotificationsOutline className="text-base" />
            </Link>

            <Link
              href="/profile"
              className="p-1.5 bg-slate-200/60 hover:bg-slate-200 text-slate-700 rounded-full transition-colors shadow-xs"
            >
              <MdPersonOutline className="text-base" />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}