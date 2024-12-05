// Global Variables

// Order and Composite Item Tracking
let orderItems = []; // Tracks all items in the current order
let currentCompositeItem = null; // Tracks the currently active composite item (e.g., bowl, plate, bigger plate)
let totalAmount = 0; // Total cost of the current order

// À La Carte Item Selection
let selectedSize = 'Medium'; // Default size for À La Carte items
let currentAlaCarteItem = null; // Tracks the currently selected À La Carte item

// Drink Selection
let selectedDrink = null; // Selected drink name
let selectedDrinkType = null; // Type of the selected drink (e.g., Fountain Drink, Gatorade)
let drinkSize = 'sm'; // Default size for drinks
let drinkQuantity = 1; // Quantity of the selected drink

// Specific À La Carte Variables
let selectedAlaCarteItem = null; // Tracks the current selected À La Carte item
let alaCarteSize = 'md'; // Default size for À La Carte items
let alaCarteQuantity = 1; // Quantity of the selected À La Carte item

// Menu Items and Mapping
let menuItems = []; // Stores all fetched menu items
let menuItemMap = {}; // Maps menu items by name and size for easier lookup

// Appetizer Tracking
let selectedAppetizer = null; // Tracks the currently selected appetizer
let appetizerSize = 'sm'; // Default size for appetizers
let appetizerQuantity = 1; // Default quantity for appetizers
let appetizerMap = {}; // Maps appetizer items by name and size

// User Email for Rewards
let globalEmail = ''; // Tracks the currently logged-in user's email

/**
 * Fetches the menu items from the API and dynamically populates the DOM with buttons for 
 * bowls, plates, bigger plates, À La Carte entrees, sides, and appetizers. 
 * Also initializes the `menuItemMap` for easy lookup by item name and size.
 */
async function loadMenuItems() {
    try {
        // Make an API request to fetch menu items
        const response = await fetch('/api/menuitems');
        if (!response.ok) {
            console.error('Failed to fetch menu items:', response.statusText);
            return; // Exit if the response is not successful
        }
    
        // Parse and log the fetched menu items
        const fetchedMenuItems = await response.json();
        console.log('Fetched Menu Items:', fetchedMenuItems);
    
        // Update the global menuItems array with the fetched data
        menuItems = [...fetchedMenuItems];
        console.log('Updated menuItems:', menuItems);
    
        // Locate the containers for entree and side buttons in the DOM
        const entreeContainer = document.getElementById('entree-buttons');
        const sideContainer = document.getElementById('side-buttons');
    
        // Debug logs if the containers are not found
        if (!entreeContainer) console.error("Entree container not found");
        if (!sideContainer) console.error("Side container not found");
    
        // Find data for composite items (bowl, plate, bigger plate)
        const bowlData = menuItems.find(item => item.menuitem === 'bowl');
        const plateData = menuItems.find(item => item.menuitem === 'plate');
        const biggerPlateData = menuItems.find(item => item.menuitem === 'biggerPlate');
    
        // Dynamically assign onclick handlers for composite items
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
    
        // Locate the containers for À La Carte entrees and sides
        const alacarteEntreeContainer = document.getElementById('ALaCarte-entrees');
        const alacarteSideContainer = document.getElementById('ALaCarte-sides');
    
        // Error handling if the containers are not found in the DOM
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
        menuItems.forEach((item) => {
            // Check for small entrees (menu IDs 1 to 39) to add to the À La Carte panel
            if (item.size === 'sm' && item.menuitemid >= 1 && item.menuitemid <= 39) {
                const button = document.createElement('button');
                button.classList.add('menu-item-button');
                button.dataset.menuId = item.menuitemid;

                // Set onclick handler to add the item to the order
                button.onclick = () => addAlaCarteItem('entree', item.menuitemid, item.menuitem, 'sm', item.price);

                // Normalize the menu item name for display and image file naming
                const normalizedMenuItem = camelCaseToNormal(item.menuitem);

                // Create and append the item's image to the button
                const image = document.createElement('img');
                image.src = `/Panda Express Photos/${normalizedMenuItem}.png`;
                image.alt = camelCaseToNormal(item.menuitem);
                image.classList.add('button-image');
                button.appendChild(image);

                // Create and append the item's text to the button
                const text = document.createElement('div');
                text.innerText = camelCaseToNormal(item.menuitem);
                text.classList.add('button-text');
                button.appendChild(text);

                // Append the button to the À La Carte entrees container
                alacarteEntreeContainer.appendChild(button);
            }

            // Check for small sides (menu IDs 40 to 51) to add to the À La Carte panel
            if (item.size === 'sm' && item.menuitemid >= 40 && item.menuitemid <= 51) {
                const button = document.createElement('button');
                button.classList.add('menu-item-button');
                button.dataset.menuId = item.menuitemid;

                // Set onclick handler to add the item to the order
                button.onclick = () => addAlaCarteItem('side', item.menuitemid, item.menuitem, 'sm', item.price);

                // Normalize the menu item name for display and image file naming
                const normalizedMenuItem = camelCaseToNormal(item.menuitem);

                // Create and append the item's image to the button
                const image = document.createElement('img');
                image.src = `/Panda Express Photos/${normalizedMenuItem}.png`;
                image.alt = camelCaseToNormal(item.menuitem);
                image.classList.add('button-image');
                button.appendChild(image);

                // Create and append the item's text to the button
                const text = document.createElement('div');
                text.innerText = camelCaseToNormal(item.menuitem);
                text.classList.add('button-text');
                button.appendChild(text);

                // Append the button to the À La Carte sides container
                alacarteSideContainer.appendChild(button);
            }
        });

        menuItems.forEach((item) => {
            // Group items by `menuitem`
            if (!menuItemMap[item.menuitem]) {
                menuItemMap[item.menuitem] = {
                    sm: null,
                    md: null,
                    lg: null,
                };
            }
            // Store the data for each size
            menuItemMap[item.menuitem][item.size] = {
                menuitemid: item.menuitemid,
                price: item.price,
                displayname: item.displayname,
            };
        });

        console.log('Menu Item Map:', menuItemMap); // Debug to ensure the map is correctly created

//**************************************************************************************************************************//
//****************************************    Bowl/Plate Button Generation     *********************************************//
//**************************************************************************************************************************//
        menuItems.forEach((item) => {
            // Process only small-sized items
            if (item.size === 'sm') {
                // Check for small entrees (menu IDs 1 to 39) and create buttons
                if (item.menuitemid >= 1 && item.menuitemid <= 39) {
                    const button = document.createElement('button');
                    button.classList.add('menu-item-button');
                    button.dataset.menuId = item.menuitemid;

                    // Assign onclick handler to add the entree to the current order
                    button.onclick = () => addComponentToCurrentOrder('entree', item.menuitemid, item.menuitem);

                    // Normalize menu item name for consistent file paths
                    const normalizedMenuItem = camelCaseToNormal(item.menuitem);

                    // Create and append an image element for the entree
                    const image = document.createElement('img');
                    image.src = `/Panda Express Photos/${normalizedMenuItem}.png`;
                    image.alt = camelCaseToNormal(item.menuitem);
                    image.classList.add('button-image'); // Optional styling class
                    button.appendChild(image);

                    // Create and append a text element for the entree name
                    const text = document.createElement('div');
                    text.innerText = camelCaseToNormal(item.menuitem);
                    text.classList.add('button-text'); // Optional styling class
                    button.appendChild(text);

                    // Append the button to the entree container
                    entreeContainer.appendChild(button);
                }

                // Check for small sides (menu IDs 40 to 51) and create buttons
                if (item.menuitemid >= 40 && item.menuitemid <= 51) {
                    const button = document.createElement('button');
                    button.classList.add('menu-item-button');
                    button.dataset.menuId = item.menuitemid;

                    // Assign onclick handler to add the side to the current order
                    button.onclick = () => addComponentToCurrentOrder('side', item.menuitemid, item.menuitem);

                    // Normalize menu item name for consistent file paths
                    const normalizedMenuItem = camelCaseToNormal(item.menuitem);

                    // Create and append an image element for the side
                    const image = document.createElement('img');
                    image.src = `/Panda Express Photos/${normalizedMenuItem}.png`;
                    image.alt = camelCaseToNormal(item.menuitem);
                    image.classList.add('button-image'); // Optional styling class
                    button.appendChild(image);

                    // Create and append a text element for the side name
                    const text = document.createElement('div');
                    text.innerText = camelCaseToNormal(item.menuitem);
                    text.classList.add('button-text'); // Optional styling class
                    button.appendChild(text);

                    // Append the button to the side container
                    sideContainer.appendChild(button);
                }
            }
        });
        
//**************************************************************************************************************************//
//********************************************    Appetizers Generation     ************************************************//
//**************************************************************************************************************************//
        // Filter menu items to include only appetizers with IDs 52-60
        const appetizers = menuItems.filter(item => item.menuitemid >= 52 && item.menuitemid <= 60);

        // Map appetizers by their `menuitem` property to group them by size
        appetizers.forEach((item) => {
            if (!appetizerMap[item.menuitem]) {
                appetizerMap[item.menuitem] = {}; // Initialize an object for sizes
            }
            // Add size-specific details to the appetizer map
            appetizerMap[item.menuitem][item.size] = {
                menuitemid: item.menuitemid,
                price: item.price,
            };
        });

        console.log('Appetizer Map:', appetizerMap); // Debug to ensure it's grouped correctly

        // Add buttons for each unique appetizer
        Object.keys(appetizerMap).forEach((menuitem) => {
            const appetizersPanelContent = document.querySelector('#appetizersPanel .appetizer-columns');

            // Check if the appetizers panel is present in the DOM
            if (!appetizersPanelContent) {
                console.error('Appetizers panel-content not found');
                return;
            }

            // Create a button for the appetizer
            const button = document.createElement('button');
            button.classList.add('menu-item-button');
            button.dataset.menuitem = menuitem;

            // Add an image for the appetizer
            const image = document.createElement('img');
            const normalizedMenuItem = camelCaseToNormal(menuitem).replace(/ /g, '%20'); // Ensure correct file path
            image.src = `/Panda Express Photos/${normalizedMenuItem}.png`;
            image.alt = camelCaseToNormal(menuitem);
            image.classList.add('button-image'); // Optional styling class
            button.appendChild(image);

            // Add the appetizer's name as text
            const text = document.createElement('div');
            text.innerText = camelCaseToNormal(menuitem);
            text.classList.add('button-text'); // Optional styling class
            button.appendChild(text);

            // Attach a click handler to open the modal for the appetizer
            button.onclick = () => showAppetizerModal(menuitem);

            // Append the button to the appetizers panel content
            appetizersPanelContent.appendChild(button);
            console.log('Appetizer Button Added:', button);
        });

        // Handle any errors that occur while processing menu items
        } catch (error) {
            console.error('Error loading menu items:', error);
        }
    }

document.addEventListener('DOMContentLoaded', () => {
    loadMenuItems();
});

//**************************************************************************************************************************//
//*****************************************    Seasonal Items Generation     ***********************************************//
//**************************************************************************************************************************//
async function loadSeasonalItems() {
    try {
        // Fetch seasonal items from the API
        const seasonalItemsResponse = await fetch('/api/getactiveseasonalitems');
        if (!seasonalItemsResponse.ok) {
            console.error('Failed to fetch seasonal items:', seasonalItemsResponse.statusText);
            return;
        }

        // Parse the seasonal items response
        const seasonalItems = await seasonalItemsResponse.json();
        console.log('Fetched Seasonal Items:', seasonalItems);

        // Fetch all menu items to match seasonal item IDs
        const menuItemsResponse = await fetch('/api/menuitems');
        if (!menuItemsResponse.ok) {
            console.error('Failed to fetch menu items:', menuItemsResponse.statusText);
            return;
        }

        // Parse the menu items response
        const menuItems = await menuItemsResponse.json();

        // Get DOM containers for different item categories
        const entreeContainer = document.getElementById('entree-buttons');
        const sideContainer = document.getElementById('side-buttons');
        const alacarteEntreeContainer = document.getElementById('ALaCarte-entrees');
        const alacarteSideContainer = document.getElementById('ALaCarte-sides');
        const appetizersPanelContent = document.querySelector('#appetizersPanel .appetizer-columns');

        // Ensure that all necessary DOM containers are available
        if (!entreeContainer || !sideContainer) {
            console.error('One or more containers are missing in the DOM.');
            return;
        }

        if (!alacarteEntreeContainer || !alacarteSideContainer) {
            console.error('One or more À La Carte containers are missing in the DOM.');
            return;
        }

//**************************************************************************************************************************//
//*******************************************    Bowl/Plates Generation     ************************************************//
//**************************************************************************************************************************//
        // Process seasonal items and match with menu items
        seasonalItems.forEach((item) => {
            // Find a corresponding menu item based on name, ID, and size
            const matchedMenuItem = menuItems.find(
                (menuItem) =>
                    menuItem.menuitem === item.menuitem &&
                    menuItem.menuitemid > 72 &&
                    menuItem.size === item.size
            );

            if (!matchedMenuItem) {
                // Log a warning if no match is found
                console.warn(`No match found for seasonal item: ${item.menuitem} (${item.size})`);
                return;
            }

            // Extract matched item data
            const menuId = matchedMenuItem.menuitemid;
            const price = matchedMenuItem.price;

            // Create buttons for seasonal entrees
            if (item.type === 'entree' && item.size === 'sm') {
                const button = document.createElement('button');
                button.classList.add('menu-item-button');
                button.dataset.menuId = menuId;
                button.onclick = () => addComponentToCurrentOrder('entree', menuId, item.menuitem);

                // Add image to the button
                const image = document.createElement('img');
                image.src = `../Panda Express Photos/Panda Express Logo.png`;
                image.alt = camelCaseToNormal(item.menuitem);
                image.classList.add('button-image');
                button.appendChild(image);

                // Add text to the button
                const text = document.createElement('div');
                text.innerText = camelCaseToNormal(item.menuitem);
                text.classList.add('button-text');
                button.appendChild(text);

                // Append the button to the entree container
                entreeContainer.appendChild(button);
            }
            // Create buttons for seasonal sides
            else if (item.type === 'side' && item.size === 'sm') {
                const button = document.createElement('button');
                button.classList.add('menu-item-button');
                button.dataset.menuId = menuId;
                button.onclick = () => addComponentToCurrentOrder('side', menuId, item.menuitem);

                // Add image to the button
                const image = document.createElement('img');
                image.src = `../Panda Express Photos/Panda Express Logo.png`;
                image.alt = camelCaseToNormal(item.menuitem);
                image.classList.add('button-image');
                button.appendChild(image);

                // Add text to the button
                const text = document.createElement('div');
                text.innerText = camelCaseToNormal(item.menuitem);
                text.classList.add('button-text');
                button.appendChild(text);

                // Append the button to the side container
                sideContainer.appendChild(button);
            }
        });

//**************************************************************************************************************************//
//*********************************************   A La Carte Generation     ************************************************//
//**************************************************************************************************************************//
        // Iterate through each seasonal item
        seasonalItems.forEach((item) => {
            // Match the seasonal item with a corresponding menu item
            const matchedMenuItem = menuItems.find(
                (menuItem) =>
                    menuItem.menuitem === item.menuitem &&
                    menuItem.menuitemid > 72 &&
                    menuItem.size === item.size
            );

            if (!matchedMenuItem) {
                // Log a warning if no matching menu item is found
                console.warn(`No match found for seasonal item: ${item.menuitem} (${item.size})`);
                return;
            }

            // Extract the menu ID and price from the matched menu item
            const menuId = matchedMenuItem.menuitemid;
            const price = matchedMenuItem.price;

            // Create buttons for seasonal entrees in the À La Carte section
            if (item.type === 'entree' && item.size === 'sm') {
                const button = document.createElement('button');
                button.classList.add('menu-item-button');
                button.dataset.menuId = menuId;
                button.onclick = () => addAlaCarteItem('entree', menuId, item.menuitem, 'sm', price);

                // Add an image to the button
                const image = document.createElement('img');
                image.src = `../Panda Express Photos/Panda Express Logo.png`;
                image.alt = camelCaseToNormal(item.menuitem);
                image.classList.add('button-image');
                button.appendChild(image);

                // Add text (item name) to the button
                const text = document.createElement('div');
                text.innerText = camelCaseToNormal(item.menuitem);
                text.classList.add('button-text');
                button.appendChild(text);

                // Append the button to the À La Carte entree container
                alacarteEntreeContainer.appendChild(button);
            }
            // Create buttons for seasonal sides in the À La Carte section
            else if (item.type === 'side' && item.size === 'sm') {
                const button = document.createElement('button');
                button.classList.add('menu-item-button');
                button.dataset.menuId = menuId;
                button.onclick = () => addAlaCarteItem('side', menuId, item.menuitem, 'sm', price);

                // Add an image to the button
                const image = document.createElement('img');
                image.src = `../Panda Express Photos/Panda Express Logo.png`;
                image.alt = camelCaseToNormal(item.menuitem);
                image.classList.add('button-image');
                button.appendChild(image);

                // Add text (item name) to the button
                const text = document.createElement('div');
                text.innerText = camelCaseToNormal(item.menuitem);
                text.classList.add('button-text');
                button.appendChild(text);

                // Append the button to the À La Carte side container
                alacarteSideContainer.appendChild(button);
            }
        });

//**************************************************************************************************************************//
//********************************************    Appetizers Generation     ************************************************//
//**************************************************************************************************************************//
        // Filter seasonal appetizers
        const seasonalAppetizers = seasonalItems.filter(item => item.type === 'appetizer');

        seasonalAppetizers.forEach((item) => {
            // Match seasonal appetizer with a corresponding menu item
            const matchedMenuItem = menuItems.find(
                menuItem => menuItem.menuitem === item.menuitem && menuItem.size === item.size
            );

            if (!matchedMenuItem) {
                // Log a warning if no matching appetizer is found
                console.warn(`No match found for seasonal appetizer: ${item.menuitem} (${item.size})`);
                return;
            }

            // Add seasonal appetizers to the appetizer map
            if (!appetizerMap[matchedMenuItem.menuitem]) {
                appetizerMap[matchedMenuItem.menuitem] = {};
            }

            appetizerMap[matchedMenuItem.menuitem][matchedMenuItem.size] = {
                menuitemid: matchedMenuItem.menuitemid,
                price: matchedMenuItem.price,
            };
        });

        console.log('Updated Appetizer Map with Seasonal Items:', appetizerMap);

        // Add buttons for seasonal appetizers
        Object.keys(appetizerMap).forEach((menuitem) => {
            const appetizersPanelContent = document.querySelector('#appetizersPanel .appetizer-columns');
            if (!appetizersPanelContent) {
                // Log an error if the appetizer panel is missing in the DOM
                console.error('Appetizers panel-content not found');
                return;
            }

            // Skip creating buttons for non-seasonal items
            if (!seasonalAppetizers.some(item => item.menuitem === menuitem)) {
                return;
            }

            // Create a button for the seasonal appetizer
            const button = document.createElement('button');
            button.classList.add('menu-item-button');
            button.dataset.menuitem = menuitem;

            // Add an image to the button
            const image = document.createElement('img');
            const normalizedMenuItem = camelCaseToNormal(menuitem).replace(/ /g, '%20'); // Adjust file path for spaces
            image.src = `../Panda Express Photos/Panda Express Logo.png`;
            image.alt = camelCaseToNormal(menuitem);
            image.classList.add('button-image');
            button.appendChild(image);

            // Add the appetizer name as button text
            const text = document.createElement('div');
            text.innerText = camelCaseToNormal(menuitem);
            text.classList.add('button-text');
            button.appendChild(text);

            // Attach a click handler to open the modal for the appetizer
            button.onclick = () => showAppetizerModal(menuitem);

            // Append the button to the appetizer panel
            appetizersPanelContent.appendChild(button);
            console.log('Seasonal Appetizer Button Added:', button);
        });

        console.log('Seasonal items successfully added.');

    } catch (error) {
        console.error('Error loading seasonal items:', error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    loadSeasonalItems();
});

//**************************************************************************************************************************//
//********************************************        Weather API       ****************************************************//
//**************************************************************************************************************************//

// Michael
// Function to get the weather information for the kiosk
/**
 * Gets and displays College Station weather
 */
async function getWeather() {
    try {
        const response = await fetch('/api/weather');
        const data = await response.json();
        const city = "College Station";
        const temp = data.current.temp;
        const description = data.current.weather[0].description;
        const weatherText = document.getElementById('weatherInfo');
        weatherText.textContent = city  + ": " + temp + "°F " + description;
    }
    catch (error) {
        console.log("Error getting weather", error);
    }
}

//**************************************************************************************************************************//
//*****************************************        Order/Preview CODE       ************************************************//
//**************************************************************************************************************************//

/**
 * Initializes a new composite item (bowl, plate, or bigger plate).
 * @param {string} type - The type of the item (e.g., 'bowl', 'plate', 'biggerPlate').
 * @param {number} price - The price of the composite item.
 * @param {number} entreesRequired - Number of entrees required for the composite item.
 * @param {number} sidesRequired - Number of sides required for the composite item.
 * @param {number} menuId - The unique menu ID for the composite item.
 */
function selectItemType(type, price, entreesRequired, sidesRequired, menuId) {
    currentCompositeItem = {
        type: type,
        name: capitalize(type), // Capitalizes the type for display purposes.
        price: price,
        menuId: menuId, // Stores the menuId for identification.
        entreesRequired: entreesRequired,
        sidesRequired: sidesRequired,
        entrees: [], // Initializes an empty list for entrees.
        sides: [] // Initializes an empty list for sides.
    };

    updateCurrentItemPreview(); // Updates the preview of the current composite item.
    openPanel('hiddenPanelMain'); // Opens the panel to allow item customization.
}

/**
 * Adds an item to the order.
 * @param {number|array} menuIds - Single or multiple menu IDs associated with the item.
 * @param {string} name - The name of the item.
 * @param {number} price - The price of the item.
 * @param {string} type - The type of the item (e.g., 'entree', 'side', 'bowl').
 * @param {array} [components=[]] - Components (entrees or sides) for composite items.
 */
function addItemToOrder(menuIds, name, price, type, components = []) {
    const orderItem = {
        menuIds: Array.isArray(menuIds) ? menuIds : [menuIds], // Ensures menuIds is always an array.
        name: name,
        price: price,
        type: type,
        components: components // Includes entrees and sides for composite items.
    };

    orderItems.push(orderItem); // Adds the new item to the order list.
    updateOrderList(); // Refreshes the order list displayed to the user.
    calculateTotal(); // Updates the total price of the order.
}

/**
 * Updates the order list displayed in the UI.
 * Clears the existing list and repopulates it with the current items in `orderItems`.
 */
function updateOrderList() {
    const orderList = document.getElementById("orderList");
    orderList.innerHTML = ""; // Clear the current list to avoid duplicates

    // Iterate over all items in the order
    orderItems.forEach((item, index) => {
        const listItem = document.createElement("div");
        listItem.classList.add("order-item"); // Add a CSS class for styling

        // Calculate total price for the item (accounting for quantity)
        const itemPrice = typeof item.price === 'number' ? item.price : 0;
        const itemQuantity = item.quantity || 1; // Default quantity to 1 if undefined
        const totalPrice = itemPrice * itemQuantity;

        if (isNaN(totalPrice)) {
            console.error('Invalid total price for item:', item);
        }

        // Format the item's name to remove size information (e.g., "(Small)" or "(Medium)")
        const formattedName = item.name.replace(/\s*\(.*?\)/, '');

        // Display the main details of the item (name, size, quantity, and price)
        let listItemHTML = `
            <div>
                <strong>${item.size ? `(${capitalize(item.size)}) ` : ''}${item.type === 'a la carte' ? 'A La Carte' : item.name} x${itemQuantity}</strong> 
                <span>+$${totalPrice.toFixed(2)}</span>
            </div>
        `;

        // Add details for sub-items or components based on the type of item
        if (item.type === 'a la carte') {
            // Display a single À La Carte item
            listItemHTML += `
                <div class="item-components">
                    <div>- ${formattedName}</div>
                </div>
            `;
        } else if (item.type === 'composite' && item.components?.length > 0) {
            // Display components (entrees and sides) for composite items
            listItemHTML += `
                <div class="item-components">
                    ${item.components
                        .map(component => `<div>- ${camelCaseToNormal(component.itemName)}</div>`)
                        .join('')}
                </div>
            `;
        } else if (item.type === 'appetizer') {
            // Display appetizer details
            listItemHTML += `
                <div class="item-components">
                    <div>- ${item.name.replace(/\s*\(.*?\)/, '')}</div>
                </div>
            `;
        }

        // Add a "Remove" button for each item
        listItemHTML += `
            <button onclick="removeItemFromOrder(${index})" class="remove-button">
                Remove
            </button>
        `;

        listItem.innerHTML = listItemHTML; // Add the generated HTML to the list item
        orderList.appendChild(listItem); // Append the item to the order list container
    });
}

/**
 * Adds a component (entree or side) to the current composite item.
 * Automatically finalizes the item when the required number of components is added.
 * 
 * @param {string} category - The category of the component ('entree' or 'side').
 * @param {number} menuId - The unique menu ID of the component.
 * @param {string} itemName - The name of the component being added.
 */
function addComponentToCurrentOrder(category, menuId, itemName) {
    if (!currentCompositeItem) {
        console.error("No active composite item. Cannot add components.");
        return;
    }

    // Add entree if within the required limit
    if (category === 'entree' && currentCompositeItem.entrees.length < currentCompositeItem.entreesRequired) {
        currentCompositeItem.entrees.push({ menuId, itemName });
    }
    // Add side if within the required limit
    else if (category === 'side' && currentCompositeItem.sides.length < currentCompositeItem.sidesRequired) {
        currentCompositeItem.sides.push({ menuId, itemName });
    } 
    // Log a warning if the category limit is reached
    else {
        console.warn(`Cannot add more ${category}s. Limit reached.`);
    }

    // Update the preview after adding a component
    updateCurrentItemPreview();

    // Check if the composite item is complete and finalize it
    const isComplete =
        currentCompositeItem.entrees.length === currentCompositeItem.entreesRequired &&
        currentCompositeItem.sides.length === currentCompositeItem.sidesRequired;

    if (isComplete) {
        finalizeCompositeItem();
    }
}

/**
 * Updates the preview of the current composite item.
 * Displays the composite item's name, price, and added components (entrees and sides).
 */
function updateCurrentItemPreview() {
    const preview = document.getElementById('currentItemPreview'); // Get the preview container
    if (!preview) {
        console.error("Preview container not found.");
        return;
    }

    // Clear the preview if no composite item is active
    if (!currentCompositeItem) {
        preview.innerHTML = "";
        return;
    }

    // Build the preview HTML
    let previewHTML = `<strong>${camelCaseToNormal(currentCompositeItem.name)} +$${currentCompositeItem.price.toFixed(2)}</strong><br>`;
    previewHTML += "<div class='item-components'>";

    // Add entree components to the preview
    currentCompositeItem.entrees.forEach(entree => {
        previewHTML += `<div>- ${camelCaseToNormal(entree.itemName)}</div>`;
    });

    // Add side components to the preview
    currentCompositeItem.sides.forEach(side => {
        previewHTML += `<div>- ${camelCaseToNormal(side.itemName)}</div>`;
    });

    previewHTML += "</div>";
    preview.innerHTML = previewHTML; // Update the preview container with the HTML
}

/**
 * Finalizes the current composite item by adding it to the order.
 * Resets the composite item and updates the UI.
 */
function finalizeCompositeItem() {
    if (!currentCompositeItem) {
        console.error("No active composite item to finalize.");
        return;
    }

    // Collect all menu IDs of the entree and side components
    const componentMenuIds = [
        ...currentCompositeItem.entrees.map(entree => entree.menuId),
        ...currentCompositeItem.sides.map(side => side.menuId),
    ];

    // Use only the base price of the composite item
    const totalPrice = currentCompositeItem.price;

    // Validate the calculated total price
    if (isNaN(totalPrice)) {
        console.error('Failed to calculate total price. Debugging data:', {
            basePrice: currentCompositeItem.price,
            entrees: currentCompositeItem.entrees,
            sides: currentCompositeItem.sides,
        });
        return;
    }

    // Add the finalized composite item to the order
    addItemToOrder(
        [currentCompositeItem.menuId, ...componentMenuIds], // Include composite menu ID and all component IDs
        currentCompositeItem.name,
        totalPrice,
        'composite', // Mark the item as a composite
        [...currentCompositeItem.entrees, ...currentCompositeItem.sides] // Include components for reference
    );

    // Reset the current composite item and update the UI
    currentCompositeItem = null; // Clear the active composite item
    updateCurrentItemPreview(); // Clear the preview
    closePanel(); // Close the UI panel
}
//**************************************************************************************************************************//
//*********************************************        DRINK CODE       ****************************************************//
//**************************************************************************************************************************//

/**
 * Handles drink selection by resetting variables, fetching data if necessary, 
 * and opening a modal for size selection if applicable.
 * @param {string} drinkName - The display name of the selected drink.
 * @param {string} menuIdName - The menu identifier for the drink type.
 */
async function selectDrink(drinkName, menuIdName) {
    // Reset selection variables for the new drink
    selectedDrink = drinkName;
    selectedDrinkType = menuIdName;
    drinkQuantity = 1;

    // Handle Gatorade separately since it has a fixed ID
    if (menuIdName === 'gatorade') {
        try {
            // Fetch all menu items from the API
            const response = await fetch('/api/menuitems');
            if (!response.ok) {
                console.error('Failed to fetch menu items:', response.statusText);
                return;
            }
            const menuItems = await response.json();

            // Find the Gatorade item by its ID
            const gatoradeData = menuItems.find(item => item.menuitemid === 68);
            if (!gatoradeData) {
                console.error('No data found for Gatorade with ID: 68');
                return;
            }

            const { menuitemid, price } = gatoradeData;

            // Add Gatorade directly to the order
            addItemToOrder([menuitemid], drinkName, price, 'drink'); // Add directly without modal
            return;
        } catch (error) {
            console.error('Error fetching menu items for Gatorade:', error);
            return;
        }
    }

    // For other drinks, open the drink modal
    const modal = document.getElementById('drinkModal');
    if (!modal) {
        console.error('Drink modal not found.');
        return;
    }

    // Find the drink button by matching the drink name
    const button = Array.from(document.querySelectorAll('#drink-buttons .menu-item-button'))
        .find(btn => btn.querySelector('.button-text').innerText === drinkName);

    if (!button) {
        console.error(`Button for drink "${drinkName}" not found.`);
        return;
    }

    // Update modal content with the drink's image and name
    const drinkImage = button.querySelector('img').src;
    document.getElementById('drinkImage').src = drinkImage;
    document.getElementById('drinkImage').alt = drinkName;
    document.getElementById('drinkItemName').innerText = drinkName;

    // Dynamically populate size buttons based on available drink sizes
    const sizeSelection = document.getElementById('sizeSelection');
    sizeSelection.innerHTML = ''; // Clear any existing buttons

    const drinkData = menuItemMap[menuIdName]; // Get size data for the drink
    if (drinkData) {
        Object.keys(drinkData).forEach(size => {
            const sizeData = drinkData[size];
            if (sizeData) {
                // Create a button for each available size
                const sizeButton = document.createElement('button');
                sizeButton.classList.add('size-button');
                sizeButton.id = `${size}DrinkSize`;
                sizeButton.innerHTML = `${capitalize(size.replace('_', ' '))}<br>$${sizeData.price.toFixed(2)}`;
                sizeButton.onclick = () => selectDrinkSize(size);

                sizeSelection.appendChild(sizeButton);
            } else {
                console.warn(`No data found for size: ${size} in drink: ${menuIdName}`);
            }
        });
    } else {
        console.error(`No size data found for drink type: ${menuIdName}`);
    }

    // Update drink quantity display and show the modal
    document.getElementById('drinkQuantity').innerText = drinkQuantity;
    modal.style.display = 'block'; // Display the modal
}

/**
 * Adds the selected drink to the order.
 * Validates the selected drink and size, constructs the order object, and updates the order UI.
 */
function addDrinkToOrder() {
    // Validate the selected drink and size
    if (!selectedDrinkType || !menuItemMap[selectedDrinkType][drinkSize]) {
        console.error('Invalid drink or size selection.');
        return;
    }

    // Retrieve the menu item ID and price for the selected size
    const { menuitemid, price } = menuItemMap[selectedDrinkType][drinkSize];

    // Create the drink order object
    const drinkOrder = {
        type: 'drink',
        name: selectedDrink, // Display name of the drink
        size: drinkSize, // Selected size
        price: price, // Price of the selected size
        quantity: drinkQuantity, // Selected quantity
        menuIds: Array(drinkQuantity).fill(menuitemid), // Repeat menu ID based on quantity
    };

    // Add the drink order to the global order list
    orderItems.push(drinkOrder);

    // Update the order UI and recalculate total
    updateOrderList();
    calculateTotal();

    // Close any open modal and panel
    closeDrinkModal();
    closePanel();
}

/**
 * Updates the selected drink size and highlights the corresponding size button.
 * Displays the price for the selected size if available.
 * @param {string} size - The selected drink size (e.g., 'sm', 'md', 'lg').
 */
function selectDrinkSize(size) {
    drinkSize = size; // Update the selected size

    // Highlight the selected size button
    const sizeButtons = document.querySelectorAll('#sizeSelection .size-button');
    sizeButtons.forEach((button) => {
        if (button.id === `${size}DrinkSize`) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });

    // Find the matching menu item for the selected size
    const selectedMenuItem = menuItems.find(
        (item) =>
            item.menuitem === selectedDrinkItem.menuitem &&
            item.size === drinkSize
    );

    if (selectedMenuItem) {
        console.log(`Price for selected size: $${selectedMenuItem.price}`);
    } else {
        console.error("No matching drink item found for the selected size.");
    }
}

/**
 * Increases the drink quantity by 1 and updates the displayed quantity in the UI.
 */
function increaseDrinkQuantity() {
    drinkQuantity++;
    document.getElementById('drinkQuantity').innerText = drinkQuantity;
}

/**
 * Decreases the drink quantity by 1, ensuring it doesn't go below 1.
 * Updates the displayed quantity in the UI.
 */
function decreaseDrinkQuantity() {
    if (drinkQuantity > 1) {
        drinkQuantity--;
        document.getElementById('drinkQuantity').innerText = drinkQuantity;
    }
}

/**
 * Opens the drink modal and initializes its content based on the selected menu item.
 * @param {Object} menuItem - The menu item object containing details about the drink.
 */
function openDrinkModal(menuItem) {
    selectedDrinkItem = menuItem; // Set the currently selected drink item
    drinkSize = 'md'; // Default drink size
    drinkQuantity = 1; // Reset drink quantity to default

    const normalizedMenuItem = camelCaseToNormal(menuItem.menuitem); // Normalize menu item name for display

    // Update modal content with drink details
    document.getElementById('drinkImage').src = `/Panda Express Photos/${normalizedMenuItem}.png`;
    document.getElementById('drinkImage').alt = normalizedMenuItem;
    document.getElementById('drinkItemName').innerText = normalizedMenuItem;

    // Generate size selection buttons dynamically
    const sizeSelection = document.getElementById('sizeSelection');
    sizeSelection.innerHTML = ''; // Clear existing buttons

    Object.keys(menuItemMap[menuItem.menuitem]).forEach((size) => {
        const sizeData = menuItemMap[menuItem.menuitem][size];

        if (sizeData) {
            const sizeButton = document.createElement('button');
            sizeButton.classList.add('size-button'); // Add styling class
            sizeButton.id = `${size}DrinkSize`; // Unique button ID for size
            sizeButton.innerHTML = `${capitalize(size)}<br>$${sizeData.price.toFixed(2)}`;
            sizeButton.onclick = () => selectDrinkSize(size); // Attach size selection handler

            sizeSelection.appendChild(sizeButton);
        }
    });

    // Reset quantity display and show the modal
    document.getElementById('drinkQuantity').innerText = drinkQuantity;
    document.getElementById('drinkModal').style.display = 'block';
}

/**
 * Closes the drink modal and resets the selected drink details.
 */
function closeDrinkModal() {
    const modal = document.getElementById('drinkModal');
    if (modal) {
        modal.style.display = 'none'; // Hide the modal
    }

    // Reset drink-related variables to their default state
    selectedDrinkItem = null;
    drinkSize = 'md';
    drinkQuantity = 1;
}
//**************************************************************************************************************************//
//******************************************        A La Carte CODE       **************************************************//
//**************************************************************************************************************************//

/**
 * Opens the modal for selecting an A La Carte item and initializes its content.
 * @param {Object} menuItem - The menu item object containing details about the A La Carte item.
 */
function openAlaCarteModal(menuItem) {
    selectedAlaCarteItem = menuItem; // Set the selected A La Carte item
    alaCarteSize = 'md'; // Default size
    alaCarteQuantity = 1; // Reset quantity to default

    const normalizedMenuItem = camelCaseToNormal(menuItem.menuitem); // Normalize menu item name for display

    // Update modal content with item details
    document.getElementById('alaCarteImage').src = `/Panda Express Photos/${normalizedMenuItem}.png`;
    document.getElementById('alaCarteImage').alt = normalizedMenuItem;
    document.getElementById('alaCarteItemName').innerText = normalizedMenuItem;

    // Generate size selection buttons dynamically
    const sizeSelection = document.getElementById('sizeSelection');
    sizeSelection.innerHTML = ''; // Clear existing buttons

    Object.keys(menuItemMap[menuItem.menuitem]).forEach((size) => {
        const sizeData = menuItemMap[menuItem.menuitem][size];

        // Skip the "Small" size for sides
        if (menuItem.category === 'side' && size === 'sm') {
            return;
        }

        // Create a button for available sizes
        if (sizeData) {
            const sizeButton = document.createElement('button');
            sizeButton.classList.add('size-button');
            sizeButton.id = `${size}Size`; // Unique ID for the button
            sizeButton.innerHTML = `${capitalize(size)}<br>$${sizeData.price.toFixed(2)}`;
            sizeButton.onclick = () => selectAlaCarteSize(size); // Attach size selection handler

            sizeSelection.appendChild(sizeButton);
        }
    });

    // Update quantity display and show the modal
    document.getElementById('alaCarteQuantity').innerText = alaCarteQuantity;
    document.getElementById('alaCarteModal').style.display = 'block';
}

/**
 * Closes the A La Carte modal and resets the selected item details.
 */
function closeAlaCarteModal() {
    const modal = document.getElementById('alaCarteModal');
    if (modal) {
        modal.style.display = 'none'; // Hide the modal
    }

    // Reset modal-related variables
    selectedAlaCarteItem = null;
    alaCarteSize = 'md'; // Reset to default size
    alaCarteQuantity = 1; // Reset to default quantity
}

/**
 * Updates the selected size for an A La Carte item.
 * @param {string} size - The size selected (e.g., 'sm', 'md', 'lg').
 */
function selectAlaCarteSize(size) {
    alaCarteSize = size; // Update the selected size
    const sizeButtons = document.querySelectorAll('#sizeSelection .size-button');
    sizeButtons.forEach((button) => {
        if (button.id === `${size}Size`) {
            button.classList.add('selected'); // Highlight the selected button
        } else {
            button.classList.remove('selected'); // Remove highlighting from other buttons
        }
    });

    // Retrieve and log the price for the selected size
    const selectedMenuItem = menuItems.find(
        (item) =>
            item.menuitem === selectedAlaCarteItem.menuitem &&
            item.size === alaCarteSize
    );

    if (selectedMenuItem) {
        console.log(`Price for selected size: $${selectedMenuItem.price}`);
    } else {
        console.warn(`No menu item found for size: ${alaCarteSize}`);
    }
}

/**
 * Increases the quantity of the selected A La Carte item.
 */
function increaseAlaCarteQuantity() {
    alaCarteQuantity++;
    document.getElementById('alaCarteQuantity').innerText = alaCarteQuantity;
}

/**
 * Decreases the quantity of the selected A La Carte item, ensuring it remains at least 1.
 */
function decreaseAlaCarteQuantity() {
    if (alaCarteQuantity > 1) {
        alaCarteQuantity--;
        document.getElementById('alaCarteQuantity').innerText = alaCarteQuantity;
    }
}

/**
 * Adds an A La Carte item to the order by opening its modal with the selected details.
 * @param {string} category - The category of the item (e.g., 'entree', 'side').
 * @param {number} menuId - The menu item ID.
 * @param {string} itemName - The name of the menu item.
 * @param {string} size - The size of the item (e.g., 'sm', 'md', 'lg').
 * @param {number} price - The price of the item.
 */
function addAlaCarteItem(category, menuId, itemName, size, price) {
    console.log(`Adding A La Carte item: ${itemName}, Category: ${category}, Size: ${size}, Price: ${price}`);

    // Open the A La Carte modal with item details
    openAlaCarteModal({
        category: category,
        menuitemid: menuId,
        menuitem: itemName,
        price: price
    });
}

/**
 * Adds the currently selected A La Carte item to the order.
 */
function addAlaCarteToOrder() {
    // Validate if an item is selected and exists in the menu map
    if (!selectedAlaCarteItem || !menuItemMap[selectedAlaCarteItem.menuitem]) {
        console.error("Invalid item selected or item not found in menu map.");
        return;
    }

    // Retrieve the data for the selected size
    const selectedSizeData = menuItemMap[selectedAlaCarteItem.menuitem][alaCarteSize];
    if (!selectedSizeData) {
        console.error(`Size data for ${alaCarteSize} not found.`);
        return;
    }

    // Extract menu ID and price from the size data
    const { menuitemid: menuId, price } = selectedSizeData;

    // Construct the order item object
    const alaCarteOrder = {
        type: 'a la carte',
        name: `${camelCaseToNormal(selectedAlaCarteItem.menuitem)} (${capitalize(alaCarteSize)})`,
        size: alaCarteSize,
        price: price,
        quantity: alaCarteQuantity,
        menuIds: Array(alaCarteQuantity).fill(menuId), // Generate an array of menu IDs based on quantity
    };

    // Add the item to the global order list
    orderItems.push(alaCarteOrder);

    // Update the UI: refresh the order list and recalculate the total
    updateOrderList();
    calculateTotal();

    // Close the A La Carte modal and any active panels
    closeAlaCarteModal();
    closePanel();
}
//**************************************************************************************************************************//
//******************************************        Appetizer CODE        **************************************************//
//**************************************************************************************************************************//

/**
 * Displays the modal for selecting an appetizer's size and quantity.
 * @param {string} menuitem - The name of the appetizer item.
 */
function showAppetizerModal(menuitem) {
    selectedAppetizer = menuitem; // Store the selected appetizer
    appetizerSize = 'sm'; // Default size
    appetizerQuantity = 1; // Reset quantity

    const modal = document.getElementById('appetizerModal');

    // Update modal content with the selected appetizer's details
    document.getElementById('appetizerImage').src = `/Panda Express Photos/${camelCaseToNormal(menuitem)}.png`;
    document.getElementById('appetizerImage').alt = camelCaseToNormal(menuitem);
    document.getElementById('appetizerItemName').innerText = camelCaseToNormal(menuitem);

    // Populate size buttons dynamically based on the available sizes
    const sizeSelection = document.getElementById('appetizerSizeSelection');
    sizeSelection.innerHTML = ''; // Clear any existing buttons

    Object.keys(appetizerMap[menuitem]).forEach((size) => {
        const sizeData = appetizerMap[menuitem][size];

        const sizeButton = document.createElement('button');
        sizeButton.classList.add('size-button');
        sizeButton.id = `${size}AppetizerSize`;
        sizeButton.innerHTML = `${capitalize(size)}<br>$${sizeData.price.toFixed(2)}`;
        sizeButton.onclick = () => selectAppetizerSize(size); // Assign click handler for size selection

        sizeSelection.appendChild(sizeButton); // Add button to the modal
    });

    modal.style.display = 'block'; // Show the modal
}

/**
 * Closes the appetizer modal and resets selection variables.
 */
function closeAppetizerModal() {
    document.getElementById('appetizerModal').style.display = 'none';
    selectedAppetizer = null; // Clear selected appetizer
    appetizerSize = 'sm'; // Reset to default size
    appetizerQuantity = 1; // Reset quantity
}

/**
 * Updates the selected size for the appetizer and highlights the selected button.
 * @param {string} size - The selected size for the appetizer.
 */
function selectAppetizerSize(size) {
    appetizerSize = size; // Update the global size variable
    const sizeButtons = document.querySelectorAll('#appetizerSizeSelection .size-button');
    sizeButtons.forEach(button => button.classList.remove('selected')); // Clear previous selection
    document.getElementById(`${size}AppetizerSize`).classList.add('selected'); // Highlight the selected size
}

/**
 * Increases the quantity of the selected appetizer and updates the UI.
 */
function increaseAppetizerQuantity() {
    appetizerQuantity++; // Increment quantity
    document.getElementById('appetizerQuantity').innerText = appetizerQuantity; // Update quantity display
}

/**
 * Decreases the quantity of the selected appetizer if greater than 1 and updates the UI.
 */
function decreaseAppetizerQuantity() {
    if (appetizerQuantity > 1) {
        appetizerQuantity--; // Decrement quantity
        document.getElementById('appetizerQuantity').innerText = appetizerQuantity; // Update quantity display
    }
}

/**
 * Adds the selected appetizer to the order with the chosen size and quantity.
 */
function addAppetizerToOrder() {
    if (!selectedAppetizer) {
        console.error("No appetizer selected.");
        return; // Prevent adding without a valid selection
    }

    const sizeData = appetizerMap[selectedAppetizer][appetizerSize];
    if (!sizeData) {
        console.error(`Size data for ${appetizerSize} not found.`);
        return; // Prevent adding if size data is unavailable
    }

    const { menuitemid: menuId, price } = sizeData;

    // Create the order object for the selected appetizer
    const appetizerOrder = {
        type: 'appetizer',
        name: camelCaseToNormal(selectedAppetizer), // Appetizer name in readable format
        size: capitalize(appetizerSize), // Display size with capitalized format
        price: price, // Price per unit
        quantity: appetizerQuantity, // Selected quantity
        menuIds: Array(appetizerQuantity).fill(menuId), // List of menu item IDs matching the quantity
    };

    // Add the appetizer to the order and update the UI
    orderItems.push(appetizerOrder);
    updateOrderList(); // Refresh the order list display
    calculateTotal(); // Recalculate the total price
    closeAppetizerModal(); // Close the appetizer selection modal
    closePanel(); // Close any related UI panel
}
//**************************************************************************************************************************//
//**************************************        Checkout/Other Features       **********************************************//
//**************************************************************************************************************************//

/**
 * Removes an item from the order at the specified index.
 * Updates the order list and recalculates the total.
 * @param {number} index - The index of the item to remove in the orderItems array.
 */
function removeItemFromOrder(index) {
    if (index >= 0 && index < orderItems.length) {
        orderItems.splice(index, 1); // Remove the item from the order
        updateOrderList(); // Refresh the displayed order list
        calculateTotal(); // Update the total price
    }
}

/**
 * Cancels the current composite item in progress.
 * Resets the current composite item and updates the UI.
 */
function cancelCurrentCompositeItem() {
    currentCompositeItem = null; // Clear the composite item
    updateCurrentItemPreview(); // Reset the preview
    closePanel(); // Close any related UI panel
}

/**
 * Calculates the total price of the order based on all items.
 * Updates the totalAmount display in the UI.
 */
function calculateTotal() {
    totalAmount = orderItems.reduce((sum, item) => {
        const itemTotal = item.price * (item.quantity || 1); // Calculate total for each item
        return sum + itemTotal; // Accumulate the total
    }, 0);

    document.getElementById("totalAmount").innerText = totalAmount.toFixed(2); // Display formatted total
}

/**
 * Clears the entire order.
 * Resets the orderItems array, total amount, and updates the UI.
 */
function clearOrder() {
    orderItems = []; // Clear the order items
    totalAmount = 0; // Reset the total
    updateOrderList(); // Clear the displayed order list
    calculateTotal(); // Update the total price
    updateCurrentItemPreview(); // Reset the current item preview
}

/**
 * Opens a specific panel for managing composite items.
 * Hides the main buttons grid and middle container, then displays the specified panel.
 * @param {string} panelId - The ID of the panel to open.
 */
function openPanel(panelId) {
    // Hide the main buttons grid
    const mainButtons = document.getElementById('main-buttons');
    mainButtons.style.display = 'none';

    // Hide the middle container
    const middleContainer = document.querySelector('.grid-container');
    if (middleContainer) {
        middleContainer.style.display = 'none';
    }

    // Display the specified hidden panel
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.style.display = 'block';
    }

    // Smoothly scroll to the top of the page for better visibility
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Closes all open hidden panels and restores the main buttons grid and middle container.
 */
function closePanel() {
    // Hide all hidden panels
    const panels = document.querySelectorAll('.hidden-panel');
    panels.forEach((panel) => {
        panel.style.display = 'none';
    });

    // Show the main buttons grid
    const mainButtons = document.getElementById('main-buttons');
    mainButtons.style.display = 'grid';

    // Show the middle container
    const middleContainer = document.querySelector('.grid-container');
    if (middleContainer) {
        middleContainer.style.display = 'block';
    }
}

/**
 * Capitalizes the first letter of a given word.
 * @param {string} word - The word to capitalize.
 * @returns {string} - The word with the first letter capitalized.
 */
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Converts a camelCase string to a normal, human-readable format.
 * Adds spaces before uppercase letters and capitalizes the first letter.
 * @param {string} camelCaseString - The camelCase string to convert.
 * @returns {string} - The converted, human-readable string.
 */
function camelCaseToNormal(camelCaseString) {
    return camelCaseString
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Add spaces before uppercase letters
        .replace(/^./, str => str.toUpperCase()); // Capitalize the first letter
}

/**
 * Converts a size abbreviation (sm, md, lg) into its full name.
 * Falls back to the abbreviation if no match is found.
 * @param {string} abbreviation - The size abbreviation to convert.
 * @returns {string} - The full size name or the original abbreviation.
 */
function getFullSizeName(abbreviation) {
    const sizeMap = {
        sm: "Small",
        md: "Medium",
        lg: "Large"
    };
    return sizeMap[abbreviation.toLowerCase()] || abbreviation; // Fallback to original if not found
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////               REWARDS ZONE                /////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Object to store user details
let userDetails = {
    name: "", // Stores the user's name
    points: 0, // Stores the user's reward points
    email: "" // Stores the user's email
};

// Function to generate the Google OAuth URL and update the login link
async function googleOAuthURL() {
    // Base URL for Google OAuth
    const URL = 'https://accounts.google.com/o/oauth2/v2/auth';

    try {
        // Fetch the configuration settings from the server
        const response = await fetch('/api/config');
        const config = await response.json();

        // Define the required scopes for Google OAuth
        const scopes = [
            'https://www.googleapis.com/auth/userinfo.profile', // Access to user's profile information
            'https://www.googleapis.com/auth/userinfo.email' // Access to user's email information
        ];

        // Options for the OAuth request
        const options = {
            redirect_uri: config.redirectUrl, // Redirect URL after authentication
            client_id: config.googleClientId, // Client ID from the server config
            access_type: 'offline', // Request offline access for refresh tokens
            response_type: 'code', // Response type to get the authorization code
            prompt: 'consent', // Prompt the user for consent every time
            scope: scopes.join(' ') // Join the scopes into a single string
        };

        // Generate a query string from the options
        const qs = new URLSearchParams(options);

        // Construct the full OAuth URL
        const oauthURL = `${URL}?${qs.toString()}`;

        // Update the login link with the generated OAuth URL
        const authLink = document.getElementById('OAuthLogin');
        if (authLink) {
            authLink.href = oauthURL; // Set the href attribute of the login link
        }
    } catch (err) {
        console.error('Error generating Google OAuth URL:', err); // Handle errors during URL generation
    }
}

/**
 * Automatically sign in a user if redirected from OAuth with an email parameter.
 */
function autoSignInFromOAuth() {
    const params = new URLSearchParams(window.location.search); // Get the query parameters from the URL
    const email = params.get('email'); // Extract the email parameter
  
    if (email) {
        handleSignIn(email); // Sign in the user if the email parameter exists
    }
}

// Initialize the application after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    googleOAuthURL(); // Generate and set up the Google OAuth login URL
    autoSignInFromOAuth(); // Attempt automatic sign-in if redirected from OAuth
});

/**
 * Redirect to the rewards panel.
 */
function redirectToRewards() {
    // Display the rewards panel
    document.getElementById('rewardsPanel').style.display = 'block';

    // Prevent scrolling in the background while the panel is visible
    document.body.style.overflow = 'hidden';

    // Automatically focus on the popup input field
    const popupInput = document.getElementById('popupInput');
    popupInput.focus();
}

/**
 * Display the sign-in section and adjust the UI accordingly.
 */
function showSignIn() {
    // Show the sign-in section and hide unrelated sections and buttons
    document.getElementById('signInSection').style.display = 'block';
    document.getElementById('createAccountSection').style.display = 'none';
    document.getElementById('signInButton').style.display = 'none';
    document.getElementById('createAccountButton').style.display = 'none';
    document.getElementById('goBackButton').style.display = 'block';

    // Focus on the email input field
    document.getElementById('signInInput').focus();
}

/**
 * Display the create account section and adjust the UI accordingly.
 */
function showCreateAccount() {
    // Show the create account section and hide unrelated sections and buttons
    document.getElementById('createAccountSection').style.display = 'block';
    document.getElementById('signInSection').style.display = 'none';
    document.getElementById('signInButton').style.display = 'none';
    document.getElementById('createAccountButton').style.display = 'none';
    document.getElementById('goBackButton').style.display = 'block';

    // Focus on the name input field
    document.getElementById('nameInput').focus();
}

/**
 * Handles the sign-in process for a user.
 * 
 * @param {string|null} emailFromOAuth - The email passed from OAuth if available, otherwise null.
 */
async function handleSignIn(emailFromOAuth = null) {
    // Get the email either from OAuth or the input field
    const emailIn = emailFromOAuth ? emailFromOAuth.trim() : document.getElementById('signInInput').value.trim();

    // Validate the email format
    if (!validateEmail(emailIn)) {
        alert('Please enter a valid email.');
        return;
    }

    try {
        // Check if the account exists using the provided email
        const checkResponse = await fetch(`/api/checkaccount?email=${encodeURIComponent(emailIn)}`);
        if (checkResponse.status === 404) {
            alert('Account does not exist. Please create an account.');
            return; // Exit if the account does not exist
        }

        // Fetch user details for the provided email
        const detailsResponse = await fetch(`/api/getuserdetails?email=${encodeURIComponent(emailIn)}`);
        if (!detailsResponse.ok) {
            throw new Error(`Failed to fetch user details: HTTP error! Status: ${detailsResponse.status}`);
        }

        // Parse the response and update the user details
        const userDetailsResponse = await detailsResponse.json();
        userDetails = {
            name: userDetailsResponse.name || 'Rewards Member', // Default to 'Rewards Member' if name is not available
            points: userDetailsResponse.points || 0, // Default to 0 points if not available
            email: emailIn, // Store the user's email
        };

        // Set the global email variable for use in other parts of the app
        globalEmail = userDetails.email; 
        console.log('Updated globalEmail:', globalEmail); // Debug log to confirm global email is updated

        // Update the UI after a successful sign-in
        updateUIAfterSignIn();

        // Welcome the user with an alert
        alert(`Welcome back, ${userDetails.name}!`);

        // Close the rewards panel if it is open
        closeRewardsPanel();
    } catch (error) {
        // Log the error to the console and alert the user
        console.error('Error signing in:', error);
        alert('An error occurred while signing in. Please try again later.');
    }
}

/**
 * Handles creating a new rewards account.
 * Validates inputs, checks for existing email, and sends a POST request to the server to create the account.
 */
async function handleCreateAccount() {
    // Get user input values
    const name = document.getElementById('nameInput').value.trim(); // User's name
    const email = document.getElementById('emailInput').value.trim(); // User's email
    const confirmEmail = document.getElementById('confirmEmailInput').value.trim(); // Confirmation email

    // Validate that all fields are filled
    if (!name || !email || !confirmEmail) {
        alert("All fields are required.");
        return; // Exit if any field is empty
    }

    // Check if the emails match
    if (email !== confirmEmail) {
        alert("Emails do not match.");
        return; // Exit if emails do not match
    }

    // Validate the email format
    if (!validateEmail(email)) {
        alert("Please enter a valid email.");
        return; // Exit if email format is invalid
    }

    // Check if the email already exists in the database
    const emailExists = await validateEmailDB(email);
    if (emailExists) {
        alert("The email already exists.");
        return; // Exit if email is already registered
    }

    // Store the email globally for further use
    globalEmail = email;

    // Send a POST request to create the rewards account
    fetch('/api/addrewardsaccount', {
        method: 'POST', // HTTP method for sending data
        headers: { 'Content-Type': 'application/json' }, // Inform server of JSON payload
        body: JSON.stringify({
            name: name, // User's name
            email: email, // User's email
            points: 0 // Initialize account with 0 points
        })
    })
    .then(response => {
        // Check if the server responded with an error
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse the JSON response
    })
    .then(data => {
        // Success: Notify the user and close the rewards panel
        alert(`Account created successfully for ${data.user.name}!`);
        closeRewardsPanel(); // Hide the rewards panel
    })
    .catch(error => {
        // Log and display error message if something goes wrong
        console.error('Error:', error);
        alert('There was an error creating the account. Please try again later.');
    });
}

/**
 * Validates the format of an email address.
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for basic email validation
    return emailRegex.test(email); // Test the email against the regex
}

/**
 * Checks if an email exists in the database.
 * Sends a GET request to the server to verify the email.
 * @param {string} email - The email address to validate against the database.
 * @returns {Promise<boolean>} True if the email exists, false otherwise.
 */
async function validateEmailDB(email) {
    try {
        const response = await fetch(`/api/checkaccount?email=${encodeURIComponent(email)}`, {
            method: 'GET', // HTTP method for retrieving data
            headers: { 'Content-Type': 'application/json' }, // Inform the server of JSON payload
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch from /api/checkaccount: HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); // Parse the JSON response

        return data.exists; // Return true if the account exists, false otherwise
    } catch (error) {
        console.error('Error:', error); // Log any error that occurs
        return false; // Return false if an error occurs
    }
}

/**
 * Returns to the main screen from sign-in or create account sections.
 * Hides all sections except the main buttons and resets the UI.
 */
function goBackToMain() {
    // Hide sign-in and create account sections
    document.getElementById('signInSection').style.display = 'none';
    document.getElementById('createAccountSection').style.display = 'none';

    // Show the main buttons
    document.getElementById('signInButton').style.display = 'block';
    document.getElementById('createAccountButton').style.display = 'block';

    // Hide the "Go Back" button
    document.getElementById('goBackButton').style.display = 'none';

    // Close the virtual keyboard (if applicable)
    Keyboard.close();
}

/**
 * Closes the rewards panel and resets the main screen.
 * Restores the default state of the page, enabling background scrolling.
 */
function closeRewardsPanel() {
    // Hide the rewards panel
    document.getElementById('rewardsPanel').style.display = 'none';

    // Re-enable background scrolling
    document.body.style.overflow = 'auto';

    // Close the virtual keyboard (if applicable)
    Keyboard.close();

    // Reset to the main screen
    goBackToMain();
}

/**
 * Updates the UI to reflect the user's signed-in state.
 * Displays the user's name, updates the rewards button to a "Log Out" button, 
 * and shows the user's reward points.
 */
function updateUIAfterSignIn() {
    console.log("Updating UI with userDetails:", userDetails); // Debugging: Verify the content of userDetails

    // Update the title with the user's name
    const titleElement = document.getElementById('welcomeTitle');
    if (!titleElement) {
        console.error("Element with ID 'welcomeTitle' not found."); // Error handling if the element is missing
        return;
    }
    titleElement.textContent = `Welcome, ${userDetails.name}`; // Set the welcome message

    // Update the rewards button to function as a "Log Out" button
    const rewardsButton = document.getElementById('rewardsButton');
    if (!rewardsButton) {
        console.error("Element with ID 'rewardsButton' not found."); // Error handling if the element is missing
        return;
    }
    rewardsButton.textContent = "Log Out"; // Change the button text
    rewardsButton.onclick = handleLogOut; // Assign the log-out functionality

    // Display the user's points in the designated area
    const pointsDisplay = document.getElementById('pointsDisplay');
    if (pointsDisplay) {
        pointsDisplay.textContent = `Points: ${userDetails.points}`; // Show the user's points
    } else {
        console.error("Element with ID 'pointsDisplay' not found."); // Error handling if the element is missing
    }
}

/**
 * Handles the user's log-out action.
 * Resets user details and UI to the default (logged-out) state.
 */
function handleLogOut() {
    // Reset global variables to the default state
    globalEmail = ''; // Clear the global email
    userDetails = {
        name: '',       // Reset user name
        points: 0,      // Reset points to 0
        email: ''       // Clear email address
    };

    // Reset the title to the default state
    const titleElement = document.getElementById('welcomeTitle');
    if (titleElement) {
        titleElement.textContent = 'Panda Express Kiosk'; // Default title
    }

    // Reset the rewards button to the default "Rewards Member" state
    const rewardsButton = document.getElementById('rewardsButton');
    if (rewardsButton) {
        rewardsButton.textContent = 'Rewards Member'; // Default text
        rewardsButton.onclick = redirectToRewards; // Assign the redirect to rewards functionality
    }

    // Reset the points display to 0
    const pointsDisplay = document.getElementById('pointsDisplay');
    if (pointsDisplay) {
        pointsDisplay.textContent = 'Points: 0'; // Default points display
    }

    console.log('User logged out successfully.'); // Debugging: Log the log-out action
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////        CHECKOUT AND KEYBOARD ZONE         /////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Define an array to store prohibited words from the CSV
let prohibitedWords = [];

/**
 * Loads the CSV file containing prohibited words and stores them in the `prohibitedWords` array.
 * Ensures unique words are stored by combining two columns and removing duplicates.
 */
function loadProhibitedWords() {
    fetch('/supportFiles/profanity_en.csv')
        .then(response => response.text()) // Fetch the CSV file as plain text
        .then(csvData => {
            // Parse the CSV using Papa Parse library
            const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true });
            const wordsSet = new Set();

            // Extract words from `text` and `canonical_form_1` columns
            parsedData.data.forEach(row => {
                if (row.text && row.text.trim() !== "") {
                    wordsSet.add(row.text.trim().toLowerCase()); // Add the trimmed and lowercase word
                }
                if (row.canonical_form_1 && row.canonical_form_1.trim() !== "") {
                    wordsSet.add(row.canonical_form_1.trim().toLowerCase()); // Add canonical forms as well
                }
            });

            // Convert the Set to an array for easier use in validation
            prohibitedWords = Array.from(wordsSet);
        })
        .catch(error => {
            console.error('Error loading CSV:', error); // Log any errors during CSV fetching or parsing
        });
}

// Load prohibited words when the window loads
window.onload = loadProhibitedWords;

// Tracks whether profanity is detected in the user's input
let isProfanityDetected = false;

// Names that should bypass the profanity check due to potential false positives
const allowedNames = [
    'assunta', 'cass', 'cassandra', 'cassidy', 'cassie', 'cassius', 'cassondra', 'classie',
    'douglass', 'hassan', 'hassie', 'kass', 'kassandra', 'kassidy', 'kassie', 'lassie', 'vassie'
];

/**
 * Handles the checkout process and validates user input for prohibited words.
 * Displays a checkout panel and prompts the user to enter their name.
 */
function checkoutOrder() {
    // Check if the order is empty before proceeding
    if (orderItems.length === 0) {
        alert('Your order is empty. Please add items before checking out.');
        return; // Exit the function if the order is empty
    }

    // Get references to the checkout panel and input elements
    const checkoutPanel = document.getElementById('checkoutPanel');
    const popupInput = document.getElementById('popupInput');
    const popupDoneBtn = document.getElementById('popupDoneBtn');

    // Show the checkout panel and focus on the input field
    checkoutPanel.style.display = 'block'; // Make the panel visible
    popupInput.value = ''; // Clear any previous input
    popupInput.focus(); // Focus the input for immediate typing

    // Add a click event listener to validate the entered name
    popupDoneBtn.addEventListener('click', handleNameValidation, { once: true }); // Ensure the listener is added only once
}

/**
 * Handles the validation of the user's input name during checkout.
 * Checks if the name is in the allowed names list or contains any profanity.
 * If invalid, the user is prompted to enter a valid name.
 * If valid, the checkout proceeds.
 */
function handleNameValidation() {
    const popupInput = document.getElementById('popupInput');
    const userInput = popupInput.value.trim().toLowerCase();

    // Check if the name is in the whitelist (bypass profanity check)
    if (allowedNames.includes(userInput)) {
        proceedWithCheckout(userInput);
    } else {
        // Check for profanity in the user input
        const containsProfanity = checkForProfanity(userInput);

        if (containsProfanity || userInput == "") {
            alert('Your name is invalid. Please enter a valid name.');
            isProfanityDetected = true;

            // Allow the user to re-enter their name by showing the input and done button again
            showRetry();
        } else {
            // Proceed with the checkout
            proceedWithCheckout(userInput);
        }
    }
}

/**
 * Checks if the user input contains any profanity by comparing it with a list of prohibited words.
 * 
 * @param {string} userInput The name input from the user to be checked for profanity.
 * @returns {boolean} Returns true if profanity is found, otherwise false.
 */
function checkForProfanity(userInput) {
    return prohibitedWords.some(word => userInput.includes(word));
}

/**
 * Displays the retry input panel allowing the user to enter a valid name.
 * Focuses on the input field and attaches the event listener for the "Done" button.
 */
function showRetry() {
    // Get the checkout panel and input elements
    const checkoutPanel = document.getElementById('checkoutPanel');
    const popupInput = document.getElementById('popupInput');
    const popupDoneBtn = document.getElementById('popupDoneBtn');

    // Show the input field and done button again so the user can try a new name
    checkoutPanel.style.display = 'block';
    popupInput.focus();
    popupDoneBtn.addEventListener('click', handleNameValidation, { once: true });
}

/**
 * Handles the checkout process for the user, including adding points if the user is signed in, 
 * and updating pending orders if the user is not signed in.
 * It proceeds with different actions based on whether the user is signed in or not.
 * 
 * @param {string} userInput The name entered by the user for the order.
 * 
 * @returns {void} This function does not return any value.
 * It performs actions such as adding points, logging the user out, and clearing the order.
 */
async function proceedWithCheckout(userInput) {
    // Check if user is signed in
    if (globalEmail && globalEmail.trim() !== '') {
        // If signed in, add points and proceed with account-specific actions
        // Flatten the array of menuIds from each order item
        const menuItemIDs = orderItems.flatMap(item => item.menuIds).filter(id => id !== undefined);

        console.log('Total Amount:', totalAmount);
        console.log('Menu Item IDs:', menuItemIDs);
        console.log('Input Name:', userInput);

        // Round totalAmount to an integer for points
        const roundedPoints = Math.round(totalAmount);

        // Add points to the account
        const data = await addPointsToAccount(globalEmail, roundedPoints);

        if (data) {
            // Show an alert with the order details
            alert(`Order placed successfully!\nDetails:\nMenu IDs: ${menuItemIDs.join(', ')}\nTotal: $${totalAmount.toFixed(2)}\nThank you, ${userInput}!`);

            // Clear the order
            clearOrder();

            // Log the user out after order
            handleLogOut();

            alert('You have been logged out. Please sign in again for your next order.');
        }
    } else {
        // If not signed in, proceed normally without adding points
        console.log('Proceeding without sign-in...');
        
        // Flatten the array of menuIds from each order item
        const menuItemIDs = orderItems.flatMap(item => item.menuIds).filter(id => id !== undefined);

        console.log('Total Amount:', totalAmount);
        console.log('Menu Item IDs:', menuItemIDs);
        console.log('Input Name:', userInput);

        // Update pending orders
        updatePendingOrders(totalAmount, menuItemIDs, userInput);

        // Show a simple alert with the order details
        alert(`Order placed successfully!\nDetails:\nMenu IDs: ${menuItemIDs.join(', ')}\nTotal: $${totalAmount.toFixed(2)}`);
        
        // Clear the order
        clearOrder();
    }

    // Hide the checkout panel
    const checkoutPanel = document.getElementById('checkoutPanel');
    checkoutPanel.style.display = 'none';

    // Close the virtual keyboard
    Keyboard.close();
}

/**
 * Adds points to a user's account. If the email is invalid or empty, the function will alert the user
 * and return null. If successful, the function will send a POST request to the server to add points to 
 * the account and return the server response.
 *
 * @param {string} email The email address of the user to whom points will be added.
 * @param {number} points The number of points to be added to the user's account.
 * 
 * @returns {Object|null} Returns the server response data if points were added successfully, or `null` 
 * if there was an error or the email was invalid.
 */
async function addPointsToAccount(email, points) {
    if (!email || email.trim() === '') {
        console.error('Email is missing or empty.');
        alert('Email is not set. Please log in or create an account.');
        return null;
    }

    try {
        const response = await fetch('/api/addpoints', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, points }),
        });

        if (!response.ok) {
            throw new Error(`Error adding points: ${response.status}`);
        }

        const data = await response.json();
        console.log('Points added successfully:', data);
        return data;
    } catch (error) {
        console.error('Error adding points:', error);
        return null;
    }
}

/**
 * Sends the order details (total cost, menu item IDs, and input name) to the backend to update the pending orders.
 * The function sends a POST request to the `/api/updatependingorders` endpoint with the provided details.
 * If the request is successful, it alerts the user that the pending order was placed successfully.
 * If an error occurs during the request, it catches the error and alerts the user about the failure.
 * 
 * @param {number} totalCost The total cost of the pending order.
 * @param {Array<number>} menuItemIDs An array of menu item IDs associated with the pending order.
 * @param {string} inputName The name of the user (or customer) who placed the order.
 * 
 * @returns {void} This function does not return any value. It triggers UI updates based on the outcome of the request.
 */
async function updatePendingOrders(totalCost, menuItemIDs, inputName)
{
    // Debugging the values being sent to the backend
    console.log('Sending to API:', { totalCost, menuItemIDs, inputName });

    try
    {
        const response = await fetch('/api/updatependingorders', {
            method: 'POST', // HTTP method for sending data
            headers: { 'Content-Type': 'application/json' }, // Specify JSON content type
            body: JSON.stringify ({ totalCost, menuItemIDs, inputName })
        });

        // Check if the response is successful
        if (!response.ok)
        {
            // Parse the response text for error details, if any
            const errorText = await response.text();
            throw new Error(`Failed to update pending order: ${errorText}`);
        }

        const data = await response.json(); // Parse JSON response from the server
        console.log('Pending order updated successfully:', data);
        alert('Pending order placed successfully!');
    }
    catch (error)
    {
        // Log and display an error message if something went wrong
        console.error('Error:', error);
        alert('An error occurred while placing your pending order. Please try again.');
    }
}

/**
 * Waits for the user to input text via a virtual keyboard and resolves with the entered value.
 * The function listens for input on a virtual keyboard and updates a textarea with the entered value.
 * When the user presses "Enter", the function resolves the promise with the final text entered.
 * 
 * @returns {Promise<string>} A promise that resolves with the text entered in the textarea when the virtual keyboard is closed.
 */
function waitForKeyboardInput() {
    return new Promise((resolve) => {
        // Get the textarea element
        const textarea = document.querySelector('#checkoutPanel textarea');

        // Open the keyboard and listen for Enter key press
        Keyboard.open("", (currentValue) => {
            textarea.value = currentValue;
        }, () => {
            // Cleanup (optional) if the keyboard is closed without pressing Enter
        });

        // Listen for "Enter" key press on the virtual keyboard
        Keyboard.eventHandlers.oninput = (value) => {
            textarea.value = value;
        };

        Keyboard.eventHandlers.onclose = () => {
            resolve(textarea.value); // Resolve the promise with the textarea's value when "Done" is pressed
        };
    });
}

/**
 * The `Keyboard` object provides a virtual keyboard interface. It includes methods for creating the keyboard,
 * handling key events (such as input and close), and displaying the keyboard on the screen.
 */
const Keyboard = {
    elements: {
        main: null, // Main element for the keyboard
        keysContainer: null, // Container for the keys
        keys: [] // Array to store individual keys
    },

    eventHandlers: {
        oninput: null, // Event handler for input events
        onclose: null // Event handler for close events
    },

    properties: {
        value: "", // Current input value
        capsLock: false // Flag for caps lock state
    },

    /**
     * Initializes the virtual keyboard, creates its elements, and adds them to the DOM.
     * It also sets up event listeners for all input fields with the class 'use-keyboard-input'.
     */
    init() {
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        // Setup main elements
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // Automatically use keyboard for elements with .use-keyboard-input
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });
    },

    /**
     * Creates the virtual keyboard layout and returns it as a document fragment.
     * It creates buttons for each key, including backspace, caps lock, and other special keys.
     *
     * @returns {DocumentFragment} A fragment containing all the keyboard keys.
     */
    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "'",
            "done", "z", "x", "c", "v", "b", "n", "m", ".", "-",
            "space", "@"
        ];

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["backspace", "p", "'", "-"].indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent("oninput");
                    });

                    break;

                case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                    });

                    break;

                case "enter":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "done":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("check_circle");

                    keyElement.addEventListener("click", () => {
                        this.close();
                        this._triggerEvent("onclose");
                    });

                    break;

                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener("click", () => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent("oninput");
                    });

                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },

    /**
     * Triggers the event specified by the handler name with the current value.
     *
     * @param {string} handlerName The name of the event handler to trigger (e.g., "oninput").
     */
    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    /**
     * Toggles the caps lock state and updates the text content of the keys.
     */
    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    /**
     * Opens the virtual keyboard with the provided initial value, input handler, and close handler.
     *
     * @param {string} initialValue The initial value to display on the keyboard.
     * @param {Function} oninput The callback to handle input changes.
     * @param {Function} onclose The callback to handle closing the keyboard.
     */
    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },

    /**
     * Closes the virtual keyboard and clears the value.
     */
    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
    getWeather();
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////                 DISCOUNTS                 /////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Applies a percentage discount to the total order amount.
 * @param {number} percent - The discount percentage (e.g., 0.2 for 20%).
 */
function applyOrderDiscount(percent) {
    if (totalAmount > 0) {
        // Calculate the discounted total
        totalAmount -= totalAmount * percent;
        document.getElementById('totalAmount').innerText = totalAmount.toFixed(2);
        alert(`Your new total is $${totalAmount.toFixed(2)}!`);
    } else {
        alert('No items in the order to apply a discount.');
    }
}

/**
 * Applies a user-specific discount based on available points.
 * Supports "freeDrink" and "percentOff" discounts.
 * @param {string} type - The type of discount to apply ('freeDrink' or 'percentOff').
 */
function applyDiscount(type) {
    // Ensure the user has sufficient points to redeem a discount
    if (!userDetails || userDetails.points < 50) {
        alert('You do not have enough points to redeem a discount.');
        return;
    }

    switch (type) {
        case 'freeDrink':
            // Redeem a free drink if the user has at least 50 points
            if (userDetails.points >= 50) {
                alert('You have redeemed a Free Large Fountain Drink!');
                userDetails.points -= 50; // Deduct points
                updatePointsDisplay();
            } else {
                alert('Not enough points for this discount.');
            }
            break;

        case 'percentOff':
            // Redeem a 20% discount if the user has at least 100 points
            if (userDetails.points >= 100) {
                alert('You have redeemed 20% Off your Order!');
                userDetails.points -= 100; // Deduct points
                applyOrderDiscount(0.2); // Apply discount
                updatePointsDisplay();
            } else {
                alert('Not enough points for this discount.');
            }
            break;

        default:
            alert('Invalid discount type.');
            break;
    }
}