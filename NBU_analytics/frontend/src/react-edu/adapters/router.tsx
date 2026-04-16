import React from 'react';

/**
 * Bridge between React components and Vue Router.
 * Vue wrapper pages set window.__VUE_ROUTER_PUSH__ to Vue Router's push function.
 */

declare global {
  interface Window {
    __VUE_ROUTER_PUSH__?: (path: string) => void;
  }
}

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  prefetch?: boolean;
  [key: string]: unknown;
}

export default function Link({ href, children, className, style, prefetch, ...rest }: LinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (window.__VUE_ROUTER_PUSH__) {
      window.__VUE_ROUTER_PUSH__(href);
    } else {
      window.location.href = href;
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className} style={style} {...rest}>
      {children}
    </a>
  );
}

export function useRouter() {
  return {
    push(path: string) {
      if (window.__VUE_ROUTER_PUSH__) {
        window.__VUE_ROUTER_PUSH__(path);
      } else {
        window.location.href = path;
      }
    },
    back() {
      window.history.back();
    },
    replace(path: string) {
      if (window.__VUE_ROUTER_PUSH__) {
        window.__VUE_ROUTER_PUSH__(path);
      } else {
        window.location.replace(path);
      }
    },
    refresh() {
      window.location.reload();
    },
  };
}

export function usePathname() {
  return window.location.pathname;
}

export function useSearchParams() {
  const params = new URLSearchParams(window.location.search);
  return [params] as const;
}
