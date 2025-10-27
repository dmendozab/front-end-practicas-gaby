<template>
  <div class="configuration-wrapper">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <div class="header-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
          <div>
            <h1 class="header-title">SIGSA</h1>
            <p class="header-subtitle">Sistemas de Información Geográfica</p>
          </div>
        </div>
        <div class="header-right">
          <p class="module-name">Módulo Seguridad</p>
          <p class="section-name">Sección Configuración</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="config-layout">
      <!-- Left Panel - Modules and Sections -->
      <div class="panel modules-panel">
        <div class="panel-header">
          <h2>Módulo y secciones</h2>
        </div>
        
        <div class="panel-body">
          <button class="btn-primary btn-add-module" @click="showAddModuleModal = true">
            ➕ Agregar Módulo
          </button>

          <div class="tree-container">
            <div v-for="module in modules" :key="module.id" class="module-item">
              <div class="module-header">
                <div class="module-title" @click="toggleModuleExpand(module)">
                  <span class="expand-icon">{{ module.expanded ? '▼' : '▶' }}</span>
                  <span class="module-name">{{ module.name }}</span>
                </div>
                <div class="module-actions">
                  <button class="btn-icon btn-edit" @click="editModule(module)" title="Editar">
                    ✏️
                  </button>
                  <button class="btn-icon btn-delete" @click="confirmDeleteModule(module)" title="Eliminar">
                    🗑️
                  </button>
                </div>
              </div>

              <div v-if="module.expanded && module.sections" class="sections-list">
                <div 
                  v-for="section in module.sections" 
                  :key="section.id"
                  class="section-item"
                  :class="{ 'section-selected': selectedSection?.id === section.id }"
                  @click="selectSection(section)"
                >
                  <span class="section-name">{{ section.name }}</span>
                  <div class="section-actions">
                    <button class="btn-icon-small btn-edit" @click.stop="editSection(section)" title="Editar">
                      ✏️
                    </button>
                    <button class="btn-icon-small btn-delete" @click.stop="confirmDeleteSection(section)" title="Eliminar">
                      🗑️
                    </button>
                  </div>
                </div>
                <button class="btn-add-section" @click="openAddSectionModal(module)">
                  ➕ Agregar Sección
                </button>
              </div>
            </div>  
          </div>
        </div>
      </div>

      <!-- Right Panel - Actions -->
      <div class="panel actions-panel">
        <div class="panel-header">
          <h2>Acción</h2>
        </div>

        <div class="panel-body">
          <button 
            class="btn-primary btn-add-action" 
            @click="showAddActionModal = true"
            :disabled="!selectedSection"
          >
            ➕ Agregar Acción
          </button>

          <div v-if="selectedSection" class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="action in sectionActions" :key="action.id">
                  <td>{{ action.name }}</td>
                  <td>{{ action.description }}</td>
                  <td class="actions-cell">
                    <button class="btn-icon btn-delete" @click="confirmDeleteAction(action)" title="Eliminar">
                      🗑️
                    </button>
                  </td>
                </tr>
                <tr v-if="sectionActions.length === 0">
                  <td colspan="3" class="empty-row">
                    No hay acciones registradas
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div class="table-footer">
              <span>Filas por página: 10</span>
              <span>1-{{ sectionActions.length }} de {{ sectionActions.length }}</span>
            </div>
          </div>
          
          <div v-else class="empty-state">
            <div class="empty-icon">📋</div>
            <p>Seleccione una sección para ver sus acciones</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Agregar Módulo -->
    <div v-if="showAddModuleModal" class="modal-overlay" @click.self="closeAddModuleModal">
      <div class="modal-container">
        <h3 class="modal-title">Agregar módulo</h3>
        <form @submit.prevent="addModule">
          <div class="form-field">
            <label>Nombre<span class="required">*</span></label>
            <input type="text" v-model="newModule.name" required maxlength="100" class="form-input">
            <span class="char-counter">{{ newModule.name.length }}/100</span>
          </div>
          <div class="form-field">
            <label>Ruta<span class="required">*</span></label>
            <input type="text" v-model="newModule.route" required maxlength="100" placeholder="/nombre-modulo" class="form-input">
            <span class="char-counter">{{ newModule.route.length }}/100</span>
            <small class="field-hint">Importante colocar la ruta de manera correcta.</small>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="closeAddModuleModal">Cancelar</button>
            <button type="submit" class="btn-primary">Confirmar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Editar Módulo -->
    <div v-if="showEditModuleModal" class="modal-overlay" @click.self="closeEditModuleModal">
      <div class="modal-container">
        <h3 class="modal-title">Editar módulo</h3>
        <form @submit.prevent="updateModule">
          <div class="form-field">
            <label>Nombre<span class="required">*</span></label>
            <input type="text" v-model="editingModule.name" required maxlength="100" class="form-input">
            <span class="char-counter">{{ editingModule.name.length }}/100</span>
          </div>
          <div class="form-field">
            <label>Ruta<span class="required">*</span></label>
            <input type="text" v-model="editingModule.route" required maxlength="100" class="form-input">
            <span class="char-counter">{{ editingModule.route.length }}/100</span>
            <small class="field-hint">Importante colocar la ruta de manera correcta.</small>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="closeEditModuleModal">Cancelar</button>
            <button type="submit" class="btn-primary">Confirmar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Agregar Sección -->
    <div v-if="showAddSectionModal" class="modal-overlay" @click.self="closeAddSectionModal">
      <div class="modal-container">
        <h3 class="modal-title">Agregar sección</h3>
        <form @submit.prevent="addSection">
          <div class="form-field">
            <label>Nombre<span class="required">*</span></label>
            <input type="text" v-model="newSection.name" required maxlength="100" class="form-input">
            <span class="char-counter">{{ newSection.name.length }}/100</span>
          </div>
          <div class="form-field">
            <label>Ruta<span class="required">*</span></label>
            <input type="text" v-model="newSection.route" required maxlength="100" placeholder="nombre-seccion" class="form-input">
            <span class="char-counter">{{ newSection.route.length }}/100</span>
            <small class="field-hint">Importante colocar la ruta de manera correcta.</small>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="closeAddSectionModal">Cancelar</button>
            <button type="submit" class="btn-primary">Confirmar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Editar Sección -->
    <div v-if="showEditSectionModal" class="modal-overlay" @click.self="closeEditSectionModal">
      <div class="modal-container">
        <h3 class="modal-title">Editar sección</h3>
        <form @submit.prevent="updateSection">
          <div class="form-field">
            <label>Nombre<span class="required">*</span></label>
            <input type="text" v-model="editingSection.name" required maxlength="100" class="form-input">
            <span class="char-counter">{{ editingSection.name.length }}/100</span>
          </div>
          <div class="form-field">
            <label>Ruta<span class="required">*</span></label>
            <input type="text" v-model="editingSection.route" required maxlength="100" class="form-input">
            <span class="char-counter">{{ editingSection.route.length }}/100</span>
            <small class="field-hint">Importante colocar la ruta de manera correcta.</small>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="closeEditSectionModal">Cancelar</button>
            <button type="submit" class="btn-primary">Confirmar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Agregar Acción -->
    <div v-if="showAddActionModal" class="modal-overlay" @click.self="closeAddActionModal">
      <div class="modal-container">
        <h3 class="modal-title">Agregar acción</h3>
        <form @submit.prevent="addAction">
          <div class="form-field">
            <label>Acción<span class="required">*</span></label>
            <input type="text" v-model="newAction.name" required placeholder="Nombre de la acción" class="form-input">
          </div>
          <div class="form-field">
            <label>Descripción</label>
            <textarea v-model="newAction.description" maxlength="250" placeholder="Descripción de la acción" class="form-textarea"></textarea>
            <span class="char-counter">{{ newAction.description.length }}/250</span>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="closeAddActionModal">Cancelar</button>
            <button type="submit" class="btn-primary">Confirmar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Confirmar Eliminación -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-container modal-small">
        <p class="delete-message">
          ¿Desea eliminar {{ deleteType === 'módulo' ? 'el' : 'la' }} {{ deleteType }} <strong>{{ itemToDelete?.name }}</strong>?
        </p>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showDeleteModal = false">Cancelar</button>
          <button class="btn-primary" @click="executeDelete">Confirmar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Configuration',
  data() {
    return {
      modules: [
        {
          id: 1,
          name: 'Seguridad',
          route: '/seguridad',
          expanded: true,
          sections: [
            { id: 1, name: 'Usuarios', route: 'usuarios', moduleId: 1 },
            { id: 2, name: 'Roles', route: 'roles', moduleId: 1 },
            { id: 3, name: 'Permisos', route: 'permisos', moduleId: 1 },
            { id: 4, name: 'Configuración', route: 'configuracion', moduleId: 1 }
          ]
        }
      ],
      actions: [
        { id: 1, name: 'agregar', description: 'Agregar', sectionId: 1 },
        { id: 2, name: 'editar', description: 'Editar', sectionId: 1 },
        { id: 3, name: 'eliminar', description: 'Eliminar', sectionId: 1 },
        { id: 4, name: 'consultar', description: 'Consultar', sectionId: 1 }
      ],
      selectedSection: null,
      currentModule: null,
      itemToDelete: null,
      deleteType: '',
      showAddModuleModal: false,
      showEditModuleModal: false,
      showAddSectionModal: false,
      showEditSectionModal: false,
      showAddActionModal: false,
      showDeleteModal: false,
      newModule: { name: '', route: '' },
      editingModule: { name: '', route: '' },
      newSection: { name: '', route: '' },
      editingSection: { name: '', route: '' },
      newAction: { name: '', description: '' }
    }
  },
  computed: {
    sectionActions() {
      if (!this.selectedSection) return []
      return this.actions.filter(a => a.sectionId === this.selectedSection.id)
    }
  },
  methods: {
    toggleModuleExpand(module) {
      module.expanded = !module.expanded
    },
    selectSection(section) {
      this.selectedSection = section
    },
    openAddSectionModal(module) {
      this.currentModule = module
      this.showAddSectionModal = true
    },
    addModule() {
      const module = {
        id: Date.now(),
        ...this.newModule,
        expanded: true,
        sections: []
      }
      this.modules.push(module)
      this.closeAddModuleModal()
      alert('Módulo agregado exitosamente')
    },
    editModule(module) {
      this.editingModule = { ...module }
      this.showEditModuleModal = true
    },
    updateModule() {
      const index = this.modules.findIndex(m => m.id === this.editingModule.id)
      if (index !== -1) {
        this.modules[index] = { ...this.modules[index], ...this.editingModule }
      }
      this.closeEditModuleModal()
      alert('Módulo actualizado exitosamente')
    },
    confirmDeleteModule(module) {
      this.itemToDelete = module
      this.deleteType = 'módulo'
      this.showDeleteModal = true
    },
    addSection() {
      if (!this.currentModule) return
      const section = {
        id: Date.now(),
        ...this.newSection,
        moduleId: this.currentModule.id
      }
      const moduleIndex = this.modules.findIndex(m => m.id === this.currentModule.id)
      if (moduleIndex !== -1) {
        if (!this.modules[moduleIndex].sections) {
          this.modules[moduleIndex].sections = []
        }
        this.modules[moduleIndex].sections.push(section)
      }
      this.closeAddSectionModal()
      alert('Sección agregada exitosamente')
    },
    editSection(section) {
      this.editingSection = { ...section }
      this.showEditSectionModal = true
    },
    updateSection() {
      this.modules.forEach(module => {
        const index = module.sections?.findIndex(s => s.id === this.editingSection.id)
        if (index !== -1) {
          module.sections[index] = { ...module.sections[index], ...this.editingSection }
        }
      })
      this.closeEditSectionModal()
      alert('Sección actualizada exitosamente')
    },
    confirmDeleteSection(section) {
      this.itemToDelete = section
      this.deleteType = 'sección'
      this.showDeleteModal = true
    },
    addAction() {
      if (!this.selectedSection) return
      const action = {
        id: Date.now(),
        ...this.newAction,
        sectionId: this.selectedSection.id
      }
      this.actions.push(action)
      this.closeAddActionModal()
      alert('Acción agregada exitosamente')
    },
    confirmDeleteAction(action) {
      this.itemToDelete = action
      this.deleteType = 'acción'
      this.showDeleteModal = true
    },
    executeDelete() {
      if (this.deleteType === 'módulo') {
        this.modules = this.modules.filter(m => m.id !== this.itemToDelete.id)
        this.selectedSection = null
      } else if (this.deleteType === 'sección') {
        this.modules.forEach(module => {
          if (module.sections) {
            module.sections = module.sections.filter(s => s.id !== this.itemToDelete.id)
          }
        })
        if (this.selectedSection?.id === this.itemToDelete.id) {
          this.selectedSection = null
        }
      } else if (this.deleteType === 'acción') {
        this.actions = this.actions.filter(a => a.id !== this.itemToDelete.id)
      }
      this.showDeleteModal = false
      this.itemToDelete = null
      alert(`${this.deleteType.charAt(0).toUpperCase() + this.deleteType.slice(1)} eliminad${this.deleteType === 'acción' ? 'a' : 'o'} exitosamente`)
    },
    closeAddModuleModal() {
      this.showAddModuleModal = false
      this.newModule = { name: '', route: '' }
    },
    closeEditModuleModal() {
      this.showEditModuleModal = false
      this.editingModule = { name: '', route: '' }
    },
    closeAddSectionModal() {
      this.showAddSectionModal = false
      this.newSection = { name: '', route: '' }
      this.currentModule = null
    },
    closeEditSectionModal() {
      this.showEditSectionModal = false
      this.editingSection = { name: '', route: '' }
    },
    closeAddActionModal() {
      this.showAddActionModal = false
      this.newAction = { name: '', description: '' }
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.configuration-wrapper {
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

/* Layout */
.config-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  overflow: hidden;
}

.panel-header {
  background: linear-gradient(135deg, #003c71 0%, #005a9c 100%);
  color: white;
  padding: 1.25rem 1.5rem;
}

.panel-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.panel-body {
  padding: 1.5rem;
}

/* Buttons */
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

.btn-primary:hover:not(:disabled) {
  background: #005a9c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,60,113,0.3);
}

.btn-primary:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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

.btn-add-module,
.btn-add-action {
  width: 100%;
  margin-bottom: 1.25rem;
}

.btn-add-section {
  width: 100%;
  background: #10b981;
  color: white;
  border: none;
  padding: 0.625rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.btn-add-section:hover {
  background: #059669;
  transform: translateY(-1px);
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.375rem 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background: #f1f5f9;
  transform: scale(1.1);
}

.btn-icon-small {
  background: none;
  border: none;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0.25rem 0.375rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.btn-icon-small:hover {
  background: #f1f5f9;
  transform: scale(1.1);
}

/* Tree Container */
.tree-container {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.module-item {
  border-bottom: 1px solid #e2e8f0;
}

.module-item:last-child {
  border-bottom: none;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  padding: 0.875rem 1rem;
  transition: background 0.2s ease;
}

.module-header:hover {
  background: #f1f5f9;
}

.module-title {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  cursor: pointer;
  flex: 1;
}

.expand-icon {
  color: #003c71;
  font-size: 0.75rem;
  width: 16px;
  display: inline-block;
}

.module-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.95rem;
}

.module-actions {
  display: flex;
  gap: 0.25rem;
}

/* Sections */
.sections-list {
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  background: white;
}

.section-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem 0.875rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.375rem;
}

.section-item:hover {
  background: #f8fafc;
}

.section-item.section-selected {
  background: #dbeafe;
  border-left: 3px solid #003c71;
  padding-left: calc(0.875rem - 3px);
}

.section-item .section-name {
  color: #475569;
  font-size: 0.9rem;
}

.section-actions {
  display: flex;
  gap: 0.125rem;
}

/* Table */
.table-wrapper {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 1.25rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: #f8fafc;
}

.data-table th {
  padding: 0.875rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
  border-bottom: 2px solid #e2e8f0;
}

.data-table td {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  color: #475569;
  font-size: 0.9rem;
}

.data-table tbody tr:hover {
  background: #f8fafc;
}

.actions-cell {
  text-align: center;
}

.empty-row {
  text-align: center;
  color: #94a3b8;
  font-style: italic;
  padding: 2rem 1rem;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  font-size: 0.875rem;
  color: #64748b;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #94a3b8;
}

.empty-icon {
  font-size: 4rem;
  opacity: 0.5;
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1rem;
  margin: 0;
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
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  animation: slideUp 0.3s ease;
}

.modal-small {
  max-width: 400px;
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

.modal-title {
  margin: 0 0 1.5rem 0;
  color: #003c71;
  font-size: 1.5rem;
  font-weight: 700;
}

.form-field {
  margin-bottom: 1.25rem;
}

.form-field label {
  display: block;
  margin-bottom: 0.5rem;
  color: #1e293b;
  font-weight: 600;
  font-size: 0.9rem;
}

.required {
  color: #dc2626;
  margin-left: 0.25rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.875rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #003c71;
  box-shadow: 0 0 0 3px rgba(0,60,113,0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.char-counter {
  display: block;
  text-align: right;
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 0.375rem;
}

.field-hint {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #64748b;
  font-style: italic;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.delete-message {
  text-align: center;
  font-size: 1.1rem;
  color: #1e293b;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.delete-message strong {
  color: #003c71;
}

/* Responsive */
@media (max-width: 1024px) {
  .config-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .configuration-wrapper {
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

  .panel-body {
    padding: 1rem;
  }

  .sections-list {
    padding-left: 1.5rem;
  }

  .modal-container {
    padding: 1.5rem;
  }
}
</style>
