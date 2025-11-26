"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/client"
import { Check, X, Mail, Calendar, User, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Submission {
  id: string
  nominee_name: string
  award_category: string
  nomination_reason: string
  nominator_email: string
  nominator_name: string | null
  nominee_email: string | null
  created_at: string
  status: string
}

interface SubmissionsTableProps {
  submissions: Submission[]
  isAdmin: boolean
}

export function SubmissionsTable({ submissions, isAdmin }: SubmissionsTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("award_submissions").update({ status }).eq("id", id)

      if (error) throw error

      toast({
        title: "Status updated",
        description: `Submission has been ${status}.`,
      })

      router.refresh()
    } catch (error) {
      console.error("[v0] Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const deleteSubmission = async (id: string) => {
    setDeletingId(id)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("award_submissions").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Submission deleted",
        description: "The submission has been successfully deleted.",
      })

      router.refresh()
    } catch (error) {
      console.error("[v0] Error deleting submission:", error)
      toast({
        title: "Error",
        description: "Failed to delete submission. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>
      default:
        return <Badge className="bg-orange-500">Pending</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {submissions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No submissions yet</p>
          </CardContent>
        </Card>
      ) : (
        submissions.map((submission) => (
          <Card key={submission.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{submission.nominee_name}</CardTitle>
                  <CardDescription className="mt-1">
                    <span className="font-semibold text-[#193fa6]">{submission.award_category}</span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(submission.status)}
                  {isAdmin && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={deletingId === submission.id}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Submission</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this submission from {submission.nominee_name}? This action
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteSubmission(submission.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(submission.created_at).toLocaleDateString()}</span>
                </div>
                {submission.nominator_name && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Nominated by: {submission.nominator_name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{submission.nominator_email}</span>
                </div>
                {submission.nominee_email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>Nominee: {submission.nominee_email}</span>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Nomination Reason:</p>
                <p className="text-gray-600 leading-relaxed">{submission.nomination_reason}</p>
              </div>

              {isAdmin && submission.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => updateStatus(submission.id, "approved")}
                    disabled={updatingId === submission.id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => updateStatus(submission.id, "rejected")}
                    disabled={updatingId === submission.id}
                    variant="destructive"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
