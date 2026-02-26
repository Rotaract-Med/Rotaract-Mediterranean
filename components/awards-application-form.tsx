"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    ChevronRight,
    ChevronLeft,
    Upload,
    FileText,
    CheckCircle2,
    User,
    Building2,
    Globe,
    Hash,
    Award,
    FolderOpen
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AwardsApplicationFormProps {
    isOpen: boolean
    onClose: () => void
}

interface FormData {
    // Section 1
    fullName: string
    clubName: string
    country: string
    districtNumber: string
    // Section 2
    projectName: string
    medCategory: string
    projectFile: File | null
}

const MED_CATEGORIES = [
    "MedLove",
    "MedNature",
    "MedCulture",
    "MedPeace",
    "MedTwinning",
    "MedExcellence"
]

export function AwardsApplicationForm({ isOpen, onClose }: AwardsApplicationFormProps) {
    const { toast } = useToast()
    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        clubName: "",
        country: "",
        districtNumber: "",
        projectName: "",
        medCategory: "",
        projectFile: null,
    })

    const updateFormData = (field: keyof FormData, value: string | File | null) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const validateStep1 = () => {
        return (
            formData.fullName.trim() !== "" &&
            formData.clubName.trim() !== "" &&
            formData.country.trim() !== "" &&
            formData.districtNumber.trim() !== ""
        )
    }

    const validateStep2 = () => {
        return (
            formData.projectName.trim() !== "" &&
            formData.medCategory !== "" &&
            formData.projectFile !== null
        )
    }

    const handleNext = () => {
        if (currentStep === 1 && !validateStep1()) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields before continuing.",
                variant: "destructive",
            })
            return
        }
        setCurrentStep(2)
    }

    const handleBack = () => {
        setCurrentStep(1)
    }

    const uploadToGoogleDrive = async (file: File): Promise<string> => {
        // This uploads both the file and registration data to Google Drive
        // File goes to Drive folder, registration data goes to Google Sheets

        const formDataToUpload = new FormData()
        formDataToUpload.append('file', file)
        formDataToUpload.append('fullName', formData.fullName)
        formDataToUpload.append('clubName', formData.clubName)
        formDataToUpload.append('country', formData.country)
        formDataToUpload.append('districtNumber', formData.districtNumber)
        formDataToUpload.append('projectName', formData.projectName)
        formDataToUpload.append('medCategory', formData.medCategory)

        const response = await fetch('/api/awards/upload-to-drive', {
            method: 'POST',
            body: formDataToUpload,
        })

        const data = await response.json()

        if (!response.ok) {
            if (response.status === 503) {
                throw new Error('GOOGLE_DRIVE_NOT_CONFIGURED')
            }
            throw new Error(data.error || 'Upload failed')
        }

        return data.fileId || data.fileUrl || ''
    }

    const handleSubmit = async () => {
        if (!validateStep2()) {
            toast({
                title: "Missing Information",
                description: "Please complete all fields and upload your project file.",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)

        try {
            // Upload to Google Drive (file + registration data)
            await uploadToGoogleDrive(formData.projectFile!)

            toast({
                title: "Application Submitted! 🎉",
                description: "Your project has been saved to Google Drive. Good luck!",
            })

            // Reset form
            setFormData({
                fullName: "",
                clubName: "",
                country: "",
                districtNumber: "",
                projectName: "",
                medCategory: "",
                projectFile: null,
            })
            setCurrentStep(1)
            onClose()
        } catch (error) {
            console.error('Submission error:', error)

            if (error instanceof Error && error.message === 'GOOGLE_DRIVE_NOT_CONFIGURED') {
                toast({
                    title: "Configuration Required",
                    description: "Google Drive integration is not yet configured. Please contact the administrator or check the documentation.",
                    variant: "destructive",
                })
            } else {
                toast({
                    title: "Submission Failed",
                    description: error instanceof Error ? error.message : "There was an error submitting your application. Please try again.",
                    variant: "destructive",
                })
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            // Validate file type (accept PDF, DOC, DOCX, PPT, PPTX)
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            ]

            if (!allowedTypes.includes(file.type)) {
                toast({
                    title: "Invalid File Type",
                    description: "Please upload a PDF, Word, or PowerPoint document.",
                    variant: "destructive",
                })
                return
            }

            // Validate file size (max 50MB)
            if (file.size > 50 * 1024 * 1024) {
                toast({
                    title: "File Too Large",
                    description: "Please upload a file smaller than 50MB.",
                    variant: "destructive",
                })
                return
            }

            updateFormData('projectFile', file)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-[#D4AF37]">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#D4AF37]">
                        Submit Your Project
                    </DialogTitle>
                </DialogHeader>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 1 ? 'bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black' : 'bg-gray-700 text-gray-400'
                            }`}>
                            1
                        </div>
                        <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-[#FFD700]' : 'text-gray-500'}`}>
                            Personal Info
                        </span>
                    </div>
                    <div className="w-12 h-0.5 bg-gray-700">
                        <div className={`h-full transition-all duration-300 ${currentStep >= 2 ? 'bg-gradient-to-r from-[#FFD700] to-[#D4AF37] w-full' : 'w-0'
                            }`} />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 2 ? 'bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black' : 'bg-gray-700 text-gray-400'
                            }`}>
                            2
                        </div>
                        <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-[#FFD700]' : 'text-gray-500'}`}>
                            Project Details
                        </span>
                    </div>
                </div>

                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-[#FFD700] font-semibold flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Full Name *
                            </Label>
                            <Input
                                id="fullName"
                                value={formData.fullName}
                                onChange={(e) => updateFormData('fullName', e.target.value)}
                                placeholder="Enter your full name"
                                className="bg-black border-[#D4AF37] text-white focus:border-[#FFD700]"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="clubName" className="text-[#FFD700] font-semibold flex items-center gap-2">
                                <Building2 className="w-4 h-4" />
                                Rotaract Club Name *
                            </Label>
                            <Input
                                id="clubName"
                                value={formData.clubName}
                                onChange={(e) => updateFormData('clubName', e.target.value)}
                                placeholder="e.g., Rotaract Club of Athens"
                                className="bg-black border-[#D4AF37] text-white focus:border-[#FFD700]"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="country" className="text-[#FFD700] font-semibold flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                Country *
                            </Label>
                            <Input
                                id="country"
                                value={formData.country}
                                onChange={(e) => updateFormData('country', e.target.value)}
                                placeholder="Enter your country"
                                className="bg-black border-[#D4AF37] text-white focus:border-[#FFD700]"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="districtNumber" className="text-[#FFD700] font-semibold flex items-center gap-2">
                                <Hash className="w-4 h-4" />
                                District Number *
                            </Label>
                            <Input
                                id="districtNumber"
                                value={formData.districtNumber}
                                onChange={(e) => updateFormData('districtNumber', e.target.value)}
                                placeholder="e.g., 2470"
                                className="bg-black border-[#D4AF37] text-white focus:border-[#FFD700]"
                                required
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                onClick={handleNext}
                                className="bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black font-bold hover:shadow-lg hover:shadow-[#FFD700]/50"
                            >
                                Next Step
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2: Project Information */}
                {currentStep === 2 && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="projectName" className="text-[#FFD700] font-semibold flex items-center gap-2">
                                <FolderOpen className="w-4 h-4" />
                                Project Name *
                            </Label>
                            <Input
                                id="projectName"
                                value={formData.projectName}
                                onChange={(e) => updateFormData('projectName', e.target.value)}
                                placeholder="Enter your project name"
                                className="bg-black border-[#D4AF37] text-white focus:border-[#FFD700]"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="medCategory" className="text-[#FFD700] font-semibold flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                MED Award Category *
                            </Label>
                            <select
                                id="medCategory"
                                value={formData.medCategory}
                                onChange={(e) => updateFormData('medCategory', e.target.value)}
                                className="w-full bg-black border-2 border-[#D4AF37] text-white rounded-md px-3 py-2 focus:border-[#FFD700] focus:outline-none"
                                aria-label="Select MED Award Category"
                                required
                            >
                                <option value="">Select a category</option>
                                {MED_CATEGORIES.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="projectFile" className="text-[#FFD700] font-semibold flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Project Presentation File *
                            </Label>
                            <p className="text-sm text-gray-400 mb-2">
                                Upload your project presentation (PDF, Word, or PowerPoint format, max 50MB)
                            </p>
                            <div className="relative">
                                <input
                                    id="projectFile"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                                    className="hidden"
                                    required
                                />
                                <label
                                    htmlFor="projectFile"
                                    className="flex items-center justify-center gap-3 w-full bg-black border-2 border-dashed border-[#D4AF37] rounded-lg p-8 cursor-pointer hover:border-[#FFD700] hover:bg-gray-900 transition-all"
                                >
                                    {formData.projectFile ? (
                                        <div className="flex items-center gap-3 text-[#FFD700]">
                                            <CheckCircle2 className="w-6 h-6" />
                                            <div className="text-left">
                                                <p className="font-semibold">{formData.projectFile.name}</p>
                                                <p className="text-sm text-gray-400">
                                                    {(formData.projectFile.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <Upload className="w-8 h-8 mx-auto mb-2" />
                                            <p className="font-semibold">Click to upload file</p>
                                            <p className="text-sm">or drag and drop</p>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button
                                onClick={handleBack}
                                variant="outline"
                                className="border-[#D4AF37] text-[#FFD700] hover:bg-gray-800"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black font-bold hover:shadow-lg hover:shadow-[#FFD700]/50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full mr-2" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Submit Application
                                        <CheckCircle2 className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
