const services = [{
  id: 1,
  name: 'Стрижка мужская',
  description: 'Классическая мужская стрижка',
  duration: 30,
  price: 1500,
  assignedMembers: [1, 2],
  active: true
}, {
  id: 2,
  name: 'Стрижка женская',
  description: 'Стрижка и укладка для женщин',
  duration: 60,
  price: 2500,
  assignedMembers: [3, 4],
  active: true
}, {
  id: 3,
  name: 'Окрашивание',
  description: 'Полное окрашивание волос',
  duration: 120,
  price: 4500,
  assignedMembers: [3, 5],
  active: true
}, {
  id: 4,
  name: 'Укладка',
  description: 'Укладка волос',
  duration: 45,
  price: 1800,
  assignedMembers: [2, 4],
  active: true
}, {
  id: 5,
  name: 'Мелирование',
  description: 'Мелирование волос',
  duration: 90,
  price: 3500,
  assignedMembers: [3],
  active: true
}]

export default eventHandler(async () => {
  return services
})

