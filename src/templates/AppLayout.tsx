import { Outlet } from "react-router-dom";

import Sidebar from "@/components/layout/Sidebar";

import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";


export default function AppLayout() {

  return (

    <SidebarProvider>

      <div className="min-h-screen w-full">

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