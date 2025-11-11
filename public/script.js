const API_URL = `http://localhost:3000/api/students`;

function checkAuth(){
    const token = localStorage.getItem('token');
    if(!token){
        window.location.href = 'login.html';
    }
    return token;
}
 const token = checkAuth();

/* ---------------------------- Get all students ---------------------------- */
async function fetchAll(search = '') {
    const result = await fetch(
        `${API_URL}?search=${encodeURIComponent(search)}`,
        {
            headers: {'Authorization': `Bearer ${token}`}
        }
    );
    const data = await result.json();
    console.log(data);
    const tbody = document.querySelector('#studentsTable');
    tbody.innerHTML = '';
    let i = 1;
    data.forEach(student => {
        tbody.innerHTML += `
            <tr>
                <td>${i++}</td>
                <td><img src="http://localhost:3000/uploads/${student.profile_pic}" class="img img-fluid rounded-circle"></td>
                <td>${student.first_name}</td>
                <td>${student.last_name}</td>
                <td>${student.email}</td>
                <td>${student.phone}</td>
                <td class="action-column">
                    <button class="btn btn-warning btn-sm" title="View" onclick="showStudent('${student._id}')"><i class="fa fa-eye"></i></button>
                    <button class="btn btn-success btn-sm" title="Edit" onclick="editStudent('${student._id}')"><i class="fa fa-pencil"></i></button>
                    <button class="btn btn-trash btn-sm" title="Delete" onclick="deleteStudent('${student._id}')"><i class="fa fa-trash"></i></button>
                </td>
            </tr>`;
    });
}

fetchAll();



async function showStudent(id) {
    const result = await fetch(
        `${API_URL}/${id}`,
        {
            headers: {'Authorization': `Bearer ${token}`}
        }
    );
    const student = await result.json();
    
    document.querySelector('#showFirstName').textContent = student.first_name;
    document.querySelector('#showLastName').textContent = student.last_name;
    document.querySelector('#showEmail').textContent = student.email;
    document.querySelector('#showPhone').textContent = student.phone;
    document.querySelector('#showImage').src = `http://localhost:3000/uploads/${student.profile_pic}`;

    new bootstrap.Modal(document.querySelector('#showModal')).show();
}

document.querySelector('#searchInput').addEventListener("input", ()=>{
    fetchAll(document.querySelector('#searchInput').value);
});



async function deleteStudent(id) {
    if(confirm("Are you sure you want to delete this record?"))
    {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${token}`}
        });
        fetchAll();
    }
}

document.querySelector('#searchInput').addEventListener("input", ()=>{
    fetchAll(document.querySelector('#searchInput').value);
});


document.querySelector('#addForm').addEventListener("submit", async function(e){
    e.preventDefault();

    const formData = new FormData(this);
    const result = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        headers: {'Authorization': `Bearer ${token}`}
    });

    if (result.ok) {
        this.reset();
         bootstrap.Modal.getInstance(document.querySelector('#addModal')).hide();
        fetchAll(); 
    } 
    else{
        alert('Error creating student');
    }
   
});



async function editStudent(id) {
    const result = await fetch(`${API_URL}/${id}`, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    const student = await result.json();

    document.querySelector('#id').value = student._id;
    document.querySelector('#first_name').value = student.first_name;
    document.querySelector('#last_name').value = student.last_name;
    document.querySelector('#email').value = student.email;
    document.querySelector('#phone').value = student.phone;

    new bootstrap.Modal(document.querySelector('#editModal')).show();

}


document.querySelector('#editForm').addEventListener("submit", async function(e){
    e.preventDefault();

    const id = document.querySelector('#id').value;
    const formData = new FormData(this);
    const result = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        body: formData,
        headers: {'Authorization': `Bearer ${token}`}
    });

    if (result.ok) {
        this.reset();
         bootstrap.Modal.getInstance(document.querySelector('#editModal')).hide();
        fetchAll(); 
    } 
    else{
        alert('Error updating student');
    }
   
});


function logout(){
    localStorage.removeItem("token");
    window.location.href = 'login.html';
}
