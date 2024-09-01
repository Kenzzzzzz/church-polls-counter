// Function to fetch candidates from the server based on the selected sector
function fetchCandidates(sector) {
    fetch(`fetch_candidates.php?sector=${sector}`)
        .then(response => response.json())
        .then(data => {
            if (data.error || data.length === 0) {
                console.log("No candidates found");
                populateTable([]);  // Pass an empty array to keep the table empty
            } else {
                //console.log("Candidates fetched:", data);
                populateTable(data);
            }
        })
        .catch(error => console.error('Fetch error:', error));
}

// Populate the table with fetched candidates
function populateTable(candidates) {
    const tableBody = document.querySelector("#candidatesTable tbody");
    tableBody.innerHTML = '';  // Clear existing rows

    if (candidates.length === 0) {
        // Optionally, you could add a row to indicate no candidates are available
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 3;
        cell.textContent = 'No candidates available for the selected sector.';
        row.appendChild(cell);
        tableBody.appendChild(row);
    } else {
        candidates.forEach(candidate => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${candidate.id}</td>
                <td>${candidate.name}</td>
                <td>${candidate.polls}</td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Function to filter candidates based on the selected sector
function filterCandidates() {
    const selectedSector = Number(document.getElementById('sectorSelect').value);
    fetchCandidates(selectedSector);
}

// Function to handle the submission of votes
function submitVotes() {
    console.log('submitVotes function called');  // Add debugging line

    const sector = Number(document.getElementById('sectorSelect').value);
    const votesInput = document.getElementById('candidateIds').value;
    const votes = [...new Set(votesInput.split(/\s+/).filter(id => id).map(Number))]; // Remove duplicates

    if (votes.length > 0) {
        fetch('update_polls.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                sector: sector,
                votes: votes.join(',')
            })
        })
        .then(response => response.text())
        .then(() => {
            fetchCandidates(sector);  // Refresh the table with updated polls
            document.getElementById('candidateIds').value = '';  // Clear the input field
        })
        .catch(error => console.error('Error updating polls:', error));
    } else {
        alert('Please enter valid candidate IDs.');
    }
}

// Initial population of the table when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const sectorSelect = document.getElementById('sectorSelect');
    fetchCandidates(sectorSelect.value);

    console.log('DOM fully loaded and parsed');
    
    // Ensure only one event listener is added
    const submitButton = document.getElementById('submitVotesButton');
    if (submitButton) {
        submitButton.removeEventListener('click', submitVotes); // Ensure no duplicates
        submitButton.addEventListener('click', submitVotes);
    }

    // Add event listener to the input field to trigger submit button click on "Enter" key press
    const candidateIdsInput = document.getElementById('candidateIds');
    candidateIdsInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();  // Prevent the default form submission
            submitVotes();  // Call the submitVotes function
        }
    });
});
