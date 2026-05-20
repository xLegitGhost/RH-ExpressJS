// Verificación de autenticación al cargar
const token = localStorage.getItem('jwt_token');
if (!token) {
    window.location.href = '/';
}

// Configuración de UI
const user = JSON.parse(localStorage.getItem('user'));
if (user) {
    document.getElementById('userNameDisplay').textContent = `Hola, ${user.username}`;
}

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
    window.location.href = '/';
});

// Variables globales
const apiUrl = '/api/employees';
let currentEmployees = [];

// Elementos del DOM
const tableBody = document.getElementById('employeesTableBody');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resetSearchBtn = document.getElementById('resetSearchBtn');
const modal = document.getElementById('employeeModal');
const employeeForm = document.getElementById('employeeForm');
const modalTitle = document.getElementById('modalTitle');
const modalError = document.getElementById('modalError');

// Cargar empleados
async function fetchEmployees(searchQuery = '') {
    try {
        const url = searchQuery ? `${apiUrl}?search=${encodeURIComponent(searchQuery)}` : apiUrl;
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401 || response.status === 403) {
            // Token inválido o expirado
            localStorage.removeItem('jwt_token');
            window.location.href = '/';
            return;
        }

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        currentEmployees = data;
        renderTable();
    } catch (error) {
        console.error('Error fetching employees:', error);
        tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-red-500">Error al cargar datos.</td></tr>`;
    }
}

function renderTable() {
    tableBody.innerHTML = '';
    
    if (currentEmployees.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-20 text-zinc-600 uppercase text-xs tracking-widest font-bold">No se encontraron empleados.</td></tr>`;
        return;
    }

    currentEmployees.forEach(emp => {
        const row = document.createElement('tr');
        row.className = "hover:bg-white/[0.02] transition-colors duration-200 group";
        row.innerHTML = `
            <td class="px-8 py-6 whitespace-nowrap">
                <div class="text-sm font-black text-white uppercase tracking-tight">${emp.nombre} ${emp.apellidos}</div>
            </td>
            <td class="px-8 py-6 whitespace-nowrap">
                <div class="text-sm text-zinc-300 font-medium">${emp.correo}</div>
                <div class="text-xs text-zinc-500 mt-1">${emp.telefono || 'N/A'}</div>
            </td>
            <td class="px-8 py-6">
                <div class="text-xs text-zinc-500 truncate max-w-xs uppercase tracking-wider font-medium">${emp.direccion || 'N/A'}</div>
            </td>
            <td class="px-8 py-6 whitespace-nowrap text-right text-xs font-bold uppercase tracking-widest">
                <button onclick="editEmployee('${emp.id}')" class="text-zinc-400 hover:text-white mr-6 transition-colors">Editar</button>
                <button onclick="deleteEmployee('${emp.id}')" class="text-zinc-700 hover:text-red-500 transition-colors">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Búsqueda
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        resetSearchBtn.classList.remove('hidden');
        fetchEmployees(query);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBtn.click();
});

resetSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    resetSearchBtn.classList.add('hidden');
    fetchEmployees();
});

// Modales y Formulario
function openModal(employee = null) {
    modalError.classList.add('hidden');
    employeeForm.reset();

    if (employee) {
        modalTitle.textContent = 'Editando Empleado';
        document.getElementById('empId').value = employee.id;
        document.getElementById('empNombre').value = employee.nombre;
        document.getElementById('empApellidos').value = employee.apellidos;
        document.getElementById('empTelefono').value = employee.telefono || '';
        document.getElementById('empCorreo').value = employee.correo;
        document.getElementById('empDireccion').value = employee.direccion || '';
    } else {
        modalTitle.textContent = 'Nuevo Empleado';
        document.getElementById('empId').value = '';
    }

    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
}

function editEmployee(id) {
    const emp = currentEmployees.find(e => e.id == id);
    if (emp) openModal(emp);
}

employeeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('empId').value;
    const empData = {
        nombre: document.getElementById('empNombre').value,
        apellidos: document.getElementById('empApellidos').value,
        telefono: document.getElementById('empTelefono').value,
        correo: document.getElementById('empCorreo').value,
        direccion: document.getElementById('empDireccion').value,
    };

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${apiUrl}/${id}` : apiUrl;

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(empData)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        closeModal();
        fetchEmployees(searchInput.value.trim()); // Refrescar manteniendo busqueda
    } catch (error) {
        modalError.textContent = error.message;
        modalError.classList.remove('hidden');
    }
});

// Eliminar
async function deleteEmployee(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este empleado? Esta acción no se puede deshacer.')) return;

    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        fetchEmployees(searchInput.value.trim());
    } catch (error) {
        alert('Error al eliminar: ' + error.message);
    }
}

// Inicializar
fetchEmployees();
