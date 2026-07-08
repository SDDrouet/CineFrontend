import { Link } from "react-router-dom";

export default function Login() {
    return <>
        <h1 className="text-3xl">Login</h1>;
        <Link to="/">Inicio</Link>

        <Link to="/auth/register">
            Registro
        </Link>

        <Link to="/app/dashboard">
            Dashboard
        </Link>
    </>
}