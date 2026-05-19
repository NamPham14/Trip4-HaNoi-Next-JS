"use client";

import React from 'react';
import { Eye, Edit, Trash2, ShieldCheck, MoreHorizontal } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

interface TableActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCustom?: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    className?: string;
  }[];
  viewTitle?: string;
  editTitle?: string;
  deleteTitle?: string;
}

export const TableActions: React.FC<TableActionsProps> = ({
  onView,
  onEdit,
  onDelete,
  onCustom,
  viewTitle = "Xem chi tiết",
  editTitle = "Chỉnh sửa",
  deleteTitle = "Xóa vĩnh viễn"
}) => {
  return (
    <div className="flex justify-end gap-1">
      {onView && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
          onClick={onView}
          title={viewTitle}
        >
          <Eye size={16} />
        </Button>
      )}

      {onEdit && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-amber-600 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition-colors"
          onClick={onEdit}
          title={editTitle}
        >
          <Edit size={16} />
        </Button>
      )}

      {onDelete && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors" 
          onClick={onDelete}
          title={deleteTitle}
        >
          <Trash2 size={16} />
        </Button>
      )}

      {onCustom && onCustom.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 rounded-xl p-1 shadow-xl">
            {onCustom.map((item, idx) => (
              <DropdownMenuItem 
                key={idx} 
                onClick={item.onClick}
                className={`flex items-center gap-2 font-bold text-xs p-2.5 rounded-lg cursor-pointer ${item.className}`}
              >
                {item.icon}
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
