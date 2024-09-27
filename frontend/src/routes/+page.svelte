<script lang="ts">
    import { onMount } from "svelte";
    import axios from "axios";
    import {
        startOfMonth,
        endOfMonth,
        startOfWeek,
        endOfWeek,
        eachDayOfInterval,
        format,
        isSameMonth,
        isSameDay,
        addMonths,
        subMonths,
        setHours,
        setMinutes,
        addHours,
    } from "date-fns";

    let currentDate = new Date();
    let selectedDate: Date | null = null;
    let calendarDays: Date[] = [];
    let step = 1;
    let name: string = "";
    let service: string = "";
    let selectedTimeSlot: { start: string; end: string } | null = null;
    let events: any[] = [];
    let availableTimeSlots: { start: string; end: string }[] = [];
    let isLoading = false;

    $: month = format(currentDate, "MMMM yyyy");

    function generateCalendarDays(date: Date) {
        const start = startOfWeek(startOfMonth(date));
        const end = endOfWeek(endOfMonth(date));
        return eachDayOfInterval({ start, end });
    }

    $: calendarDays = generateCalendarDays(currentDate);

    function prevMonth() {
        currentDate = subMonths(currentDate, 1);
    }

    function nextMonth() {
        currentDate = addMonths(currentDate, 1);
    }

    function selectDate(date: Date) {
        selectedDate = date;
        generateTimeSlots(date);
        step = 2;
    }

    function generateTimeSlots(date: Date) {
        const startTime = setHours(setMinutes(date, 0), 9); // 9:00 AM
        const endTime = setHours(setMinutes(date, 0), 17); // 5:00 PM
        const interval = 60; // 60-minute intervals

        availableTimeSlots = [];
        let currentTime = startTime;

        while (currentTime < endTime) {
            const slotStart = format(currentTime, "HH:mm");
            const slotEnd = format(addHours(currentTime, 1), "HH:mm");
            availableTimeSlots.push({ start: slotStart, end: slotEnd });
            currentTime = addHours(currentTime, 1);
        }

        // Filter out time slots that are already booked
        availableTimeSlots = availableTimeSlots.filter((timeSlot) => {
            return !events.some(
                (event) =>
                    isSameDay(new Date(event.date), date) &&
                    event.startTime === timeSlot.start,
            );
        });
    }

    function selectTimeSlot(timeSlot: { start: string; end: string }) {
        selectedTimeSlot = timeSlot;
        step = 3;
    }

    function validateForm() {
        if (!name.trim()) {
            alert("Please enter your name.");
            return false;
        }
        if (!service.trim()) {
            alert("Please enter a service.");
            return false;
        }
        return true;
    }

    async function handleSubmit() {
        if (!selectedDate || !selectedTimeSlot) return;
        if (!validateForm()) return;

        isLoading = true;
        const appointmentData = {
            name,
            date: format(selectedDate, "yyyy-MM-dd"),
            startTime: `${selectedTimeSlot.start}:00`,
            endTime: `${selectedTimeSlot.end}:00`,
            service,
        };

        console.log(appointmentData);
        try {
            const response = await axios.post(
                "http://localhost:3000/api/booking",
                appointmentData,
            );

            console.log("response data: ", response.data);
            const newEvent = response.data;
            events = [...events, newEvent];
            console.log(events);
            resetForm();
            alert("Booking successful!");
        } catch (error) {
            console.error(
                "Error booking appointment:",
                error.response?.data || error.message,
            );
            alert("Failed to book appointment. Please try again.");
        } finally {
            isLoading = false;
        }
    }

    function resetForm() {
        step = 1;
        selectedDate = null;
        selectedTimeSlot = null;
        name = "";
        service = "";
    }

    onMount(async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/api/booking",
            );
            events = response.data;
        } catch (error) {
            console.error(
                "Error loading events:",
                error.response?.data || error.message,
            );
            alert("Failed to load events. Please refresh the page.");
        }
    });
</script>

<div class="max-w-2xl mx-auto p-4">
    {#if step === 1}
        <div class="mb-4">
            <h2 class="text-2xl font-bold mb-2">Select a Date</h2>
            <div class="flex justify-between items-center mb-4">
                <button
                    class="bg-blue-500 text-white px-4 py-2 rounded"
                    on:click={prevMonth}>&lt;</button
                >
                <h3 class="text-xl font-semibold">{month}</h3>
                <button
                    class="bg-blue-500 text-white px-4 py-2 rounded"
                    on:click={nextMonth}>&gt;</button
                >
            </div>
            <div class="grid grid-cols-7 gap-2">
                {#each ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as day}
                    <div class="text-center font-bold">{day}</div>
                {/each}
                {#each calendarDays as day}
                    <button
                        class="p-2 text-center rounded transition-colors duration-200 ease-in-out"
                        class:text-gray-400={!isSameMonth(day, currentDate)}
                        class:bg-blue-100={isSameDay(day, new Date())}
                        class:bg-blue-500={selectedDate &&
                            isSameDay(day, selectedDate)}
                        class:text-white={selectedDate &&
                            isSameDay(day, selectedDate)}
                        class:hover:bg-blue-200={!selectedDate ||
                            !isSameDay(day, selectedDate)}
                        on:click={() => selectDate(day)}
                    >
                        {format(day, "d")}
                        {#if events.some( (event) => isSameDay(new Date(event.date), day), )}
                            <span
                                class="block w-2 h-2 mx-auto mt-1 bg-green-500 rounded-full"
                            ></span>
                        {/if}
                    </button>
                {/each}
            </div>
        </div>
    {:else if step === 2}
        <div class="mb-4">
            <h2 class="text-2xl font-bold mb-2">Select a Time Slot</h2>
            <p class="mb-4">Date: {format(selectedDate, "MMMM d, yyyy")}</p>
            <div class="grid grid-cols-2 gap-2">
                {#each availableTimeSlots as timeSlot}
                    <button
                        class="p-2 text-center bg-blue-100 rounded hover:bg-blue-200 transition-colors duration-200 ease-in-out"
                        on:click={() => selectTimeSlot(timeSlot)}
                    >
                        {timeSlot.start} - {timeSlot.end}
                    </button>
                {/each}
            </div>
            <button
                class="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
                on:click={() => (step = 1)}>Back</button
            >
        </div>
    {:else if step === 3}
        <div class="mb-4">
            <h2 class="text-2xl font-bold mb-2">Enter Details</h2>
            <p class="mb-4">
                Date: {format(selectedDate, "MMMM d, yyyy")} at {selectedTimeSlot.start}
                - {selectedTimeSlot.end}
            </p>
            <form on:submit|preventDefault={handleSubmit} class="space-y-4">
                <div>
                    <label for="name" class="block mb-1">Name</label>
                    <input
                        id="name"
                        type="text"
                        bind:value={name}
                        required
                        class="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label for="service" class="block mb-1">Service</label>
                    <input
                        id="service"
                        type="text"
                        bind:value={service}
                        required
                        class="w-full p-2 border rounded"
                    />
                </div>
                <div class="flex justify-between">
                    <button
                        type="button"
                        class="bg-gray-500 text-white px-4 py-2 rounded"
                        on:click={() => (step = 2)}>Back</button
                    >
                    <button
                        type="submit"
                        class="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        {isLoading ? "Booking..." : "Book Appointment"}
                    </button>
                </div>
            </form>
        </div>
    {/if}
</div>

