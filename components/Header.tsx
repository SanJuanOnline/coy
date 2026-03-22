"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Wallet, Menu, X, UserCircle, Bell, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { db } from "@/lib/db";
import Swal from "sweetalert2";
import { useTheme } from "@/lib/ThemeContext";

const nav = [
  { href: "/",          label: "Inicio",    Icon: Wallet },
  { href: "/clientes",  label: "Clientes",  Icon: Users },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuCuenta, setMenuCuenta] = useState(false);
  const [notificaciones, setNotificaciones] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleBorrarTodo = async () => {
    const result = await Swal.fire({
      title: "⚠️ ¿Borrar todos los datos?",
      text: "Esta acción eliminará TODOS los clientes y movimientos. No se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, borrar todo",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b"
    });

    if (result.isConfirmed) {
      try {
        await db.clientes.clear();
        await db.movimientos.clear();

        await Swal.fire({
          icon: "success",
          title: "Datos eliminados",
          text: "Todos los registros han sido borrados",
          timer: 2000,
          showConfirmButton: false
        });
        window.location.href = "/clientes";
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo borrar los datos"
        });
      }
    }
  };

  return (
    <header className="header-gradient">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="logo-link">
          <span className="logo-icon">
            <Wallet style={{ width: 18, height: 18, color: "#fff" }} />
          </span>
          <span className="logo-text">COY</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {nav.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className={`nav-link ${active ? "active" : ""}`}>
                <Icon style={{ width: 16, height: 16 }} />{label}
              </Link>
            );
          })}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          {/* Notificaciones */}
          <div style={{ position: "relative" }} className="hidden md:block">
            <button onClick={() => setNotificaciones(!notificaciones)} className="icon-btn">
              <Bell style={{ width: 18, height: 18 }} />
            </button>

            {notificaciones && (
              <div className="dropdown-menu" style={{ minWidth: "280px" }}>
                <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: "0.875rem" }}>
                  Notificaciones
                </div>
                <div style={{ padding: "2rem 1rem", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                  No hay notificaciones
                </div>
              </div>
            )}
          </div>

          {/* Modo oscuro */}
          <button onClick={toggleTheme} className="icon-btn hidden md:flex">
            {theme === "light" ? <Moon style={{ width: 18, height: 18 }} /> : <Sun style={{ width: 18, height: 18 }} />}
          </button>

          {/* Menú de cuenta */}
          <div style={{ position: "relative" }} className="hidden md:block">
            <button onClick={() => setMenuCuenta(!menuCuenta)} className="account-btn">
              <UserCircle style={{ width: 20, height: 20 }} />
              <span>Cuenta</span>
            </button>

            {menuCuenta && (
              <div className="dropdown-menu">
                <button onClick={() => { setMenuCuenta(false); handleBorrarTodo(); }} className="dropdown-item danger">
                  🗑️ Borrar todos los datos
                </button>
              </div>
            )}
          </div>

          {/* Menú móvil - Solo visible en móvil */}
          <button 
            onClick={() => setOpen(!open)} 
            className="icon-btn"
            style={{ display: 'flex' }}
            aria-label="Menú"
          >
            {open ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-menu">
          {nav.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)} className={`nav-link ${active ? "active" : ""}`}>
                <Icon style={{ width: 16, height: 16 }} />{label}
              </Link>
            );
          })}
          <div style={{ borderTop: "1px solid var(--border)", marginTop: "0.5rem", paddingTop: "0.5rem" }}>
            <button onClick={toggleTheme} className="nav-link" style={{ width: "100%", justifyContent: "flex-start" }}>
              {theme === "light" ? <Moon style={{ width: 16, height: 16 }} /> : <Sun style={{ width: 16, height: 16 }} />}
              Modo {theme === "light" ? "Oscuro" : "Claro"}
            </button>
            <button onClick={() => { setOpen(false); handleBorrarTodo(); }} className="nav-link danger" style={{ width: "100%", justifyContent: "flex-start", color: "#dc2626" }}>
              🗑️ Borrar datos
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

