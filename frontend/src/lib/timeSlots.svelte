<script>
  import { format, addMinutes, parse } from 'date-fns';

  export let startTime = '08:00:00';
  export let endTime = '17:00:00';
  export let slotDuration = 60; // in minutes

  let selectedSlot = null;

  $: timeSlots = generateTimeSlots(startTime, endTime, slotDuration);

  function generateTimeSlots(start, end, duration) {
    const slots = [];
    let currentTime = parse(start, 'HH:mm:ss', new Date());
    const endDateTime = parse(end, 'HH:mm:ss', new Date());

    while (currentTime < endDateTime) {
      slots.push(format(currentTime, 'h:mm a'));
      currentTime = addMinutes(currentTime, duration);
    }

    return slots;
  }

  function handleSlotClick(slot) {
    selectedSlot = slot;
  }
</script>

<div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
  <h2 class="text-2xl font-bold mb-4 text-center text-gray-800">Select a Time</h2>
  <p class="text-center text-gray-600 mb-4">Timezone: Your Local Time</p>
  <div class="h-[400px] overflow-y-auto rounded-md border p-4">
    <div class="grid grid-cols-2 gap-2">
      {#each timeSlots as slot}
        <button
          class="h-12 text-left justify-start px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200 {selectedSlot === slot ? 'border-primary-500 bg-primary-100' : ''}"
          on:click={() => handleSlotClick(slot)}
        >
          {slot}
        </button>
      {/each}
    </div>
  </div>
  {#if selectedSlot}
    <div class="mt-4 text-center">
      <p class="text-sm text-gray-600 mb-2">You selected:</p>
      <p class="text-lg font-semibold text-primary-600">{selectedSlot}</p>
    </div>
  {/if}
</div>

<style>
  /* Add any additional styles here if needed */
  :global(.text-primary-600) {
    color: #2563eb;
  }
  :global(.bg-primary-100) {
    background-color: #dbeafe;
  }
  :global(.border-primary-500) {
    border-color: #3b82f6;
  }
  :global(.focus\:ring-primary-500:focus) {
    --tw-ring-color: #3b82f6;
  }
</style>
