import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r p-4">

      <ul className="space-y-3">

        <li>
          <Link to="/app/dashboard">
            Dashboard
          </Link>
        </li>

      </ul>

    </aside>
  );
}