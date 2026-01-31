interface SleepEntry {
  id: number
  sleepDate: string
  bedTime: string
  wakeTime: string
  duration: number
  quality: number
  notes: string
}

interface Insight {
  type: 'pattern' | 'recommendation' | 'warning' | 'achievement'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  actionable: boolean
}

export class AIInsightsService {
  static generateInsights(entries: SleepEntry[]): Insight[] {
    const insights: Insight[] = []
    
    if (entries.length === 0) {
      return [{
        type: 'recommendation',
        title: 'Start Tracking',
        description: 'Begin logging your sleep to receive personalized insights and recommendations.',
        priority: 'high',
        actionable: true
      }]
    }

    // Analyze sleep duration patterns
    const durationInsights = this.analyzeDurationPatterns(entries)
    insights.push(...durationInsights)

    // Analyze sleep quality patterns
    const qualityInsights = this.analyzeQualityPatterns(entries)
    insights.push(...qualityInsights)

    // Analyze bedtime consistency
    const consistencyInsights = this.analyzeConsistency(entries)
    insights.push(...consistencyInsights)

    // Analyze weekly patterns
    const weeklyInsights = this.analyzeWeeklyPatterns(entries)
    insights.push(...weeklyInsights)

    // Generate recommendations
    const recommendations = this.generateRecommendations(entries)
    insights.push(...recommendations)

    // Sort by priority
    return insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  private static analyzeDurationPatterns(entries: SleepEntry[]): Insight[] {
    const insights: Insight[] = []
    const durations = entries.map(e => e.duration / 60) // Convert to hours
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length
    
    // Check for insufficient sleep
    if (avgDuration < 7) {
      insights.push({
        type: 'warning',
        title: 'Insufficient Sleep Duration',
        description: `You're averaging ${avgDuration.toFixed(1)} hours of sleep per night. Consider aiming for 7-9 hours for optimal health.`,
        priority: 'high',
        actionable: true
      })
    } else if (avgDuration > 9) {
      insights.push({
        type: 'pattern',
        title: 'Extended Sleep Duration',
        description: `You're averaging ${avgDuration.toFixed(1)} hours of sleep. While individual needs vary, consistently sleeping over 9 hours may indicate underlying issues.`,
        priority: 'medium',
        actionable: true
      })
    } else {
      insights.push({
        type: 'achievement',
        title: 'Optimal Sleep Duration',
        description: `Great job! You're averaging ${avgDuration.toFixed(1)} hours of sleep, which is within the recommended range.`,
        priority: 'low',
        actionable: false
      })
    }

    // Check for recent trends
    const recentEntries = entries.slice(-7)
    const recentAvg = recentEntries.reduce((sum, e) => sum + e.duration / 60, 0) / recentEntries.length
    
    if (recentAvg < avgDuration - 0.5) {
      insights.push({
        type: 'warning',
        title: 'Declining Sleep Duration',
        description: 'Your sleep duration has decreased recently. Consider evaluating recent changes in your routine.',
        priority: 'medium',
        actionable: true
      })
    }

    return insights
  }

  private static analyzeQualityPatterns(entries: SleepEntry[]): Insight[] {
    const insights: Insight[] = []
    const qualities = entries.map(e => e.quality)
    const avgQuality = qualities.reduce((a, b) => a + b, 0) / qualities.length
    
    if (avgQuality < 5) {
      insights.push({
        type: 'warning',
        title: 'Poor Sleep Quality',
        description: `Your average sleep quality is ${avgQuality.toFixed(1)}/10. Consider improving your sleep environment and habits.`,
        priority: 'high',
        actionable: true
      })
    } else if (avgQuality > 8) {
      insights.push({
        type: 'achievement',
        title: 'Excellent Sleep Quality',
        description: `Outstanding! Your average sleep quality is ${avgQuality.toFixed(1)}/10. Keep up the great habits!`,
        priority: 'low',
        actionable: false
      })
    }

    // Check for quality consistency
    const qualityVariance = this.calculateVariance(qualities)
    if (qualityVariance > 4) {
      insights.push({
        type: 'pattern',
        title: 'Inconsistent Sleep Quality',
        description: 'Your sleep quality varies significantly. Focus on maintaining consistent routines for more stable sleep.',
        priority: 'medium',
        actionable: true
      })
    }

    return insights
  }

  private static analyzeConsistency(entries: SleepEntry[]): Insight[] {
    const insights: Insight[] = []
    
    // Analyze bedtime consistency
    const bedTimes = entries.map(e => {
      const [hours, minutes] = e.bedTime.split(':').map(Number)
      return hours * 60 + minutes
    })
    
    const bedtimeVariance = this.calculateVariance(bedTimes)
    if (bedtimeVariance > 120) { // More than 2 hours variance
      insights.push({
        type: 'recommendation',
        title: 'Inconsistent Bedtime',
        description: 'Your bedtime varies significantly. Try to maintain a consistent bedtime for better sleep quality.',
        priority: 'medium',
        actionable: true
      })
    }

    // Analyze wake time consistency
    const wakeTimes = entries.map(e => {
      const [hours, minutes] = e.wakeTime.split(':').map(Number)
      return hours * 60 + minutes
    })
    
    const wakeTimeVariance = this.calculateVariance(wakeTimes)
    if (wakeTimeVariance > 60) { // More than 1 hour variance
      insights.push({
        type: 'recommendation',
        title: 'Inconsistent Wake Time',
        description: 'Your wake time varies. A consistent wake time helps regulate your circadian rhythm.',
        priority: 'medium',
        actionable: true
      })
    }

    return insights
  }

  private static analyzeWeeklyPatterns(entries: SleepEntry[]): Insight[] {
    const insights: Insight[] = []
    
    // Group by day of week
    const dayData: { [key: number]: { durations: number[], qualities: number[] } } = {}
    
    entries.forEach(entry => {
      const dayOfWeek = new Date(entry.sleepDate).getDay()
      if (!dayData[dayOfWeek]) {
        dayData[dayOfWeek] = { durations: [], qualities: [] }
      }
      dayData[dayOfWeek].durations.push(entry.duration / 60)
      dayData[dayOfWeek].qualities.push(entry.quality)
    })

    // Check for weekend vs weekday patterns
    const weekdays = [1, 2, 3, 4, 5] // Mon-Fri
    const weekends = [0, 6] // Sun-Sat
    
    const weekdayAvg = this.calculateAverageForDays(dayData, weekdays, 'durations')
    const weekendAvg = this.calculateAverageForDays(dayData, weekends, 'durations')
    
    if (Math.abs(weekdayAvg - weekendAvg) > 1.5) {
      insights.push({
        type: 'pattern',
        title: 'Weekend Sleep Shift',
        description: `Your sleep duration differs significantly between weekdays (${weekdayAvg.toFixed(1)}h) and weekends (${weekendAvg.toFixed(1)}h). Try to minimize this difference.`,
        priority: 'medium',
        actionable: true
      })
    }

    return insights
  }

  private static generateRecommendations(entries: SleepEntry[]): Insight[] {
    const insights: Insight[] = []
    
    // Check for notes indicating issues
    const stressEntries = entries.filter(e => 
      e.notes.toLowerCase().includes('stress') || 
      e.notes.toLowerCase().includes('anxious')
    )
    
    if (stressEntries.length > entries.length * 0.3) {
      insights.push({
        type: 'recommendation',
        title: 'Stress Management',
        description: 'Stress appears to be affecting your sleep. Consider relaxation techniques like meditation or gentle stretching before bed.',
        priority: 'high',
        actionable: true
      })
    }

    const caffeineEntries = entries.filter(e => 
      e.notes.toLowerCase().includes('caffeine') || 
      e.notes.toLowerCase().includes('coffee')
    )
    
    if (caffeineEntries.length > 0) {
      insights.push({
        type: 'recommendation',
        title: 'Caffeine Awareness',
        description: 'Caffeine may be impacting your sleep. Try avoiding caffeine at least 6 hours before bedtime.',
        priority: 'medium',
        actionable: true
      })
    }

    return insights
  }

  private static calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2))
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length
  }

  private static calculateAverageForDays(
    dayData: { [key: number]: { durations: number[], qualities: number[] } },
    days: number[],
    metric: 'durations' | 'qualities'
  ): number {
    const values: number[] = []
    days.forEach(day => {
      if (dayData[day]) {
        values.push(...dayData[day][metric])
      }
    })
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0
  }
}
