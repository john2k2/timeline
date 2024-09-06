<template>
  <div class="reservation-form card">
    <h3 class="form-title">RESERVAR</h3>
    <form @submit.prevent="saveReservation" class="form">
      <div class="form-row">
        <div class="form-group name-group">
          <label>Nombre</label>
          <input v-model="name" type="text" required placeholder="Nombre" />
        </div>
        <div class="form-group date-group">
          <label>Fecha</label>
          <input v-model="date" type="date" required @change="filterTimes" />
        </div>
        <div class="form-group time-group">
          <label>Desde</label>
          <select v-model="startTime" required>
            <option v-for="time in availableStartTimes" :key="time" :value="time">
              {{ time }}
            </option>
          </select>
        </div>
        <div class="form-group time-group">
          <label>Hasta</label>
          <select v-model="endTime" required>
            <option v-for="time in availableEndTimes" :key="time" :value="time">
              {{ time }}
            </option>
          </select>
        </div>
        <button type="submit" class="btn">Guardar</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useReservationsStore } from '@/store/reservations'
import moment from 'moment'

const reservationsStore = useReservationsStore()

const name = ref('')
const date = ref('')
const startTime = ref('')
const endTime = ref('')

// Horarios completos desde las 9:00 hasta las 18:00
const allTimes = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00'
]

const availableStartTimes = ref(allTimes) // Inicialmente, todos los horarios están disponibles
const availableEndTimes = ref(allTimes)

// Filtrar horarios disponibles cuando se selecciona una fecha
const filterTimes = () => {
  if (!date.value) {
    availableStartTimes.value = allTimes
    availableEndTimes.value = allTimes
    return
  }

  // Obtener todas las reservas en la fecha seleccionada
  const reservationsForDate = reservationsStore.getReservations.filter(
    (reservation) => reservation.date === date.value
  )

  // Filtrar los horarios de inicio disponibles
  availableStartTimes.value = allTimes.filter((time) => {
    return !reservationsForDate.some(
      (reservation) => time >= reservation.startTime && time < reservation.endTime
    )
  })

  // Filtrar los horarios de finalización en base al horario de inicio seleccionado
  availableEndTimes.value = allTimes.filter((time) => {
    return (
      time > startTime.value &&
      !reservationsForDate.some(
        (reservation) => time >= reservation.startTime && time < reservation.endTime
      )
    )
  })
}

const saveReservation = () => {
  // Asegurarse de que el rango de horas es válido
  if (startTime.value >= endTime.value) {
    alert('La hora de finalización debe ser posterior a la hora de inicio.')
    return
  }

  // Guardar la nueva reserva con la fecha de creación
  reservationsStore.addReservation({
    name: name.value,
    date: date.value,
    startTime: startTime.value,
    endTime: endTime.value
  })

  // Desplazarse automáticamente a la reserva recién creada en el timeline
  scrollToReservation(date.value, startTime.value)

  // Limpiar los campos después de agregar la reserva
  name.value = ''
  date.value = ''
  startTime.value = ''
  endTime.value = ''
  availableStartTimes.value = allTimes
  availableEndTimes.value = allTimes
}

// Función para desplazar el timeline hasta la nueva reserva
const scrollToReservation = (date, startTime) => {
  const startMoment = moment(`${date} ${startTime}`)
  // eslint-disable-next-line no-unused-vars
  const endMoment = startMoment.clone().add(1, 'hour') // Duración estimada de 1 hora
  // Aquí necesitas acceder a tu instancia de timeline y desplazarte a la ventana de la nueva reserva
  // timeline.setWindow(startMoment.toDate(), endMoment.toDate())
}
</script>

<style scoped>
.reservation-form {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.form-title {
  color: #008c63;
  font-size: 24px;
  margin-bottom: 20px;
  text-align: left;
}

.form-row {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

.form-group {
  flex: 1;
  margin-bottom: 10px;
}

.name-group {
  flex: 0 0 30%;
}

.date-group,
.time-group {
  flex: 1;
}

input,
select {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;

  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.btn {
  background-color: #008c63;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  opacity: 0.6;
}
</style>
