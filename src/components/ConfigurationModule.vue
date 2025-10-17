<template>
  <div class="config-module">
    <div class="module-header">
      <h2>Configuración General</h2>
    </div>
    
    <div class="module-content">
      <div class="config-section">
        <h3>Configuración del Sistema</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Nombre del Sistema:</label>
            <input type="text" v-model="config.systemName" class="form-control">
          </div>
          
          <div class="form-group">
            <label>URL del Servidor:</label>
            <input type="text" v-model="config.serverUrl" class="form-control">
          </div>
          
          <div class="form-group">
            <label>Puerto:</label>
            <input type="number" v-model="config.port" class="form-control">
          </div>
          
          <div class="form-group">
            <label>Tiempo de Sesión (minutos):</label>
            <input type="number" v-model="config.sessionTime" class="form-control">
          </div>
        </div>
      </div>

      <div class="config-section">
        <h3>Configuración de Mapas</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Proveedor de Mapas:</label>
            <select v-model="config.mapProvider" class="form-control">
              <option value="google">Google Maps</option>
              <option value="osm">OpenStreetMap</option>
              <option value="mapbox">Mapbox</option>
              <option value="arcgis">ArcGIS</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>API Key:</label>
            <input type="text" v-model="config.apiKey" class="form-control" placeholder="API Key del proveedor">
          </div>
          
          <div class="form-group">
            <label>Nivel de Zoom Inicial:</label>
            <input type="range" v-model="config.zoomLevel" min="1" max="20" class="form-range">
            <span class="range-value">{{ config.zoomLevel }}</span>
          </div>
          
          <div class="form-group">
            <label>Coordenadas Iniciales:</label>
            <div class="coord-inputs">
              <input type="number" v-model="config.lat" placeholder="Latitud" class="form-control" step="0.000001">
              <input type="number" v-model="config.lng" placeholder="Longitud" class="form-control" step="0.000001">
            </div>
          </div>
        </div>
      </div>

      <div class="config-section">
        <h3>Configuración de Seguridad</h3>
        <div class="form-grid">
          <div class="form-group checkbox-group">
            <input type="checkbox" id="twoFactor" v-model="config.twoFactorAuth">
            <label for="twoFactor">Autenticación de dos factores</label>
          </div>
          
          <div class="form-group checkbox-group">
            <input type="checkbox" id="passwordExpire" v-model="config.passwordExpire">
            <label for="passwordExpire">Expiración de contraseñas</label>
          </div>
          
          <div class="form-group">
            <label>Longitud mínima de contraseña:</label>
            <input type="number" v-model="config.minPasswordLength" class="form-control" min="6" max="20">
          </div>
          
          <div class="form-group">
            <label>Intentos de login permitidos:</label>
            <input type="number" v-model="config.maxLoginAttempts" class="form-control" min="3" max="10">
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button class="btn-secondary" @click="resetConfig">Restablecer</button>
        <button class="btn-primary" @click="saveConfig">Guardar Configuración</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfigurationModule',
  data() {
    return {
      config: {
        systemName: 'SIGSA',
        serverUrl: 'https://servidor.sigsa.com',
        port: 8080,
        sessionTime: 30,
        mapProvider: 'google',
        apiKey: '',
        zoomLevel: 12,
        lat: 20.0911,
        lng: -98.7624,
        twoFactorAuth: false,
        passwordExpire: true,
        minPasswordLength: 8,
        maxLoginAttempts: 5
      }
    }
  },
  methods: {
    saveConfig() {
      alert('Configuración guardada exitosamente')
      console.log('Configuración guardada:', this.config)
    },
    resetConfig() {
      if (confirm('¿Desea restablecer la configuración a los valores predeterminados?')) {
        this.config = {
          systemName: 'SIGSA',
          serverUrl: 'https://servidor.sigsa.com',
          port: 8080,
          sessionTime: 30,
          mapProvider: 'google',
          apiKey: '',
          zoomLevel: 12,
          lat: 20.0911,
          lng: -98.7624,
          twoFactorAuth: false,
          passwordExpire: true,
          minPasswordLength: 8,
          maxLoginAttempts: 5
        }
      }
    }
  }
}
</script>

<style scoped>
.config-module {
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
  background: #11998e;
  color: white;
  padding: 1.25rem 2rem;
}

.module-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.module-content {
  padding: 2rem;
}

.config-section {
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e0e0e0;
}

.config-section:last-of-type {
  border-bottom: none;
}

.config-section h3 {
  color: #1e3c72;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.95rem;
}

.form-control {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #1e3c72;
  box-shadow: 0 0 0 3px rgba(30, 60, 114, 0.1);
}

.form-range {
  width: 100%;
  margin-bottom: 0.5rem;
}

.range-value {
  display: inline-block;
  background: #1e3c72;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-weight: 600;
}

.coord-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
}

.checkbox-group input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.checkbox-group label {
  margin: 0;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #1e3c72;
  color: white;
}

.btn-primary:hover {
  background: #2a5298;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 60, 114, 0.3);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>