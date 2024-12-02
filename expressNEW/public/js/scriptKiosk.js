let orderItems = [];
let currentCompositeItem = null;
let totalAmount = 0;
let selectedSize = 'Medium'; // Default size for A La Carte
let currentAlaCarteItem = null;

let selectedDrink = null;
let selectedDrinkType = null;
let drinkSize = 'sm';
let drinkQuantity = 1;

let selectedAlaCarteItem = null; // Tracks the current selected item
let alaCarteSize = 'md'; // Default size
let alaCarteQuantity = 1;

let menuItems = []; // To store the fetched menu items
let menuItemMap = {}; // To group menu items by `menuitem`

let selectedAppetizer = null;
let appetizerSize = 'sm'; // Default size
let appetizerQuantity = 1; // Default quantity
let appetizerMap = {};

let globalEmail = '';

async function loadMenuItems() {
    try {
        const response = await fetch('/api/menuitems');
        if (!response.ok) {
            console.error('Failed to fetch menu items:', response.statusText);
            return;
        }

        // Fetch and store all menu items
        const fetchedMenuItems = await response.json();
        console.log('Fetched Menu Items:', fetchedMenuItems);

        // Update the global menuItems array
        menuItems = [...fetchedMenuItems];

        console.log('Updated menuItems:', menuItems);

        const entreeContainer = document.getElementById('entree-buttons');
        const sideContainer = document.getElementById('side-buttons');

        // Debug containers
        if (!entreeContainer) console.error("Entree container not found");
        if (!sideContainer) console.error("Side container not found");

        // Find and assign the menuIds for bowls, plates, and bigger plates
        const bowlData = menuItems.find(item => item.menuitem === 'bowl');
        const plateData = menuItems.find(item => item.menuitem === 'plate');
        const biggerPlateData = menuItems.find(item => item.menuitem === 'biggerPlate');

        // Assign onclick handlers with dynamic menuIds for static buttons
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
//**************************************************************************************************************************//
//**************************************************************************************************************************//
    menuItems.forEach((item) => {
        // Add entrees to the À La Carte panel
        if (item.size === 'sm' && item.menuitemid >= 1 && item.menuitemid <= 39) {
            const button = document.createElement('button');
            button.classList.add('menu-item-button');
            button.dataset.menuId = item.menuitemid;
            button.onclick = () => addAlaCarteItem('entree', item.menuitemid, item.menuitem, 'sm', item.price);

            // Convert `item.menuitem` to normal case for the image file name
            const normalizedMenuItem = camelCaseToNormal(item.menuitem);

            // Add the image
            const image = document.createElement('img');
            image.src = `/Panda Express Photos/${normalizedMenuItem}.png`;
            image.alt = camelCaseToNormal(item.menuitem);
            image.classList.add('button-image');
            button.appendChild(image);

            // Add the text
            const text = document.createElement('div');
            text.innerText = camelCaseToNormal(item.menuitem);
            text.classList.add('button-text');
            button.appendChild(text);

            // Append to the À La Carte entrees container
            alacarteEntreeContainer.appendChild(button);
        }

        // Add sides to the À La Carte panel
        if (item.size === 'sm' && item.menuitemid >= 40 && item.menuitemid <= 51) {
            const button = document.createElement('button');
            button.classList.add('menu-item-button');
            button.dataset.menuId = item.menuitemid;
            button.onclick = () => addAlaCarteItem('side', item.menuitemid, item.menuitem, 'sm', item.price);

            // Convert `item.menuitem` to normal case for the image file name
            const normalizedMenuItem = camelCaseToNormal(item.menuitem);

            // Add the image
            const image = document.createElement('img');
            image.src = `/Panda Express Photos/${normalizedMenuItem}.png`;
            image.alt = camelCaseToNormal(item.menuitem);
            image.classList.add('button-image');
            button.appendChild(image);

            // Add the text
            const text = document.createElement('div');
            text.innerText = camelCaseToNormal(item.menuitem);
            text.classList.add('button-text');
            button.appendChild(text);

            // Append to the À La Carte sides container
            alacarteSideContainer.appendChild(button);
        }
    });

//**************************************************************************************************************************//
//**************************************************************************************************************************//
//**************************************************************************************************************************//

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
//**************************************************************************************************************************//
//**************************************************************************************************************************//

        // Populate standard entrees and sides
        menuItems.forEach((item) => {

            if (item.size === 'sm') {
                if (item.menuitemid >= 1 && item.menuitemid <= 39) {
                    const button = document.createElement('button');
                    button.classList.add('menu-item-button');
                    button.dataset.menuId = item.menuitemid;
                    button.onclick = () => addComponentToCurrentOrder('entree', item.menuitemid, item.menuitem);
            
                    // Convert `item.menuitem` to normal case for the image file name
                    const normalizedMenuItem = camelCaseToNormal(item.menuitem); // Remove spaces for file path
            
                    // Add the image
                    const image = document.createElement('img');
                    image.src = `/Panda Express Photos/${normalizedMenuItem}.png`; // Image path
                    image.alt = camelCaseToNormal(item.menuitem); // Alt text for accessibility
                    image.classList.add('button-image'); // Optional: Add a class for styling
                    button.appendChild(image);
            
                    // Add the text
                    const text = document.createElement('div');
                    text.innerText = camelCaseToNormal(item.menuitem);
                    text.classList.add('button-text'); // Optional: Add a class for styling
                    button.appendChild(text);
            
                    entreeContainer.appendChild(button);
                }
            
                if (item.menuitemid >= 40 && item.menuitemid <= 51) {
                    const button = document.createElement('button');
                    button.classList.add('menu-item-button');
                    button.dataset.menuId = item.menuitemid;
                    button.onclick = () => addComponentToCurrentOrder('side', item.menuitemid, item.menuitem);
            
                    // Convert `item.menuitem` to normal case for the image file name
                    const normalizedMenuItem = camelCaseToNormal(item.menuitem); // Remove spaces for file path
            
                    // Add the image
                    const image = document.createElement('img');
                    image.src = `/Panda Express Photos/${normalizedMenuItem}.png`; // Image path
                    image.alt = camelCaseToNormal(item.menuitem); // Alt text for accessibility
                    image.classList.add('button-image'); // Optional: Add a class for styling
                    button.appendChild(image);
            
                    // Add the text
                    const text = document.createElement('div');
                    text.innerText = camelCaseToNormal(item.menuitem);
                    text.classList.add('button-text'); // Optional: Add a class for styling
                    button.appendChild(text);
            
                    sideContainer.appendChild(button);
                }
            }
        });

//**************************************************************************************************************************//
//**************************************************************************************************************************//
//**************************************************************************************************************************//

        const appetizers = menuItems.filter(item => item.menuitemid >= 52 && item.menuitemid <= 60);

        appetizers.forEach((item) => {
            if (!appetizerMap[item.menuitem]) {
                appetizerMap[item.menuitem] = {}; // Initialize an object for sizes
            }
            appetizerMap[item.menuitem][item.size] = {
                menuitemid: item.menuitemid,
                price: item.price,
            };
        });

        console.log('Appetizer Map:', appetizerMap); // Debug to ensure it's grouped correctly

        
        // Add one button per unique appetizer
        // Add buttons for appetizers with images and names
        Object.keys(appetizerMap).forEach((menuitem) => {
            const appetizersPanelContent = document.querySelector('#appetizersPanel .appetizer-columns');
            if (!appetizersPanelContent) {
                console.error('Appetizers panel-content not found');
                return;
            }

            // Create a button for the appetizer
            const button = document.createElement('button');
            button.classList.add('menu-item-button');
            button.dataset.menuitem = menuitem;

            // Add the image
            const image = document.createElement('img');
            const normalizedMenuItem = camelCaseToNormal(menuitem).replace(/ /g, '%20'); // Ensure correct file path
            image.src = `/Panda Express Photos/${normalizedMenuItem}.png`;
            image.alt = camelCaseToNormal(menuitem);
            image.classList.add('button-image'); // Add a CSS class for styling the image
            button.appendChild(image);

            // Add the text (name of the appetizer)
            const text = document.createElement('div');
            text.innerText = camelCaseToNormal(menuitem);
            text.classList.add('button-text'); // Add a CSS class for styling the text
            button.appendChild(text);

            // Attach click handler to open the modal
            button.onclick = () => showAppetizerModal(menuitem);

            // Append the button to the appetizersPanelContent
            appetizersPanelContent.appendChild(button);
            console.log('Appetizer Button Added:', button);
        });
            } catch (error) {
                console.error('Error loading menu items:', error);
            }
        }

document.addEventListener('DOMContentLoaded', () => {
    loadMenuItems();
});

async function loadSeasonalItems() {
    try {
        // Fetch seasonal items
        const seasonalItemsResponse = await fetch('/api/getactiveseasonalitems');
        if (!seasonalItemsResponse.ok) {
            console.error('Failed to fetch seasonal items:', seasonalItemsResponse.statusText);
            return;
        }

        const seasonalItems = await seasonalItemsResponse.json();
        console.log('Fetched Seasonal Items:', seasonalItems);

        // Fetch all menu items for ID matching
        const menuItemsResponse = await fetch('/api/menuitems');
        if (!menuItemsResponse.ok) {
            console.error('Failed to fetch menu items:', menuItemsResponse.statusText);
            return;
        }

        const menuItems = await menuItemsResponse.json();

        const entreeContainer = document.getElementById('entree-buttons');
        const sideContainer = document.getElementById('side-buttons');
        const alacarteEntreeContainer = document.getElementById('ALaCarte-entrees');
        const alacarteSideContainer = document.getElementById('ALaCarte-sides');
        const appetizersPanelContent = document.querySelector('#appetizersPanel .appetizer-columns');

        if (!entreeContainer || !sideContainer) {
            console.error('One or more containers are missing in the DOM.');
            return;
        }

        if (!alacarteEntreeContainer || !alacarteSideContainer) {
            console.error('One or more À La Carte containers are missing in the DOM.');
            return;
        }

        // Process seasonal items and match with menu items
        seasonalItems.forEach((item) => {
            const matchedMenuItem = menuItems.find(
                (menuItem) =>
                    menuItem.menuitem === item.menuitem &&
                    menuItem.menuitemid > 72 &&
                    menuItem.size === item.size
            );

            if (!matchedMenuItem) {
                console.warn(`No match found for seasonal item: ${item.menuitem} (${item.size})`);
                return;
            }

            // Use matched data for seasonal item
            const menuId = matchedMenuItem.menuitemid;
            const price = matchedMenuItem.price;

            // Create buttons based on type
            if (item.type === 'entree' && item.size === 'sm') {
                const button = document.createElement('button');
                button.classList.add('menu-item-button');
                button.dataset.menuId = menuId;
                button.onclick = () => addComponentToCurrentOrder('entree', menuId, item.menuitem);

                // Add image
                const image = document.createElement('img');
                image.src = `../Panda Express Photos/Panda Express Logo.png`;
                image.alt = camelCaseToNormal(item.menuitem);
                image.classList.add('button-image');
                button.appendChild(image);

                // Add text
                const text = document.createElement('div');
                text.innerText = camelCaseToNormal(item.menuitem);
                text.classList.add('button-text');
                button.appendChild(text);

                entreeContainer.appendChild(button);
            } else if (item.type === 'side' && item.size === 'sm') {
                const button = document.createElement('button');
                button.classList.add('menu-item-button');
                button.dataset.menuId = menuId;
                button.onclick = () => addComponentToCurrentOrder('side', menuId, item.menuitem);

                // Add image
                const image = document.createElement('img');
                image.src = `../Panda Express Photos/Panda Express Logo.png`;
                image.alt = camelCaseToNormal(item.menuitem);
                image.classList.add('button-image');
                button.appendChild(image);

                // Add text
                const text = document.createElement('div');
                text.innerText = camelCaseToNormal(item.menuitem);
                text.classList.add('button-text');
                button.appendChild(text);

                sideContainer.appendChild(button);
            }
        });

        seasonalItems.forEach((item) => {
            const matchedMenuItem = menuItems.find(
                (menuItem) =>
                    menuItem.menuitem === item.menuitem &&
                    menuItem.menuitemid > 72 &&
                    menuItem.size === item.size
            );

            if (!matchedMenuItem) {
                console.warn(`No match found for seasonal item: ${item.menuitem} (${item.size})`);
                return;
            }

            // Use matched data for seasonal item
            const menuId = matchedMenuItem.menuitemid;
            const price = matchedMenuItem.price;

            // Create buttons for À La Carte items
            if (item.type === 'entree' && item.size === 'sm') {
                const button = document.createElement('button');
                button.classList.add('menu-item-button');
                button.dataset.menuId = menuId;
                button.onclick = () => addAlaCarteItem('entree', menuId, item.menuitem, 'sm', price);

                // Add image
                const image = document.createElement('img');
                image.src = `../Panda Express Photos/Panda Express Logo.png`;
                image.alt = camelCaseToNormal(item.menuitem);
                image.classList.add('button-image');
                button.appendChild(image);

                // Add text
                const text = document.createElement('div');
                text.innerText = camelCaseToNormal(item.menuitem);
                text.classList.add('button-text');
                button.appendChild(text);

                alacarteEntreeContainer.appendChild(button);
            } else if (item.type === 'side' && item.size === 'sm') {
                const button = document.createElement('button');
                button.classList.add('menu-item-button');
                button.dataset.menuId = menuId;
                button.onclick = () => addAlaCarteItem('side', menuId, item.menuitem, 'sm', price);

                // Add image
                const image = document.createElement('img');
                image.src = `../Panda Express Photos/Panda Express Logo.png`;
                image.alt = camelCaseToNormal(item.menuitem);
                image.classList.add('button-image');
                button.appendChild(image);

                // Add text
                const text = document.createElement('div');
                text.innerText = camelCaseToNormal(item.menuitem);
                text.classList.add('button-text');
                button.appendChild(text);

                alacarteSideContainer.appendChild(button);
            }
        });

        // Filter seasonal appetizers
        const seasonalAppetizers = seasonalItems.filter(item => item.type === 'appetizer');

        seasonalAppetizers.forEach((item) => {
            const matchedMenuItem = menuItems.find(
                menuItem => menuItem.menuitem === item.menuitem && menuItem.size === item.size
            );

            if (!matchedMenuItem) {
                console.warn(`No match found for seasonal appetizer: ${item.menuitem} (${item.size})`);
                return;
            }

            // Update the appetizer map with seasonal items
            if (!appetizerMap[matchedMenuItem.menuitem]) {
                appetizerMap[matchedMenuItem.menuitem] = {};
            }

            appetizerMap[matchedMenuItem.menuitem][matchedMenuItem.size] = {
                menuitemid: matchedMenuItem.menuitemid,
                price: matchedMenuItem.price,
            };
        });

        console.log('Updated Appetizer Map with Seasonal Items:', appetizerMap);

        // Add seasonal appetizer buttons
        Object.keys(appetizerMap).forEach((menuitem) => {
            const appetizersPanelContent = document.querySelector('#appetizersPanel .appetizer-columns');
            if (!appetizersPanelContent) {
                console.error('Appetizers panel-content not found');
                return;
            }

            // Skip adding buttons for non-seasonal items
            if (!seasonalAppetizers.some(item => item.menuitem === menuitem)) {
                return;
            }

            // Create a button for the seasonal appetizer
            const button = document.createElement('button');
            button.classList.add('menu-item-button');
            button.dataset.menuitem = menuitem;

            // Add the image
            const image = document.createElement('img');
            const normalizedMenuItem = camelCaseToNormal(menuitem).replace(/ /g, '%20'); // Ensure correct file path
            image.src = `../Panda Express Photos/Panda Express Logo.png`;
            image.alt = camelCaseToNormal(menuitem);
            image.classList.add('button-image'); // Add a CSS class for styling the image
            button.appendChild(image);

            // Add the text (name of the appetizer)
            const text = document.createElement('div');
            text.innerText = camelCaseToNormal(menuitem);
            text.classList.add('button-text'); // Add a CSS class for styling the text
            button.appendChild(text);

            // Attach click handler to open the modal
            button.onclick = () => showAppetizerModal(menuitem);

            // Append the button to the appetizersPanelContent
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




// Michael
// Function to get the weather information for the kiosk
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


// Function to initialize a new composite item (bowl, plate, or bigger plate)
function selectItemType(type, price, entreesRequired, sidesRequired, menuId) {
    currentCompositeItem = {
        type: type,
        name: capitalize(type),
        price: price,
        menuId: menuId, // Store the menuId for the composite item
        entreesRequired: entreesRequired,
        sidesRequired: sidesRequired,
        entrees: [],
        sides: []
    };
    updateCurrentItemPreview();
    openPanel('hiddenPanelMain');
}

function addItemToOrder(menuIds, name, price, type, components = []) {
    const orderItem = {
        menuIds: Array.isArray(menuIds) ? menuIds : [menuIds], // Composite and component IDs
        name: name,
        price: price,
        type: type,
        components: components // Store components (entrees and sides)
    };

    orderItems.push(orderItem);
    updateOrderList();
    calculateTotal();
}

function updateOrderList() {
    const orderList = document.getElementById("orderList");
    orderList.innerHTML = ""; // Clear the current list

    orderItems.forEach((item, index) => {
        const listItem = document.createElement("div");
        listItem.classList.add("order-item");

        const itemPrice = typeof item.price === 'number' ? item.price : 0;
        const itemQuantity = item.quantity || 1;
        const totalPrice = itemPrice * itemQuantity;

        if (isNaN(totalPrice)) {
            console.error('Invalid total price for item:', item);
        }

        // Format the name to remove size from the item's display name
        const formattedName = item.name.replace(/\s*\(.*?\)/, '');

        // Display main item details
        let listItemHTML = `
            <div>
                <strong>${item.size ? `(${capitalize(item.size)}) ` : ''}${item.type === 'a la carte' ? 'A La Carte' : item.name} x${itemQuantity}</strong> 
                <span>+$${totalPrice.toFixed(2)}</span>
            </div>
        `;

        // Add sub-item details for specific item types
        if (item.type === 'a la carte') {
            listItemHTML += `
                <div class="item-components">
                    <div>- ${formattedName}</div>
                </div>
            `;
        } else if (item.type === 'composite' && item.components?.length > 0) {
            listItemHTML += `
                <div class="item-components">
                    ${item.components
                        .map(component => `<div>- ${camelCaseToNormal(component.itemName)}</div>`)
                        .join('')}
                </div>
            `;
        } else if (item.type === 'appetizer') {
            listItemHTML += `
                <div class="item-components">
                    <div>- ${item.name.replace(/\s*\(.*?\)/, '')}</div>
                </div>
            `;
        }

        // Add a "Remove" button
        listItemHTML += `
            <button onclick="removeItemFromOrder(${index})" class="remove-button">
                Remove
            </button>
        `;

        listItem.innerHTML = listItemHTML;
        orderList.appendChild(listItem);
    });
}



// Function to add a component (entree or side) to the current composite item
function addComponentToCurrentOrder(category, menuId, itemName) {
    if (!currentCompositeItem) {
        console.error("No active composite item. Cannot add components.");
        return;
    }

    if (category === 'entree' && currentCompositeItem.entrees.length < currentCompositeItem.entreesRequired) {
        currentCompositeItem.entrees.push({ menuId, itemName });
    } else if (category === 'side' && currentCompositeItem.sides.length < currentCompositeItem.sidesRequired) {
        currentCompositeItem.sides.push({ menuId, itemName });
    } else {
        console.warn(`Cannot add more ${category}s. Limit reached.`);
    }

    // Update the item preview after adding
    updateCurrentItemPreview();

    // Automatically finalize if the composite item is complete
    const isComplete =
        currentCompositeItem.entrees.length === currentCompositeItem.entreesRequired &&
        currentCompositeItem.sides.length === currentCompositeItem.sidesRequired;

    if (isComplete) {
        finalizeCompositeItem();
    }
}

function updateCurrentItemPreview() {
    const preview = document.getElementById('currentItemPreview'); // Ensure this element exists in your HTML
    if (!preview) {
        console.error("Preview container not found.");
        return;
    }

    if (!currentCompositeItem) {
        preview.innerHTML = ""; // Clear preview if no active composite item
        return;
    }

    let previewHTML = `<strong>${camelCaseToNormal(currentCompositeItem.name)} +$${currentCompositeItem.price.toFixed(2)}</strong><br>`;
    previewHTML += "<div class='item-components'>";

    // Add entrees and sides to the preview
    currentCompositeItem.entrees.forEach(entree => {
        previewHTML += `<div>- ${camelCaseToNormal(entree.itemName)}</div>`;
    });
    currentCompositeItem.sides.forEach(side => {
        previewHTML += `<div>- ${camelCaseToNormal(side.itemName)}</div>`;
    });

    previewHTML += "</div>";
    preview.innerHTML = previewHTML;
}


function finalizeCompositeItem() {
    if (!currentCompositeItem) {
        console.error("No active composite item to finalize.");
        return;
    }

    // Collect all menu IDs of the components
    const componentMenuIds = [
        ...currentCompositeItem.entrees.map(entree => entree.menuId),
        ...currentCompositeItem.sides.map(side => side.menuId),
    ];

    // Use the base price of the composite item only
    const totalPrice = currentCompositeItem.price;

    // Validate the total price
    if (isNaN(totalPrice)) {
        console.error('Failed to calculate total price. Debugging data:', {
            basePrice: currentCompositeItem.price,
            entrees: currentCompositeItem.entrees,
            sides: currentCompositeItem.sides,
        });
        return;
    }

    // Add the composite item to orderItems
    addItemToOrder(
        [currentCompositeItem.menuId, ...componentMenuIds], // Include the composite menu ID and all component IDs
        currentCompositeItem.name,
        totalPrice,
        'composite', // Mark as composite
        [...currentCompositeItem.entrees, ...currentCompositeItem.sides] // Include components for reference
    );

    // Reset the composite item
    currentCompositeItem = null;
    updateCurrentItemPreview();
    closePanel();
}

//**************************************************************************************************************************//
//**************************************************************************************************************************//
//**************************************************************************************************************************//
// Function to handle drink selection
async function selectDrink(drinkName, menuIdName) {
    // Reset selection variables
    selectedDrink = drinkName;
    selectedDrinkType = menuIdName;
    drinkQuantity = 1;

    // Handle Gatorade specifically
    if (menuIdName === 'gatorade') {
        try {
            // Fetch Gatorade information directly from the API
            const response = await fetch('/api/menuitems');
            if (!response.ok) {
                console.error('Failed to fetch menu items:', response.statusText);
                return;
            }
            const menuItems = await response.json();

            // Find the Gatorade item using its ID
            const gatoradeData = menuItems.find(item => item.menuitemid === 68);
            if (!gatoradeData) {
                console.error('No data found for gatorade with ID: 68');
                return;
            }

            const { menuitemid, price } = gatoradeData;

            // Add Gatorade directly to the order
            addItemToOrder([menuitemid], drinkName, price, 'drink'); // Using existing addItemToOrder
            return;
        } catch (error) {
            console.error('Error fetching menu items for Gatorade:', error);
            return;
        }
    }

    // For other drinks, open the modal
    const modal = document.getElementById('drinkModal');
    if (!modal) {
        console.error('Drink modal not found.');
        return;
    }

    // Update modal content
    const button = Array.from(document.querySelectorAll('#drink-buttons .menu-item-button'))
        .find(btn => btn.querySelector('.button-text').innerText === drinkName);

    if (!button) {
        console.error(`Button for drink "${drinkName}" not found.`);
        return;
    }

    const drinkImage = button.querySelector('img').src;
    document.getElementById('drinkImage').src = drinkImage;
    document.getElementById('drinkImage').alt = drinkName;
    document.getElementById('drinkItemName').innerText = drinkName;

    // Dynamically update size buttons
    const sizeSelection = document.getElementById('sizeSelection');
    sizeSelection.innerHTML = ''; // Clear existing buttons

    const drinkData = menuItemMap[menuIdName];
    if (drinkData) {
        Object.keys(drinkData).forEach(size => {
            const sizeData = drinkData[size];
            if (sizeData) {
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

    document.getElementById('drinkQuantity').innerText = drinkQuantity;
    modal.style.display = 'block'; // Show modal
}

function addDrinkToOrder() {
    if (!selectedDrinkItem || !menuItemMap[selectedDrinkItem.menuitem]) {
        console.error("Invalid drink selected or not found in menu map.");
        return;
    }

    const selectedSizeData = menuItemMap[selectedDrinkItem.menuitem][drinkSize];
    if (!selectedSizeData) {
        console.error(`Size data for ${drinkSize} not found.`);
        return;
    }

    const { menuitemid, price } = selectedSizeData;

    const drinkOrder = {
        type: 'drink',
        name: `${camelCaseToNormal(selectedDrinkItem.menuitem)} (${capitalize(drinkSize)})`,
        size: drinkSize,
        price: price,
        quantity: drinkQuantity,
        menuIds: Array(drinkQuantity).fill(menuitemid),
    };

    orderItems.push(drinkOrder);
    updateOrderList();
    calculateTotal();
    closeDrinkModal();
}

// Function to select a size
function selectDrinkSize(size) {
    drinkSize = size; // Update selected size
    const sizeButtons = document.querySelectorAll('#sizeSelection .size-button');
    sizeButtons.forEach((button) => {
        if (button.id === `${size}DrinkSize`) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });

    // Find the menu item in the global menuItems array
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



function increaseDrinkQuantity() {
    drinkQuantity++;
    document.getElementById('drinkQuantity').innerText = drinkQuantity;
}

function decreaseDrinkQuantity() {
    if (drinkQuantity > 1) {
        drinkQuantity--;
        document.getElementById('drinkQuantity').innerText = drinkQuantity;
    }
}


// Function to add the selected drink to the order
function addDrinkToOrder() {
    if (!selectedDrinkType || !menuItemMap[selectedDrinkType][drinkSize]) {
        console.error('Invalid drink or size selection.');
        return;
    }

    const { menuitemid, price } = menuItemMap[selectedDrinkType][drinkSize];
    const drinkOrder = {
        type: 'drink',
        name: selectedDrink,
        size: drinkSize,
        price: price,
        quantity: drinkQuantity,
        menuIds: Array(drinkQuantity).fill(menuitemid),
    };

    // Add to order and update UI
    orderItems.push(drinkOrder);
    updateOrderList();
    calculateTotal();

    // Close modal
    closeDrinkModal();
    closePanel();
}

function openDrinkModal(menuItem) {
    selectedDrinkItem = menuItem;
    drinkSize = 'md'; // Default size
    drinkQuantity = 1;

    const normalizedMenuItem = camelCaseToNormal(menuItem.menuitem);

    // Update modal content
    document.getElementById('drinkImage').src = `/Panda Express Photos/${normalizedMenuItem}.png`;
    document.getElementById('drinkImage').alt = normalizedMenuItem;
    document.getElementById('drinkItemName').innerText = normalizedMenuItem;

    // Update size selection buttons
    const sizeSelection = document.getElementById('sizeSelection');
    sizeSelection.innerHTML = ''; // Clear existing buttons

    Object.keys(menuItemMap[menuItem.menuitem]).forEach((size) => {
        const sizeData = menuItemMap[menuItem.menuitem][size];

        if (sizeData) {
            const sizeButton = document.createElement('button');
            sizeButton.classList.add('size-button');
            sizeButton.id = `${size}DrinkSize`;
            sizeButton.innerHTML = `${capitalize(size)}<br>$${sizeData.price.toFixed(2)}`;
            sizeButton.onclick = () => selectDrinkSize(size);

            sizeSelection.appendChild(sizeButton);
        }
    });

    // Reset quantity and show the modal
    document.getElementById('drinkQuantity').innerText = drinkQuantity;
    document.getElementById('drinkModal').style.display = 'block';
}

function closeDrinkModal() {
    const modal = document.getElementById('drinkModal');
    if (modal) {
        modal.style.display = 'none';
    }
    selectedDrinkItem = null;
    drinkSize = 'md';
    drinkQuantity = 1;
}

//**************************************************************************************************************************//
//**************************************************************************************************************************//
//**************************************************************************************************************************//

// Opens the modal for A La Carte item

function openAlaCarteModal(menuItem) {
    selectedAlaCarteItem = menuItem;
    alaCarteSize = 'md'; // Default size
    alaCarteQuantity = 1;

    const normalizedMenuItem = camelCaseToNormal(menuItem.menuitem);

    // Update modal content
    document.getElementById('alaCarteImage').src = `/Panda Express Photos/${normalizedMenuItem}.png`;
    document.getElementById('alaCarteImage').alt = normalizedMenuItem;
    document.getElementById('alaCarteItemName').innerText = normalizedMenuItem;

    // Update size selection buttons
    const sizeSelection = document.getElementById('sizeSelection');
    sizeSelection.innerHTML = ''; // Clear existing buttons

    // Loop through available sizes, but skip the "Small" size for sides
    Object.keys(menuItemMap[menuItem.menuitem]).forEach((size) => {
        const sizeData = menuItemMap[menuItem.menuitem][size];

        // Exclude the "Small" size if the item is a side
        if (menuItem.category === 'side' && size === 'sm') {
            return;
        }

        // Create a size button
        if (sizeData) {
            const sizeButton = document.createElement('button');
            sizeButton.classList.add('size-button');
            sizeButton.id = `${size}Size`;
            sizeButton.innerHTML = `${capitalize(size)}<br>$${sizeData.price.toFixed(2)}`;
            sizeButton.onclick = () => selectAlaCarteSize(size);

            sizeSelection.appendChild(sizeButton);
        }
    });

    // Reset quantity and show the modal
    document.getElementById('alaCarteQuantity').innerText = alaCarteQuantity;
    document.getElementById('alaCarteModal').style.display = 'block';
}


// Closes the modal
function closeAlaCarteModal() {
    const modal = document.getElementById('alaCarteModal');
    if (modal) {
        modal.style.display = 'none'; // Hide the modal
    }
    selectedAlaCarteItem = null; // Reset the selected item
    alaCarteSize = 'md'; // Reset size to default
    alaCarteQuantity = 1; // Reset quantity
}


// Adjust the size
function selectAlaCarteSize(size) {
    alaCarteSize = size; // Update selected size
    const sizeButtons = document.querySelectorAll('#sizeSelection .size-button');
    sizeButtons.forEach((button) => {
        if (button.id === `${size}Size`) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });

    // Find the menu item in the global menuItems array
    const selectedMenuItem = menuItems.find(
        (item) =>
            item.menuitem === selectedAlaCarteItem.menuitem &&
            item.size === alaCarteSize
    );

    console.log(`Price for selected size: $${selectedMenuItem.price}`);
}

// Adjust quantity
function increaseAlaCarteQuantity() {
    alaCarteQuantity++;
    document.getElementById('alaCarteQuantity').innerText = alaCarteQuantity;
}

function decreaseAlaCarteQuantity() {
    if (alaCarteQuantity > 1) {
        alaCarteQuantity--;
        document.getElementById('alaCarteQuantity').innerText = alaCarteQuantity;
    }
}

function addAlaCarteItem(category, menuId, itemName, size, price) {
    console.log(`Adding A La Carte item: ${itemName}, Category: ${category}, Size: ${size}, Price: ${price}`);

    // Open the A La Carte modal with the selected item details
    openAlaCarteModal({
        category: category,
        menuitemid: menuId,
        menuitem: itemName,
        price: price
    });
}

// Adds the item to the order
function addAlaCarteToOrder() {
    if (!selectedAlaCarteItem || !menuItemMap[selectedAlaCarteItem.menuitem]) {
        console.error("Invalid item selected or item not found in menu map.");
        return;
    }

    const selectedSizeData = menuItemMap[selectedAlaCarteItem.menuitem][alaCarteSize];
    if (!selectedSizeData) {
        console.error(`Size data for ${alaCarteSize} not found.`);
        return;
    }

    const { menuitemid: menuId, price } = selectedSizeData;

    // Create the order item
    const alaCarteOrder = {
        type: 'a la carte',
        name: `${camelCaseToNormal(selectedAlaCarteItem.menuitem)} (${capitalize(alaCarteSize)})`,
        size: alaCarteSize,
        price: price,
        quantity: alaCarteQuantity,
        menuIds: Array(alaCarteQuantity).fill(menuId),
    };

    // Add the item to the order
    orderItems.push(alaCarteOrder);

    // Update the order list and total
    updateOrderList();
    calculateTotal();

    // Close the modal
    closeAlaCarteModal();
    closePanel();
}

//**************************************************************************************************************************//
//**************************************************************************************************************************//
//**************************************************************************************************************************//

function showAppetizerModal(menuitem) {
    selectedAppetizer = menuitem;
    appetizerSize = 'sm'; // Default size
    appetizerQuantity = 1; // Reset quantity

    const modal = document.getElementById('appetizerModal');

    // Update modal content
    document.getElementById('appetizerImage').src = `/Panda Express Photos/${camelCaseToNormal(menuitem)}.png`;
    document.getElementById('appetizerImage').alt = camelCaseToNormal(menuitem);
    document.getElementById('appetizerItemName').innerText = camelCaseToNormal(menuitem);

    // Dynamically populate size buttons
    const sizeSelection = document.getElementById('appetizerSizeSelection');
    sizeSelection.innerHTML = ''; // Clear existing buttons

    Object.keys(appetizerMap[menuitem]).forEach((size) => {
        const sizeData = appetizerMap[menuitem][size];

        const sizeButton = document.createElement('button');
        sizeButton.classList.add('size-button');
        sizeButton.id = `${size}AppetizerSize`;
        sizeButton.innerHTML = `${capitalize(size)}<br>$${sizeData.price.toFixed(2)}`;
        sizeButton.onclick = () => selectAppetizerSize(size);

        sizeSelection.appendChild(sizeButton);
    });

    modal.style.display = 'block'; // Show modal
}


function closeAppetizerModal() {
    document.getElementById('appetizerModal').style.display = 'none';
    selectedAppetizer = null; // Reset selection
    appetizerSize = 'sm'; // Reset size
    appetizerQuantity = 1; // Reset quantity
}

function selectAppetizerSize(size) {
    appetizerSize = size;
    const sizeButtons = document.querySelectorAll('#appetizerSizeSelection .size-button');
    sizeButtons.forEach(button => button.classList.remove('selected'));
    document.getElementById(`${size}AppetizerSize`).classList.add('selected');
}

function increaseAppetizerQuantity() {
    appetizerQuantity++;
    document.getElementById('appetizerQuantity').innerText = appetizerQuantity;
}

function decreaseAppetizerQuantity() {
    if (appetizerQuantity > 1) {
        appetizerQuantity--;
        document.getElementById('appetizerQuantity').innerText = appetizerQuantity;
    }
}


function addAppetizerToOrder() {
    if (!selectedAppetizer) {
        console.error("No appetizer selected.");
        return;
    }

    const sizeData = appetizerMap[selectedAppetizer][appetizerSize];
    if (!sizeData) {
        console.error(`Size data for ${appetizerSize} not found.`);
        return;
    }

    const { menuitemid: menuId, price } = sizeData;

    // Construct the order item without adding size redundantly to the name
    const appetizerOrder = {
        type: 'appetizer',
        name: camelCaseToNormal(selectedAppetizer), // Do not include size here
        size: capitalize(appetizerSize), // Size is stored separately
        price: price,
        quantity: appetizerQuantity,
        menuIds: Array(appetizerQuantity).fill(menuId),
    };

    orderItems.push(appetizerOrder);
    updateOrderList();
    calculateTotal();
    closeAppetizerModal();
    closePanel();
}

//**************************************************************************************************************************//
//**************************************************************************************************************************//
//**************************************************************************************************************************//


function removeItemFromOrder(index) {
    if (index >= 0 && index < orderItems.length) {
        orderItems.splice(index, 1);
        updateOrderList();
        calculateTotal();
    }
}

// Cancel the current composite item
function cancelCurrentCompositeItem() {
    currentCompositeItem = null;
    updateCurrentItemPreview();
    closePanel();
}

function calculateTotal() {
    totalAmount = orderItems.reduce((sum, item) => {
        const itemTotal = item.price * (item.quantity || 1);
        return sum + itemTotal;
    }, 0);

    document.getElementById("totalAmount").innerText = totalAmount.toFixed(2);
}


function clearOrder() {
    orderItems = [];
    totalAmount = 0;
    updateOrderList();
    calculateTotal();
    updateCurrentItemPreview();
}

// Open a specific hidden panel and hide the main grid
function openPanel(panelId) {
    // Hide the main buttons grid
    const mainButtons = document.getElementById('main-buttons');
    mainButtons.style.display = 'none';

    const middleContainer = document.querySelector('.grid-container');
    if (middleContainer) {
        middleContainer.style.display = 'none';
    }

    // Show the requested hidden panel
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.style.display = 'block';
    }

    // Optional: Add smooth scrolling to the top of the panel (optional)
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Close any open hidden panel and show the main grid and middle container
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


function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function camelCaseToNormal(camelCaseString) {
    return camelCaseString
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Add a space before each uppercase letter
        .replace(/^./, str => str.toUpperCase()); // Capitalize the first letter
}

function getFullSizeName(abbreviation) {
    const sizeMap = {
        sm: "Small",
        md: "Medium",
        lg: "Large"
    };
    return sizeMap[abbreviation.toLowerCase()] || abbreviation; // Fallback to original if not found
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////                                           /////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////               REWARDS ZONE                /////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////                                           /////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let userDetails = {
    name: "",
    points: 0,
    email: ""
};

async function googleOAuthURL() {
    const URL = 'https://accounts.google.com/o/oauth2/v2/auth';

    try {
        const response = await fetch('/api/config');
        const config = await response.json();

        const scopes = [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
        const options = {
            redirect_uri: config.redirectUrl,
            client_id: config.googleClientId,
            access_type: 'offline',
            response_type: 'code',
            prompt: 'consent',
            scope: scopes.join(' ')
        }
    
        const qs = new URLSearchParams(options)
    
        const oauthURL = `${URL}?${qs.toString()}`;
    
        const authLink = document.getElementById('OAuthLogin');
        if (authLink) {
            authLink.href = oauthURL;
        }
    }catch (err) {

    }
}

function autoSignInFromOAuth() {
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
  
    if (email) {
      handleSignIn(email);
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    googleOAuthURL();
    autoSignInFromOAuth();
  });

function redirectToRewards() {
    // Show the rewards panel
    document.getElementById('rewardsPanel').style.display = 'block';

    // Optionally, disable scrolling in the background while the panel is visible
    document.body.style.overflow = 'hidden';

    // Focus the input field so that the user can start typing immediately
    const popupInput = document.getElementById('popupInput');
    popupInput.focus();
}

function showSignIn() {
    // Hide the main buttons and show the sign-in section
    document.getElementById('signInSection').style.display = 'block';
    document.getElementById('createAccountSection').style.display = 'none';
    document.getElementById('signInButton').style.display = 'none';
    document.getElementById('createAccountButton').style.display = 'none';
    document.getElementById('goBackButton').style.display = 'block';

    // Focus on the email input
    document.getElementById('signInInput').focus();
}

function showCreateAccount() {
    // Hide the main buttons and show the create account section
    document.getElementById('createAccountSection').style.display = 'block';
    document.getElementById('signInSection').style.display = 'none';
    document.getElementById('signInButton').style.display = 'none';
    document.getElementById('createAccountButton').style.display = 'none';
    document.getElementById('goBackButton').style.display = 'block';

    // Focus on the name input
    document.getElementById('nameInput').focus();
}

async function handleSignIn(emailFromOAuth = null) {
    const emailIn = emailFromOAuth ? emailFromOAuth.trim() : document.getElementById('signInInput').value.trim();

    if (!validateEmail(emailIn)) {
        alert('Please enter a valid email.');
        return;
    }

    try {
        const checkResponse = await fetch(`/api/checkaccount?email=${encodeURIComponent(emailIn)}`);
        if (checkResponse.status === 404) {
            alert('Account does not exist. Please create an account.');
            return;
        }

        const detailsResponse = await fetch(`/api/getuserdetails?email=${encodeURIComponent(emailIn)}`);
        if (!detailsResponse.ok) {
            throw new Error(`Failed to fetch user details: HTTP error! Status: ${detailsResponse.status}`);
        }

        const userDetailsResponse = await detailsResponse.json();
        userDetails = {
            name: userDetailsResponse.name || 'Rewards Member',
            points: userDetailsResponse.points || 0,
            email: emailIn,
        };

        globalEmail = userDetails.email; // Set globalEmail
        console.log('Updated globalEmail:', globalEmail); // Debug log

        updateUIAfterSignIn();
        alert(`Welcome back, ${userDetails.name}!`);
        closeRewardsPanel();
    } catch (error) {
        console.error('Error signing in:', error);
        alert('An error occurred while signing in. Please try again later.');
    }
}



async function handleCreateAccount()
{
    const name = document.getElementById('nameInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const confirmEmail = document.getElementById('confirmEmailInput').value.trim();

    if (!name || !email || !confirmEmail) {
        alert("All fields are required.");
        return;
    }

    if (email !== confirmEmail) {
        alert("Emails do not match.");
        return;
    }

    if (!validateEmail(email)) {
        alert("Please enter a valid email.");
        return;
    }

    // Check if email exists in the DB only if the email format is valid
    const emailExists = await validateEmailDB(email);
    if (emailExists) {
        alert("The email already exists.");
        return;
    }

    // /* Add the name, email, and 0 points to the account when generated */
    // alert(`Account created successfully for ${name}!`);
    // closeRewardsPanel();

    globalEmail = email;

    // Send a POST request to the server to create the rewards account
    fetch('/api/addrewardsaccount',
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify
        ({
            name: name, 
            email: email, 
            points: 0 // Initialize with 0 points
        })
    })
    .then(response =>
    {
        if (!response.ok)
        {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data =>
    {
        // Handle success response
        alert(`Account created successfully for ${data.user.name}!`);
        closeRewardsPanel();
    })
    .catch(error =>
    {
        // Handle errors
        console.error('Error:', error);
        alert('There was an error creating the account. Please try again later.');
    });
}


function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function validateEmailDB(email)
{
    try
    {
        const response = await fetch(`/api/checkaccount?email=${encodeURIComponent(email)}`,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok)
        {
            throw new Error(`Failed to fetch from /api/checkaccount: HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Check if the account exists
        return data.exists; // true if account exists, false otherwise

    }
    catch (error)
    {
        console.error('Error:', error);
        return false; // Handle errors, return false by default
    }
}

function goBackToMain() {
    // Show the main buttons and hide other sections
    document.getElementById('signInSection').style.display = 'none';
    document.getElementById('createAccountSection').style.display = 'none';
    document.getElementById('signInButton').style.display = 'block';
    document.getElementById('createAccountButton').style.display = 'block';
    document.getElementById('goBackButton').style.display = 'none';
    Keyboard.close();
}

function closeRewardsPanel() {
    document.getElementById('rewardsPanel').style.display = 'none';
    document.body.style.overflow = 'auto';
    Keyboard.close();

    // Hide all sections and reset to the main screen
    goBackToMain();
}


function updateUIAfterSignIn() {
    console.log("Updating UI with userDetails:", userDetails); // Debugging: Verify userDetails content

    // Update the title
    const titleElement = document.getElementById('welcomeTitle');
    if (!titleElement) {
        console.error("Element with ID 'welcomeTitle' not found.");
        return;
    }
    titleElement.textContent = `Welcome, ${userDetails.name}`;

    // Update the rewards button to a log-out button
    const rewardsButton = document.getElementById('rewardsButton');
    if (!rewardsButton) {
        console.error("Element with ID 'rewardsButton' not found.");
        return;
    }
    rewardsButton.textContent = "Log Out";
    rewardsButton.onclick = handleLogOut;

    // Update points display in the bottom bar
    const pointsDisplay = document.getElementById('pointsDisplay');
    if (pointsDisplay) {
        pointsDisplay.textContent = `Points: ${userDetails.points}`;
    } else {
        console.error("Element with ID 'pointsDisplay' not found.");
    }
}

function handleLogOut() {
    // Reset global variables
    globalEmail = '';
    userDetails = {
        name: '',
        points: 0,
        email: ''
    };

    // Reset the UI to the logged-out state
    const titleElement = document.getElementById('welcomeTitle');
    titleElement.textContent = 'Panda Express Kiosk';

    const rewardsButton = document.getElementById('rewardsButton');
    rewardsButton.textContent = 'Rewards Member';
    rewardsButton.onclick = redirectToRewards;

    const pointsDisplay = document.getElementById('pointsDisplay');
    if (pointsDisplay) {
        pointsDisplay.textContent = 'Points: 0';
    }

    console.log('User logged out successfully.');
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////                                           /////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////        CHECKOUT AND KEYBOARD ZONE         /////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////                                           /////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Define an array to store the prohibited words from the CSV
let prohibitedWords = [];

// Function to load the CSV file and extract prohibited words
function loadProhibitedWords() {
    fetch('/supportFiles/profanity_en.csv')
        .then(response => response.text())
        .then(csvData => {
            const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true });
            // Extract the 'text' column and store it in the prohibitedWords array
            prohibitedWords = parsedData.data.map(row => row.text.trim().toLowerCase()).filter(text => text !== '');
        })
        .catch(error => {
            console.error('Error loading CSV:', error);
        });
}

// Load prohibited words on page load
window.onload = loadProhibitedWords;


let isProfanityDetected = false;

// List of allowed names to bypass profanity check
const allowedNames = ['assunta', 'cass', 'cassandra', 'cassidy', 'cassie', 'cassius', 'cassondra', 'classie', 
    'douglass', 'hassan', 'hassie', 'kass', 'kassandra', 'kassidy', 'kassie', 'lassie', 'vassie'];

function checkoutOrder() {
    // Check if there are no items in the order
    if (orderItems.length === 0) {
        alert('Your order is empty. Please add items before checking out.');
        return; // Exit the function if the order is empty
    }

    const checkoutPanel = document.getElementById('checkoutPanel');
    const popupInput = document.getElementById('popupInput');
    const popupDoneBtn = document.getElementById('popupDoneBtn');

    // Show the checkout panel and focus on the textarea
    checkoutPanel.style.display = 'block'; // Make it visible
    popupInput.value = ''; // Clear any previous input
    popupInput.focus();

    // Listen for the "Done" button click and handle name input validation
    popupDoneBtn.addEventListener('click', handleNameValidation, { once: true });
}
    


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

function checkForProfanity(userInput) {
    return prohibitedWords.some(word => userInput.includes(word));
}

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

async function proceedWithCheckout(userInput) {
    if (!globalEmail || globalEmail.trim() === '') {
        alert('Please sign in or create an account to complete your order.');
        redirectToRewards(); // Redirect user to rewards login or sign-up panel
        return;
    }

    // Close the virtual keyboard
    Keyboard.close();

    // Hide the checkout panel
    const checkoutPanel = document.getElementById('checkoutPanel');
    checkoutPanel.style.display = 'none';

    // Flatten the array of menuIds from each order item
    const menuItemIDs = orderItems.flatMap(item => item.menuIds).filter(id => id !== undefined);

    console.log('Total Amount:', totalAmount);
    console.log('Menu Item IDs:', menuItemIDs);
    console.log('Input Name:', userInput);

    // Update pending orders
    updatePendingOrders(totalAmount, menuItemIDs, userInput);

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
}


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


const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false
    },

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

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },

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
//////////////////////////////////////////////////////////////                                           /////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////                 DISCOUNTS                 /////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////                                           /////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function applyOrderDiscount(percent) {
    if (totalAmount > 0) {
        totalAmount -= totalAmount * percent;
        document.getElementById('totalAmount').innerText = totalAmount.toFixed(2);
        alert(`Your new total is $${totalAmount.toFixed(2)}!`);
    } else {
        alert('No items in the order to apply a discount.');
    }
}

function applyDiscount(type) {
    if (!userDetails || userDetails.points < 50) {
        alert('You do not have enough points to redeem a discount.');
        return;
    }

    switch (type) {
        case 'freeDrink':
            if (userDetails.points >= 50) {
                alert('You have redeemed a Free Large Fountain Drink!');
                userDetails.points -= 50; // Deduct 50 points
                updatePointsDisplay();
            } else {
                alert('Not enough points for this discount.');
            }
            break;

        case 'percentOff':
            if (userDetails.points >= 100) {
                alert('You have redeemed 20% Off your Order!');
                userDetails.points -= 100; // Deduct 100 points
                applyOrderDiscount(0.2); // Apply 20% discount
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
