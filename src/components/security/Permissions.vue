<template>
  <div class="permissions-wrapper">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <div class="header-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <div>
            <h1 class="header-title">SIGSA</h1>
            <p class="header-subtitle">Sistemas de Información Geográfica</p>
          </div>
        </div>
        <div class="header-right">
          <p class="module-name">Módulo Seguridad</p>
          <p class="section-name">Sección Permisos</p>
        </div>
      </div>
    </div>

    <!-- Role Selector -->
    <div class="selector-panel">
      <div class="selector-content">
        <label class="selector-label">Seleccione un rol</label>
        <select v-model="selectedRole" @change="loadPermissions" class="role-select">
          <option value="">Seleccione un rol</option>
          <option v-for="role in roles" :key="role.id" :value="role.id">
            {{ role.name }}
          </option>
        </select>
        <button 
          class="btn-apply" 
          @click="confirmApplyPermissions" 
          :disabled="!selectedRole"
        >
          Aplicar
        </button>
      </div>
    </div>

    <!-- Permissions Tree -->
    <div v-if="selectedRole" class="permissions-content">
      <div class="permissions-panel">
        <div v-for="module in modules" :key="module.id" class="permission-module">
          <div class="module-checkbox-header">
            <div class="checkbox-wrapper">
              <input 
                type="checkbox" 
                :id="'module-' + module.id"
                v-model="module.selected"
                @change="toggleModule(module)"
                class="checkbox-input"
              >
              <label :for="'module-' + module.id" class="module-label">
                {{ module.name }}
              </label>
            </div>
          </div>
          
          <div v-if="module.sections && module.sections.length" class="sections-wrapper">
            <div v-for="section in module.sections" :key="section.id" class="permission-section">
              <div class="section-checkbox-header">
                <div class="checkbox-wrapper">
                  <input 
                    type="checkbox" 
                    :id="'section-' + section.id"
                    v-model="section.selected"
                    @change="toggleSection(module, section)"
                    class="checkbox-input"
                  >
                  <label :for="'section-' + section.id" class="section-label">
                    {{ section.name }}
                  </label>
                </div>
              </div>
              
              <div v-if="section.actions && section.actions.length" class="actions-grid">
                <div v-for="action in section.actions" :key="action.id" class="action-checkbox">
                  <input 
                    type="checkbox" 
                    :id="'action-' + action.id"
                    v-model="action.selected"
                    @change="updateSelections(module, section)"
                    class="checkbox-input"
                  >
                  <label :for="'action-' + action.id" class="action-label">
                    {{ action.name }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">🔒</div>
      <p class="empty-text">Seleccione un rol para visualizar y configurar los permisos</p>
    </div>

    <!-- Modal Confirmar Aplicar Permisos -->
    <div v-if="showConfirmModal" class="modal-overlay" @click.self="showConfirmModal = false">
      <div class="modal-container modal-small">
        <p class="confirm-message">
          ¿Desea aplicar los permisos al rol <strong>{{ getSelectedRoleName() }}</strong>?
        </p>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showConfirmModal = false">Cancelar</button>
          <button class="btn-primary" @click="applyPermissions">Confirmar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Permissions',
  data() {
    return {
      selectedRole: '',
      showConfirmModal: false,
      roles: [
        { id: 1, name: 'Admin' },
        { id: 2, name: 'Administrador' },
        { id: 3, name: 'Dirección' },
        { id: 4, name: 'Gerente Sucursal' },
        { id: 5, name: 'Nominas' },
        { id: 6, name: 'Recursos Humanos' }
      ],
      modules: [
        {
          id: 1,
          name: 'Seguridad',
          selected: false,
          sections: [
            {
              id: 1,
              name: 'Usuario',
              selected: false,
              actions: [
                { id: 1, name: 'Consultar', selected: false },
                { id: 2, name: 'Agregar', selected: false },
                { id: 3, name: 'Editar', selected: false },
                { id: 4, name: 'Eliminar', selected: false }
              ]
            },
            {
              id: 2,
              name: 'Roles',
              selected: false,
              actions: [
                { id: 5, name: 'Consultar', selected: false },
                { id: 6, name: 'Agregar', selected: false },
                { id: 7, name: 'Editar', selected: false },
                { id: 8, name: 'Eliminar', selected: false }
              ]
            },
            {
              id: 3,
              name: 'Permisos',
              selected: false,
              actions: [
                { id: 9, name: 'Consultar', selected: false },
                { id: 10, name: 'Aplicar', selected: false }
              ]
            },
            {
              id: 4,
              name: 'Configuración',
              selected: false,
              actions: [
                { id: 11, name: 'Consultar', selected: false },
                { id: 12, name: 'Agregar', selected: false },
                { id: 13, name: 'Editar', selected: false },
                { id: 14, name: 'Eliminar', selected: false }
              ]
            }
          ]
        }
      ]
    }
  },
  methods: {
    loadPermissions() {
      // Simular carga de permisos del rol seleccionado
      this.resetPermissions()
      
      // Si es Admin, seleccionar todos los permisos
      if (this.selectedRole === 1) {
        this.modules.forEach(module => {
          module.selected = true
          module.sections.forEach(section => {
            section.selected = true
            section.actions.forEach(action => {
              action.selected = true
            })
          })
        })
      }
    },
    resetPermissions() {
      this.modules.forEach(module => {
        module.selected = false
        module.sections.forEach(section => {
          section.selected = false
          section.actions.forEach(action => {
            action.selected = false
          })
        })
      })
    },
    toggleModule(module) {
      // Si se selecciona el módulo, seleccionar todas las secciones y acciones
      if (module.selected) {
        module.sections.forEach(section => {
          section.selected = true
          section.actions.forEach(action => {
            action.selected = true
          })
        })
      } else {
        // Si se deselecciona, deseleccionar todo
        module.sections.forEach(section => {
          section.selected = false
          section.actions.forEach(action => {
            action.selected = false
          })
        })
      }
    },
    toggleSection(module, section) {
      // Si se selecciona la sección, seleccionar todas las acciones
      if (section.selected) {
        section.actions.forEach(action => {
          action.selected = true
        })
      } else {
        // Si se deselecciona, deseleccionar todas las acciones
        section.actions.forEach(action => {
          action.selected = false
        })
      }
      this.updateModuleSelection(module)
    },
    updateSelections(module, section) {
      // Actualizar selección de sección basado en acciones
      const allActionsSelected = section.actions.every(a => a.selected)
      const someActionsSelected = section.actions.some(a => a.selected)
      
      section.selected = allActionsSelected || someActionsSelected
      
      this.updateModuleSelection(module)
    },
    updateModuleSelection(module) {
      // Actualizar selección de módulo basado en secciones
      const allSectionsSelected = module.sections.every(s => s.selected)
      const someSectionsSelected = module.sections.some(s => s.selected)
      
      module.selected = allSectionsSelected || someSectionsSelected
    },
    confirmApplyPermissions() {
      this.showConfirmModal = true
    },
    applyPermissions() {
      // Aquí se enviarían los permisos al backend
      const permissions = this.getSelectedPermissions()
      console.log('Permisos a aplicar:', permissions)
      
      this.showConfirmModal = false
      alert('Permisos aplicados exitosamente al rol ' + this.getSelectedRoleName())
    },
    getSelectedPermissions() {
      const permissions = []
      this.modules.forEach(module => {
        module.sections.forEach(section => {
          section.actions.forEach(action => {
            if (action.selected) {
              permissions.push({
                module: module.name,
                section: section.name,
                action: action.name
              })
            }
          })
        })
      })
      return permissions
    },
    getSelectedRoleName() {
      const role = this.roles.find(r => r.id === this.selectedRole)
      return role ? role.name : ''
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.permissions-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
  padding: 1.5rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Header */
.page-header {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  margin-bottom: 1.5rem;
  border-bottom: 4px solid #003c71;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  background: #003c71;
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,60,113,0.3);
}

.header-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #003c71;
  margin: 0;
  letter-spacing: 0.5px;
}

.header-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.header-right {
  text-align: right;
}

.module-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #003c71;
  margin: 0 0 0.25rem 0;
}

.section-name {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
}

/* Role Selector */
.selector-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.selector-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.selector-label {
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  font-size: 0.95rem;
}

.role-select {
  flex: 1;
  padding: 0.875rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1e293b;
  background: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

.role-select:focus {
  outline: none;
  border-color: #003c71;
  box-shadow: 0 0 0 3px rgba(0,60,113,0.1);
}

.btn-apply {
  background: #003c71;
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0,60,113,0.2);
}

.btn-apply:hover:not(:disabled) {
  background: #005a9c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,60,113,0.3);
}

.btn-apply:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Permissions Content */
.permissions-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  overflow: hidden;
}

.permissions-panel {
  padding: 1.5rem;
}

.permission-module {
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.permission-module:last-child {
  margin-bottom: 0;
}

.module-checkbox-header {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 1.25rem 1.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.checkbox-input {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #003c71;
}

.module-label {
  font-weight: 700;
  font-size: 1.15rem;
  color: #003c71;
  cursor: pointer;
  margin: 0;
  user-select: none;
}

.sections-wrapper {
  padding: 1.25rem 1.5rem;
}

.permission-section {
  margin-bottom: 1.5rem;
  padding-left: 2rem;
  border-left: 3px solid #e2e8f0;
}

.permission-section:last-child {
  margin-bottom: 0;
}

.section-checkbox-header {
  margin-bottom: 1rem;
}

.section-label {
  font-weight: 600;
  font-size: 1rem;
  color: #1e293b;
  cursor: pointer;
  margin: 0;
  user-select: none;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.875rem;
  padding-left: 2rem;
}

.action-checkbox {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.action-checkbox:hover {
  background: #f8fafc;
}

.action-label {
  font-size: 0.9rem;
  color: #475569;
  cursor: pointer;
  margin: 0;
  user-select: none;
}

/* Empty State */
.empty-state {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 5rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 5rem;
  opacity: 0.4;
  margin-bottom: 1.5rem;
}

.empty-text {
  color: #64748b;
  font-size: 1.15rem;
  margin: 0;
  line-height: 1.6;
}

/* Modal */
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
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  animation: slideUp 0.3s ease;
}

.modal-small {
  max-width: 420px;
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(30px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.confirm-message {
  text-align: center;
  font-size: 1.15rem;
  color: #1e293b;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.confirm-message strong {
  color: #003c71;
  font-weight: 700;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn-primary {
  background: #003c71;
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,60,113,0.2);
}

.btn-primary:hover {
  background: #005a9c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,60,113,0.3);
}

.btn-secondary {
  background: #64748b;
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #475569;
}

/* Responsive */
@media (max-width: 768px) {
  .permissions-wrapper {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-right {
    text-align: left;
  }

  .selector-content {
    flex-direction: column;
    align-items: stretch;
  }

  .actions-grid {
    grid-template-columns: 1fr;
    padding-left: 1rem;
  }

  .permission-section {
    padding-left: 1rem;
  }

  .permissions-panel {
    padding: 1rem;
  }

  .sections-wrapper {
    padding: 1rem;
  }
}
</style>
