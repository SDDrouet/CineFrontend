import { Clapperboard, MapPin, Phone, Clock3 } from "lucide-react";

export default function Footer() {
    return (
        <footer className="mt-16 border-t bg-zinc-900 text-zinc-300">
            <div className="mx-auto grid max-w-6xl gap-10 px-6 py-10 md:grid-cols-3">
                {/* Logo */}
                <div>
                    <div className="mb-4 flex items-center gap-2">
                        <Clapperboard className="h-6 w-6 text-amber-400" />
                        <span className="text-xl font-bold text-white">
                            Cine<span className="text-amber-400">Reservas</span>
                        </span>
                    </div>

                    <p className="text-sm leading-6 text-zinc-400">
                        Compra tus entradas de forma rápida y segura. Consulta la
                        cartelera, selecciona tus asientos y disfruta de la mejor
                        experiencia en el cine.
                    </p>
                </div>

                {/* Información */}
                <div>
                    <h3 className="mb-4 font-semibold text-white">
                        Información
                    </h3>

                    <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-amber-400" />
                            Quito, Ecuador
                        </li>

                        <li className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-amber-400" />
                            (02) 123-4567
                        </li>

                        <li className="flex items-center gap-2">
                            <Clock3 className="h-4 w-4 text-amber-400" />
                            Atención: 10:00 - 22:00
                        </li>
                    </ul>
                </div>

                {/* Navegación */}
                <div>
                    <h3 className="mb-4 font-semibold text-white">
                        Navegación
                    </h3>

                    <nav className="flex flex-col gap-3 text-sm">
                        <a
                            href="/"
                            className="transition-colors hover:text-amber-400"
                        >
                            Cartelera
                        </a>
                    </nav>
                </div>
            </div>

            <div className="border-t border-zinc-800 py-4">
                <p className="text-center text-xs text-zinc-500">
                    © {new Date().getFullYear()} CineReservas. Todos los derechos
                    reservados.
                </p>
            </div>
        </footer>
    );
}