<!-- eslint-disable no-unused-vars -->
<template>
  <div class="timeline-wrapper">
    <h3 class="timeline-title">Agenda de Reservas</h3>
    <div class="timeline-legend">
      <span class="legend-item"><span class="color-box available"></span> Disponible</span>
      <span class="legend-item"><span class="color-box reserved"></span> Reservado</span>
      <span class="legend-item"><span class="color-box current"></span> Mi Reserva Actual</span>
    </div>
    <div class="timeline-container">
      <button class="nav-button left" @click="moveTimeline('prev')">&lt;</button>
      <div ref="timelineRef" class="timeline"></div>
      <button class="nav-button right" @click="moveTimeline('next')">&gt;</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { Timeline, DataSet } from 'vis-timeline/standalone'
import moment from 'moment'
import { useReservationsStore } from '@/store/reservations'

const reservationsStore = useReservationsStore()
const timelineRef = ref(null)
let timeline = null
let items = null

const getReservationColor = (reservation) => {
  const now = moment()
  const reservationStart = moment(`${reservation.date} ${reservation.startTime}`)
  const reservationEnd = moment(`${reservation.date} ${reservation.endTime}`)

  if (now.isBetween(reservationStart, reservationEnd)) {
    return 'current'
  } else {
    return 'reserved'
  }
}

const createTimelineItems = (reservations) => {
  return reservations.map((reservation) => ({
    id: reservation.id,
    content: reservation.name,
    start: moment(`${reservation.date} ${reservation.startTime}`).toDate(),
    end: moment(`${reservation.date} ${reservation.endTime}`).toDate(),
    className: getReservationColor(reservation)
  }))
}

const customizeLabels = () => {
  console.log('Customizing labels')
  const minorLabels = document.querySelectorAll('.vis-text.vis-minor')
  minorLabels.forEach((label) => {
    const time = label.textContent
    if (time) {
      // eslint-disable-next-line no-unused-vars
      const [hours, minutes] = time.split(':')
      if (minutes === '00') {
        label.innerHTML = `<span class="timeline-hour">${moment(time, 'HH:mm').format('ha')}</span>`
        label.closest('.vis-grid')?.classList.add('vis-major')
      } else {
        label.innerHTML = `<span class="timeline-minute">${minutes}</span>`
        label.closest('.vis-grid')?.classList.add('vis-minor')
      }
    }
  })
}

const initializeTimeline = () => {
  console.log('Initializing timeline')
  if (!timelineRef.value) {
    console.error('Timeline ref is not available')
    return
  }

  items = new DataSet(createTimelineItems(reservationsStore.reservations))
  console.log('Created items:', items)

  const now = moment()
  const options = {
    start: now.clone().startOf('hour').toDate(),
    end: now.clone().startOf('hour').add(6, 'hours').toDate(),
    timeAxis: { scale: 'minute', step: 15 },
    orientation: { axis: 'top' },
    stack: false,
    zoomable: false,
    moveable: true,
    margin: { item: { vertical: 10, horizontal: 0 } },
    verticalScroll: true,
    format: {
      minorLabels: {
        minute: 'HH:mm',
        hour: 'HH:mm'
      },
      majorLabels: {
        hour: '',
        day: 'ddd D',
        week: 'w',
        month: 'MMM',
        year: 'YYYY'
      }
    },
    height: '130px',
    groupHeightMode: 'fixed',
    itemsAlwaysDraggable: false
  }

  timeline = new Timeline(timelineRef.value, items, options)
  console.log('Timeline created')

  timeline.on('changed', () => {
    console.log('Timeline changed event triggered')
    customizeLabels()
  })

  timeline.on('click', function (properties) {
    if (properties.item) {
      const clickedReservation = reservationsStore.reservations.find(
        (r) => r.id === properties.item
      )
      if (clickedReservation) {
        alert(`Clicked reservation: ${clickedReservation.name}`)
      }
    }
  })

  customizeLabels()
}

const updateTimelineWindow = () => {
  console.log('Updating timeline window')
  if (timeline) {
    const now = moment().startOf('hour')
    timeline.setWindow(now.toDate(), now.clone().add(6, 'hours').toDate())
    customizeLabels()
  }
}

onMounted(() => {
  console.log('Component mounted')
  initializeTimeline()
  updateTimelineWindow() // Asegurarse de que el timeline se muestre correctamente al inicio
  setInterval(updateTimelineWindow, 900000) // Actualizar cada 15 minutos
})
watch(
  () => reservationsStore.reservations,
  (newReservations) => {
    console.log('Reservations updated:', newReservations)
    if (timeline && items) {
      items.clear()
      items.add(createTimelineItems(newReservations))
      updateTimelineWindow()
      customizeLabels()
    }
  },
  { deep: true }
)

const moveTimeline = (direction) => {
  console.log('Moving timeline:', direction)
  if (!timeline) return

  const range = timeline.getWindow()
  const step = 1 // hour

  if (direction === 'next') {
    timeline.setWindow({
      start: moment(range.start).add(step, 'hour').toDate(),
      end: moment(range.end).add(step, 'hour').toDate()
    })
  } else if (direction === 'prev') {
    timeline.setWindow({
      start: moment(range.start).subtract(step, 'hour').toDate(),
      end: moment(range.end).subtract(step, 'hour').toDate()
    })
  }

  customizeLabels()
}

onBeforeUnmount(() => {
  if (timeline) {
    timeline.destroy()
  }
})
</script>

<style scoped>
/* Contenedor principal del timeline */
.timeline-wrapper {
  margin-top: 20px;
  padding: 10px;
}

/* Título del timeline */
.timeline-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

/* Estilos para la leyenda */
.timeline-legend {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  padding: 5px;
}
.legend-item {
  margin-left: 15px;
  font-size: 12px;
}
.color-box {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 5px;
}
.available {
  background-color: #e0e0e0;
}
.reserved {
  background-color: #ffd700;
}
.current {
  background-color: #90ee90;
}

/* Contenedor del timeline y botones de navegación */
.timeline-container {
  position: relative;
  padding: 0 30px;
}
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
  width: 30px;
  height: 100%;
  font-size: 28px;
  cursor: pointer;
  z-index: 1000;
}
.nav-button.left {
  left: 0;
}
.nav-button.right {
  right: 0;
}

/* Estilos específicos de vis-timeline */
:deep(.vis-timeline) {
  border: none;
}
:deep(.vis-item) {
  border-radius: 0;
  font-size: 12px;
  cursor: pointer;
  transition: opacity 0.3s;
}
:deep(.vis-item:hover) {
  color: white;
}
:deep(.vis-item.current:hover) {
  background-color: #007b59;
  border-color: #007b59;
}
:deep(.vis-item.reserved) {
  background-color: #ffd700;
  border-color: #ffd700;
}
:deep(.vis-item.current) {
  background-color: #90ee90;
  border-color: #90ee90;
}

/* Estilos para el eje de tiempo y las etiquetas */
:deep(.vis-time-axis) {
  padding-top: 10px;
}

:deep(.vis-time-axis .vis-text) {
  font-size: 10px;
  color: #333;
  overflow: visible;
  white-space: nowrap;
  top: -22px;
}

:deep(.vis-time-axis .vis-text.vis-minor) {
  top: -5px !important;
}

:deep(.vis-time-axis .timeline-hour) {
  font-size: 16px;
  font-weight: bold;
  position: absolute;
  top: -10px;
  left: -14px;
}

:deep(.vis-time-axis .timeline-minute) {
  font-size: 10px;
  color: black;
  font: bold;
  border-radius: 2px;
  position: absolute;
  top: 3px;
  left: -4px;
}

/* Ajusta la posición de las líneas de cuadrícula */
:deep(.vis-time-axis .vis-grid.vis-minor) {
  border-width: 2px;
  top: 10px;
  padding-top: 30px;
}

:deep(.vis-time-axis .vis-grid.vis-major) {
  border-width: 2px;
  top: 20px;
}

/* Ajusta la posición de los elementos del timeline (las reservas) */
:deep(.vis-item) {
  top: 5px !important;
}

:deep(.vis-timeline) {
  min-height: 120px;
} /* Ajusta este valor según sea necesario */
</style>
