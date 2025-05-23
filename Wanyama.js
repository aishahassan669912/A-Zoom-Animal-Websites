document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const wanyamaContainer = document.getElementById("Wanyama-container");
    let isEditing = false;
    let currentEditId = null;

    // Form submit handler
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const wanyamaObj = {
            id: document.getElementById("WanyamaId").value,
            Title: document.getElementById("WanyamaTitle").value,
            Poster: document.getElementById("WanyamaPoster").value,
            Plot: document.getElementById("WanyamaPlot").value,
            Price: document.getElementById("WanyamaPrice").value
        };

        if (isEditing) {
            updateWanyama(currentEditId, wanyamaObj);
        } else {
            addWanyama(wanyamaObj);
        }
    });

    // Add new Wanyama
    function addWanyama(wanyama) {
        fetch("http://localhost:3000/Wanyama", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(wanyama)
        })
        .then(response => response.json())
        .then(data => {
            loadWanyama(data);
            form.reset();
        })
        .catch(error => console.error("Error adding Wanyama:", error));
    }

    // Get all Wanyama
    function getWanyama() {
        fetch("http://localhost:3000/Wanyama")
            .then(res => res.json())
            .then(data => {
                wanyamaContainer.innerHTML = "";
                if (Array.isArray(data)) {
                    data.forEach(wanyama => loadWanyama(wanyama));
                } else if (data.Wanyama) {
                    data.Wanyama.forEach(wanyama => loadWanyama(wanyama));
                }
            })
            .catch(error => console.error("Error fetching Wanyama:", error));
    }

    // Display Wanyama
    function loadWanyama(wanyama) {
        const card = document.createElement("div");
        card.classList.add("card", "col-3", "m-3");
        card.setAttribute("data-id", wanyama.id);

        card.innerHTML = `
            <div class="card h-100">
                <img src="${wanyama.Poster}" class="card-img-top" alt="${wanyama.Title}" style="height: 200px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${wanyama.Title}</h5>
                    <p class="card-text">${wanyama.Plot}</p>
                    <p class="mt-auto"><strong>Price: KSh ${wanyama.Price}</strong></p>
                    <div class="d-flex justify-content-between mt-3">
                        <button class="btn btn-warning btn-sm edit-btn">Edit</button>
                        <button class="btn btn-danger btn-sm delete-btn">Delete</button>
                        <button class="btn btn-success btn-sm buy-now-btn">Buy Now</button>
                    </div>
                </div>
            </div>
        `;

        wanyamaContainer.appendChild(card);

        // Add event listeners
        card.querySelector(".delete-btn").addEventListener("click", () => deleteWanyama(wanyama.id));
        card.querySelector(".edit-btn").addEventListener("click", () => editWanyama(wanyama));
        card.querySelector(".buy-now-btn").addEventListener("click", () => {
            alert(`You are buying: ${wanyama.Title} for KSh ${wanyama.Price}`);
        });
    }

    // Delete Wanyama
    function deleteWanyama(id) {
        if (confirm("Are you sure you want to delete this Wanyama?")) {
            fetch(`http://localhost:3000/Wanyama/${id}`, {
                method: "DELETE"
            })
            .then(() => {
                document.querySelector(`.card[data-id="${id}"]`).remove();
            })
            .catch(error => console.error("Error deleting Wanyama:", error));
        }
    }

    // Edit Wanyama
    function editWanyama(wanyama) {
        isEditing = true;
        currentEditId = wanyama.id;
        
        document.getElementById("WanyamaTitle").value = wanyama.Title;
        document.getElementById("WanyamaId").value = wanyama.id;
        document.getElementById("WanyamaPoster").value = wanyama.Poster;
        document.getElementById("WanyamaPlot").value = wanyama.Plot;
        document.getElementById("WanyamaPrice").value = wanyama.Price;
        
        form.querySelector("button[type='submit']").textContent = "Update Wanyama";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update Wanyama
    function updateWanyama(id, updatedWanyama) {
        fetch(`http://localhost:3000/Wanyama/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedWanyama)
        })
        .then(response => response.json())
        .then(() => {
            getWanyama();
            form.reset();
            form.querySelector("button[type='submit']").textContent = "Add Wanyama";
            isEditing = false;
            currentEditId = null;
        })
        .catch(error => console.error("Error updating Wanyama:", error));
    }

    // Initial load
    getWanyama();
});