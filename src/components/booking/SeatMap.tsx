import type { Section, SectionType } from "@/types";
import { cn } from "@/lib/utils";
import { Armchair, CircleOff, DoorOpen } from "lucide-react";

interface SeatMapProps {
  sections: Section[];
  selectedSeatIds: string[];
  onToggle: (seatId: string) => void;
}

// Orden de renderizado: desde la pantalla hacia atrás
const SECTION_ORDER: Record<SectionType, number> = {
  GENERAL: 0,
  DBOX: 1,
  VIP: 2,
};

// Cada sección se hace más ancha simulando un cine real
const SECTION_WIDTH: Record<SectionType, string> = {
  GENERAL: "max-w-[68%]",
  DBOX: "max-w-[84%]",
  VIP: "max-w-full",
};

const SECTION_CHIP: Record<SectionType, string> = {
  GENERAL: "bg-slate-100 text-slate-700",
  DBOX: "bg-violet-100 text-violet-700",
  VIP: "bg-amber-100 text-amber-700",
};

function SeatButton({
  id,
  rowLabel,
  number,
  status,
  isSelected,
  onToggle,
}: {
  id: string;
  rowLabel: string;
  number: number;
  status: string;
  isSelected: boolean;
  onToggle: (seatId: string) => void;
}) {
  const isTaken = status !== "DISPONIBLE";

  return (
    <button
      type="button"
      disabled={isTaken}
      onClick={() => onToggle(id)}
      title={`Asiento ${rowLabel}${number}`}
      aria-label={`Asiento ${rowLabel}${number}, ${
        isTaken
          ? "no disponible"
          : isSelected
            ? "seleccionado"
            : "disponible"
      }`}
      className={cn(
        "relative flex h-8 w-8 items-center justify-center transition-all duration-200",
        isTaken && "cursor-not-allowed",
        !isTaken && "hover:scale-110"
      )}
    >
      <Armchair
        className={cn(
          "h-6 w-6 transition-all duration-200",
          isTaken && "text-zinc-300",
          !isTaken &&
            !isSelected &&
            "text-emerald-600 hover:text-emerald-700",
          isSelected &&
            "fill-amber-500 text-amber-500 scale-110"
        )}
      />

      {isTaken && (
        <CircleOff
          className="absolute h-5 w-5 text-zinc-500 drop-shadow-sm"
          strokeWidth={2.5}
        />
      )}
    </button>
  );
}

export default function SeatMap({
  sections,
  selectedSeatIds,
  onToggle,
}: SeatMapProps) {
  const orderedSections = [...sections].sort(
    (a, b) => SECTION_ORDER[a.type] - SECTION_ORDER[b.type]
  );

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="min-w-140">
        {/* Pantalla */}
        <div className="relative mb-2 flex justify-center">
          <DoorOpen className="absolute left-2 top-3 h-4 w-4 text-zinc-400" />
          <DoorOpen className="absolute right-2 top-3 h-4 w-4 text-zinc-400" />

          <div className="h-4 w-3/4 rounded-t-[100%] bg-zinc-800 shadow-[0_10px_35px_rgba(0,0,0,0.18)]" />
        </div>

        <p className="mb-10 text-center text-[10px] font-semibold uppercase tracking-[0.5em] text-zinc-500">
          Pantalla
        </p>

        {/* Secciones */}
        <div className="space-y-10">
          {orderedSections.map((section) => (
            <div
              key={section.id}
              className={cn("mx-auto", SECTION_WIDTH[section.type])}
            >
              <div className="mb-3 flex items-center justify-center">
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-[11px] font-semibold",
                    SECTION_CHIP[section.type]
                  )}
                >
                  {section.name} · ${section.price.toFixed(2)}
                </span>
              </div>

              <div className="space-y-2">
                {section.rows.map((row) => {
                  const half = Math.ceil(row.seats.length / 2);

                  const left = row.seats.slice(0, half);
                  const right = row.seats.slice(half);

                  return (
                    <div
                      key={row.label}
                      className="flex items-center justify-center gap-3"
                    >
                      <span className="w-4 text-center text-[11px] font-semibold text-zinc-600">
                        {row.label}
                      </span>

                      {/* Lado izquierdo */}
                      <div className="flex gap-1">
                        {left.map((seat) => (
                          <SeatButton
                            key={seat.id}
                            id={seat.id}
                            rowLabel={seat.rowLabel}
                            number={seat.number}
                            status={seat.status}
                            isSelected={selectedSeatIds.includes(seat.id)}
                            onToggle={onToggle}
                          />
                        ))}
                      </div>

                      {/* Pasillo */}
                      <div className="w-8" />

                      {/* Lado derecho */}
                      <div className="flex gap-1">
                        {right.map((seat) => (
                          <SeatButton
                            key={seat.id}
                            id={seat.id}
                            rowLabel={seat.rowLabel}
                            number={seat.number}
                            status={seat.status}
                            isSelected={selectedSeatIds.includes(seat.id)}
                            onToggle={onToggle}
                          />
                        ))}
                      </div>

                      <span className="w-4 text-center text-[11px] font-semibold text-zinc-600">
                        {row.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Leyenda */}
        <div className="mt-10 flex flex-wrap justify-center gap-8 text-sm text-zinc-700">
          <span className="flex items-center gap-2">
            <Armchair className="h-5 w-5 text-emerald-600" />
            Disponible
          </span>

          <span className="flex items-center gap-2">
            <Armchair className="h-5 w-5 fill-amber-500 text-amber-500" />
            Seleccionado
          </span>

          <span className="flex items-center gap-2">
            <div className="relative h-5 w-5">
              <Armchair className="absolute h-5 w-5 text-zinc-300" />
              <CircleOff className="absolute h-5 w-5 text-zinc-500" />
            </div>
            Ocupado / Reservado
          </span>
        </div>
      </div>
    </div>
  );
}