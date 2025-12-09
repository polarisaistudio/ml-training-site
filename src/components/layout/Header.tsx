import Link from "next/link";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              ML Interview Prep
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/questions"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Questions
            </Link>
            <Link
              href="/roadmap"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Roadmap
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
