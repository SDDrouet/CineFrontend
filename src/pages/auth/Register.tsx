import { Link } from "react-router-dom";

export default function Register() {
    return <>
        <h1 className="text-3xl">Registro</h1>;
        <Link to="/">Inicio</Link>

        <Link to="/auth/login">
            Login
        </Link>

        <Link to="/app/dashboard">
            Dashboard
        </Link>
    </>
}