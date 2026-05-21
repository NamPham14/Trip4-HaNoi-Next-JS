/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Info, Bookmark, Loader2 } from 'lucide-react'
import { ChatAIResponse } from '../../types/chat'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import Link from 'next/link'

interface AIContentProps {
  content: ChatAIResponse
  isSaving: boolean
  onSaveItinerary: (title: string, timeline: any) => void
}

export const AIContent = ({ content, isSaving, onSaveItinerary }: AIContentProps) => {
  return (
    <div className="space-y-4">
      <p className={`font-medium text-zinc-800 ${content.timeline.length > 0 ? 'text-zinc-900' : ''}`}>
        {content.introduction}
      </p>

      {content.timeline && content.timeline.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-zinc-100">
          {content.timeline.map((item, idx) => (
            <div key={idx} className="flex gap-3 group">
              <div className="flex flex-col items-center">
                <div className="h-6 w-6 rounded-full bg-hanoi-red/10 flex items-center justify-center text-[10px] font-bold text-hanoi-red">
                  {idx + 1}
                </div>
                {idx !== content.timeline.length - 1 && (
                  <div className="w-px flex-1 bg-hanoi-red/10 my-1" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-[10px] bg-zinc-50 font-bold px-1.5 py-0">
                    {item.time}
                  </Badge>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    {item.estimatedCost ? `${item.estimatedCost.toLocaleString()}đ` : ''}
                  </span>
                </div>
                <p className="font-bold text-zinc-900 text-xs">
                  {item.activity}
                </p>
                {item.note && (
                  <p className="text-[11px] text-zinc-500 italic mt-1">
                    {item.note}
                  </p>
                )}
                {item.placeId && (
                  <Link
                    href={`/places/${item.placeId}`}
                    className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-hanoi-red hover:underline"
                  >
                    <Info className="h-3 w-3" /> Xem chi tiết
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {content.summary && (
        <p className="text-xs text-zinc-500 pt-2 italic">
          {content.summary}
        </p>
      )}

      {content.timeline && content.timeline.length > 0 && (
        <div className="pt-2 border-t border-zinc-50 mt-2 flex justify-end">
          <button
            disabled={isSaving}
            onClick={() => onSaveItinerary('Lịch trình từ AI', content.timeline)}
            className="inline-flex items-center gap-2 text-[10px] font-bold text-hanoi-red hover:bg-hanoi-red/5 h-8 px-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Bookmark className="h-3 w-3" />
            )}
            Lưu lịch trình này
          </button>
        </div>
      )}
    </div>
  )
}
