import { subDays, addDays } from 'date-fns'

const bookings = [{
  id: 1,
  date: new Date().toISOString().split('T')[0],
  startTime: '10:45',
  endTime: '11:45',
  serviceId: 1,
  employeeId: 1,
  customerId: 1,
  customerName: 'Иван Иванов',
  serviceName: 'Стрижка мужская',
  status: 'confirmed' as const,
  notes: 'Новый сеанс'
}, {
  id: 2,
  date: new Date().toISOString().split('T')[0],
  startTime: '14:00',
  endTime: '15:30',
  serviceId: 2,
  employeeId: 3,
  customerId: 2,
  customerName: 'Мария Петрова',
  serviceName: 'Стрижка женская',
  status: 'confirmed' as const
}, {
  id: 3,
  date: addDays(new Date(), 1).toISOString().split('T')[0],
  startTime: '11:00',
  endTime: '13:00',
  serviceId: 3,
  employeeId: 3,
  customerId: 3,
  customerName: 'Анна Сидорова',
  serviceName: 'Окрашивание',
  status: 'pending' as const
}, {
  id: 4,
  date: addDays(new Date(), 2).toISOString().split('T')[0],
  startTime: '09:00',
  endTime: '09:45',
  serviceId: 4,
  employeeId: 2,
  customerId: 4,
  customerName: 'Петр Смирнов',
  serviceName: 'Укладка',
  status: 'confirmed' as const
}, {
  id: 5,
  date: subDays(new Date(), 1).toISOString().split('T')[0],
  startTime: '16:00',
  endTime: '17:00',
  serviceId: 1,
  employeeId: 1,
  customerId: 5,
  customerName: 'Ольга Козлова',
  serviceName: 'Стрижка мужская',
  status: 'completed' as const
}]

export default eventHandler(async (event) => {
  const query = getQuery(event)
  const date = query.date as string | undefined
  const employeeId = query.employeeId ? Number.parseInt(query.employeeId as string) : undefined

  let filtered = bookings

  if (date) {
    filtered = filtered.filter(b => b.date === date)
  }

  if (employeeId) {
    filtered = filtered.filter(b => b.employeeId === employeeId)
  }

  return filtered
})

