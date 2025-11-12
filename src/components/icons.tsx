import { type SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 21h20" />
      <path d="M6.34 16.34 12 10.69l5.66 5.65" />
      <path d="M12 10.69V3.5" />
      <path d="m20.69 11.02-3-1.01a1.99 1.99 0 0 0-2.37.64l-.65.86" />
      <path d="m3.31 11.02 3-1.01a1.99 1.99 0 0 1 2.37.64l.65.86" />
      <path d="M12 21v-8.31" />
    </svg>
  );
}
