const TIME_ZONE = 'Asia/Kuala_Lumpur'

const formatters = {
  short: new Intl.DateTimeFormat('en-GB', { timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }),
  long: new Intl.DateTimeFormat('en-GB', { timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }),
}

export function formatMalaysiaTime(date = new Date(), { seconds = false } = {}) {
  return (seconds ? formatters.long : formatters.short).format(date)
}
