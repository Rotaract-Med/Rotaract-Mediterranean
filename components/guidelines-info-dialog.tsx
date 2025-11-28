"use client"

import { Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function GuidelinesInfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button 
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative group"
          title="Guidelines & Resources naming info"
        >
          <Info className="h-5 w-5" />
          <span className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap">
            Guidelines naming info
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            Guidelines & Resources Upload
          </DialogTitle>
          <DialogDescription>
            If you want to upload files for the Guidelines & Resources page, please use these exact names:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-900 mb-3">Required File Names:</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span className="font-mono bg-white px-2 py-1 rounded border border-gray-200">
                  Rotaract Mediterranean Bylaws
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span className="font-mono bg-white px-2 py-1 rounded border border-gray-200">
                  Rotaract Mediterranean Official Presentation
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span className="font-mono bg-white px-2 py-1 rounded border border-gray-200">
                  Rotaract Mediterranean Event Organisation Guidelines
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span className="font-mono bg-white px-2 py-1 rounded border border-gray-200">
                  Rotaract Mediterranean Fundraising Guidelines
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span className="font-mono bg-white px-2 py-1 rounded border border-gray-200">
                  Rotaract Mediterranean Brand Guidelines
                </span>
              </li>
            </ul>
          </div>
          <p className="text-xs text-gray-500 italic">
            💡 Copy and paste these names exactly when uploading to ensure they appear correctly on the Guidelines & Resources page.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
