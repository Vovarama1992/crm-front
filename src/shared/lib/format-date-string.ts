export const formatDateString = (date: string) => {
  return new Date(date).toLocaleDateString(undefined, { hour: '2-digit', minute: '2-digit' })
}
