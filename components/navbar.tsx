"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/compat/router";
import Cookies from "js-cookie";

import withAuth from "./withAuth";
import { getTokenData } from "@/app/Clients/clientHooks/hook";

export const AcmeLogo = () => {
  return (
    <img src="https://cdn4.iconfinder.com/data/icons/airport-elements-1/64/CAR_HIRE-Hire-car-rent-travel-512.png" className="w-8 h-8 mr-8" alt="" />
  );
};

const NavBarComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get(process.env.NEXT_PUBLIC_AUTH_KEY || "f34bdb07-355f-477d-92d8-78041ac31f57"));
  const menuItems = ["Clients", "Catalog"];
  const token = Cookies.get(process.env.NEXT_PUBLIC_AUTH_KEY || "f34bdb07-355f-477d-92d8-78041ac31f57");

  const router = useRouter(); // may be null or a NextRouter instance

  useEffect(() => {
    if (router && !router.isReady) { return; }
  }, [router]);

  useEffect(() => {
    if (token) { return; }
  }, [token]);

  const handleLogout = () => {
    Cookies.remove(process.env.NEXT_PUBLIC_AUTH_KEY || "f34bdb07-355f-477d-92d8-78041ac31f57");
    setIsAuthenticated(false);
    window.location.href = "/LogIn";
  };

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <AcmeLogo />
          <p className="font-bold text-inherit">Rent a Car</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {isAuthenticated && getTokenData()?.role == "ADMIN" && (
          <NavbarItem>
            <Link color="foreground" href="/Clients">
              Clients
            </Link>
          </NavbarItem>
        )}

        {isAuthenticated && (
          <NavbarItem>
            <Link color="foreground" href="/Catalog">
              Catalog
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent justify="end">
        {isAuthenticated ? (
          <NavbarItem>
            <Link color="danger" type="button" onPress={handleLogout}>
              Log Out
            </Link>
          </NavbarItem>
        ) : (
          <NavbarItem>
            <Link color="foreground" href="/LogIn">
              Log In
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              as={Button}
              className="w-full"
              color="foreground"
              href={`/${item}`}
              size="lg"
              onPress={() => setIsMenuOpen(!isMenuOpen)}
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default withAuth(NavBarComponent);
