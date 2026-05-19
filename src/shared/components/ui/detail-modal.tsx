/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, any> | null;
  fields: { label: string; key: string; render?: (value: any) => React.ReactNode }[];
}

export function DetailModal({
  isOpen,
  onClose,
  title,
  data,
  fields,
}: DetailModalProps) {
  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold border-b pb-2">{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {fields.map((field) => (
            <div key={field.key} className="grid grid-cols-3 gap-4 border-b border-gray-50 pb-2 last:border-0">
              <span className="text-sm font-semibold text-gray-500">{field.label}</span>
              <div className="col-span-2 text-sm text-gray-900">
                {field.render ? field.render(data[field.key]) : (data[field.key] || "---")}
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
