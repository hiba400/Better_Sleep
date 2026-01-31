"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { api } from "@/lib/api"

interface Advice {
  id: string
  title: string
  category: 'environment' | 'lifestyle' | 'routine' | 'diet' | 'exercise' | 'stress' | 'personalized'
  description: string
  tips: string[]
  evidence: string
  difficulty: 'easy' | 'medium' | 'hard'
  timeToImplement: string
  benefits: string[]
  icon: string
  isBookmarked: boolean
}

export default function AdvicePage() {
  const [advice, setAdvice] = useState<Advice[]>([])
  const [filteredAdvice, setFilteredAdvice] = useState<Advice[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchAdvice()
  }, [])

  useEffect(() => {
    filterAdvice()
  }, [advice, selectedCategory, searchTerm])

  const fetchAdvice = async () => {
    try {
      const userId = 1 // Temporary hardcoded user ID
      
      // Fetch personalized advice from backend
      try {
        const backendAdvice = await api.advice.getAdvice(userId)
        if (backendAdvice && backendAdvice.conseilPrincipal) {
          // Convert backend advice to frontend format
          const personalizedAdvice: Advice = {
            id: 'personalized',
            title: '🎯 Conseil Personnel',
            category: 'personalized',
            description: backendAdvice.conseilPrincipal,
            tips: backendAdvice.conseilsAdditionnels || [],
            evidence: 'Basé sur vos données de sommeil récentes',
            difficulty: 'medium',
            timeToImplement: '1 semaine',
            benefits: ['Amélioration personnalisée', 'Basé sur vos habitudes'],
            icon: '🤖',
            isBookmarked: false
          }
          
          // Mock advice for additional content
          const mockAdvice: Advice[] = [
            {
              id: '1',
              title: 'Optimize Your Sleep Environment',
              category: 'environment',
              description: 'Create the perfect bedroom environment for quality sleep',
              tips: [
                'Keep your bedroom cool (60-67°F or 15-19°C)',
                'Use blackout curtains or an eye mask',
                'Reduce noise with earplugs or white noise',
                'Remove electronic devices from bedroom',
                'Invest in a comfortable mattress and pillows'
              ],
              evidence: 'Studies show that environmental factors can improve sleep quality by up to 30%',
              difficulty: 'easy',
              timeToImplement: '1-2 hours',
              benefits: ['Better sleep quality', 'Faster sleep onset', 'Fewer nighttime awakenings'],
              icon: '🏠',
              isBookmarked: false
            },
            {
              id: '2',
              title: 'Establish a Consistent Sleep Schedule',
              category: 'routine',
              description: 'Maintain regular sleep and wake times for better circadian rhythm',
              tips: [
                'Go to bed and wake up at the same time daily',
                'Stick to your schedule even on weekends',
                'Create a relaxing bedtime routine',
                'Avoid screens 1 hour before bed',
                'Use dim lighting in the evening'
              ],
              evidence: 'Research shows that consistent sleep schedules improve sleep efficiency and daytime alertness',
              difficulty: 'medium',
              timeToImplement: '1 week',
              benefits: ['Improved sleep quality', 'Better mood', 'Enhanced cognitive function'],
              icon: '⏰',
              isBookmarked: false
            },
            {
              id: '3',
              title: 'Mind Your Diet for Better Sleep',
              category: 'diet',
              description: 'Nutritional choices that promote better sleep',
              tips: [
                'Avoid caffeine 6 hours before bedtime',
                'Limit alcohol, especially close to bedtime',
                'Eat a light dinner 2-3 hours before bed',
                'Try sleep-promoting foods (cherries, nuts, warm milk)',
                'Stay hydrated but limit fluids before bed'
              ],
              evidence: 'Nutritional timing and choices can significantly impact sleep onset and quality',
              difficulty: 'medium',
              timeToImplement: '3-5 days',
              benefits: ['Faster sleep onset', 'Reduced nighttime awakenings', 'Better sleep quality'],
              icon: '🥗',
              isBookmarked: false
            },
            {
              id: '4',
              title: 'Exercise for Better Sleep',
              category: 'exercise',
              description: 'Physical activity guidelines for improved sleep',
              tips: [
                'Aim for 150 minutes of moderate exercise weekly',
                'Exercise earlier in the day when possible',
                'Avoid intense workouts within 3 hours of bedtime',
                'Try gentle yoga or stretching before bed',
                'Include both cardio and strength training'
              ],
              evidence: 'Regular exercise can reduce sleep onset time by 15 minutes and increase total sleep time',
              difficulty: 'medium',
              timeToImplement: '2 weeks',
              benefits: ['Deeper sleep', 'Faster sleep onset', 'Better mood', 'More energy'],
              icon: '🏃',
              isBookmarked: false
            },
            {
              id: '5',
              title: 'Stress Management Techniques',
              category: 'stress',
              description: 'Mental strategies to calm your mind for better sleep',
              tips: [
                'Practice meditation or mindfulness',
                'Try progressive muscle relaxation',
                'Journal before bed to clear your mind',
                'Use breathing exercises (4-7-8 technique)',
                'Consider cognitive behavioral therapy for insomnia'
              ],
              evidence: 'Stress reduction techniques can improve sleep quality by 25-40%',
              difficulty: 'hard',
              timeToImplement: '2-4 weeks',
              benefits: ['Reduced anxiety', 'Better sleep quality', 'Improved mental health'],
              icon: '🧘',
              isBookmarked: false
            },
            {
              id: '6',
              title: 'Smart Napping Strategies',
              category: 'lifestyle',
              description: 'How to nap effectively without disrupting nighttime sleep',
              tips: [
                'Keep naps short (20-30 minutes)',
                'Nap before 3 PM to avoid affecting nighttime sleep',
                'Find a comfortable, quiet place',
                'Use a timer to avoid oversleeping',
                'Consider caffeine naps (coffee before nap)'
              ],
              evidence: 'Strategic napping can improve alertness by 30% without affecting nighttime sleep',
              difficulty: 'easy',
              timeToImplement: '1 day',
              benefits: ['Increased alertness', 'Better mood', 'Improved performance'],
              icon: '😴',
              isBookmarked: false
            }
          ]
          
          setAdvice([personalizedAdvice, ...mockAdvice.slice(0, 5)])
        } else {
          // Fallback to mock advice only
          const mockAdvice: Advice[] = [
            {
              id: '1',
              title: 'Optimize Your Sleep Environment',
              category: 'environment',
              description: 'Create the perfect bedroom environment for quality sleep',
              tips: [
                'Keep your bedroom cool (60-67°F or 15-19°C)',
                'Use blackout curtains or an eye mask',
                'Reduce noise with earplugs or white noise',
                'Remove electronic devices from bedroom',
                'Invest in a comfortable mattress and pillows'
              ],
              evidence: 'Studies show that environmental factors can improve sleep quality by up to 30%',
              difficulty: 'easy',
              timeToImplement: '1-2 hours',
              benefits: ['Better sleep quality', 'Faster sleep onset', 'Fewer nighttime awakenings'],
              icon: '🏠',
              isBookmarked: false
            },
            {
              id: '2',
              title: 'Establish a Consistent Sleep Schedule',
              category: 'routine',
              description: 'Maintain regular sleep and wake times for better circadian rhythm',
              tips: [
                'Go to bed and wake up at the same time daily',
                'Stick to your schedule even on weekends',
                'Create a relaxing bedtime routine',
                'Avoid screens 1 hour before bed',
                'Use dim lighting in the evening'
              ],
              evidence: 'Research shows that consistent sleep schedules improve sleep efficiency and daytime alertness',
              difficulty: 'medium',
              timeToImplement: '1 week',
              benefits: ['Improved sleep quality', 'Better mood', 'Enhanced cognitive function'],
              icon: '⏰',
              isBookmarked: false
            },
            {
              id: '3',
              title: 'Mind Your Diet for Better Sleep',
              category: 'diet',
              description: 'Nutritional choices that promote better sleep',
              tips: [
                'Avoid caffeine 6 hours before bedtime',
                'Limit alcohol, especially close to bedtime',
                'Eat a light dinner 2-3 hours before bed',
                'Try sleep-promoting foods (cherries, nuts, warm milk)',
                'Stay hydrated but limit fluids before bed'
              ],
              evidence: 'Nutritional timing and choices can significantly impact sleep onset and quality',
              difficulty: 'medium',
              timeToImplement: '3-5 days',
              benefits: ['Faster sleep onset', 'Reduced nighttime awakenings', 'Better sleep quality'],
              icon: '🥗',
              isBookmarked: false
            },
            {
              id: '4',
              title: 'Exercise for Better Sleep',
              category: 'exercise',
              description: 'Physical activity guidelines for improved sleep',
              tips: [
                'Aim for 150 minutes of moderate exercise weekly',
                'Exercise earlier in the day when possible',
                'Avoid intense workouts within 3 hours of bedtime',
                'Try gentle yoga or stretching before bed',
                'Include both cardio and strength training'
              ],
              evidence: 'Regular exercise can reduce sleep onset time by 15 minutes and increase total sleep time',
              difficulty: 'medium',
              timeToImplement: '2 weeks',
              benefits: ['Deeper sleep', 'Faster sleep onset', 'Better mood', 'More energy'],
              icon: '🏃',
              isBookmarked: false
            },
            {
              id: '5',
              title: 'Stress Management Techniques',
              category: 'stress',
              description: 'Mental strategies to calm your mind for better sleep',
              tips: [
                'Practice meditation or mindfulness',
                'Try progressive muscle relaxation',
                'Journal before bed to clear your mind',
                'Use breathing exercises (4-7-8 technique)',
                'Consider cognitive behavioral therapy for insomnia'
              ],
              evidence: 'Stress reduction techniques can improve sleep quality by 25-40%',
              difficulty: 'hard',
              timeToImplement: '2-4 weeks',
              benefits: ['Reduced anxiety', 'Better sleep quality', 'Improved mental health'],
              icon: '🧘',
              isBookmarked: false
            },
            {
              id: '6',
              title: 'Smart Napping Strategies',
              category: 'lifestyle',
              description: 'How to nap effectively without disrupting nighttime sleep',
              tips: [
                'Keep naps short (20-30 minutes)',
                'Nap before 3 PM to avoid affecting nighttime sleep',
                'Find a comfortable, quiet place',
                'Use a timer to avoid oversleeping',
                'Consider caffeine naps (coffee before nap)'
              ],
              evidence: 'Strategic napping can improve alertness by 30% without affecting nighttime sleep',
              difficulty: 'easy',
              timeToImplement: '1 day',
              benefits: ['Increased alertness', 'Better mood', 'Improved performance'],
              icon: '😴',
              isBookmarked: false
            }
          ]
          setAdvice(mockAdvice)
        }
      } catch (error) {
        console.error("Failed to fetch backend advice:", error)
        // Fallback to mock advice
        const mockAdvice: Advice[] = [
          {
            id: '1',
            title: 'Optimize Your Sleep Environment',
            category: 'environment',
            description: 'Create the perfect bedroom environment for quality sleep',
            tips: [
              'Keep your bedroom cool (60-67°F or 15-19°C)',
              'Use blackout curtains or an eye mask',
              'Reduce noise with earplugs or white noise',
              'Remove electronic devices from bedroom',
              'Invest in a comfortable mattress and pillows'
            ],
            evidence: 'Studies show that environmental factors can improve sleep quality by up to 30%',
            difficulty: 'easy',
            timeToImplement: '1-2 hours',
            benefits: ['Better sleep quality', 'Faster sleep onset', 'Fewer nighttime awakenings'],
            icon: '🏠',
            isBookmarked: false
          }
        ]
        setAdvice(mockAdvice)
      }
    } catch (error) {
      console.error("Failed to fetch advice:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAdvice = () => {
    let filtered = advice
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tips.some(tip => tip.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    
    setFilteredAdvice(filtered)
  }

  const toggleBookmark = (adviceId: string) => {
    setAdvice(advice.map(item => 
      item.id === adviceId ? { ...item, isBookmarked: !item.isBookmarked } : item
    ))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'environment': return 'from-blue-500 to-blue-600'
      case 'lifestyle': return 'from-green-500 to-green-600'
      case 'routine': return 'from-purple-500 to-purple-600'
      case 'diet': return 'from-orange-500 to-orange-600'
      case 'exercise': return 'from-red-500 to-red-600'
      case 'stress': return 'from-indigo-500 to-indigo-600'
      case 'personalized': return 'from-yellow-500 to-yellow-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const categories = [
    { id: 'all', name: 'All Advice', icon: '📚' },
    { id: 'personalized', name: 'Personalized', icon: '🎯' },
    { id: 'environment', name: 'Environment', icon: '🏠' },
    { id: 'lifestyle', name: 'Lifestyle', icon: '🌟' },
    { id: 'routine', name: 'Routine', icon: '⏰' },
    { id: 'diet', name: 'Diet', icon: '🥗' },
    { id: 'exercise', name: 'Exercise', icon: '🏃' },
    { id: 'stress', name: 'Stress', icon: '🧘' }
  ]

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

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            💡 Sleep Advice
          </h1>
          <p className="text-muted-foreground">Evidence-based tips and strategies to improve your sleep quality</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search advice..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-premium w-full"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Advice Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAdvice.map(item => (
            <div key={item.id} className="card-premium">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getCategoryColor(item.category)} flex items-center justify-center text-white text-xl`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleBookmark(item.id)}
                  className={`text-2xl ${item.isBookmarked ? 'text-yellow-500' : 'text-muted-foreground hover:text-yellow-500'}`}
                >
                  {item.isBookmarked ? '⭐' : '☆'}
                </button>
              </div>

              {/* Tags */}
              <div className="flex gap-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(item.difficulty)}`}>
                  {item.difficulty}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-secondary text-muted-foreground">
                  {item.timeToImplement}
                </span>
              </div>

              {/* Tips */}
              <div className="mb-4">
                <h4 className="font-medium mb-2">Key Tips:</h4>
                <ul className="space-y-1">
                  {item.tips.slice(0, 3).map((tip, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {tip}
                    </li>
                  ))}
                  {item.tips.length > 3 && (
                    <li className="text-sm text-primary">+{item.tips.length - 3} more tips</li>
                  )}
                </ul>
              </div>

              {/* Benefits */}
              <div className="mb-4">
                <h4 className="font-medium mb-2">Benefits:</h4>
                <div className="flex flex-wrap gap-1">
                  {item.benefits.map((benefit, index) => (
                    <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>

              {/* Evidence */}
              <div className="text-xs text-muted-foreground italic">
                💡 {item.evidence}
              </div>
            </div>
          ))}
        </div>

        {filteredAdvice.length === 0 && (
          <div className="card-premium text-center py-12">
            <p className="text-muted-foreground">No advice found matching your criteria.</p>
          </div>
        )}
      </div>
    </main>
  )
}
