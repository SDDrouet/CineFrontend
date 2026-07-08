import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="border-b p-4">

      <nav className="flex gap-4">

        <Link to="/">Inicio</Link>

        <Link to="/auth/login">
          Login
        </Link>

        <Link to="/auth/register">
          Registro
        </Link>

        <Link to="/app/dashboard">
          Dashboard
        </Link>

      </nav>

    </header>
  );
}