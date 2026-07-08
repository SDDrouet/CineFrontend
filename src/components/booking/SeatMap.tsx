import type { Section } from "@/types";
import { cn } from "@/lib/utils";

const SECTION_STYLES: Record<string, string> = {
  VIP: "border-amber-400",
  DBOX: "border-violet-400",
  GENERAL: "border-zinc-300",
};

interface SeatMapProps {
  sections: Section[];
  selectedSeatIds: string[];
  onToggle: (seatId: string) => void;
}

export default function SeatMap({ sections, selectedSeatIds, onToggle }: SeatMapProps) {
  return (
    <div className="space-y-8">
      <div className="mx-auto h-2 w-2/3 rounded-full bg-zinc-800/80" />
      <p className="text-center text-xs uppercase tracking-[0.3em] text-zinc-400">Pantalla</p>

      {sections.map((section) => (
        <div key={section.id} className={cn("rounded-xl border-2 border-dashed p-4", SECTION_STYLES[section.type])}>
          <div className="mb-3 flex items-center justify-between text-sm font-semibold">
            <span>{section.name}</span>
            <span>${section.price.toFixed(2)}</span>
          </div>

          <div className="space-y-2">
            {section.rows.map((row) => (
              <div key={row.label} className="flex items-center gap-2">
                <span className="w-4 text-xs font-medium text-zinc-400">{row.label}</span>
                <div className="flex flex-wrap gap-1.5">
                  {row.seats.map((seat) => {
                    const isSelected = selectedSeatIds.includes(seat.id);
                    const isTaken = seat.status !== "DISPONIBLE";
                    return (
                      <button
                        key={seat.id}
                        type="button"
                        disabled={isTaken}
                        onClick={() => onToggle(seat.id)}
                        title={`${row.label}${seat.number}`}
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-medium transition",
                          isTaken && "cursor-not-allowed bg-zinc-200 text-zinc-400",
                          !isTaken && !isSelected && "border border-zinc-300 bg-white hover:border-amber-400",
                          isSelected && "bg-amber-500 text-white"
                        )}
                      >
                        {seat.number}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex flex-wrap justify-center gap-4 text-xs text-zinc-500">
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded border bg-white" /> Disponible</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-amber-500" /> Seleccionado</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-zinc-200" /> Ocupado/reservado</span>
      </div>
    </div>
  );
}