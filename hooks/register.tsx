import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Limit, Usage } from '../types'

const usage = atom({ plugin: 'usage-band', key: 'usage' } as const, null)

const NAMES: Record<string, string> = {
  five_hour: '5시간',
  seven_day: '7일',
  spend_limit: '지출 한도',
}

// 초기화까지 남은 시간: "2시간 10분 후" / "3일 후"
function untilReset(resetsAt: string | undefined, now: number): string {
  if (!resetsAt) return ''
  const ms = Date.parse(resetsAt) - now
  if (!(ms > 0)) return ''
  const min = Math.round(ms / 60000)
  if (min < 60) return ` (${min}분 후 초기화)`
  const h = Math.floor(min / 60)
  if (h < 24) return ` (${h}시간 ${min % 60}분 후 초기화)`
  return ` (${Math.round(h / 24)}일 후 초기화)`
}

async function refresh($: EngineInterface) {
  const u = await $.session.usage()
  const next: Usage = {
    limits: u.rateLimits.map(r => ({ kind: r.kind, percentUsed: r.percentUsed, resetsAt: r.resetsAt })),
    contextPercent: u.context.percent,
    usd: u.cost?.usd,
  }
  await update($, usage, () => next)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const r = await next(e)
    await refresh($)
    return r
  })

  on('session.measure', async ($, e, next) => {
    await refresh($)
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    let u = await read($, usage)
    if (u === null) {
      await refresh($)
      u = (await read($, usage)) ?? { limits: [] }
    }

    const { Box, Text } = $.ui.resolve(e)
    const now = await $.clock.now()

    const parts: string[] = u.limits.map(
      (l: Limit) => `${NAMES[l.kind] ?? l.kind} ${l.percentUsed}%${untilReset(l.resetsAt, now)}`,
    )
    if (u.contextPercent !== undefined) parts.push(`컨텍스트 ${u.contextPercent}%`)
    if (u.usd !== undefined) parts.push(`$${u.usd.toFixed(2)}`)
    if (parts.length === 0) parts.push('첫 응답 후 표시됩니다')

    const top = Math.max(0, ...u.limits.map((l: Limit) => l.percentUsed))
    const color = top >= 90 ? 'red' : top >= 70 ? 'yellow' : undefined

    return (
      <Box>
        <Text dimColor={!color} color={color}>
          사용량 · {parts.join(' · ')}
        </Text>
      </Box>
    )
  })
}
