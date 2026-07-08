import { Link } from "react-router-dom";
import { Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Register() {

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dni: "",
    nationality: "",
    address: "",
    phone: "",
    email: "",
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegister = () => {
    console.log(form);
  };

  return (
    <div className="flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl rounded-2xl border bg-white p-8 shadow-sm">

        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Film className="h-10 w-10 text-amber-500" />
          </div>

          <h1 className="text-3xl font-bold">
            Registro de cliente
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Complete la información para crear una cuenta.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Primer nombre
            </label>

            <Input
              value={form.firstName}
              onChange={(e) =>
                handleChange("firstName", e.target.value)
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Segundo nombre
            </label>

            <Input
              value={form.middleName}
              onChange={(e) =>
                handleChange("middleName", e.target.value)
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Apellidos
            </label>

            <Input
              value={form.lastName}
              onChange={(e) =>
                handleChange("lastName", e.target.value)
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              DNI
            </label>

            <Input
              value={form.dni}
              onChange={(e) =>
                handleChange("dni", e.target.value)
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Nacionalidad
            </label>

            <Input
              value={form.nationality}
              onChange={(e) =>
                handleChange("nationality", e.target.value)
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Teléfono
            </label>

            <Input
              value={form.phone}
              onChange={(e) =>
                handleChange("phone", e.target.value)
              }
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Dirección
            </label>

            <Input
              value={form.address}
              onChange={(e) =>
                handleChange("address", e.target.value)
              }
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Correo electrónico
            </label>

            <Input
              type="email"
              value={form.email}
              onChange={(e) =>
                handleChange("email", e.target.value)
              }
            />
          </div>

        </div>

        <div className="mt-8 rounded-lg border bg-amber-50 p-4 text-sm text-amber-900">
          El nombre de usuario y la contraseña serán generados automáticamente
          al finalizar el registro.
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">

          <Link to="/">
            <Button
              variant="outline"
              className="w-full"
            >
              Volver al inicio
            </Button>
          </Link>

          <Button onClick={handleRegister}>
            Registrarse
          </Button>
        </div>

        <div className="mt-6 text-center text-sm">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/auth/login"
            className="font-medium text-amber-600 hover:text-amber-700"
          >
            Inicia sesión
          </Link>
        </div>

      </div>
    </div>
  );
}