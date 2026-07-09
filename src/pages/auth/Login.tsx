import { Link, useNavigate } from "react-router-dom";
import { Clapperboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        // Aquí posteriormente llamarás al API
        login();
        navigate("/app/dashboard");
    };

    return (
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">

                <div className="mb-8 text-center">
                    <div className="mb-4 flex justify-center">
                        <Clapperboard className="h-10 w-10 text-amber-500" />
                    </div>

                    <h1 className="text-3xl font-bold">
                        Iniciar sesión
                    </h1>

                    <p className="mt-2 text-sm text-zinc-500">
                        Accede para administrar o reservar tus funciones.
                    </p>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Usuario
                        </label>

                        <Input
                            placeholder="Ingrese su usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Contraseña
                        </label>

                        <Input
                            type="password"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <Button
                        className="w-full"
                        onClick={handleLogin}
                    >
                        Iniciar sesión
                    </Button>
                </div>

                <div className="mt-8 flex justify-between text-sm">
                    <Link
                        to="/"
                        className="text-zinc-600 hover:text-amber-600"
                    >
                        ← Volver al inicio
                    </Link>

                    <Link
                        to="/auth/register"
                        className="font-medium text-amber-600 hover:text-amber-700"
                    >
                        Registrarse
                    </Link>
                </div>
            </div>
        </div>
    );
}