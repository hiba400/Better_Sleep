import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization")

    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dashboardData = {
      stats: {
        avgSleep: 7.2,
        lastNightSleep: 7.5,
        qualityScore: 72,
        shortNights: 2,
      },
      alerts: [
        {
          id: "1",
          message: "You had 3 short nights last week. Try to maintain consistent sleep schedule.",
          severity: "warning",
          isViewed: false,
          explanation: "Votre sommeil a été insuffisant plusieurs nuits cette semaine. Un sommeil régulier est essentiel pour votre santé et votre bien-être général.",
          reason: "Détection de 3 nuits avec moins de 6 heures de sommeil au cours des 7 derniers jours. Cette irrégularité peut affecter votre concentration, votre humeur et votre système immunitaire.",
          sleepDataLink: "Vos données montrent une durée moyenne de 7.2h cette semaine, mais avec des variations importantes (de 5.8h à 9.2h). Les nuits courtes sont survenues les lundi, mercredi et vendredi, suggérant un possible impact du rythme de travail.",
        },
        {
          id: "2",
          message: "Your fatigue levels are elevated. Consider improving your sleep environment.",
          severity: "info",
          isViewed: true,
          explanation: "Vos niveaux de fatigue signalés sont plus élevés que la normale. Cela peut être lié à plusieurs facteurs environnementaux ou comportementaux.",
          reason: "Votre score de qualité de sommeil moyen est de 72%, ce qui est légèrement en dessous de l'optimal (80%+). Les facteurs environnementaux comme la température, la luminosité ou le bruit peuvent impacter la qualité de votre repos.",
          sleepDataLink: "Analyse de vos 7 dernières entrées : qualité moyenne de 7.2/10, avec des variations entre 6.5 et 8.1. Les nuits avec qualité inférieure correspondent souvent à des heures de coucher irrégulières.",
        },
      ],
      advice: [
        {
          id: "1",
          message: "Try to maintain a consistent bedtime within 30 minutes every night",
          priority: 1,
        },
        {
          id: "2",
          message: "Reduce screen time 1 hour before bed",
          priority: 2,
        },
        {
          id: "3",
          message: "Keep your bedroom cool and dark",
          priority: 3,
        },
      ],
      goals: [
        {
          id: "1",
          name: "Sleep Duration",
          target: 8,
          current: 7.2,
          unit: "hours",
        },
        {
          id: "2",
          name: "Sleep Quality",
          target: 100,
          current: 72,
          unit: "%",
        },
      ],
      weeklySummary: {
        totalSleep: 50.4,
        avgQuality: 72,
        bestNight: 9.2,
        worstNight: 5.8,
      },
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 })
  }
}
