interface SleepEntry {
  id: number
  sleepDate: string
  bedTime: string
  wakeTime: string
  duration: number
  quality: number
  notes: string
}

interface Alert {
  id: string
  type: 'warning' | 'info' | 'success' | 'critical'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  category: 'sleep_debt' | 'quality_decline' | 'consistency' | 'achievement' | 'recommendation'
  actionable: boolean
  actionText?: string
  actionUrl?: string
}

export class SmartAlertsService {
  static generateAlerts(entries: SleepEntry[]): Alert[] {
    const alerts: Alert[] = []
    
    if (entries.length === 0) {
      return [{
        id: 'welcome',
        type: 'info',
        title: 'Welcome to SleepBetter!',
        message: 'Start logging your sleep to receive personalized alerts and insights.',
        timestamp: new Date().toISOString(),
        isRead: false,
        category: 'recommendation',
        actionable: true,
        actionText: 'Log Sleep',
        actionUrl: '/sleep-entry'
      }]
    }

    // Check for sleep debt
    const sleepDebtAlerts = this.checkSleepDebt(entries)
    alerts.push(...sleepDebtAlerts)

    // Check for quality decline
    const qualityAlerts = this.checkQualityDecline(entries)
    alerts.push(...qualityAlerts)

    // Check for consistency issues
    const consistencyAlerts = this.checkConsistency(entries)
    alerts.push(...consistencyAlerts)

    // Check for achievements
    const achievementAlerts = this.checkAchievements(entries)
    alerts.push(...achievementAlerts)

    // Generate recommendations
    const recommendationAlerts = this.generateRecommendations(entries)
    alerts.push(...recommendationAlerts)

    return alerts.sort((a, b) => {
      const priorityOrder = { critical: 4, warning: 3, info: 2, success: 1 }
      return priorityOrder[b.type] - priorityOrder[a.type]
    })
  }

  private static checkSleepDebt(entries: SleepEntry[]): Alert[] {
    const alerts: Alert[] = []
    const recentEntries = entries.slice(-7) // Last 7 days
    const durations = recentEntries.map(e => e.duration / 60)
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length

    if (avgDuration < 6) {
      alerts.push({
        id: 'critical-sleep-debt',
        type: 'critical',
        title: 'Critical Sleep Debt Detected',
        message: `You're averaging only ${avgDuration.toFixed(1)} hours of sleep. This can seriously impact your health and cognitive function.`,
        timestamp: new Date().toISOString(),
        isRead: false,
        category: 'sleep_debt',
        actionable: true,
        actionText: 'Get Sleep Advice',
        actionUrl: '/advice'
      })
    } else if (avgDuration < 7) {
      alerts.push({
        id: 'sleep-debt-warning',
        type: 'warning',
        title: 'Sleep Debt Warning',
        message: `You're averaging ${avgDuration.toFixed(1)} hours of sleep. Consider prioritizing more rest.`,
        timestamp: new Date().toISOString(),
        isRead: false,
        category: 'sleep_debt',
        actionable: true,
        actionText: 'Set Sleep Goals',
        actionUrl: '/goals'
      })
    }

    return alerts
  }

  private static checkQualityDecline(entries: SleepEntry[]): Alert[] {
    const alerts: Alert[] = []
    
    if (entries.length < 3) return alerts

    const recentEntries = entries.slice(-7)
    const olderEntries = entries.slice(-14, -7)
    
    if (olderEntries.length === 0) return alerts

    const recentAvg = recentEntries.reduce((sum, e) => sum + e.quality, 0) / recentEntries.length
    const olderAvg = olderEntries.reduce((sum, e) => sum + e.quality, 0) / olderEntries.length

    if (recentAvg < olderAvg - 2) {
      alerts.push({
        id: 'quality-decline',
        type: 'warning',
        title: 'Sleep Quality Declining',
        message: `Your sleep quality has dropped from ${olderAvg.toFixed(1)} to ${recentAvg.toFixed(1)}. Consider reviewing recent changes in your routine.`,
        timestamp: new Date().toISOString(),
        isRead: false,
        category: 'quality_decline',
        actionable: true,
        actionText: 'View Analytics',
        actionUrl: '/analytics'
      })
    }

    // Check for consistently poor quality
    const poorQualityCount = recentEntries.filter(e => e.quality < 5).length
    if (poorQualityCount >= 4) {
      alerts.push({
        id: 'consistently-poor-quality',
        type: 'critical',
        title: 'Consistently Poor Sleep Quality',
        message: `${poorQualityCount} out of your last 7 nights had poor sleep quality. This may indicate underlying issues that need attention.`,
        timestamp: new Date().toISOString(),
        isRead: false,
        category: 'quality_decline',
        actionable: true,
        actionText: 'Get Sleep Advice',
        actionUrl: '/advice'
      })
    }

    return alerts
  }

  private static checkConsistency(entries: SleepEntry[]): Alert[] {
    const alerts: Alert[] = []
    const recentEntries = entries.slice(-7)
    
    if (recentEntries.length < 3) return alerts

    // Check bedtime consistency
    const bedTimes = recentEntries.map(e => {
      const [hours, minutes] = e.bedTime.split(':').map(Number)
      return hours * 60 + minutes
    })
    
    const bedtimeVariance = this.calculateVariance(bedTimes)
    if (bedtimeVariance > 120) { // More than 2 hours variance
      alerts.push({
        id: 'inconsistent-bedtime',
        type: 'info',
        title: 'Inconsistent Bedtime Routine',
        message: 'Your bedtime varies significantly. A consistent schedule can improve sleep quality by 30%.',
        timestamp: new Date().toISOString(),
        isRead: false,
        category: 'consistency',
        actionable: true,
        actionText: 'Set Consistency Goal',
        actionUrl: '/goals'
      })
    }

    // Check for missed logging
    const lastEntry = new Date(recentEntries[0].sleepDate)
    const daysSinceLastEntry = Math.floor((new Date().getTime() - lastEntry.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysSinceLastEntry > 2) {
      alerts.push({
        id: 'missed-logging',
        type: 'info',
        title: 'Missing Sleep Data',
        message: `You haven't logged sleep for ${daysSinceLastEntry} days. Regular tracking provides better insights.`,
        timestamp: new Date().toISOString(),
        isRead: false,
        category: 'recommendation',
        actionable: true,
        actionText: 'Log Sleep Now',
        actionUrl: '/sleep-entry'
      })
    }

    return alerts
  }

  private static checkAchievements(entries: SleepEntry[]): Alert[] {
    const alerts: Alert[] = []
    
    // Check for streaks
    const recentEntries = entries.slice(-7)
    const goodSleepCount = recentEntries.filter(e => e.duration >= 7 * 60 && e.quality >= 7).length
    
    if (goodSleepCount === 7) {
      alerts.push({
        id: 'perfect-week',
        type: 'success',
        title: '🎉 Perfect Sleep Week!',
        message: 'Congratulations! You\'ve had 7 consecutive nights of good sleep (7+ hours, quality 7+). Keep up the excellent work!',
        timestamp: new Date().toISOString(),
        isRead: false,
        category: 'achievement',
        actionable: false
      })
    } else if (goodSleepCount >= 5) {
      alerts.push({
        id: 'good-week',
        type: 'success',
        title: 'Great Sleep Week!',
        message: `${goodSleepCount} out of 7 nights had good sleep. You\'re on the right track!`,
        timestamp: new Date().toISOString(),
        isRead: false,
        category: 'achievement',
        actionable: false
      })
    }

    // Check for milestones
    if (entries.length === 10) {
      alerts.push({
        id: '10-entries',
        type: 'success',
        title: '📊 10 Sleep Entries Logged!',
        message: 'You\'ve logged 10 sleep entries! Your data is now providing meaningful insights.',
        timestamp: new Date().toISOString(),
        isRead: false,
        category: 'achievement',
        actionable: true,
        actionText: 'View Analytics',
        actionUrl: '/analytics'
      })
    } else if (entries.length === 30) {
      alerts.push({
        id: '30-entries',
        type: 'success',
        title: '📈 30 Sleep Entries Logged!',
        message: 'Amazing! You\'ve been tracking your sleep for a month. Your patterns are now well-established.',
        timestamp: new Date().toISOString(),
        isRead: false,
        category: 'achievement',
        actionable: true,
        actionText: 'View Analytics',
        actionUrl: '/analytics'
      })
    }

    return alerts
  }

  private static generateRecommendations(entries: SleepEntry[]): Alert[] {
    const alerts: Alert[] = []
    const recentEntries = entries.slice(-7)
    
    // Check for weekend vs weekday patterns
    const weekdays = recentEntries.filter(e => {
      const day = new Date(e.sleepDate).getDay()
      return day >= 1 && day <= 5
    })
    
    const weekends = recentEntries.filter(e => {
      const day = new Date(e.sleepDate).getDay()
      return day === 0 || day === 6
    })

    if (weekdays.length > 0 && weekends.length > 0) {
      const weekdayAvg = weekdays.reduce((sum, e) => sum + e.duration / 60, 0) / weekdays.length
      const weekendAvg = weekends.reduce((sum, e) => sum + e.duration / 60, 0) / weekends.length
      
      if (Math.abs(weekdayAvg - weekendAvg) > 2) {
        alerts.push({
          id: 'weekend-shift',
          type: 'info',
          title: 'Weekend Sleep Shift Detected',
          message: `Your sleep duration differs by ${Math.abs(weekdayAvg - weekendAvg).toFixed(1)} hours between weekdays and weekends.`,
          timestamp: new Date().toISOString(),
          isRead: false,
          category: 'recommendation',
          actionable: true,
          actionText: 'Learn More',
          actionUrl: '/advice'
        })
      }
    }

    // Check for notes indicating issues
    const stressEntries = recentEntries.filter(e => 
      e.notes.toLowerCase().includes('stress') || 
      e.notes.toLowerCase().includes('anxious')
    )
    
    if (stressEntries.length >= 2) {
      alerts.push({
        id: 'stress-pattern',
        type: 'warning',
        title: 'Stress Affecting Your Sleep',
        message: 'Stress has been mentioned in your sleep notes recently. Consider stress management techniques.',
        timestamp: new Date().toISOString(),
        isRead: false,
        category: 'recommendation',
        actionable: true,
        actionText: 'Get Stress Management Tips',
        actionUrl: '/advice'
      })
    }

    return alerts
  }

  private static calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2))
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length
  }

  static markAsRead(alertId: string, alerts: Alert[]): Alert[] {
    return alerts.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    )
  }

  static getUnreadCount(alerts: Alert[]): number {
    return alerts.filter(alert => !alert.isRead).length
  }

  static getAlertsByCategory(alerts: Alert[], category: string): Alert[] {
    return alerts.filter(alert => alert.category === category)
  }
}
