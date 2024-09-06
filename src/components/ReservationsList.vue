<template>
  <div class="reservations-list">
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Fecha del Turno</th>
          <th>Horario <span class="sort-icon">↑</span></th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reservation in sortedReservations" :key="reservation.id">
          <td>{{ reservation.name }}</td>
          <td>{{ formatDate(reservation.date) }}</td>
          <td>
            de {{ formatTime(reservation.startTime) }} a {{ formatTime(reservation.endTime) }}
          </td>
          <td>
            <button @click="removeReservation(reservation.id)" class="delete-btn">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useReservationsStore } from '@/store/reservations'
import moment from 'moment'

const reservationsStore = useReservationsStore()

const sortedReservations = computed(() =>
  [...reservationsStore.reservations].sort((a, b) => a.startTime.localeCompare(b.startTime))
)

// Eliminar una reserva
const removeReservation = (id) => {
  reservationsStore.removeReservation(id)
}

// Formatear la hora
const formatTime = (time) => {
  return time.slice(0, 5) // Asumiendo que el formato es "HH:MM"
}

// Formatear la fecha del turno
const formatDate = (date) => {
  return moment(date).format('DD/MM/YYYY') // Formato de fecha
}
</script>

<style scoped>
.reservations-list {
  margin-top: 20px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
th {
  background-color: #f8f8f8;
  font-weight: bold;
  color: #333;
}
.sort-icon {
  font-size: 12px;
  margin-left: 5px;
}
.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
}
</style>
