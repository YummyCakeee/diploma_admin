export const dateTimeSplitter = (value: Date): { date: string, time: string } => {
    const match = value.toISOString()
        .match(/([\w | \-]*)T([\w | \:]*):[\w | \.]*Z/)
    if (match && match.length >= 3) {
        const [date, time] = match?.slice(1)
        return {
            date,
            time
        }
    }
    return  {
        date: '',
        time: ''
    }
}