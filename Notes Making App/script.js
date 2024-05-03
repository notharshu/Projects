// C R U D
// Create Read Update Delete Search

function isLocalStorageAvailable() {
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
    } catch (e) {
        return false;
    }
}

function showError(message) {
    // Display an error message to the user
    console.error(message);
}

if (isLocalStorageAvailable()) {
    let addNoteContainer = document.getElementById('addNoteContainer');

    function showAllNotes() {
        addNoteContainer.classList.remove('fade-in', 'fade-out'); // Remove fade classes
        addNoteContainer.style.display = 'none';

        let allNotes;
        let notes = localStorage.getItem('notes');
        if (notes === null) {
            allNotes = [];
        } else {
            allNotes = JSON.parse(notes);
        }

        let notesContainer = document.getElementById('notes');
        notesContainer.innerHTML = '';
        allNotes.forEach((note, index) => {
            let notesToBeShown = `<div class="card" style="width: 18rem;">
                                <div class="card-body">
                                    <h5 class="card-title">${note.title}</h5>
                                    <p class="card-text">${note.descp}</p>
                                    <p class="card-date">Created on: ${note.date}</p>
                                    <button class="btn btn-warning card_btns" onclick="deleteNote(${index})"><img src="./delete.svg" alt="" class="delete_btn"></button>
                                    <button class="btn btn-warning card_btns" onclick="editNote(${index})"><img src="./edit.svg" alt="" class="edit_btn"></button>
                                </div>
                            </div>`;

            notesContainer.innerHTML += notesToBeShown;
        });
    }

    showAllNotes();

    let addNoteBtn = document.getElementById('addNote');
    let addTaskBtn = document.getElementById('addTaskBtn');
    let cancelAddBtn = document.getElementById('cancelAdd');

    // Function to handle both "Add Note" and "Add Task" buttons
    function handleAddButtonClick() {
        addNoteContainer.style.display = 'block';
        addNoteContainer.classList.remove('fade-out'); // Remove fade-out class
        void addNoteContainer.offsetWidth; // Trigger reflow to apply fade-in on the next frame
        addNoteContainer.classList.add('fade-in'); // Add fade-in class
        addNoteBtn.innerText = 'Save';
    }

    // Function to hide the "Add Note" container with fade-out effect
    function hideAddNoteContainer() {
        addNoteContainer.classList.add('fade-out'); // Add fade-out class

        // Wait for the fade-out transition to complete before hiding
        setTimeout(() => {
            addNoteContainer.style.display = 'none';
            addNoteContainer.classList.remove('fade-in', 'fade-out'); // Remove fade classes
            addNoteBtn.innerText = 'Save';
        }, 500); // Adjust the timeout duration to match the transition duration
    }

    addNoteBtn.addEventListener('click', () => {
        let title = document.getElementById('title');
        let descp = document.getElementById('descp');
        
        // Check if both title and description are empty
        if (!title.value.trim() && !descp.value.trim()) {
            // If empty, show an alert or handle it as needed
            alert('Please enter a title or description before saving.');
            return;
        }

        let allNotes;
        let notes = localStorage.getItem('notes');
        if (notes === null) {
            allNotes = [];
        } else {
            allNotes = JSON.parse(notes);
        }

        let newNoteObj = {
            title: title.value,
            descp: descp.value,
            date: new Date().toLocaleString(),
        };

        if (addNoteBtn.innerText === 'Update Note') {
            let editCard = document.querySelector('.card');
            let editIndex = editCard.getAttribute('editIndex');
            allNotes[editIndex] = newNoteObj;
        } else {
            allNotes.push(newNoteObj);
        }

        try {
            localStorage.setItem('notes', JSON.stringify(allNotes));
        } catch (error) {
            showError('Error saving to local storage: ' + error.message);
        }

        title.value = '';
        descp.value = '';
        showAllNotes();

        hideAddNoteContainer(); // Call the function to hide the "Add Note" container
    });

    addTaskBtn.addEventListener('click', handleAddButtonClick);
    addNoteBtn.addEventListener('click', handleAddButtonClick);

    cancelAddBtn.addEventListener('click', () => {
        hideAddNoteContainer(); // Call the function to hide the "Add Note" container
    });

    let navAddNoteBtn = document.getElementById('navAddNote');
    navAddNoteBtn.addEventListener('click', handleAddButtonClick);

    function deleteNote(noteIndex) {
        let allNotes = JSON.parse(localStorage.getItem('notes'));
        allNotes.splice(noteIndex, 1);

        try {
            localStorage.setItem('notes', JSON.stringify(allNotes));
        } catch (error) {
            showError('Error saving to local storage: ' + error.message);
        }

        showAllNotes();
    }

    function editNote(noteIndex) {
        let allNotes = JSON.parse(localStorage.getItem('notes'));
        addNoteContainer.classList.add('fade-in'); // Add fade-in class
        addNoteContainer.style.display = 'block';
        addNoteBtn.innerText = 'Update Note';

        let title = document.getElementById('title');
        let descp = document.getElementById('descp');

        title.value = allNotes[noteIndex].title;
        descp.value = allNotes[noteIndex].descp;

        let editCard = document.querySelector('.card');
        editCard.setAttribute('editIndex', `${noteIndex}`);
    }

    let search = document.getElementById('search');
    search.addEventListener('input', () => {
        let inputValue = search.value.toLowerCase();
        let allCards = document.getElementsByClassName('card');

        Array.from(allCards).forEach((ele) => {
            let cardText = ele.getElementsByTagName('p')[0].innerText;

            if (cardText.toLowerCase().includes(inputValue)) {
                ele.style.display = 'block';
            } else {
                ele.style.display = 'none';
            }
        });
    });

} else {
    showError('Local storage is not available.');
}
