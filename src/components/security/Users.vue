<template>
  <div class="users-section">
    <div class="actions-bar">
      <button class="btn-add" @click="showAddModal = true">
        ➕ Agregar Usuario
      </button>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Descripción</th>
            <th>Admin</th>
            <th>Escritura</th>
            <th>Lectura</th>
            <th>Comandos</th>
            <th>Informes</th>
            <th>Cambiar email</th>
            <th>Vigente</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.description }}</td>
            <td>{{ user.isAdmin ? 'Si' : 'No' }}</td>
            <td>{{ user.canWrite ? 'Si' : 'No' }}</td>
            <td>{{ user.canRead ? 'Si' : 'No' }}</td>
            <td>{{ user.canCommands ? 'Si' : 'No' }}</td>
            <td>{{ user.canReports ? 'Si' : 'No' }}</td>
            <td>{{ user.canChangeEmail ? 'Si' : 'No' }}</td>
            <td>
              <span :class="['status-badge', user.active ? 'active' : 'inactive']">
                {{ user.active ? 'Sí' : 'No' }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn-icon btn-edit" @click="editUser(user)" title="Editar">✏️</button>
                <button class="btn-icon btn-delete" @click="confirmDelete(user)" title="Eliminar">🗑️</button>
                <button class="btn-icon btn-roles" @click="showRolesModal(user)" title="Roles">👥</button>
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

    <!-- Modal Agregar Usuario -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="closeAddModal">
      <div class="modal-content">
        <h3>Agregar usuario</h3>
        <form @submit.prevent="addUser">
          <div class="form-row">
            <div class="form-group">
              <label>Nombre<span class="required">*</span></label>
              <input type="text" v-model="newUser.name" required maxlength="100">
              <span class="char-count">{{ newUser.name.length }}/100</span>
            </div>
            <div class="form-group">
              <label>Usuario<span class="required">*</span></label>
              <input type="text" v-model="newUser.username" required maxlength="100">
              <span class="char-count">{{ newUser.username.length }}/100</span>
            </div>
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <textarea v-model="newUser.description" maxlength="250"></textarea>
            <span class="char-count">{{ newUser.description.length }}/250</span>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Correo<span class="required">*</span></label>
              <input type="email" v-model="newUser.email" required>
            </div>
            <div class="form-group">
              <label>Contraseña<span class="required">*</span></label>
              <input type="password" v-model="newUser.password" required>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="closeAddModal">Cancelar</button>
            <button type="submit" class="btn-confirm">Confirmar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Editar Usuario -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-content">
        <h3>Editar usuario</h3>
        <form @submit.prevent="updateUser">
          <div class="form-row">
            <div class="form-group">
              <label>Nombre<span class="required">*</span></label>
              <input type="text" v-model="editingUser.name" required maxlength="100">
              <span class="char-count">{{ editingUser.name.length }}/100</span>
            </div>
            <div class="form-group">
              <label>Usuario<span class="required">*</span></label>
              <input type="text" v-model="editingUser.username" required maxlength="100">
              <span class="char-count">{{ editingUser.username.length }}/100</span>
            </div>
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <textarea v-model="editingUser.description" maxlength="250"></textarea>
            <span class="char-count">{{ editingUser.description.length }}/250</span>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Correo<span class="required">*</span></label>
              <input type="email" v-model="editingUser.email" required>
            </div>
            <div class="form-group">
              <label>Contraseña<span class="required">*</span></label>
              <input type="password" v-model="editingUser.password">
            </div>
          </div>
          <div class="form-group checkbox-group">
            <input type="checkbox" id="editVigente" v-model="editingUser.active">
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
        <p class="delete-message">¿Desea eliminar el usuario <strong>{{ userToDelete?.name }}</strong>?</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showDeleteModal = false">Cancelar</button>
          <button class="btn-confirm" @click="deleteUser">Confirmar</button>
        </div>
      </div>
    </div>

    <!-- Modal Roles -->
    <div v-if="showRolesWindow" class="modal-overlay" @click.self="closeRolesModal">
      <div class="modal-content modal-large">
        <h3>Roles de usuario</h3>
        <div class="roles-section">
          <div class="add-role-section">
            <select v-model="selectedRole" class="role-select">
              <option value="">Seleccione un rol</option>
              <option v-for="role in availableRoles" :key="role.id" :value="role">
                {{ role.name }}
              </option>
            </select>
            <button class="btn-add-role" @click="addRoleToUser" :disabled="!selectedRole">
              Agregar rol
            </button>
          </div>
          
          <table class="roles-table">
            <thead>
              <tr>
                <th>Rol</th>
                <th>Default</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="role in currentUserRoles" :key="role.id">
                <td>{{ role.name }}</td>
                <td>{{ role.isDefault ? '✓' : '' }}</td>
                <td>
                  <button class="btn-icon btn-delete" @click="confirmDeleteRole(role)" title="Eliminar">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div class="pagination">
            <span>Filas por página: 10</span>
            <span>1-{{ currentUserRoles.length }} de {{ currentUserRoles.length }}</span>
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="btn-cancel" @click="closeRolesModal">Cerrar</button>
        </div>
      </div>
    </div>

    <!-- Modal Confirmar Eliminar Rol -->
    <div v-if="showDeleteRoleModal" class="modal-overlay" @click.self="showDeleteRoleModal = false">
      <div class="modal-content modal-small">
        <p class="delete-message">¿Desea eliminar el rol asociado <strong>{{ roleToDelete?.name }}</strong>?</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showDeleteRoleModal = false">Cancelar</button>
          <button class="btn-confirm" @click="deleteRoleFromUser">Confirmar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    return {
      users: [
        {
          id: 1,
          name: 'Administrador',
          username: 'Admin',
          description: 'Administrador del sistema',
          email: 'admin@sigsa.com',
          isAdmin: true,
          canWrite: false,
          canRead: true,
          canCommands: true,
          canReports: true,
          canChangeEmail: false,
          active: true
        }
      ],
      rowsPerPage: 10,
      currentPage: 1,
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      showRolesWindow: false,
      showDeleteRoleModal: false,
      userToDelete: null,
      roleToDelete: null,
      currentUserForRoles: null,
      selectedRole: '',
      newUser: {
        name: '',
        username: '',
        description: '',
        email: '',
        password: ''
      },
      editingUser: {},
      availableRoles: [
        { id: 1, name: 'Admin' },
        { id: 2, name: 'GerenteSucursal' },
        { id: 3, name: 'Operador' },
        { id: 4, name: 'Supervisor' }
      ],
      currentUserRoles: []
    }
  },
  computed: {
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.rowsPerPage
      const end = start + this.rowsPerPage
      return this.users.slice(start, end)
    },
    paginationText() {
      const start = (this.currentPage - 1) * this.rowsPerPage + 1
      const end = Math.min(this.currentPage * this.rowsPerPage, this.users.length)
      return `${start}-${end} de ${this.users.length}`
    }
  },
  methods: {
    addUser() {
      const user = {
        id: this.users.length + 1,
        ...this.newUser,
        isAdmin: false,
        canWrite: false,
        canRead: true,
        canCommands: false,
        canReports: false,
        canChangeEmail: false,
        active: true
      }
      this.users.push(user)
      this.closeAddModal()
      alert('Usuario agregado exitosamente')
    },
    editUser(user) {
      this.editingUser = { ...user }
      this.showEditModal = true
    },
    updateUser() {
      const index = this.users.findIndex(u => u.id === this.editingUser.id)
      if (index !== -1) {
        this.users[index] = { ...this.editingUser }
      }
      this.closeEditModal()
      alert('Usuario actualizado exitosamente')
    },
    confirmDelete(user) {
      this.userToDelete = user
      this.showDeleteModal = true
    },
    deleteUser() {
      this.users = this.users.filter(u => u.id !== this.userToDelete.id)
      this.showDeleteModal = false
      this.userToDelete = null
      alert('Usuario eliminado exitosamente')
    },
    showRolesModal(user) {
      this.currentUserForRoles = user
      this.currentUserRoles = [
        { id: 1, name: 'Admin', isDefault: true },
        { id: 2, name: 'GerenteSucursal', isDefault: false }
      ]
      this.showRolesWindow = true
    },
    addRoleToUser() {
      if (this.selectedRole) {
        const exists = this.currentUserRoles.find(r => r.id === this.selectedRole.id)
        if (!exists) {
          this.currentUserRoles.push({
            ...this.selectedRole,
            isDefault: false
          })
        }
        this.selectedRole = ''
      }
    },
    confirmDeleteRole(role) {
      this.roleToDelete = role
      this.showDeleteRoleModal = true
    },
    deleteRoleFromUser() {
      this.currentUserRoles = this.currentUserRoles.filter(r => r.id !== this.roleToDelete.id)
      this.showDeleteRoleModal = false
      this.roleToDelete = null
      alert('Rol eliminado exitosamente')
    },
    closeAddModal() {
      this.showAddModal = false
      this.newUser = {
        name: '',
        username: '',
        description: '',
        email: '',
        password: ''
      }
    },
    closeEditModal() {
      this.showEditModal = false
      this.editingUser = {}
    },
    closeRolesModal() {
      this.showRolesWindow = false
      this.currentUserForRoles = null
      this.selectedRole = ''
    }
  }
}
</script>

<style scoped>
.users-section {
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

.modal-large {
  max-width: 800px;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
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
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #1e3c72;
  box-shadow: 0 0 0 3px rgba(30, 60, 114, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
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

.roles-section {
  margin: 1.5rem 0;
}

.add-role-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.role-select {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.btn-add-role {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.btn-add-role:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-2px);
}

.btn-add-role:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.roles-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.roles-table thead {
  background: #f8f9fa;
}

.roles-table th {
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e0e0e0;
}

.roles-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .data-table {
    font-size: 0.85rem;
  }
  
  .data-table th,
  .data-table td {
    padding: 0.5rem;
  }
}
</style>