<template>
  <div class="roles-section">
    <div class="actions-bar">
      <button class="btn-add" @click="showAddModal = true">
        ➕ Agregar Rol
      </button>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Id rol</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Vigente</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="role in paginatedRoles" :key="role.id">
            <td>{{ role.id }}</td>
            <td>{{ role.name }}</td>
            <td>{{ role.description }}</td>
            <td>
              <span :class="['status-badge', role.active ? 'active' : 'inactive']">
                {{ role.active ? 'Sí' : 'No' }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn-icon btn-edit" @click="editRole(role)" title="Editar">✏️</button>
                <button class="btn-icon btn-delete" @click="confirmDelete(role)" title="Eliminar">🗑️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination">
        <span>Filas por página: 
          <select v-model="rowsPerPage">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </span>
        <span>{{ paginationText }}</span>
      </div>
    </div>

    <!-- Modal Agregar Rol -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="closeAddModal">
      <div class="modal-content">
        <h3>Agregar rol</h3>
        <form @submit.prevent="addRole">
          <div class="form-group">
            <label>Nombre<span class="required">*</span></label>
            <input type="text" v-model="newRole.name" required maxlength="100">
            <span class="char-count">{{ newRole.name.length }}/100</span>
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <textarea v-model="newRole.description" maxlength="250"></textarea>
            <span class="char-count">{{ newRole.description.length }}/250</span>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="closeAddModal">Cancelar</button>
            <button type="submit" class="btn-confirm">Confirmar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Editar Rol -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-content">
        <h3>Editar rol</h3>
        <form @submit.prevent="updateRole">
          <div class="form-group">
            <label>Nombre<span class="required">*</span></label>
            <input type="text" v-model="editingRole.name" required maxlength="100">
            <span class="char-count">{{ editingRole.name.length }}/100</span>
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <textarea v-model="editingRole.description" maxlength="250"></textarea>
            <span class="char-count">{{ editingRole.description.length }}/250</span>
          </div>
          <div class="form-group checkbox-group">
            <input type="checkbox" id="editVigente" v-model="editingRole.active">
            <label for="editVigente">Vigente</label>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="closeEditModal">Cancelar</button>
            <button type="submit" class="btn-confirm">Confirmar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Confirmar Eliminación -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-content modal-small">
        <p class="delete-message">¿Desea eliminar el rol <strong>{{ roleToDelete?.name }}</strong>?</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showDeleteModal = false">Cancelar</button>
          <button class="btn-confirm" @click="deleteRole">Confirmar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      roles: [
        {
          id: 1,
          name: 'Admin',
          description: 'Administrador',
          active: true
        },
        {
          id: 2,
          name: 'Administración',
          description: 'Administrador',
          active: true
        }
      ],
      rowsPerPage: 10,
      currentPage: 1,
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      roleToDelete: null,
      newRole: {
        name: '',
        description: ''
      },
      editingRole: {}
    }
  },
  computed: {
    paginatedRoles() {
      const start = (this.currentPage - 1) * this.rowsPerPage
      const end = start + this.rowsPerPage
      return this.roles.slice(start, end)
    },
    paginationText() {
      const start = (this.currentPage - 1) * this.rowsPerPage + 1
      const end = Math.min(this.currentPage * this.rowsPerPage, this.roles.length)
      return `${start}-${end} de ${this.roles.length}`
    }
  },
  methods: {
    addRole() {
      const role = {
        id: this.roles.length + 1,
        ...this.newRole,
        active: true
      }
      this.roles.push(role)
      this.closeAddModal()
      alert('Rol agregado exitosamente')
    },
    editRole(role) {
      this.editingRole = { ...role }
      this.showEditModal = true
    },
    updateRole() {
      const index = this.roles.findIndex(r => r.id === this.editingRole.id)
      if (index !== -1) {
        this.roles[index] = { ...this.editingRole }
      }
      this.closeEditModal()
      alert('Rol actualizado exitosamente')
    },
    confirmDelete(role) {
      this.roleToDelete = role
      this.showDeleteModal = true
    },
    deleteRole() {
      this.roles = this.roles.filter(r => r.id !== this.roleToDelete.id)
      this.showDeleteModal = false
      this.roleToDelete = null
      alert('Rol eliminado exitosamente')
    },
    closeAddModal() {
      this.showAddModal = false
      this.newRole = {
        name: '',
        description: ''
      }
    },
    closeEditModal() {
      this.showEditModal = false
      this.editingRole = {}
    }
  }
}
</script>

<style scoped>
.roles-section {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.actions-bar {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: flex-start;
}

.btn-add {
  background: #1e3c72;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-add:hover {
  background: #2a5298;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(30, 60, 114, 0.3);
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: #f8f9fa;
}

.data-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e0e0e0;
  font-size: 0.9rem;
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  color: #555;
}

.data-table tbody tr:hover {
  background: #f8f9fa;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.3s;
}

.btn-icon:hover {
  background: #f0f0f0;
  transform: scale(1.1);
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.pagination select {
  padding: 0.25rem 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-left: 0.5rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s;
}

.modal-small {
  max-width: 400px;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-content h3 {
  margin: 0 0 1.5rem 0;
  color: #1e3c72;
  font-size: 1.4rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.95rem;
}

.required {
  color: #dc3545;
  margin-left: 0.25rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1e3c72;
  box-shadow: 0 0 0 3px rgba(30, 60, 114, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.char-count {
  display: block;
  text-align: right;
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.25rem;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  cursor: pointer;
}

.checkbox-group label {
  margin: 0;
  cursor: pointer;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.btn-confirm,
.btn-cancel {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-confirm {
  background: #1e3c72;
  color: white;
}

.btn-confirm:hover {
  background: #2a5298;
  transform: translateY(-2px);
}

.btn-cancel {
  background: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background: #5a6268;
}

.delete-message {
  text-align: center;
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .data-table {
    font-size: 0.85rem;
  }
  
  .data-table th,
  .data-table td {
    padding: 0.5rem;
  }
}
</style>