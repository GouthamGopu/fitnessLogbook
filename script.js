const apiUrl = "https://6820501a72e59f922ef84ab4.mockapi.io/fitness";

function fetchExercises() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", apiUrl, true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
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
    }
  };
  xhr.send();
}

function addExercise(event) {
  event.preventDefault();
  const exercise = {
    exerciseName: document.getElementById("exerciseName").value,
    duration: document.getElementById("duration").value,
    caloriesBurned: document.getElementById("calories").value,
    date: document.getElementById("date").value,
  };

  if (!exercise.exerciseName || !exercise.duration || !exercise.caloriesBurned || !exercise.date) {
    showError("All fields are required.");
    return;
  }

  const xhr = new XMLHttpRequest();
  xhr.open("POST", apiUrl, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function () {
    if (xhr.status === 201 || xhr.status === 200) {
      closeModal();
      fetchExercises();
    }
  };
  xhr.send(JSON.stringify(exercise));
}

function deleteExercise(id) {
  if (confirm("Are you sure you want to delete this entry?")) {
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", `${apiUrl}/${id}`, true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        fetchExercises();
      }
    };
    xhr.send();
  }
}

function editExercise(id) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${apiUrl}/${id}`, true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      openModal("Update", id);
      document.getElementById("exerciseName").value = data.exerciseName;
      document.getElementById("duration").value = data.duration;
      document.getElementById("calories").value = data.caloriesBurned;
      document.getElementById("date").value = data.date;
    }
  };
  xhr.send();
}

function saveExercise(id) {
  event.preventDefault();
  const updated = {
    exerciseName: document.getElementById("exerciseName").value,
    duration: document.getElementById("duration").value,
    caloriesBurned: document.getElementById("calories").value,
    date: document.getElementById("date").value,
  };

  if (!updated.exerciseName || !updated.duration || !updated.caloriesBurned || !updated.date) {
    showError("All fields are required.");
    return;
  }

  const xhr = new XMLHttpRequest();
  xhr.open("PUT", `${apiUrl}/${id}`, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function () {
    if (xhr.status === 200) {
      closeModal();
      fetchExercises();
    }
  };
  xhr.send(JSON.stringify(updated));
}

function openModal(mode, id = null) {
  const modal = document.getElementById("modal");
  modal.style.display = "block";
  const submitBtn = document.querySelector(".save-btn");
  const modalTitle = document.getElementById("modalTitle");

  if (mode === "Update") {
    modalTitle.textContent = "Update Exercise";
    submitBtn.textContent = "Save Changes";
    submitBtn.onclick = () => saveExercise(id);
  } else {
    modalTitle.textContent = "Add Exercise";
    document.getElementById("exerciseForm").reset();
    submitBtn.textContent = "Add Exercise";
    submitBtn.onclick = addExercise;
  }
}

function addEntry() {
  openModal("Add");
}

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
