import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            {item.href ? (
              <Link
                href={item.href}
                className="text-gray-600 hover:text-orange-600 hover:underline transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-orange-600 font-medium">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <span className="text-gray-400">›</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
