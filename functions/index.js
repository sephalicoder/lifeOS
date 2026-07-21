const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

const GROQ_API_KEY = functions.config().groq.key // set via CLI, never in code

exports.chatWithLifeOS = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be signed in')
  }

  const uid = context.auth.uid
  const { message } = data

  // Pull user's real data for context
  const snapshot = await admin.database().ref(`users/${uid}`).once('value')
  const userData = snapshot.val() || {}

  const summary = buildUserSummary(userData)

  const systemPrompt = `You are LifeOS's personal guide. You know this user's real data below.
Be warm, encouraging, and specific — reference their actual notes, habits, and progress.
Never be judgmental about gaps or inactivity; always frame feedback positively and forward-looking.

USER DATA SNAPSHOT:
${summary}`

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 600
    })
  })

  const result = await response.json()
  const reply = result.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response."

  return { reply }
})

function buildUserSummary(userData) {
  const toArr = (v) => (Array.isArray(v) ? v : v ? Object.values(v) : [])

  const notes = toArr(userData.notes).slice(-5).map(n => `- ${n.title || n.text}`).join('\n') || 'None yet'
  const health = toArr(userData.health).slice(-5).map(h => `- ${h.text}`).join('\n') || 'None yet'
  const career = toArr(userData.career).slice(-5).map(c => `- ${c.text}`).join('\n') || 'None yet'
  const money = toArr(userData.money).slice(-5).map(m => `- ${m.text}`).join('\n') || 'None yet'
  const relationships = toArr(userData.relationships).slice(-5).map(r => `- ${r.text}`).join('\n') || 'None yet'
  const activityCount = toArr(userData.activityLog).length

  return `
Recent Notes:
${notes}

Recent Health entries:
${health}

Recent Career entries:
${career}

Recent Money entries:
${money}

Recent Relationships entries:
${relationships}

Total logged activities: ${activityCount}
`.trim()
}