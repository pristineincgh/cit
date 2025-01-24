'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NavLinks = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path
      ? 'font-semibold text-primary'
      : 'text-muted-foreground hover:text-foreground transition-colors duration-300 ease-in-out';
  };

  const basePath = pathname.startsWith('/admin') ? '/admin' : '/agent';

  const isAdmin = basePath === '/admin';

  return (
    <ul className="flex items-center gap-4">
      <li>
        <Link href={`${basePath}`} className={isActive(basePath)}>
          Overview
        </Link>
      </li>
      <li>
        <Link
          href={`${basePath}/tickets`}
          className={isActive(`${basePath}/tickets`)}
        >
          {isAdmin ? 'Tickets' : 'My Tickets'}
        </Link>
      </li>
      <li>
        <Link
          href={`${basePath}/customers`}
          className={isActive(`${basePath}/customers`)}
        >
          Customers
        </Link>
      </li>
      {isAdmin && (
        <li>
          <Link
            href={`${basePath}/agents`}
            className={isActive(`${basePath}/agents`)}
          >
            Agents
          </Link>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
