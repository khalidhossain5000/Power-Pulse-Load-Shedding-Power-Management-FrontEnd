"use client";

import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/layout/shared/modeToggle/ModeToggle";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/assets/svg/Logo";
import { useGetMe, useLogout } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Menu } from "lucide-react";
import { useState } from "react";
import MobileNav from "./MobileNav";

const NavBar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data, isPending } = useGetMe();

  const user = data?.data;



  const isLoggedIn = !!user;
  const router = useRouter();
  const routes = [
    { name: "Home", url: "/", protected: false },

    { name: "Zones", url: "/zones", protected: false },
    { name: "Load Shedding Schedule", url: "/load-shedding-schedule", protected: false },
    { name: "Planned Outage", url: "/planned-outage", protected: false },
    // { name: "Outages", url: "/unexpected-outage", protected: true },
    { name: "About us", url: "/about-us", protected: false },
    { name: "Dashboard", url: `/${data?.data?.role.toLowerCase()}/dashboard`, protected: true },
  ];
  const visibleRoutes = routes.filter(
    (route) => !route.protected || isLoggedIn
  );
  const { mutate: logout } = useLogout();

  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Log out success");
        queryClient.removeQueries({
          queryKey: ["user"],
        });
        router.push("/login");
      },
      onError: () => {
        toast.error("Log out failed");
      },
    });
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 rounded-full border border-border/70 bg-muted/40 p-1.5 xl:flex">
            {visibleRoutes.map((route) => {
              const isActive = pathname === route.url;

              return (
                <Link
                  key={route.url}
                  href={route.url}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-background hover:text-foreground dark:hover:bg-card"
                  }`}
                >
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary-foreground/90" />
                  )}
                  {route.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* Desktop auth buttons ==- */}
            <div className="hidden items-center gap-3 xl:flex">
              {isPending ? (
                <span className="animate-pulse px-3 text-sm font-medium text-muted-foreground">
                  Checking authentication...
                </span>
              ) : data ? (
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="cursor-pointer rounded-full border-border px-5 font-manrope text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted"
                >
                  Logout
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    nativeButton={false}
                    className="rounded-full border-border bg-background/70 px-5 font-manrope text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted dark:border-cyan-200 dark:bg-input/30 dark:hover:bg-input/50"
                    render={
                      <Link href="/login" className="flex items-center">
                        Login
                      </Link>
                    }
                  >
                    Login
                  </Button>
                  <Button
                    variant="secondary"
                    className="rounded-full border-border px-5 font-manrope text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted dark:border-cyan-200 dark:bg-input/30 dark:hover:bg-input/50"
                    render={
                      <Link href="/select-role" className="flex items-center">
                        Register
                      </Link>
                    }
                    nativeButton={false}
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>

            <ModeToggle />

            {/* Hamburger  */}
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
              className="cursor-pointer rounded-full xl:hidden"
            >
              <Menu className="size-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <MobileNav
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        routes={visibleRoutes}
        pathname={pathname}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
    </>
  );
};

export default NavBar;