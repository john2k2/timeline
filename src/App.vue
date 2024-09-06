<template>
  <div class="reservation-system">
    <ReservationForm @add-reservation="addReservation" />
    <TimelineComponent />
    <ReservationsList
      :reservations="reservationsStore.reservations"
      @remove-reservation="removeReservation"
    />
  </div>
</template>

<script setup>
import ReservationForm from './components/ReservationForm.vue'
import TimelineComponent from './components/TimelineComponent.vue'
import ReservationsList from './components/ReservationsList.vue'
import moment from 'moment'
import { useReservationsStore } from '@/store/reservations'

const reservationsStore = useReservationsStore()

const addReservation = (newReservation) => {
  newReservation.date = newReservation.date || moment().format('YYYY-MM-DD')
  reservationsStore.addReservation(newReservation)
}

const removeReservation = (index) => {
  reservationsStore.removeReservation(index)
}
</script>

<style scoped>
.reservation-system {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}
</style>
