"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { api } from "@/lib/api"

interface Goal {
  id: string
  name: string
  description: string
  target: number
  current: number
  unit: string
  category: 'duration' | 'quality' | 'consistency' | 'bedtime'
  deadline: string
  isActive: boolean
  createdAt: string
  milestones: Milestone[]
}

interface Milestone {
  id: string
  title: string
  target: number
  achieved: boolean
  achievedAt?: string
}

interface CreateGoalData {
  name: string
  description: string
  target: number
  unit: string
  category: 'duration' | 'quality' | 'consistency' | 'bedtime'
  deadline: string
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newGoal, setNewGoal] = useState<CreateGoalData>({
    name: '',
    description: '',
    target: 7,
    unit: 'hours',
    category: 'duration',
    deadline: ''
  })
  const router = useRouter()

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      // For now, use mock data since we don't have goals API yet
      const mockGoals: Goal[] = [
        {
          id: '1',
          name: 'Consistent 8 Hours Sleep',
          description: 'Sleep for at least 8 hours every night for a month',
          target: 30,
          current: 18,
          unit: 'days',
          category: 'duration',
          deadline: '2024-02-29',
          isActive: true,
          createdAt: '2024-01-01',
          milestones: [
            { id: '1', title: 'First Week', target: 7, achieved: true },
            { id: '2', title: 'Two Weeks', target: 14, achieved: true },
            { id: '3', title: 'Three Weeks', target: 21, achieved: false }
          ]
        },
        {
          id: '2',
          name: 'Improve Sleep Quality',
          description: 'Maintain an average sleep quality of 8/10 or higher',
          target: 8,
          current: 7.2,
          unit: 'points',
          category: 'quality',
          deadline: '2024-02-15',
          isActive: true,
          createdAt: '2024-01-01',
          milestones: [
            { id: '4', title: 'Reach 7.5', target: 7.5, achieved: true },
            { id: '5', title: 'Reach 8.0', target: 8, achieved: false }
          ]
        }
      ]
      setGoals(mockGoals)
    } catch (error) {
      console.error("Failed to fetch goals:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateGoal = async () => {
    try {
      const goal: Goal = {
        id: Date.now().toString(),
        ...newGoal,
        current: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        milestones: generateMilestones(newGoal)
      }
      
      setGoals([...goals, goal])
      setShowCreateForm(false)
      setNewGoal({
        name: '',
        description: '',
        target: 7,
        unit: 'hours',
        category: 'duration',
        deadline: ''
      })
    } catch (error) {
      console.error("Failed to create goal:", error)
    }
  }

  const generateMilestones = (goal: CreateGoalData): Milestone[] => {
    const milestones: Milestone[] = []
    const steps = Math.min(4, Math.floor(goal.target / 2))
    
    for (let i = 1; i <= steps; i++) {
      milestones.push({
        id: `milestone-${i}`,
        title: `Step ${i}`,
        target: (goal.target / steps) * i,
        achieved: false
      })
    }
    
    return milestones
  }

  const updateGoalProgress = (goalId: string, newProgress: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const updatedGoal = { ...goal, current: newProgress }
        
        // Update milestones
        updatedGoal.milestones = goal.milestones.map(milestone => ({
          ...milestone,
          achieved: newProgress >= milestone.target,
          achievedAt: newProgress >= milestone.target && !milestone.achieved 
            ? new Date().toISOString() 
            : milestone.achievedAt
        }))
        
        return updatedGoal
      }
      return goal
    }))
  }

  const toggleGoalStatus = (goalId: string) => {
    setGoals(goals.map(goal => 
      goal.id === goalId ? { ...goal, isActive: !goal.isActive } : goal
    ))
  }

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId))
  }

  const getProgressPercentage = (goal: Goal) => {
    return Math.min((goal.current / goal.target) * 100, 100)
  }

  const getDaysRemaining = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'duration': return '⏰'
      case 'quality': return '⭐'
      case 'consistency': return '🔄'
      case 'bedtime': return '🌙'
      default: return '🎯'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'duration': return 'from-blue-500 to-blue-600'
      case 'quality': return 'from-green-500 to-green-600'
      case 'consistency': return 'from-purple-500 to-purple-600'
      case 'bedtime': return 'from-indigo-500 to-indigo-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </main>
    )
  }

  const activeGoals = goals.filter(goal => goal.isActive)
  const completedGoals = goals.filter(goal => !goal.isActive)

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Smart Goals
          </h1>
          <p className="text-muted-foreground">Set ambitious sleep goals and track your progress with detailed statistics</p>
        </div>

        {/* Create Goal Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
          >
            🎯 Create New Goal
          </button>
        </div>

        {/* Create Goal Form */}
        {showCreateForm && (
          <div className="card-premium mb-8">
            <h3 className="text-xl font-semibold mb-4">Create New Goal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Goal Name</label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  className="input-premium"
                  placeholder="e.g., Sleep 8 hours nightly"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value as any})}
                  className="input-premium"
                >
                  <option value="duration">Sleep Duration</option>
                  <option value="quality">Sleep Quality</option>
                  <option value="consistency">Consistency</option>
                  <option value="bedtime">Bedtime Routine</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Target</label>
                <input
                  type="number"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({...newGoal, target: Number(e.target.value)})}
                  className="input-premium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Unit</label>
                <input
                  type="text"
                  value={newGoal.unit}
                  onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                  className="input-premium"
                  placeholder="hours, days, points..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  className="input-premium resize-none"
                  rows={3}
                  placeholder="Describe your goal and why it's important to you..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Deadline</label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                  className="input-premium"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleCreateGoal}
                disabled={!newGoal.name || !newGoal.deadline}
                className="btn-primary bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
              >
                Create Goal
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="btn-secondary bg-secondary text-foreground px-6 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Active Goals */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Active Goals</h2>
          {activeGoals.length === 0 ? (
            <div className="card-premium text-center py-8">
              <p className="text-muted-foreground">No active goals. Create your first goal to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeGoals.map(goal => (
                <div key={goal.id} className="card-premium">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getCategoryColor(goal.category)} flex items-center justify-center text-white text-xl`}>
                        {getCategoryIcon(goal.category)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{goal.name}</h3>
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleGoalStatus(goal.id)}
                        className="text-sm px-3 py-1 bg-secondary rounded-lg hover:bg-secondary/80"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="text-sm px-3 py-1 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{goal.current}/{goal.target} {goal.unit}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 bg-gradient-to-r ${getCategoryColor(goal.category)}`}
                        style={{ width: `${getProgressPercentage(goal)}%` }}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {getProgressPercentage(goal).toFixed(0)}% complete
                    </div>
                  </div>

                  {/* Milestones */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Milestones</h4>
                    <div className="space-y-2">
                      {goal.milestones.map(milestone => (
                        <div key={milestone.id} className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${milestone.achieved ? 'bg-green-500' : 'bg-muted'}`} />
                          <span className={`text-sm ${milestone.achieved ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {milestone.title}: {milestone.target} {goal.unit}
                          </span>
                          {milestone.achieved && <span className="text-xs text-green-500">✓</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Deadline</span>
                    <span className={getDaysRemaining(goal.deadline) < 7 ? 'text-destructive' : ''}>
                      {new Date(goal.deadline).toLocaleDateString()} ({getDaysRemaining(goal.deadline)} days)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Completed Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedGoals.map(goal => (
                <div key={goal.id} className="card-premium opacity-75">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getCategoryColor(goal.category)} flex items-center justify-center text-white`}>
                      {getCategoryIcon(goal.category)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{goal.name}</h3>
                      <p className="text-sm text-muted-foreground">Completed on {new Date(goal.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="text-green-500 text-lg">✓</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Final progress: {goal.current}/{goal.target} {goal.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
