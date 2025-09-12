import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primary"
      {...props}
    >
      <path d="M8.5 10.5c3.6-1 5.5-3.6 5.5-6.5" />
      <path d="M14 9.5c-3.2.5-5.5 3-5.5 6" />
      <path d="M19 14c-3.1 1-5.5 3.9-5.5 7" />
      <path d="M14 6.5c-3.5 0-5.5 2.5-5.5 5.5" />
      <path d="M5 5c3.5 0 5.5 2.5 5.5 5.5" />
      <path d="M12 12c3.5 0 5.5 2.5 5.5 5.5" />
    </svg>
  );
}
