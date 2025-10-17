<template>
  <div class="security-module">
    <div class="module-header">
      <h2>Seguridad</h2>
    </div>
    
    <div class="tabs-container">
      <router-link to="/seguridad/usuarios" class="tab">Usuario</router-link>
      <router-link to="/seguridad/roles" class="tab">Roles</router-link>
      <router-link to="/seguridad/permisos" class="tab">Permisos</router-link>
      <router-link to="/seguridad/configuracion" class="tab">Configuración</router-link>
    </div>
    
    <div class="module-content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SecurityModule'
}
</script>

<style scoped>
.security-module {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.module-header {
  background: #1e3c72;
  color: white;
  padding: 1.25rem 2rem;
}

.module-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.tabs-container {
  display: flex;
  background: #f8f9fa;
  border-bottom: 2px solid #e0e0e0;
}

.tab {
  flex: 1;
  padding: 1rem;
  text-align: center;
  text-decoration: none;
  color: #666;
  font-weight: 500;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
  cursor: pointer;
}

.tab:hover {
  background: #e9ecef;
  color: #1e3c72;
}

.tab.router-link-active {
  color: #1e3c72;
  background: white;
  border-bottom-color: #1e3c72;
  font-weight: 600;
}

.module-content {
  padding: 2rem;
  min-height: 500px;
}

@media (max-width: 768px) {
  .tabs-container {
    flex-wrap: wrap;
  }
  
  .tab {
    flex: 1 1 50%;
  }
  
  .module-content {
    padding: 1rem;
  }
}
</style>