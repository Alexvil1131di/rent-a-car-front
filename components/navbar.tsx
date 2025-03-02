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
import withAuth from "./withAuth";

export const AcmeLogo = () => {
  return (
    <img src="https://cdn4.iconfinder.com/data/icons/airport-elements-1/64/CAR_HIRE-Hire-car-rent-travel-512.png" className="w-8 h-8 mr-8" alt="" />
  );
};

const NavBarComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuItems = ["Clients", "Catalog", "Reservations", "Users"];

  const router = useRouter(); // may be null or a NextRouter instance

  useEffect(() => {
    if (router && !router.isReady) {
      return;
    }
  }, [router]);

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
        <NavbarItem >
          <Link color="foreground" href="/Clients">
            Clients
          </Link>
        </NavbarItem>

        <NavbarItem >
          <Link color="foreground" href="/Catalog">
            Catalog
          </Link>
        </NavbarItem>

        <NavbarItem >
          <Link color="foreground" href="/Reservations">
            Reservations
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">

        <NavbarItem className="hidden lg:flex">
          <Link color="primary" href="#" >
            Users
          </Link>
        </NavbarItem>

        <NavbarItem >
          <Link color="danger" href="#">LogOut</Link>
        </NavbarItem>

      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color="foreground"
              href={`/${item}`}
              size="lg"
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
