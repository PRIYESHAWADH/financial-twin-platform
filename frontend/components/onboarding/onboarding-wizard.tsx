'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { UserPersona, OnboardingStep } from '@/lib/auth/types'
import { getOnboardingFlow, calculateOnboardingProgress } from '@/lib/auth/persona-config'
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Sparkles,
  Shield,
  Brain,
  Zap,
  Trophy,
  Star,
  Gift
} from 'lucide-react'

interface OnboardingWizardProps {
  persona: UserPersona
  onComplete: () => void
  onBack?: () => void
}

export function OnboardingWizard({ persona, onComplete, onBack }: OnboardingWizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [onboardingFlow, setOnboardingFlow] = useState(getOnboardingFlow(persona))
  const [isLoading, setIsLoading] = useState(false)

  const currentStep = onboardingFlow.steps[currentStepIndex]
  const progress = calculateOnboardingProgress(onboardingFlow)
  const isLastStep = currentStepIndex === onboardingFlow.steps.length - 1

  const handleStepComplete = async (stepId: string, data?: any) => {
    setIsLoading(true)
    
    try {
      // Update step status
      const updatedSteps = onboardingFlow.steps.map(step => 
        step.id === stepId 
          ? { ...step, status: 'completed' as const }
          : step
      )
      
      setOnboardingFlow({
        ...onboardingFlow,
        steps: updatedSteps
      })
      
      setCompletedSteps(prev => new Set([...Array.from(prev), stepId]))
      
      // Move to next step or complete
      if (isLastStep) {
        onComplete()
      } else {
        setCurrentStepIndex(prev => prev + 1)
      }
    } catch (error) {
      console.error('Failed to complete step:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStepSkip = (stepId: string) => {
    if (!currentStep.required) {
      const updatedSteps = onboardingFlow.steps.map(step => 
        step.id === stepId 
          ? { ...step, status: 'skipped' as const }
          : step
      )
      
      setOnboardingFlow({
        ...onboardingFlow,
        steps: updatedSteps
      })
      
      if (isLastStep) {
        onComplete()
      } else {
        setCurrentStepIndex(prev => prev + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1)
    }
  }

  const formatTimeEstimate = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Personalized Setup Experience
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Let's Set Up Your{' '}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Financial Twin
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We'll customize everything based on your needs. This should take about{' '}
            <span className="font-semibold text-primary">
              {formatTimeEstimate(onboardingFlow.estimatedTotalTime)}
            </span>
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Setup Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Step {currentStepIndex + 1} of {onboardingFlow.steps.length}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{progress}%</div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>
            
            <Progress value={progress} className="h-3 mb-4" />
            
            {/* Step Indicators */}
            <div className="flex justify-between">
              {onboardingFlow.steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                    ${step.status === 'completed' ? 'bg-success text-white' :
                      step.status === 'skipped' ? 'bg-muted text-muted-foreground' :
                      index === currentStepIndex ? 'bg-primary text-white animate-pulse' :
                      'bg-muted/30 text-muted-foreground'}
                  `}>
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 text-center max-w-16">
                    {step.title.split(' ')[0]}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Step */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center">
                {getStepIcon(currentStep.type)}
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold text-foreground">
                  {currentStep.title}
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  {currentStep.description}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Clock className="w-4 h-4" />
                  <span>~{currentStep.estimatedTime} min</span>
                </div>
                {currentStep.required ? (
                  <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                    Required
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-muted/30">
                    Optional
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Step Content */}
            <StepContent 
              step={currentStep}
              onComplete={handleStepComplete}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        {/* Completion Rewards Preview */}
        {progress > 50 && (
          <Card className="card-hover bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-0 shadow-xl mb-8 animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl flex items-center justify-center">
                  <Gift className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Almost There! 🎉</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete setup to unlock your rewards
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-white/60">
                  <div className="text-2xl font-bold text-primary mb-1">
                    ₹{onboardingFlow.completionRewards.credits}
                  </div>
                  <div className="text-sm text-muted-foreground">Credits</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/60">
                  <div className="text-2xl font-bold text-secondary mb-1">
                    {onboardingFlow.completionRewards.features.length}+
                  </div>
                  <div className="text-sm text-muted-foreground">Free Features</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/60">
                  <div className="text-2xl font-bold text-accent mb-1">
                    {onboardingFlow.completionRewards.discounts[0]?.value || 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">First Year Discount</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-4">
            {onBack && currentStepIndex === 0 ? (
              <Button variant="outline" onClick={onBack} className="btn-hover">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Persona Selection
              </Button>
            ) : currentStepIndex > 0 ? (
              <Button variant="outline" onClick={handlePrevious} className="btn-hover">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous Step
              </Button>
            ) : (
              <div></div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!currentStep.required && (
              <Button 
                variant="ghost" 
                onClick={() => handleStepSkip(currentStep.id)}
                className="btn-hover text-muted-foreground"
              >
                Skip for Now
              </Button>
            )}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center gap-8 mt-12 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-success" />
            <span>Bank-Grade Security</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            <span>AI-Powered Setup</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            <span>Instant Value</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step Content Component
function StepContent({ 
  step, 
  onComplete, 
  isLoading 
}: { 
  step: OnboardingStep
  onComplete: (stepId: string, data?: any) => void
  isLoading: boolean
}) {
  const [stepData, setStepData] = useState<any>({})

  const handleComplete = () => {
    onComplete(step.id, stepData)
  }

  return (
    <div className="space-y-6">
      {/* Step-specific content would go here */}
      <div className="bg-muted/20 rounded-lg p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {getStepIcon(step.type, 'w-8 h-8')}
          </div>
          <h4 className="text-lg font-semibold text-foreground mb-2">
            {getStepTitle(step.type)}
          </h4>
          <p className="text-muted-foreground mb-6">
            {getStepInstructions(step.type)}
          </p>
          
          {/* Mock interaction based on step type */}
          <StepInteraction 
            type={step.type} 
            onDataChange={setStepData}
            data={stepData}
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleComplete}
          disabled={isLoading || !isStepValid(step.type, stepData)}
          className="btn-hover bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 text-lg font-semibold"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

// Step Interaction Component
function StepInteraction({ 
  type, 
  onDataChange, 
  data 
}: { 
  type: OnboardingStep['type']
  onDataChange: (data: any) => void
  data: any
}) {
  switch (type) {
    case 'phone_verification':
      return <PhoneVerificationStep onDataChange={onDataChange} data={data} />
    case 'persona_selection':
      return <PersonaSelectionStep onDataChange={onDataChange} data={data} />
    case 'account_linking':
      return <AccountLinkingStep onDataChange={onDataChange} data={data} />
    case 'kyc_upload':
      return <KYCUploadStep onDataChange={onDataChange} data={data} />
    case 'goal_setting':
      return <GoalSettingStep onDataChange={onDataChange} data={data} />
    default:
      return <div>Step content coming soon...</div>
  }
}

// Individual step components (simplified for brevity)
function PhoneVerificationStep({ onDataChange, data }: any) {
  return (
    <div className="space-y-4">
      <input 
        type="tel" 
        placeholder="Enter your phone number"
        className="w-full p-3 rounded-lg border border-muted bg-white"
        onChange={(e) => onDataChange({ phone: e.target.value })}
      />
      <p className="text-sm text-muted-foreground">
        We'll send you a secure OTP to verify your identity
      </p>
    </div>
  )
}

function PersonaSelectionStep({ onDataChange, data }: any) {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Tell us more about your financial profile to personalize your experience
      </p>
      {/* Profile form would go here */}
    </div>
  )
}

function AccountLinkingStep({ onDataChange, data }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4">
        <div className="text-center p-4 border rounded-lg cursor-pointer hover:bg-primary/5">
          <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
          <div className="font-medium">Account Aggregation</div>
          <div className="text-sm text-muted-foreground">Secure bank linking</div>
        </div>
        <div className="text-center p-4 border rounded-lg cursor-pointer hover:bg-secondary/5">
          <Trophy className="w-8 h-8 text-secondary mx-auto mb-2" />
          <div className="font-medium">Manual Upload</div>
          <div className="text-sm text-muted-foreground">Upload statements</div>
        </div>
      </div>
    </div>
  )
}

function KYCUploadStep({ onDataChange, data }: any) {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Upload your documents for verification and automated data extraction
      </p>
      <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:border-primary/50">
        <div className="text-muted-foreground">
          Drag & drop files here or click to browse
        </div>
      </div>
    </div>
  )
}

function GoalSettingStep({ onDataChange, data }: any) {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Set your financial goals so we can provide personalized recommendations
      </p>
      {/* Goal setting interface would go here */}
    </div>
  )
}

// Utility functions
function getStepIcon(type: OnboardingStep['type'], className = 'w-6 h-6') {
  switch (type) {
    case 'phone_verification':
      return <Shield className={`${className} text-primary`} />
    case 'persona_selection':
      return <Brain className={`${className} text-secondary`} />
    case 'account_linking':
      return <Zap className={`${className} text-accent`} />
    case 'kyc_upload':
      return <Trophy className={`${className} text-primary`} />
    case 'goal_setting':
      return <Star className={`${className} text-secondary`} />
    default:
      return <Sparkles className={`${className} text-primary`} />
  }
}

function getStepTitle(type: OnboardingStep['type']): string {
  switch (type) {
    case 'phone_verification':
      return 'Secure Phone Verification'
    case 'persona_selection':
      return 'Complete Your Profile'
    case 'account_linking':
      return 'Connect Your Accounts'
    case 'kyc_upload':
      return 'Upload Documents'
    case 'goal_setting':
      return 'Set Financial Goals'
    default:
      return 'Setup Step'
  }
}

function getStepInstructions(type: OnboardingStep['type']): string {
  switch (type) {
    case 'phone_verification':
      return 'Verify your phone number with a secure OTP to protect your account'
    case 'persona_selection':
      return 'Help us understand your needs better by completing your profile'
    case 'account_linking':
      return 'Securely connect your bank accounts for automated insights'
    case 'kyc_upload':
      return 'Upload your tax documents for AI-powered analysis'
    case 'goal_setting':
      return 'Define your financial objectives for personalized recommendations'
    default:
      return 'Complete this step to continue your setup'
  }
}

function isStepValid(type: OnboardingStep['type'], data: any): boolean {
  switch (type) {
    case 'phone_verification':
      return data.phone && data.phone.length >= 10
    default:
      return true
  }
}
