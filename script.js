const apiUrl = "https://6820501a72e59f922ef84ab4.mockapi.io/fitness";

function fetchExercises() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const tableBody = document.getElementById("exercise-table-body");
      tableBody.innerHTML = "";

      data.forEach((exercise) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${exercise.exerciseName}</td>
          <td>${exercise.duration} mins</td>
          <td>${exercise.caloriesBurned} kcal</td>
          <td>${exercise.date}</td>
          <td class="action-buttons">
            <button class="update" onclick="editExercise('${exercise.id}')">Update</button>
            <button class="delete" onclick="deleteExercise('${exercise.id}')">Delete</button>
          </td>
        `;

        tableBody.appendChild(row);
      });
    });
}

function addExercise(event) {
  event.preventDefault();
  const exerciseName = document.getElementById("exerciseName").value;
  const duration = document.getElementById("duration").value;
  const caloriesBurned = document.getElementById("calories").value;
  const date = document.getElementById("date").value;

  if (!exerciseName || !duration || !caloriesBurned || !date) {
    showError("All fields are required.");
    return;
  }

  const exercise = {
    exerciseName,
    duration,
    caloriesBurned,
    date,
  };

  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(exercise),
  }).then(() => {
    closeModal();
    fetchExercises();
  });
}

function deleteExercise(id) {
  if (confirm("Are you sure you want to delete this entry?")) {
    fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
    }).then(() => fetchExercises());
  }
}

function editExercise(id) {
  fetch(`${apiUrl}/${id}`)
    .then(response => response.json())
    .then(data => {
      openModal("Update", id);
      document.getElementById("exerciseName").value = data.exerciseName;
      document.getElementById("duration").value = data.duration;
      document.getElementById("calories").value = data.caloriesBurned;
      document.getElementById("date").value = data.date;
    });
}

function saveExercise(id) {
  event.preventDefault();
  const exerciseName = document.getElementById("exerciseName").value;
  const duration = document.getElementById("duration").value;
  const caloriesBurned = document.getElementById("calories").value;
  const date = document.getElementById("date").value;

  if (!exerciseName || !duration || !caloriesBurned || !date) {
    showError("All fields are required.");
    return;
  }

  const updated = {
    exerciseName,
    duration,
    caloriesBurned,
    date,
  };

  fetch(`${apiUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  }).then(() => {
    closeModal();
    fetchExercises();
  });
}

function openModal(mode, id = null) {
  const modal = document.getElementById("modal");
  modal.style.display = "block";
  const submitBtn = document.querySelector(".save-btn");
  const modelTitle = document.getElementById("modalTitle");

  if (mode === "Update") {
    modelTitle.textContent="Update Exercise";
    submitBtn.textContent = "Save Changes";
    submitBtn.onclick = () => saveExercise(id);
  } else {
    modelTitle.textContent="Add Exercise";
    document.getElementById("exerciseForm").reset();
    submitBtn.textContent = "Add Exercise";
    submitBtn.onclick = addExercise;
  }
}

function addEntry() {
  openModal("Add");
}

document.getElementById("modal").style.display = "none";

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function showError(message) {
  const errorElement = document.getElementById("error-message");
  errorElement.textContent = message;
  errorElement.style.display = "block";
  setTimeout(() => {
    errorElement.style.display = "none";
  }, 5000);
}
 
window.onload = fetchExercises;
