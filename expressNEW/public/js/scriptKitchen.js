
        // JavaScript Code
        document.addEventListener("DOMContentLoaded", () => {
            const inProgressContainer = document.querySelector("#inProgress .orderContainer");
            const completedContainer = document.querySelector("#completed .orderContainer");

            let voices = [];

            // Load available voices
            const loadVoices = () => {
                voices = window.speechSynthesis.getVoices();
                console.log("Available voices:", voices);
            };

            // Ensure voices are loaded before using them
            if (speechSynthesis.onvoiceschanged !== undefined) {
                speechSynthesis.onvoiceschanged = loadVoices;
            } else {
                loadVoices();
            }

            // Function to fetch and play audio
            const playAudioFromAPI = async (text) => {
                try {
                    const response = await fetch(`/api/generate-audio?text=${encodeURIComponent(text)}`);
                    if (!response.ok) throw new Error('Failed to fetch audio');

                    const blob = await response.blob();
                    const audioURL = URL.createObjectURL(blob);

                    // Play the audio
                    const audio = new Audio(audioURL);
                    audio.play();
                } catch (error) {
                    console.error('Error playing audio:', error);
                }
            };

            // Handle click events for orders in "In Progress"
            inProgressContainer.addEventListener("click", async (e) => {
                const order = e.target.closest(".orderCard");
                if (order && order.dataset.status === "in-progress") {
                    // Move to completed section
                    order.dataset.status = "completed";
                    completedContainer.appendChild(order);
                    order.style.cursor = "default";

                    // Set up and play the speech
                    const speechSynthesis = window.speechSynthesis;
                    const text = "The bluetooth device, is connected successfully";
                    const speech = new SpeechSynthesisUtterance(text);

                    // Select a voice
                    const selectedVoice = voices.find(voice => voice.name.includes("Google 國語（臺灣）")) || voices[0];
                    if (selectedVoice) {
                        speech.voice = selectedVoice;
                    }

                    speechSynthesis.speak(speech);

                    // Retrieve `menuItemIDs` and `totalCost` from the dataset
                    const menuItemIDs = order.dataset.menuItemIDs.split(','); // Convert to array
                    const totalCost = parseFloat(order.dataset.totalCost); // Convert to number

                    console.log('Menu Item IDs:', menuItemIDs);
                    console.log('Total Cost:', totalCost);

                    // Call APIs to update the order and inventory
                    await updateOrder(totalCost, menuItemIDs);
                    await updateInventory(menuItemIDs);

                    // Set a timer to auto-remove after 5 minutes
                    setTimeout(() => {
                        if (order.parentElement === completedContainer) {
                            order.remove();
                        }
                    }, 300000); // 5 minutes
                }
            });

            // Handle click events for orders in "Completed"
            completedContainer.addEventListener("click", (e) => {
                const order = e.target.closest(".orderCard");
                if (order && order.dataset.status === "completed") {
                    // Remove order immediately when clicked
                    order.remove();
                }
            });

            // Load pending orders on page load
            loadPendingOrders();
        });

        async function loadPendingOrders() {
            const inProgressContainer = document.querySelector("#inProgress .orderContainer");

            try {
                const response = await fetch('/api/getpendingorders');
                if (!response.ok) {
                    throw new Error(`Failed to fetch Pending Orders: ${response.statusText}`);
                }

                const pendingOrders = await response.json();
                console.log('Fetched Pending Orders (Kitchen):', pendingOrders);

                // Clear the existing orders in progress before rendering
                inProgressContainer.innerHTML = '';

                // Render each pending order
                for (const order of pendingOrders) {
                    const orderCard = document.createElement("div");
                    orderCard.classList.add("orderCard");
                    orderCard.dataset.status = "in-progress";
                    orderCard.dataset.menuItemIDs = JSON.stringify(order.menuitemids); // Store as JSON string
                    orderCard.dataset.totalCost = order.totalcost; // Store the total cost

                    const orderTitle = document.createElement("h3");
                    orderTitle.textContent = `Order #${order.pendingorderid}`;

                    const orderList = document.createElement("ul");

                    // Convert the menuitemids string to an array and fetch item names
                    const items = order.menuitemids.slice(1, -1).split(','); // Strip curly braces and split by comma

                    for (const itemId of items) {
                        const itemIdTrimmed = itemId.trim();
                        const itemName = await getItemNameById(itemIdTrimmed);

                        const listItem = document.createElement("li");
                        listItem.textContent = itemName || `Item ID: ${itemIdTrimmed}`;
                        orderList.appendChild(listItem);
                    }

                    orderCard.appendChild(orderTitle);
                    orderCard.appendChild(orderList);
                    inProgressContainer.appendChild(orderCard);
                }
            } catch (err) {
                console.error('Error loading pending orders:', err);
            }
        }

        async function getItemNameById(itemId) {
            try {
                const response = await fetch(`/api/getdisplayname?menuitemID=${itemId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch display name for ID ${itemId}: ${response.statusText}`);
                }
                const itemName = await response.text();
                console.log(`Fetched itemName for ID ${itemId}:`, itemName);
                return itemName;
            } catch (err) {
                console.error(`Error fetching menu item name for ID ${itemId}:`, err);
                return null;
            }
        }

        async function updateOrder(totalCost, menuItemIDs) {
            try {
                const response = await fetch('/api/updateorders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ totalCost, menuItemIDs })
                });
                const data = await response.json();
                console.log('Order updated:', data);
            } catch (error) {
                console.error('Error updating order:', error);
            }
        }

        async function updateInventory(menuItemIDs) {
            try {
                const response = await fetch('/api/updateinventory', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ menuItemIDs })
                });
                const data = await response.json();
                console.log('Inventory updated:', data);
            } catch (error) {
                console.error('Error updating inventory:', error);
            }
        }