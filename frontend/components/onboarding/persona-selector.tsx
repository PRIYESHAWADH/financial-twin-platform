'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { UserPersona } from '@/lib/auth/types'
import { PERSONA_CONFIG, getPersonaConfig } from '@/lib/auth/persona-config'
import { 
  ArrowRight, 
  Clock, 
  Star, 
  TrendingUp, 
  CheckCircle,
  Sparkles,
  Brain,
  Target
} from 'lucide-react'

interface PersonaSelectorProps {
  onPersonaSelect: (persona: UserPersona) => void
  onBack?: () => void
  selectedPersona?: UserPersona
}

export function PersonaSelector({ onPersonaSelect, onBack, selectedPersona }: PersonaSelectorProps) {
  const [hoveredPersona, setHoveredPersona] = useState<UserPersona | null>(null)
  const [currentPersona, setCurrentPersona] = useState<UserPersona | null>(selectedPersona || null)

  const personas: UserPersona[] = [
    'salary_warrior',
    'hustle_master', 
    'business_builder',
    'tax_expert',
    'corporate_commander',
    'wealth_guardian'
  ]

  const handlePersonaClick = (persona: UserPersona) => {
    setCurrentPersona(persona)
  }

  const handleContinue = () => {
    if (currentPersona) {
      onPersonaSelect(currentPersona)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Brain className="w-4 h-4 mr-2" />
            AI-Powered Persona Matching
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Financial Journey
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Select the profile that best matches your financial needs. 
            Our AI will customize your entire experience based on your choice.
          </p>
        </div>

        {/* Persona Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {personas.map((persona: UserPersona, index: number) => {
            const config = getPersonaConfig(persona)
            const isSelected = currentPersona === persona
            const isHovered = hoveredPersona === persona
            
            return (
              <Card 
                key={persona}
                className={`
                  card-hover cursor-pointer border-0 shadow-xl relative overflow-hidden transition-all duration-500
                  ${isSelected ? 'ring-4 ring-primary ring-opacity-50 scale-105' : 'hover:scale-102'}
                  ${isHovered ? 'shadow-2xl' : ''}
                `}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  background: isSelected ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1))' : 'rgba(255, 255, 255, 0.8)'
                }}
                onClick={() => handlePersonaClick(persona)}
                onMouseEnter={() => setHoveredPersona(persona)}
                onMouseLeave={() => setHoveredPersona(null)}
              >
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl opacity-30 transform translate-x-16 -translate-y-16" />
                
                {/* Selected Badge */}
                {isSelected && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-success to-secondary text-white border-0 shadow-lg">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Selected
                    </Badge>
                  </div>
                )}

                <CardHeader className="relative z-10 pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`
                      w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-transform duration-300
                      ${isHovered ? 'scale-110' : ''}
                    `}
                    style={{ 
                      background: `linear-gradient(135deg, hsl(var(--${config.color})/0.1), hsl(var(--${config.color})/0.2))` 
                    }}>
                      {config.icon}
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-foreground">
                        {config.name}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {config.targetAudience}
                      </CardDescription>
                    </div>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-3 rounded-lg bg-muted/30">
                      <div className="text-lg font-bold text-primary">{config.timeToValue}</div>
                      <div className="text-xs text-muted-foreground">Time to Value</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/30">
                      <div className="text-lg font-bold text-secondary">{config.estimatedSavings}</div>
                      <div className="text-xs text-muted-foreground">Est. Savings</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10">
                  {/* Description */}
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {config.description}
                  </p>

                  {/* Primary Needs */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Primary Needs:</h4>
                    <div className="flex flex-wrap gap-1">
                      {config.primaryNeeds.slice(0, 3).map((need: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs bg-primary/5 border-primary/20">
                          {need}
                        </Badge>
                      ))}
                      {config.primaryNeeds.length > 3 && (
                        <Badge variant="outline" className="text-xs bg-muted/30">
                          +{config.primaryNeeds.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Key Features Preview */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {config.features.slice(0, 3).map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Selection Indicator */}
                  <div className={`
                    w-full h-1 rounded-full transition-all duration-300
                    ${isSelected ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-muted/30'}
                  `} />
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Selected Persona Details */}
        {currentPersona && (
          <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-8 animate-fade-in">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">
                        Perfect Choice for {getPersonaConfig(currentPersona).name}!
                      </h3>
                      <p className="text-muted-foreground">
                        Here's what you'll get with this profile
                      </p>
                    </div>
                  </div>

                  {/* Subscription Benefits */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">What's Included:</h4>
                    {Object.entries(getPersonaConfig(currentPersona).subscription).map(([plan, features]: [string, any]) => (
                      <div key={plan} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium capitalize text-primary">{plan} Plan</span>
                          {plan === 'free' && (
                            <Badge className="bg-success text-white">Free Forever</Badge>
                          )}
                        </div>
                        <ul className="space-y-1">
                          {(features as string[]).map((feature: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="w-4 h-4 text-success" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:pl-8">
                  {/* Experience Preview */}
                  <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-2xl p-6">
                    <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Your Personalized Experience
                    </h4>
                    
                    {/* Mock Dashboard Preview */}
                    <div className="space-y-3">
                      <div className="bg-white/60 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-20 h-3 bg-primary/20 rounded"></div>
                          <div className="w-12 h-3 bg-success/20 rounded"></div>
                        </div>
                        <div className="w-full h-2 bg-muted/30 rounded">
                          <div className="w-3/4 h-2 bg-gradient-to-r from-primary to-secondary rounded"></div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/60 rounded-lg p-3">
                          <div className="w-16 h-3 bg-secondary/20 rounded mb-2"></div>
                          <div className="w-12 h-4 bg-accent/30 rounded"></div>
                        </div>
                        <div className="bg-white/60 rounded-lg p-3">
                          <div className="w-16 h-3 bg-primary/20 rounded mb-2"></div>
                          <div className="w-12 h-4 bg-success/30 rounded"></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-success" />
                        AI-powered insights tailored for your needs
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-primary" />
                        Save {getPersonaConfig(currentPersona).timeToValue} on financial tasks
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Join thousands of satisfied users
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          {onBack && (
            <Button variant="outline" onClick={onBack} className="btn-hover px-8 py-4">
              Back
            </Button>
          )}
          
          <Button 
            onClick={handleContinue}
            disabled={!currentPersona}
            className="btn-hover bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 text-lg font-semibold disabled:opacity-50"
          >
            {currentPersona ? (
              <>
                Continue as {getPersonaConfig(currentPersona).name}
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            ) : (
              'Select a Profile to Continue'
            )}
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center gap-8 mt-12 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            <span>1M+ Users Trust FinTwin</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>4.9/5 User Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>5-Min Setup</span>
          </div>
        </div>
      </div>
    </div>
  )
}
