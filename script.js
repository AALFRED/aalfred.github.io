let currentLanguage = 'en';

const translations = {
  en: {
    title: "Hotel Maintenance System",
    subtitle: "Room maintenance registration and tracking",
    newRecord: "New Maintenance Record",
    roomNumber: "Room Number",
    commonAreas: "Common Areas",
    scheduledDate: "Scheduled Date",
    maintenanceType: "Maintenance Type",
    description: "Problem Description",
    priority: "Priority",
    workDate: "Work Registration Date",
    register: "Register Maintenance",
    maintenanceRecords: "Maintenance Records",
    room: "Room",
    type: "Type",
    priority: "Priority",
    status: "Status",
    actions: "Actions",
    pending: "Pending",
    completed: "Completed",
    complete: "Complete",
    reopen: "Reopen",
    delete: "Delete",
    confirmDelete: "Are you sure you want to delete this record?",
    edit: "Edit",
    editRecord: "Edit Maintenance Record",
    cancel: "Cancel",
    update: "Update",
    maintenanceTypes: [
      "General Cleaning",
      "Plumbing", 
      "Electrical System",
      "Furniture",
      "Air Conditioning",
      "Touch Up",
      "Painting",
      "Lighting Change",
      "Carpet Cleaning", 
      "Faucet Adjustments",
      "Door Correction"
    ],
    priorities: ["Low", "Medium", "High", "Urgent"],
    commonAreaTypes: [
      "Lobby",
      "Swimming Pool",
      "Restaurant",
      "Gym",
      "Parking Lot",
      "Gardens",
      "Meeting Rooms",
      "Elevators",
      "Corridors",
      "Reception"
    ],
    exportPDF: "Export to PDF",
    exportTitle: "Maintenance Records Report",
    generatedOn: "Generated on"
  },
  es: {
    title: "Sistema de Mantenimiento Hotelero",
    subtitle: "Registro y seguimiento de mantenimiento de habitaciones",
    newRecord: "Nuevo Registro de Mantenimiento",
    roomNumber: "Número de Habitación",
    commonAreas: "Áreas Comunes",
    scheduledDate: "Fecha Programada",
    maintenanceType: "Tipo de Mantenimiento",
    description: "Descripción del Problema",
    priority: "Prioridad",
    workDate: "Fecha de Registro del Trabajo",
    register: "Registrar Mantenimiento",
    maintenanceRecords: "Registros de Mantenimiento",
    room: "Habitación",
    type: "Tipo",
    priority: "Prioridad",
    status: "Estado",
    actions: "Acciones",
    pending: "Pendiente",
    completed: "Completado",
    complete: "Completar",
    reopen: "Reabrir",
    delete: "Eliminar",
    confirmDelete: "¿Está seguro de eliminar este registro?",
    edit: "Editar",
    editRecord: "Editar Registro de Mantenimiento",
    cancel: "Cancelar",
    update: "Actualizar",
    maintenanceTypes: [
      "Limpieza General",
      "Plomería",
      "Sistema Eléctrico", 
      "Mobiliario",
      "Aire Acondicionado",
      "Touch Up",
      "Pintura",
      "Cambio de Luminaria",
      "Limpieza de Alfombra",
      "Ajustes en Grifería",
      "Corrección de Puertas"
    ],
    priorities: ["Baja", "Media", "Alta", "Urgente"],
    commonAreaTypes: [
      "Lobby",
      "Piscina",
      "Restaurante", 
      "Gimnasio",
      "Estacionamiento",
      "Jardines",
      "Salas de Reuniones",
      "Ascensores",
      "Pasillos",
      "Recepción"
    ],
    exportPDF: "Exportar a PDF",
    exportTitle: "Reporte de Registros de Mantenimiento",
    generatedOn: "Generado el"
  }
};

// Database setup and operations
const DB_NAME = 'maintenanceDB';
const DB_VERSION = 1;
const STORE_NAME = 'maintenanceRecords';

// Initialize database
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => {
            reject('Error opening database');
        };
        
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { 
                    keyPath: 'id', 
                    autoIncrement: true 
                });
                store.createIndex('roomNumber', 'roomNumber');
                store.createIndex('status', 'status');
                store.createIndex('issueType', 'issueType');
                store.createIndex('priority', 'priority');
            }
        };
    });
}

function populateSelects() {
    const currentLang = currentLanguage || 'en';
    
    // Populate maintenance types
    const issueTypeSelect = document.getElementById('issueType');
    issueTypeSelect.innerHTML = '<option value="">Select type</option>';
    translations[currentLang].maintenanceTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        issueTypeSelect.appendChild(option);
    });

    // Populate priorities
    const prioritySelect = document.getElementById('priority');
    prioritySelect.innerHTML = '<option value="">Select priority</option>';
    translations[currentLang].priorities.forEach(priority => {
        const option = document.createElement('option');
        option.value = priority;
        option.textContent = priority;
        prioritySelect.appendChild(option);
    });

    // Populate common areas
    const commonAreaSelect = document.getElementById('commonArea');
    commonAreaSelect.innerHTML = '<option value="">Select area</option>';
    translations[currentLang].commonAreaTypes.forEach(area => {
        const option = document.createElement('option');
        option.value = area;
        option.textContent = area;
        commonAreaSelect.appendChild(option);
    });
}

function populateFilterSelects() {
    const currentLang = currentLanguage || 'en';
    
    // Populate type filter
    const filterType = document.getElementById('filterType');
    filterType.innerHTML = '<option value="">All types</option>';
    translations[currentLang].maintenanceTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        filterType.appendChild(option);
    });

    // Populate priority filter
    const filterPriority = document.getElementById('filterPriority');
    filterPriority.innerHTML = '<option value="">All priorities</option>';
    translations[currentLang].priorities.forEach(priority => {
        const option = document.createElement('option');
        option.value = priority;
        option.textContent = priority;
        filterPriority.appendChild(option);
    });
}

// Save record to database
async function saveRecord(record) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(record);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Get all records from database
async function getAllRecords() {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Update record in database
async function updateRecord(id, record) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put({...record, id});
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Delete record from database
async function deleteRecordFromDB(id) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Modify the displayRecords function:
async function displayRecords() {
    const recordsTable = document.getElementById('maintenanceRecords');
    const filterRoom = document.getElementById('filterRoom').value.toLowerCase();
    const filterType = document.getElementById('filterType').value;
    const filterPriority = document.getElementById('filterPriority').value;
    const filterStatus = document.getElementById('filterStatus').value;
    
    recordsTable.innerHTML = '';
    
    try {
        const maintenanceRecords = await getAllRecords();
        
        const filteredRecords = maintenanceRecords.filter(record => {
            return (!filterRoom || record.roomNumber.toString().toLowerCase().includes(filterRoom) || 
                    (record.commonArea && record.commonArea.toLowerCase().includes(filterRoom))) &&
                   (!filterType || record.issueType === filterType) &&
                   (!filterPriority || record.priority === filterPriority) &&
                   (!filterStatus || record.status === filterStatus);
        });
        
        filteredRecords.forEach((record) => {
            const row = document.createElement('tr');
            row.className = 'new-record';
            const status = record.status === 'Pending' ? 
                translations[currentLanguage].pending : 
                translations[currentLanguage].completed;
            
            const locationDisplay = record.commonArea ? 
                `${record.commonArea}` :
                `${translations[currentLanguage].room} ${record.roomNumber}`;
            
            row.innerHTML = `
                <td>${locationDisplay}</td>
                <td>${record.issueType}</td>
                <td>${record.description}</td>
                <td>${record.priority}</td>
                <td>${new Date(record.scheduledDate).toLocaleString()}</td>
                <td>${record.workDate ? new Date(record.workDate).toLocaleString() : translations[currentLanguage].pending}</td>
                <td><span class="status ${record.status.toLowerCase()}">${status}</span></td>
                <td>
                    <button onclick="editRecord(${record.id})" style="background: var(--secondary); margin-right: 5px;">
                        ${currentLanguage === 'es' ? 'Editar' : 'Edit'}
                    </button>
                    <button onclick="toggleStatus(${record.id})" style="margin-right: 5px;">
                        ${record.status === 'Pending' ? translations[currentLanguage].complete : translations[currentLanguage].reopen}
                    </button>
                    <button onclick="deleteRecord(${record.id})" style="background: var(--danger);">
                        ${translations[currentLanguage].delete}
                    </button>
                </td>
            `;
            recordsTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error displaying records:', error);
    }
}

// Modify form submit handler:
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('maintenanceForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const newRecord = {
            roomNumber: document.getElementById('roomNumber').value,
            commonArea: document.getElementById('commonArea').value,
            issueType: document.getElementById('issueType').value,
            description: document.getElementById('description').value,
            priority: document.getElementById('priority').value,
            scheduledDate: document.getElementById('scheduledDate').value,
            workDate: document.getElementById('workDate').value || null,
            status: 'Pending'
        };

        try {
            await saveRecord(newRecord);
            await displayRecords();
            form.reset();
            document.getElementById('roomNumber').value = '1'; // Reset to default value
        } catch (error) {
            console.error('Error saving record:', error);
        }
    });

    // Initialize listeners and display
    document.getElementById('filterRoom').addEventListener('input', displayRecords);
    document.getElementById('filterType').addEventListener('change', displayRecords);
    document.getElementById('filterPriority').addEventListener('change', displayRecords);
    document.getElementById('filterStatus').addEventListener('change', displayRecords);
    
    populateSelects();
    populateFilterSelects();
    displayRecords();
});

// Add the changeLanguage function
function changeLanguage(lang) {
    currentLanguage = lang;
    const elements = document.querySelectorAll('[data-lang]');
    elements.forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    populateSelects();
    populateFilterSelects();
    displayRecords();
}

// Modify deleteRecord function:
async function deleteRecord(id) {
    if (confirm(translations[currentLanguage].confirmDelete)) {
        try {
            await deleteRecordFromDB(id);
            await displayRecords();
        } catch (error) {
            console.error('Error deleting record:', error);
        }
    }
}

// Modify toggleStatus function:
async function toggleStatus(id) {
    try {
        const records = await getAllRecords();
        const record = records.find(r => r.id === id);
        if (record) {
            record.status = record.status === 'Pending' ? 'Completed' : 'Pending';
            if (record.status === 'Completed' && !record.workDate) {
                record.workDate = new Date().toISOString().slice(0, 16);
            }
            await updateRecord(id, record);
            await displayRecords();
        }
    } catch (error) {
        console.error('Error toggling status:', error);
    }
}

const maintenanceRecords = JSON.parse(localStorage.getItem('maintenanceRecords')) || [];

// Updated exportToPDF function
window.exportToPDF = async function() {
  try {
    // Get records from IndexedDB
    const records = await getAllRecords();
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const filterRoom = document.getElementById('filterRoom').value.toLowerCase();
    const filterType = document.getElementById('filterType').value;
    const filterPriority = document.getElementById('filterPriority').value;
    const filterStatus = document.getElementById('filterStatus').value;
    
    const filteredRecords = records.filter(record => {
      return (!filterRoom || record.roomNumber.toString().toLowerCase().includes(filterRoom) || 
              (record.commonArea && record.commonArea.toLowerCase().includes(filterRoom))) &&
             (!filterType || record.issueType === filterType) &&
             (!filterPriority || record.priority === filterPriority) &&
             (!filterStatus || record.status === filterStatus);
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(translations[currentLanguage].exportTitle, 14, 15);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${translations[currentLanguage].generatedOn}: ${new Date().toLocaleString()}`,
      14, 
      25
    );

    const tableColumn = [
      translations[currentLanguage].room,
      translations[currentLanguage].type,
      translations[currentLanguage].description,
      translations[currentLanguage].priority,
      translations[currentLanguage].scheduledDate,
      translations[currentLanguage].workDate,
      translations[currentLanguage].status
    ];

    const tableRows = filteredRecords.map(record => [
      record.commonArea ? record.commonArea : `${translations[currentLanguage].room} ${record.roomNumber}`,
      record.issueType,
      record.description,
      record.priority,
      new Date(record.scheduledDate).toLocaleString(),
      record.workDate ? new Date(record.workDate).toLocaleString() : translations[currentLanguage].pending,
      record.status === 'Pending' ? translations[currentLanguage].pending : translations[currentLanguage].completed
    ]);

    doc.autoTable({
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      headStyles: { 
        fillColor: [26, 26, 46],
        textColor: [233, 236, 239]
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      styles: {
        fontSize: 8,
        cellPadding: 3
      },
      theme: 'grid'
    });

    doc.save('maintenance-records.pdf');
  } catch (error) {
    console.error('Error exporting to PDF:', error);
  }
}