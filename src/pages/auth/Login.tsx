import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    navigate("/app/dashboard");
  };

  return (
    <Button onClick={handleLogin}>
      Iniciar sesión
    </Button>
  );
}