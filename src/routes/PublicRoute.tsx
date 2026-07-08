import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface Props {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: Props) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return children;
}