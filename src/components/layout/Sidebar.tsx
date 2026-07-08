import { Link } from "react-router-dom";
import { LayoutDashboard, Ticket } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r p-4">
      <ul className="space-y-3">
        <li>
          <Link to="/app/dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/app/mis-reservas" className="flex items-center gap-2">
            <Ticket className="h-4 w-4" /> Mis reservas
          </Link>
        </li>
      </ul>
    </aside>
  );
}