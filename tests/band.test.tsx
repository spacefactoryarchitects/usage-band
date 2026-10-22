import { expect, test } from 'claude-code/testing'

test('the band shows the limits on desktop', async ($, on) => {
  on('session.usage', () => ({
    value: {
      startedAt: 0,
      context: { window: 200000, percent: 35 },
      rateLimits: [
        { kind: 'five_hour', percentUsed: 42 },
        { kind: 'seven_day', percentUsed: 18 },
      ],
      cost: { usd: 1.2 },
    },
  }))
  on('clock.now', () => ({ value: 0 }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  const ui = await $.ui.mount({
    plugin: 'usage-band',
    component: 'AbovePrompt',
    surface: 'desktop',
    props: { hasSurvey: false, isWorking: false, bodyColumns: 100 },
  } as never)
  const row = await ui.find({ type: 'Text', text: /사용량/ })
  expect(row?.text).toBe('사용량 · 5시간 42% · 7일 18% · 컨텍스트 35% · $1.20')
  await ui.unmount()
})
