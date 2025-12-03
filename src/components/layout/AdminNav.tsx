import Link from 'next/link';

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/questions', label: 'Questions' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/interview-logs', label: 'Interview Logs' },
];

export function AdminNav() {
  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-semibold">
              Admin Panel
            </Link>
            <div className="flex items-center gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-gray-700"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              View Site
            </Link>
            <form action="/admin/logout" method="POST">
              <button
                type="submit"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}
