const addBookmarkBtn = document.getElementById('addBookmarkBtn');
const titleInput = document.getElementById('title');
const urlInput = document.getElementById('url');
const errorDisplay = document.getElementById('error');
const bookmarkList = document.getElementById('bookmarkList');


let editIndex = -1; // Tracks the position of the bookmark being edited

//Load bookmark from localStorage and displays them
loadBookmarks();

//Event Listeners
addBookmarkBtn.addEventListener('click', handleAddBookmark);
bookmarkList.addEventListener('click', handleListClick);

//Function to handle adding and updating bookmarks
function handleAddBookmark(){
    const title = titleInput.value.trim();
    const url = urlInput.value.trim();

    if(editIndex === -1){
        addBookmark(title, url); // Add a new bookmark
    } else{
        updateBookmark(editIndex, title, url); // Updates existing bookmark
    }
}

//Function to handle clicking on bookmark list(edit and remove)
function handleListClick(e){
    console.log(e.target);
    if(e.target && e.target.classList.contains('editBtn')){
        const index = e.target.dataset.index;
         editBookmark(index);
    }
    if(e.target && e.target.classList.contains('removeBtn')){
        const index = e.target.dataset.index;
        removeBookmark(index);
    }
}

//Function to add a new bookmark
function addBookmark(title, url){
    if(!validateInputs(title, url)){
        return;
    }
    const newBookmark = {title, url};
    const bookmarks = getBookmarksFromStorage();
    bookmarks.push(newBookmark);
    saveBookmarksToStorage(bookmarks);
    clearInputs();
    loadBookmarks();
}

//Function to updates an existing bookmark
function updateBookmark(index, title, url){
    if(!validateInputs(title, url)){
        return;
    }
    const bookmarks = getBookmarksFromStorage();
    bookmarks[index] = {title, url}; //Replaces the old bookmark with the updated one
    saveBookmarksToStorage(bookmarks);
    clearInputs();
    loadBookmarks();

    //Reset mode
    editIndex = -1;
    addBookmarkBtn.textContent= 'Add Bookmark'; //Reset button text
}

//Function to remove a bookmark
function removeBookmark(index){
    const bookmarks = getBookmarksFromStorage();
    bookmarks.splice(index, 1); //Remove the bookmark at the given index
    saveBookmarksToStorage(bookmarks);
    loadBookmarks();
}

//Function to edit a bookmark
function editBookmark(index) {
    const bookmarks = getBookmarksFromStorage();
    
    if (isValidBookmarkIndex(bookmarks, index)) {
        const bookmark = bookmarks[index];
        
    // Populate the input fields with the selected bookmark's title and URL
    titleInput.value = bookmark.title;
    urlInput.value = bookmark.url;
    editIndex = index; // Set the current bookmark index for updating later
        
    // Change the button text to "Update Bookmark"
    addBookmarkBtn.textContent = 'Update Bookmark';
        
    // Optionally scroll to the input fields if needed
    titleInput.focus();
    } else {
        console.log("Invalid bookmark index:", index);
        showError("Unable to load bookmark for editing.");
    }
}

// Function to check if the bookmark index is valid
function isValidBookmarkIndex(bookmarks, index) {
    return Array.isArray(bookmarks) && index >= 0 && index < bookmarks.length;
}


//Function to validate input fields
function validateInputs(title, url){
    if(!title || !url){
        showError('Both title and URL are required');
        return false;
    } else{
        return true;
    }
}

//Function to display an error message
function showError(message){
    errorDisplay.textContent = message;
    errorDisplay.style.display = 'block';
}

//Function to clear the input fields and reset the error message
function clearInputs(){
    titleInput.value = '';
    urlInput.value = '';
    errorDisplay.style.display = 'none';
}

//Function to retrieve bookmark from localStorage
function getBookmarksFromStorage(){
    return JSON.parse(localStorage.getItem('bookmarks')) || [];

}

//Function to save bookmark to localStorage
function saveBookmarksToStorage(bookmarks){
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

//Function to load and display bookmarks from localStorage
function loadBookmarks(){
    const bookmarks = getBookmarksFromStorage();
    bookmarkList.innerHTML = ''; //Clears existing bookmarks

    //Add each bookmark to the list
    bookmarks.forEach((bookmark, index) => {
        if (bookmark && bookmark.url && bookmark.title) {
            addBookmarkToList(bookmark, index);
        } else {
            console.log("Invalid bookmark data:", bookmark);
        }
});
}

//Function to add a bookmark to the displayed list
function addBookmarkToList(bookmark, index){
    const li = document.createElement('li');

    li.innerHTML = `<a href = "${bookmark.url}" target="_blank">${bookmark.title}</a>
                    <button class= "editBtn" data-index="${index}">Edit</button>
                    <button class= "removeBtn" data-index="${index}">Remove</button>`;
    bookmarkList.appendChild(li);
}



