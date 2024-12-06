// Global Variables

let orderItems = []; // Array to store items added to the order.
let currentCompositeItem = null; // Tracks the currently selected composite item (e.g., bowl, plate).
let totalAmount = 0; // Total cost of the order.
let selectedSize = 'Medium'; // Default size for A La Carte items.
let currentAlaCarteItem = null; // Tracks the currently selected À La Carte item.

let menuItemMap = {}; // Map to store menu item data, grouped by item name for quick access.

let selectedAppetizer = null; // Tracks the currently selected appetizer.
let appetizerSize = 'sm'; // Default size for appetizers.
let appetizerQuantity = 1; // Default quantity for appetizers.
let appetizerMap = {}; // Map to store appetizer data, grouped by item name and size.

/**
 * Fetches menu items from the API and populates various containers in the UI.
 * Assigns click handlers to static buttons for composite items like bowls, plates, and bigger plates.
 */
async function loadMenuItems() {
    try {
        // Fetch menu items from the server
        const response = await fetch('/api/menuitems');
        if (!response.ok) {
            console.error('Failed to fetch menu items:', response.statusText);
            return;
        }

        const menuItems = await response.json();
        console.log('Fetched Menu Items:', menuItems);

        // Locate and validate the appetizer container
        const appetizerContainer = document.getElementById('appetizer-buttons');
        if (!appetizerContainer) {
            console.error('Appetizer container not found');
            return;
        }

        // Locate containers for entrees, sides, and drinks
        const entreeContainer = document.getElementById('entree-buttons');
        const sideContainer = document.getElementById('side-buttons');
        const drinkContainer = document.getElementById('drink-buttons');

        // Debug missing containers
        if (!entreeContainer) console.error("Entree container not found");
        if (!sideContainer) console.error("Side container not found");

        // Find data for specific composite items like bowls, plates, and bigger plates
        const bowlData = menuItems.find(item => item.menuitem === 'bowl');
        const plateData = menuItems.find(item => item.menuitem === 'plate');
        const biggerPlateData = menuItems.find(item => item.menuitem === 'biggerPlate');

        // Assign onclick handlers for bowls, plates, and bigger plates with menu IDs
        if (bowlData) {
            const bowlButton = document.querySelector('.button[onclick*="selectItemType(\'bowl\'"]');
            if (bowlButton) {
                bowlButton.onclick = () => selectItemType('bowl', 8.30, 1, 2, bowlData.menuitemid);
            }
        }

        if (plateData) {
            const plateButton = document.querySelector('.button[onclick*="selectItemType(\'plate\'"]');
            if (plateButton) {
                plateButton.onclick = () => selectItemType('plate', 9.80, 2, 2, plateData.menuitemid);
            }
        }

        if (biggerPlateData) {
            const biggerPlateButton = document.querySelector('.button[onclick*="selectItemType(\'biggerPlate\'"]');
            if (biggerPlateButton) {
                biggerPlateButton.onclick = () => selectItemType('biggerPlate', 11.30, 3, 2, biggerPlateData.menuitemid);
            }
        }

        // Locate and validate the À La Carte containers
        const alacarteEntreeContainer = document.getElementById('ALaCarte-entrees');
        const alacarteSideContainer = document.getElementById('ALaCarte-sides');
        
        if (!alacarteEntreeContainer) {
            console.error("ALaCarte-entrees container not found in the DOM.");
            return;
        }
        
        if (!alacarteSideContainer) {
            console.error("ALaCarte-sides container not found in the DOM.");
            return;
        }
//**************************************************************************************************************************//
//********************************************    A La Carte Generation     ************************************************//
//**************************************************************************************************************************//

        // Organize menu items by `menuitem` and size for easy lookup
        menuItems.forEach((item) => {
            if (!menuItemMap[item.menuitem]) {
                menuItemMap[item.menuitem] = {
                    sm: null,
                    md: null,
                    lg: null,
                };
            }
            // Populate size-specific details for each menu item
            menuItemMap[item.menuitem][item.size] = {
                menuitemid: item.menuitemid,
                price: item.price,
                displayname: item.displayname,
            };
        });

        // Populate the À La Carte panels with buttons for entrees and sides
        menuItems.forEach((item) => {
            // Add small-sized entrees to the À La Carte panel
            if (item.size === 'sm' && item.menuitemid >= 1 && item.menuitemid <= 39) {
                const button = document.createElement('button');
                button.classList.add('menu-item-button'); // Add CSS class for styling
                button.dataset.menuId = item.menuitemid; // Store menu ID as data attribute
                button.onclick = () => addAlaCarteItem('entree', item.menuitemid, item.menuitem, 'sm', item.price);

                // Convert `menuitem` to a user-friendly format
                const normalizedMenuItem = camelCaseToNormal(item.menuitem);

                // Add text to the button
                const text = document.createElement('div');
                text.innerText = normalizedMenuItem; // Display the item name
                text.classList.add('button-text'); // Add CSS class for styling
                button.appendChild(text);

                // Append the button to the À La Carte entrees container
                alacarteEntreeContainer.appendChild(button);
            }

            // Add small-sized sides to the À La Carte panel
            if (item.size === 'sm' && item.menuitemid >= 40 && item.menuitemid <= 51) {
                const button = document.createElement('button');
                button.classList.add('menu-item-button'); // Add CSS class for styling
                button.dataset.menuId = item.menuitemid; // Store menu ID as data attribute
                button.onclick = () => addAlaCarteItem('side', item.menuitemid, item.menuitem, 'sm', item.price);

                // Convert `menuitem` to a user-friendly format
                const normalizedMenuItem = camelCaseToNormal(item.menuitem);

                // Add text to the button
                const text = document.createElement('div');
                text.innerText = normalizedMenuItem; // Display the item name
                text.classList.add('button-text'); // Add CSS class for styling
                button.appendChild(text);

                // Append the button to the À La Carte sides container
                alacarteSideContainer.appendChild(button);
            }
        });
//**************************************************************************************************************************//
//****************************************    Main Menu Buttons Generation     *********************************************//
//**************************************************************************************************************************//

        // Populate standard entrees, sides, drinks, and appetizers
        menuItems.forEach((item) => {

            // Process small-sized entrees
            if (item.size === 'sm') {
                if (item.menuitemid >= 1 && item.menuitemid <= 39) {
                    const button = document.createElement('button');
                    button.innerText = `${camelCaseToNormal(item.menuitem)} (${item.size})`; // Display name and size
                    button.classList.add('menu-item-button');
                    button.dataset.menuId = item.menuitemid; // Store menu ID for use in order
                    button.onclick = () => addComponentToCurrentOrder('entree', item.menuitemid, item.menuitem); // Add entree to order
                    entreeContainer.appendChild(button); // Add button to the entree container
                }

                // Process small-sized sides
                if (item.menuitemid >= 40 && item.menuitemid <= 51) {
                    const button = document.createElement('button');
                    button.innerText = `${camelCaseToNormal(item.menuitem)} (${item.size})`; // Display name and size
                    button.classList.add('menu-item-button');
                    button.dataset.menuId = item.menuitemid; // Store menu ID for use in order
                    button.onclick = () => addComponentToCurrentOrder('side', item.menuitemid, item.menuitem); // Add side to order
                    sideContainer.appendChild(button); // Add button to the side container
                }
            }

            // Process appetizers
            if (item.menuitemid >= 52 && item.menuitemid <= 60) {
                console.log('Processing Appetizer:', item); // Debug log

                const appetizersPanelContent = document.querySelector('#appetizersPanel .panel-content'); // Locate appetizers panel
                if (!appetizersPanelContent) {
                    console.error('Appetizers panel-content not found');
                    return;
                }

                // Create a button for the appetizer
                const button = document.createElement('button');
                button.innerText = `${camelCaseToNormal(item.menuitem)} (${item.size})`; // Display name and size
                button.classList.add('menu-item-button');
                button.dataset.menuId = item.menuitemid; // Store menu ID for use in order
                button.dataset.size = item.size; // Store size
                button.dataset.price = item.price; // Store price

                // Attach click handler to add the appetizer to the order
                button.onclick = () => addAppetizerToOrder(item.menuitem, item.price);

                appetizersPanelContent.appendChild(button); // Add button to the appetizers panel
                console.log('Appetizer Button Added:', button); // Debug log
            }

            // Process drinks
            if (item.menuitemid >= 61 && item.menuitemid <= 68) {
                const wrapper = document.createElement('div');
                wrapper.classList.add('menu-item-wrapper'); // Wrapper for better layout

                const label = document.createElement('div');
                label.classList.add('menu-item-label'); // Display size and price
                label.innerText = `${item.size} - $${item.price.toFixed(2)}`;

                const button = document.createElement('button');
                button.innerText = `${camelCaseToNormal(item.menuitem)}`; // Display drink name
                button.classList.add('menu-item-button');
                button.dataset.menuId = item.menuitemid; // Store menu ID for use in order
                button.onclick = () => addItemToOrder(item.menuitemid, item.menuitem, item.price, 'drink'); // Add drink to order

                wrapper.appendChild(label); // Add label to the wrapper
                wrapper.appendChild(button); // Add button to the wrapper
                drinkContainer.appendChild(wrapper); // Add wrapper to the drink container
            }
        });

    } catch (error) {
        console.error('Error loading menu items:', error);
    }
}
//**************************************************************************************************************************//
//*****************************************    Seasonal Buttons Generation     *********************************************//
//**************************************************************************************************************************//

async function loadSeasonalItems() {
    try {
        // Fetch seasonal items
        const seasonalItemsResponse = await fetch('/api/seasonalItems');
        if (!seasonalItemsResponse.ok) {
            console.error('Failed to fetch seasonal items:', seasonalItemsResponse.statusText);
            return;
        }
        const seasonalItems = await seasonalItemsResponse.json();
        console.log('Fetched Seasonal Items:', seasonalItems);

        // Fetch all menu items for matching seasonal items
        const menuItemsResponse = await fetch('/api/menuitems');
        if (!menuItemsResponse.ok) {
            console.error('Failed to fetch menu items:', menuItemsResponse.statusText);
            return;
        }
        const menuItems = await menuItemsResponse.json();

        // DOM containers for seasonal items
        const entreeContainer = document.getElementById('entree-buttons');
        const sideContainer = document.getElementById('side-buttons');
        const alacarteEntreeContainer = document.getElementById('ALaCarte-entrees');
        const alacarteSideContainer = document.getElementById('ALaCarte-sides');
        const appetizersPanelContent = document.querySelector('#appetizersPanel .panel-content');

        // Ensure all required containers are available
        if (!entreeContainer || !sideContainer || !alacarteEntreeContainer || !alacarteSideContainer || !appetizersPanelContent) {
            console.error('One or more containers are missing in the DOM.');
            return;
        }
//**************************************************************************************************************************//
//****************************************    Bowl/Plate Buttons Generation     ********************************************//
//**************************************************************************************************************************//

        // Update `menuItemMap` with seasonal items
        seasonalItems.forEach((item) => {
            const matchedMenuItem = menuItems.find(
                (menuItem) =>
                    menuItem.menuitem === item.menuitem &&
                    menuItem.size === item.size &&
                    menuItem.menuitemid > 72 &&
                    menuItem.status === item.status
            );

            if (matchedMenuItem) {
                // Initialize menu item mapping if it doesn't exist
                if (!menuItemMap[item.menuitem]) {
                    menuItemMap[item.menuitem] = { sm: null, md: null, lg: null };
                }

                // Map seasonal item details to `menuItemMap`
                menuItemMap[item.menuitem][item.size] = {
                    menuitemid: Number(matchedMenuItem.menuitemid), // Ensure `menuitemid` is a number
                    price: matchedMenuItem.price,
                    displayname: matchedMenuItem.displayname,
                };
            } else {
                console.warn(`No match found for seasonal item: ${item.menuitem}`);
            }
        });

        // Populate Seasonal Entrees
        seasonalItems.forEach((item) => {
            if (item.type === 'entree' && item.size === 'sm' && item.status === 'active') {
                const button = document.createElement('button');
                button.classList.add('menu-item-button');
                button.dataset.menuId = Number(menuItemMap[item.menuitem]?.sm?.menuitemid || 'unknown'); // Ensure `menuId` is a number
                button.onclick = () => addComponentToCurrentOrder('entree', Number(button.dataset.menuId), item.menuitem);

                // Add text for the button
                const text = document.createElement('div');
                text.innerText = camelCaseToNormal(item.menuitem);
                text.classList.add('button-text');
                button.appendChild(text);

                // Append button to the seasonal entrees container
                entreeContainer.appendChild(button);
            }
        });

        // Populate Seasonal Sides
        seasonalItems.forEach((item) => {
            if (item.type === 'side' && item.size === 'sm' && item.status === 'active') {
                const button = document.createElement('button');
                button.classList.add('menu-item-button');
                button.dataset.menuId = Number(menuItemMap[item.menuitem]?.sm?.menuitemid || 'unknown'); // Ensure `menuId` is a number
                button.onclick = () => addComponentToCurrentOrder('side', Number(button.dataset.menuId), item.menuitem);

                // Add text for the button
                const text = document.createElement('div');
                text.innerText = camelCaseToNormal(item.menuitem);
                text.classList.add('button-text');
                button.appendChild(text);

                // Append button to the seasonal sides container
                sideContainer.appendChild(button);
            }
        });
//**************************************************************************************************************************//
//****************************************    À La Carte Buttons Generation     ********************************************//
//**************************************************************************************************************************//

        // Populate Seasonal À La Carte Items
        seasonalItems.forEach((item) => {
            const matchedMenuId = Number(menuItemMap[item.menuitem]?.sm?.menuitemid || 'unknown'); // Ensure `menuitemid` is a valid number

            // Populate seasonal entrees
            if (item.type === 'entree' && item.size === 'sm' && item.status === 'active') {
                const button = document.createElement('button');
                button.classList.add('menu-item-button');
                button.dataset.menuId = matchedMenuId;
                button.onclick = () => addAlaCarteItem('entree', matchedMenuId, item.menuitem, 'sm', item.price);

                // Add text for the button
                const text = document.createElement('div');
                text.innerText = camelCaseToNormal(item.menuitem);
                text.classList.add('button-text');
                button.appendChild(text);

                // Append the button to the À La Carte entrees container
                alacarteEntreeContainer.appendChild(button);
            }

            // Populate seasonal sides
            if (item.type === 'side' && item.size === 'sm' && item.status === 'active') {
                const button = document.createElement('button');
                button.classList.add('menu-item-button');
                button.dataset.menuId = matchedMenuId;
                button.onclick = () => addAlaCarteItem('side', matchedMenuId, item.menuitem, 'sm', item.price);

                // Add text for the button
                const text = document.createElement('div');
                text.innerText = camelCaseToNormal(item.menuitem);
                text.classList.add('button-text');
                button.appendChild(text);

                // Append the button to the À La Carte sides container
                alacarteSideContainer.appendChild(button);
            }
        });
//**************************************************************************************************************************//
//****************************************    Appetizers Buttons Generation     ********************************************//
//**************************************************************************************************************************//

        // Populate Seasonal Appetizers
        seasonalItems.forEach((item) => {
            if (item.type === 'appetizer' && item.status === 'active') {
                const matchedMenuId = Number(menuItemMap[item.menuitem]?.sm?.menuitemid || 'unknown'); // Ensure `menuitemid` is a valid number

                // Create a button for the seasonal appetizer
                const button = document.createElement('button');
                button.classList.add('menu-item-button');
                button.dataset.menuId = matchedMenuId; // Attach the matched menu ID for later reference
                button.onclick = () => addAppetizerToOrder(item.menuitem, item.price); // Define the click action

                // Add text for the button
                const text = document.createElement('div');
                text.innerText = camelCaseToNormal(item.menuitem); // Convert camelCase to a readable format
                text.classList.add('button-text');
                button.appendChild(text);

                // Append the button to the appetizers panel
                appetizersPanelContent.appendChild(button);
            }
        });

        console.log('Seasonal Items Successfully Loaded.', menuItemMap);

    } catch (error) {
        console.error('Error loading seasonal items:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadSeasonalItems();
});
//**************************************************************************************************************************//
//********************************************    Left Panel Generation     ************************************************//
//**************************************************************************************************************************//

/**
 * Sets the active size panel and updates UI accordingly.
 * @param {string} size - The size to activate (e.g., 'Small', 'Medium', 'Large').
 */
function setSize(size) {
    // Hide all size-specific panels
    const panels = document.querySelectorAll('#sizePanels > .hidden-panel');
    panels.forEach((panel) => {
        if (panel) panel.style.display = 'none'; // Null-check ensures no errors for undefined panels
    });

    // Show the selected size panel
    const selectedPanel = document.getElementById(`size-${size}-panel`);
    if (selectedPanel) {
        selectedPanel.style.display = 'block'; // Display the relevant size panel
    } else {
        console.error(`Panel for size ${size} not found in DOM.`); // Log if panel is missing
    }

    // Update the active button style
    const sizeButtons = document.querySelectorAll('.size-button');
    sizeButtons.forEach((button) => {
        if (button.id === `size-${size}`) {
            button.style.backgroundColor = 'green'; // Highlight the selected button
        } else {
            button.style.backgroundColor = ''; // Reset the style for other buttons
        }
    });
}

/**
 * Initializes the application by loading menu items and setting the default size panel.
 */
document.addEventListener('DOMContentLoaded', () => {
    loadMenuItems(); // Load menu items into the UI
    setSize('Medium'); // Default size panel to display
});

/**
 * Initializes a new composite item (bowl, plate, or bigger plate) and prepares the UI.
 * @param {string} type - The type of composite item (e.g., 'bowl', 'plate').
 * @param {number} price - The base price of the composite item.
 * @param {number} entreesRequired - Number of entrees required for the item.
 * @param {number} sidesRequired - Number of sides required for the item.
 * @param {number} menuId - Unique menu ID for the composite item.
 */
function selectItemType(type, price, entreesRequired, sidesRequired, menuId) {
    currentCompositeItem = {
        type: type, // Type of composite item (e.g., bowl, plate)
        name: capitalize(type), // Capitalize the type for display purposes
        price: price, // Base price of the composite item
        menuId: menuId, // Unique menu ID for the composite item
        entreesRequired: entreesRequired, // Number of entrees required
        sidesRequired: sidesRequired, // Number of sides required
        entrees: [], // Array to store selected entrees
        sides: [] // Array to store selected sides
    };

    updateCurrentItemPreview(); // Update the item preview panel
    openPanel('hiddenPanelMain'); // Open the composite item configuration panel
}

/**
 * Adds an item to the order and updates the UI.
 * @param {number|number[]} menuIds - A single or array of menu item IDs representing the order.
 * @param {string} name - The name of the item (e.g., 'Bowl', 'Plate').
 * @param {number} price - The price of the item.
 * @param {string} type - The type of item (e.g., 'composite', 'a la carte').
 * @param {Array<Object>} [components=[]] - An optional array of components (e.g., entrees, sides) included in the item.
 */
function addItemToOrder(menuIds, name, price, type, components = []) {
    const orderItem = {
        menuIds: Array.isArray(menuIds) ? menuIds : [menuIds], // Composite and component IDs
        name: name,
        price: price,
        type: type,
        components: components // Store components (entrees and sides)
    };

    orderItems.push(orderItem); // Add the new item to the order
    updateOrderList(); // Refresh the order list in the UI
    calculateTotal(); // Recalculate the total cost
}

/**
 * Updates the order list displayed in the UI.
 * Iterates over all order items and creates HTML elements to represent them.
 */
function updateOrderList() {
    const orderList = document.getElementById("orderList");
    orderList.innerHTML = ""; // Clear the current list

    orderItems.forEach((item, index) => {
        const listItem = document.createElement("div");
        listItem.classList.add("order-item");

        // Display the main item (e.g., Bowl, Plate, Bigger Plate)
        let listItemHTML = `
            <div><strong>${camelCaseToNormal(item.name)} +$${item.price.toFixed(2)}</strong></div>
        `;

        // If the item has components (e.g., entrees and sides), display them
        if (item.components && item.components.length > 0) {
            listItemHTML += `
                <div class="item-components">
                    ${item.components.map(comp => `<div>- ${camelCaseToNormal(comp.itemName)}</div>`).join('')}
                </div>
            `;
        }

        // Add a remove button to each item
        listItemHTML += `
            <button onclick="removeItemFromOrder(${index})">Remove</button>
        `;

        listItem.innerHTML = listItemHTML; // Populate the list item's HTML
        orderList.appendChild(listItem); // Append the item to the order list in the UI
    });
}

/**
 * Adds a component (entree or side) to the current composite item.
 * Finalizes and adds the composite item to the order if all required components are selected.
 * @param {string} category - The category of the component ('entree' or 'side').
 * @param {number} menuId - The menu ID of the component.
 * @param {string} itemName - The name of the component.
 */
function addComponentToCurrentOrder(category, menuId, itemName) {
    if (!currentCompositeItem) return; // Exit if no active composite item

    // Add entrees or sides to the current composite item
    if (category === 'entree' && currentCompositeItem.entrees.length < currentCompositeItem.entreesRequired) {
        currentCompositeItem.entrees.push({ menuId, itemName });
    } else if (category === 'side' && currentCompositeItem.sides.length < currentCompositeItem.sidesRequired) {
        currentCompositeItem.sides.push({ menuId, itemName });
    }

    updateCurrentItemPreview(); // Update the UI with the current composite item's details

    // Check if the current composite item is complete
    const isComplete =
        currentCompositeItem.entrees.length === currentCompositeItem.entreesRequired &&
        currentCompositeItem.sides.length === currentCompositeItem.sidesRequired;

    if (isComplete) {
        const allMenuIds = [
            currentCompositeItem.menuId, // Composite item menuId
            ...currentCompositeItem.entrees.map(e => e.menuId),
            ...currentCompositeItem.sides.map(s => s.menuId)
        ];

        const components = [
            ...currentCompositeItem.entrees,
            ...currentCompositeItem.sides
        ];

        // Add the finalized composite item to the order
        addItemToOrder(allMenuIds, currentCompositeItem.name, currentCompositeItem.price, 'composite', components);

        currentCompositeItem = null; // Reset the composite item after adding to the order
        updateCurrentItemPreview(); // Clear the preview UI
        closePanel(); // Close the panel
    }
}
//**************************************************************************************************************************//
//**************************************************    Drink Code     *****************************************************//
//**************************************************************************************************************************//

/**
 * Adds a drink to the order.
 * @param {string} drinkName - The name of the drink (e.g., 'Coke').
 * @param {number} price - The price of the drink.
 * @param {string|null} [size=null] - The size of the drink (e.g., 'Small', 'Medium'). Optional.
 */
function addDrinkToOrder(drinkName, price, size = null) {
    const drinkItem = {
        type: 'drink',
        name: size ? `${size} ${drinkName}` : drinkName, // Include size in the name if provided
        price: price,
        components: [] // No components for drinks
    };

    orderItems.push(drinkItem); // Add the drink to the order
    updateOrderList(); // Refresh the order list in the UI
    calculateTotal(); // Recalculate the total cost
    closePanel(); // Close the panel
}
//**************************************************************************************************************************//
//************************************************    Appetizer Code     ***************************************************//
//**************************************************************************************************************************//

/**
 * Adds an appetizer to the order.
 * @param {string} appetizerName - The name of the appetizer to add.
 * @param {number} price - The price of the appetizer.
 */
function addAppetizerToOrder(appetizerName, price) {
    const appetizerItem = {
        type: 'appetizer',
        name: appetizerName,
        price: price,
        components: [] // No additional components for appetizers
    };

    orderItems.push(appetizerItem); // Add the appetizer to the order
    updateOrderList(); // Update the order list UI
    calculateTotal(); // Recalculate the total order cost
    closePanel(); // Close any active panels
}
//**************************************************************************************************************************//
//***********************************************    A La Carte Code     ***************************************************//
//**************************************************************************************************************************//

/**
 * Updates the selected size for an À La Carte item and displays the corresponding price.
 * @param {string} size - The size of the À La Carte item (e.g., 'sm', 'md', 'lg').
 */
function selectAlaCarteSize(size) {
    alaCarteSize = size; // Set the selected size
    const sizeButtons = document.querySelectorAll('#sizeSelection .size-button');

    // Highlight the selected size button
    sizeButtons.forEach((button) => {
        if (button.id === `${size}Size`) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });

    // Fetch the price for the selected size from menuItemMap
    const selectedSizeData = menuItemMap[selectedAlaCarteItem.menuitem]?.[size];
    if (selectedSizeData) {
        const price = selectedSizeData.price;
        console.log(`Price for selected size (${size}): $${price.toFixed(2)}`);
        document.getElementById('alaCartePrice').innerText = `$${price.toFixed(2)}`;
    } else {
        console.error(`Size data for ${size} not found in menuItemMap.`);
    }
}

/**
 * Adds the selected À La Carte item to the order.
 * Validates the selected item and size before adding.
 */
function addAlaCarteToOrder() {
    if (!selectedAlaCarteItem || !menuItemMap[selectedAlaCarteItem.menuitem]) {
        console.error("Invalid item selected or item not found in menu map.");
        return;
    }

    // Fetch size-specific data for the selected À La Carte item
    const selectedSizeData = menuItemMap[selectedAlaCarteItem.menuitem][alaCarteSize];
    if (!selectedSizeData) {
        console.error(`Size data for ${alaCarteSize} not found.`);
        return;
    }

    const { menuitemid, price } = selectedSizeData;

    // Create an order object for the À La Carte item
    const alaCarteOrder = {
        type: 'a la carte',
        name: `${camelCaseToNormal(selectedAlaCarteItem.menuitem)} (${capitalize(alaCarteSize)})`,
        size: alaCarteSize,
        price: price,
        quantity: alaCarteQuantity,
        menuIds: Array(alaCarteQuantity).fill(menuitemid), // Create an array of menu IDs for the quantity
    };

    // Add the item to the order and update the UI
    orderItems.push(alaCarteOrder);
    updateOrderList(); // Refresh the order list
    calculateTotal(); // Recalculate the total order cost
    closeAlaCarteModal(); // Close the À La Carte modal
}

/**
 * Adds an À La Carte item by opening a modal with the item's details.
 * @param {string} category - The category of the item (e.g., 'entree', 'side').
 * @param {number} menuId - The unique ID of the menu item.
 * @param {string} itemName - The name of the item.
 * @param {string} size - The size of the item (e.g., 'sm', 'md', 'lg').
 * @param {number} price - The price of the item.
 */
function addAlaCarteItem(category, menuId, itemName, size, price) {
    console.log(`Adding A La Carte item: ${itemName}, Category: ${category}, Size: ${size}, Price: ${price}`);

    // Open the modal with the selected item's details
    openAlaCarteModal({
        category: category,
        menuitemid: menuId,
        menuitem: itemName,
        price: price,
        size: size,
    });
}

/**
 * Opens a modal displaying details of the selected À La Carte item.
 * Dynamically populates size options and updates the modal content.
 * @param {Object} menuItem - The selected menu item object.
 */
function openAlaCarteModal(menuItem) {
    selectedAlaCarteItem = menuItem;
    alaCarteSize = 'md'; // Set the default size
    alaCarteQuantity = 1; // Reset the quantity to default

    const normalizedMenuItem = camelCaseToNormal(menuItem.menuitem);

    // Update the item name in the modal
    const itemNameElement = document.getElementById('alaCarteItemName');
    if (itemNameElement) {
        itemNameElement.innerText = normalizedMenuItem;
    } else {
        console.error('Element with ID alaCarteItemName not found.');
    }

    // Dynamically populate size buttons and display prices
    const sizeSelection = document.getElementById('sizeSelection');
    if (sizeSelection) {
        sizeSelection.innerHTML = ''; // Clear any existing size buttons

        Object.keys(menuItemMap[menuItem.menuitem]).forEach((size) => {
            const sizeData = menuItemMap[menuItem.menuitem][size];

            // Skip the 'Small' size for side options
            if (menuItem.category === 'side' && size === 'sm') {
                return; // Skip rendering the 'Small' button
            }

            if (sizeData) {
                const sizeButton = document.createElement('button');
                sizeButton.classList.add('size-button');
                sizeButton.id = `${size}Size`;
                sizeButton.innerHTML = `${capitalize(size)}<br>$${sizeData.price.toFixed(2)}`;
                sizeButton.onclick = () => selectAlaCarteSize(size); // Attach size selection logic

                sizeSelection.appendChild(sizeButton);
            }
        });
    } else {
        console.error('Element with ID sizeSelection not found.');
    }

    // Display the modal
    const modal = document.getElementById('alaCarteModal');
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error('Element with ID alaCarteModal not found.');
    }
}

/**
 * Closes the À La Carte modal and resets related variables.
 */
function closeAlaCarteModal() {
    const modal = document.getElementById('alaCarteModal');
    if (modal) {
        modal.style.display = 'none'; // Hide the modal
    } else {
        console.error('Modal with ID alaCarteModal not found.');
    }
    selectedAlaCarteItem = null; // Reset the selected item
    alaCarteSize = 'md'; // Reset the size to default
    alaCarteQuantity = 1; // Reset the quantity to default
}
//**************************************************************************************************************************//
//************************************************    Ordering Code     ****************************************************//
//**************************************************************************************************************************//

/**
 * Updates the preview for the current composite item being configured.
 * Displays the item name, price, and its components (entrees and sides).
 */
function updateCurrentItemPreview() {
    const preview = document.getElementById("currentItemPreview");
    if (!preview) {
        console.error('Preview container with ID currentItemPreview not found.');
        return;
    }

    if (!currentCompositeItem) {
        preview.innerHTML = ""; // Clear the preview if no composite item is active
        return;
    }

    // Generate preview content with the composite item details
    let previewHTML = `<strong>${camelCaseToNormal(currentCompositeItem.name)} +$${currentCompositeItem.price.toFixed(2)}</strong><br>`;
    previewHTML += "<div class='item-components'>";

    // Add readable names for entrees
    previewHTML += currentCompositeItem.entrees
        .map(entree => `<div>- ${camelCaseToNormal(entree.itemName)}</div>`)
        .join('');
    
    // Add readable names for sides
    previewHTML += currentCompositeItem.sides
        .map(side => `<div>- ${camelCaseToNormal(side.itemName)}</div>`)
        .join('');
    
    previewHTML += "</div>";

    preview.innerHTML = previewHTML; // Update the preview container
}

/**
 * Removes an item from the order based on its index.
 * Updates the order list and recalculates the total after removal.
 * @param {number} index - The index of the item to remove.
 */
function removeItemFromOrder(index) {
    if (index >= 0 && index < orderItems.length) {
        orderItems.splice(index, 1); // Remove the item from the order
        updateOrderList(); // Refresh the order list display
        calculateTotal(); // Recalculate the total cost
    } else {
        console.warn(`Invalid index ${index} for removing an item from the order.`);
    }
}

/**
 * Cancels the current composite item configuration and clears the preview.
 */
function cancelCurrentCompositeItem() {
    currentCompositeItem = null; // Reset the composite item
    updateCurrentItemPreview(); // Clear the composite item preview
    closePanel(); // Close the active panel
}

/**
 * Calculates the total amount for the order by summing up the prices of all items.
 * Updates the total amount display in the UI.
 */
function calculateTotal() {
    totalAmount = orderItems.reduce((sum, item) => sum + item.price, 0); // Sum up prices
    document.getElementById("totalAmount").innerText = totalAmount.toFixed(2); // Update total display
}

/**
 * Clears the current order, resets the total amount, and updates the UI.
 */
function clearOrder() {
    orderItems = []; // Empty the order items
    totalAmount = 0; // Reset the total amount
    updateOrderList(); // Clear the order list display
    calculateTotal(); // Reset the total display
    updateCurrentItemPreview(); // Clear the current item preview
}

/**
 * Opens a specific hidden panel and hides the main buttons.
 * @param {string} panelId - The ID of the panel to open.
 */
function openPanel(panelId) {
    const mainButtons = document.getElementById('main-buttons');
    if (mainButtons) mainButtons.style.display = 'none'; // Hide main buttons grid
    const panel = document.getElementById(panelId);
    if (panel) panel.style.display = 'block'; // Show the selected panel
}

/**
 * Closes all hidden panels and restores the main buttons grid.
 */
function closePanel() {
    document.querySelectorAll('.hidden-panel').forEach(panel => panel.style.display = 'none'); // Hide all panels
    const mainButtons = document.getElementById('main-buttons');
    if (mainButtons) mainButtons.style.display = 'grid'; // Restore the main buttons grid
}

/**
 * Capitalizes the first letter of a word.
 * @param {string} word - The word to capitalize.
 * @returns {string} - The capitalized word.
 */
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1); // Capitalize the first letter
}

/**
 * Converts a camelCase string to a normal sentence-like format.
 * Adds spaces before uppercase letters and capitalizes the first letter.
 * @param {string} camelCaseString - The camelCase string to convert.
 * @returns {string} - The converted string.
 */
function camelCaseToNormal(camelCaseString) {
    return camelCaseString
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Add a space before each uppercase letter
        .replace(/^./, str => str.toUpperCase()); // Capitalize the first letter
}

/**
 * Gets the full size name (e.g., "Small", "Medium", "Large") from an abbreviation.
 * @param {string} abbreviation - The size abbreviation (e.g., "sm", "md", "lg").
 * @returns {string} - The full size name.
 */
function getFullSizeName(abbreviation) {
    const sizeMap = {
        sm: "Small",
        md: "Medium",
        lg: "Large"
    };
    return sizeMap[abbreviation.toLowerCase()] || abbreviation; // Default to original if not found
}

/**
 * Handles the checkout process for the current order.
 * Validates the order, sends it to the server, and clears it upon success.
 */
function checkoutOrder() {
    // Check if there are no items in the order
    if (orderItems.length === 0) {
        alert('Your order is empty. Please add items before checking out.');
        return; // Exit the function if the order is empty
    }

    // Flatten the array of menuIds from each order item
    const menuItemIDs = orderItems.flatMap(item => item.menuIds);

    // Log the order details for debugging purposes
    console.log('Order Details:');
    console.log('Total Cost:', totalAmount.toFixed(2));
    console.log('Menu Item IDs:', menuItemIDs);

    // Send the order details to the server via a POST request
    fetch('/api/updateorders', {
        method: 'POST', // Specify the HTTP method
        headers: { 'Content-Type': 'application/json' }, // Indicate JSON data format
        body: JSON.stringify({
            totalCost: totalAmount, // Send the total cost of the order
            menuItemIDs: menuItemIDs, // Send the array of menu item IDs
        }),
    })
        .then(response => {
            // Check if the response status is not OK
            if (!response.ok) {
                throw new Error('Failed to update order.');
            }
            // Parse the JSON response from the server
            return response.json();
        })
        .then(data => {
            // Display a success message and the server's response message
            alert(`Order placed successfully!\nOrder total: $${totalAmount.toFixed(2)}\n${data.message}`);
            clearOrder(); // Clear the order after successful checkout

            // Update inventory only if the order was successfully updated
            updateInventory(menuItemIDs);
        })
        .catch(error => {
            // Log and display an error message if the process fails
            console.error('Error:', error);
            alert('An error occurred while placing your order. Please try again.');
        });
}

/**
 * Updates the inventory based on the menu item IDs from the order.
 * Sends a request to the server and handles the response.
 * 
 * @param {Array<number>} menuItemIDs - Array of menu item IDs to update inventory for.
 */
function updateInventory(menuItemIDs) {
    // Send a POST request to the server to update the inventory
    fetch('/api/updateinventory', {
        method: 'POST', // Specify the HTTP method
        headers: { 'Content-Type': 'application/json' }, // Indicate JSON data format
        body: JSON.stringify({ menuItemIDs: menuItemIDs }) // Include the menu item IDs in the request body
    })
        .then(response => {
            // Check if the response status is not OK
            if (!response.ok) {
                throw new Error('Failed to update inventory.');
            }
            // Parse the JSON response from the server
            return response.json();
        })
        .then(data => {
            // Display a success message with the server's response message
            alert(`Inventory updated successfully!\n${data.message}`);
        })
        .catch(error => {
            // Log and display an error message if the inventory update fails
            console.error('Error:', error);
            alert('An error occurred while updating inventory. Please try again.');
        });
}