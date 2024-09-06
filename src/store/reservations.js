import { defineStore } from 'pinia'

export const useReservationsStore = defineStore('reservations', {
  state: () => ({
    reservations: [
      {
        id: 1,
        name: 'Juan Pérez',
        date: '2024-09-06',
        startTime: '09:00',
        endTime: '10:00'
      }
    ]
  }),
  getters: {
    getReservations: (state) => state.reservations
  },
  actions: {
    addReservation(reservation) {
      const newId =
        this.reservations.length > 0 ? Math.max(...this.reservations.map((r) => r.id)) + 1 : 1
      const createdAt = new Date().toISOString() // Guardar la fecha y hora de creación
      this.reservations.push({ ...reservation, id: newId, createdAt })
      alert('Turno agregado con éxito')
    },

    updateReservation(id, updatedReservation) {
      const index = this.reservations.findIndex((r) => r.id === id)
      if (index !== -1) {
        this.reservations[index] = { ...updatedReservation, id }
      }
    },
    removeReservation(id) {
      const index = this.reservations.findIndex((r) => r.id === id)
      if (index !== -1) {
        this.reservations.splice(index, 1)
      }
    }
  }
})
