import { Outlet } from "react-router-dom";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";


export default function AppLayout() {

  return (

    <SidebarProvider>

      <div className="min-h-screen w-full">


        <Navbar />


        <div className="flex">


          <Sidebar />


          <SidebarInset>

            <main className="flex-1 p-6">
              <Outlet />
            </main>

          </SidebarInset>


        </div>


      </div>


    </SidebarProvider>

  );
}