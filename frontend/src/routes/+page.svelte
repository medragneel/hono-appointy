<script lang="ts">
    import { onMount } from "svelte";
    import { Calendar } from "@fullcalendar/core";
    import dayGridPlugin from "@fullcalendar/daygrid";
    import interactionPlugin from "@fullcalendar/interaction";
    import { fade, fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";

    let calendarEl: HTMLElement;
    let calendar: Calendar;
    let showForm = false;
    let selectedDate: string = "";
    let name: string = "";
    let startTime: string = "";
    let endTime: string = "";
    let service: string = "";
    let loading = false;
    let errorMessage: string = ""; // Variable to hold error messages

    onMount(() => {
        calendar = new Calendar(calendarEl, {
            plugins: [dayGridPlugin, interactionPlugin],
            initialView: "dayGridMonth",
            dateClick: handleDateClick,
            height: "auto",
            headerToolbar: {
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,dayGridWeek",
            },
            buttonText: {
                today: "Today",
                month: "Month",
                week: "Week",
            },
            themeSystem: "standard",
        });
        calendar.render();
    });

    function handleDateClick(info) {
        selectedDate = info.dateStr;
        showForm = true;
        errorMessage = ""; // Reset error message when a date is clicked
    }

    async function handleSubmit() {
        loading = true;
        const appointmentData = {
            name,
            date: selectedDate,
            startTime: `${startTime}:00`,
            endTime: `${endTime}:00`,
            service,
        };
        console.log(appointmentData); // Check if data is correct before sending

        try {
            const response = await fetch("http://localhost:3000/api/booking", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(appointmentData),
            });

            const responseData = await response.json(); // Get the response from server
            console.log("Response from server:", responseData);

            if (response.ok) {
                calendar.addEvent({
                    title: name,
                    start: `${selectedDate}T${startTime}`,
                    end: `${selectedDate}T${endTime}`,
                });
                showForm = false;
                name = "";
                startTime = "";
                endTime = "";
                service = "";
                errorMessage = ""; // Reset error message on success
            } else {
                console.error("Error from server:", responseData);
                errorMessage =
                    responseData.message || "Failed to book appointment"; // Set error message
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error("Error booking appointment:", error);
            errorMessage = "An error occurred. Please try again."; // Set a generic error message
        } finally {
            loading = false;
        }
    }
</script>

<div class="calendar-container">
    <div bind:this={calendarEl}></div>

    {#if showForm}
        <div class="modal-overlay" transition:fade={{ duration: 300 }}>
            <div
                class="modal"
                transition:fly={{ y: 20, duration: 300, easing: cubicOut }}
            >
                <h3>Book Appointment for {selectedDate}</h3>
                {#if errorMessage}
                    <!-- Conditionally render the error message -->
                    <div class="error-message">{errorMessage}</div>
                {/if}
                <form on:submit|preventDefault={handleSubmit}>
                    <div class="form-group">
                        <input
                            type="text"
                            id="name"
                            bind:value={name}
                            required
                            placeholder="Name"
                        />
                    </div>
                    <div class="form-group">
                        <input
                            type="time"
                            id="startTime"
                            bind:value={startTime}
                            required
                        />
                        <label for="startTime">Start Time</label>
                    </div>
                    <div class="form-group">
                        <input
                            type="time"
                            id="endTime"
                            bind:value={endTime}
                            required
                        />
                        <label for="endTime">End Time</label>
                    </div>
                    <div class="form-group">
                        <input
                            type="text"
                            id="service"
                            bind:value={service}
                            required
                            placeholder="Service"
                        />
                    </div>
                    <div class="form-actions">
                        <button
                            type="button"
                            on:click={() => (showForm = false)}
                            class="btn-cancel">Cancel</button
                        >
                        <button
                            type="submit"
                            class="btn-submit"
                            disabled={loading}
                        >
                            {loading ? "Booking..." : "Book Appointment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    {/if}
</div>

<style>
    @import "https://cdn.jsdelivr.net/npm/@fullcalendar/core/main.min.css";
    @import "https://cdn.jsdelivr.net/npm/@fullcalendar/daygrid/main.min.css";

    :global(body) {
        font-family: "Arial", sans-serif;
        background-color: #f0f4f8;
        color: #333;
    }

    .calendar-container {
        max-width: 1000px;
        margin: 2rem auto;
        padding: 2rem;
        background-color: #ffffff;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal {
        background-color: #ffffff;
        padding: 2rem;
        border-radius: 12px;
        width: 90%;
        max-width: 400px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    h3 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        color: #2c3e50;
        font-size: 1.5rem;
    }

    .form-group {
        margin-bottom: 1.5rem;
        position: relative;
    }

    input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        font-size: 1rem;
        transition:
            border-color 0.3s,
            box-shadow 0.3s;
    }

    input:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }

    label {
        position: absolute;
        left: 0.75rem;
        top: 0.75rem;
        color: #7f8c8d;
        transition: all 0.3s;
        pointer-events: none;
    }

    input:focus + label,
    input:not(:placeholder-shown) + label {
        top: -0.5rem;
        left: 0.5rem;
        font-size: 0.75rem;
        color: #3498db;
        background-color: #ffffff;
        padding: 0 0.25rem;
    }

    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
    }

    .btn-cancel,
    .btn-submit {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        cursor: pointer;
        transition:
            background-color 0.3s,
            transform 0.1s;
    }

    .btn-cancel {
        background-color: #e0e0e0;
        color: #333;
    }

    .btn-submit {
        background-color: #3498db;
        color: #ffffff;
    }

    .btn-cancel:hover,
    .btn-submit:hover {
        transform: translateY(-2px);
    }

    .btn-cancel:active,
    .btn-submit:active {
        transform: translateY(0);
    }

    .btn-submit:disabled {
        background-color: #bdc3c7;
        cursor: not-allowed;
    }

    :global(.fc) {
        font-size: 1rem;
    }

    :global(.fc-button-primary) {
        background-color: #3498db;
        border-color: #3498db;
    }

    :global(.fc-button-primary:hover) {
        background-color: #2980b9;
        border-color: #2980b9;
    }

    :global(.fc-day-today) {
        background-color: #e8f4fd !important;
    }

    :global(.fc-event) {
        background-color: #3498db;
        border-color: #3498db;
    }
</style>
