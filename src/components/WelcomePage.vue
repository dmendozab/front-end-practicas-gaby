<template>
  <div class="welcome-container">
    <div class="welcome-card">
      <img 
        src="https://via.placeholder.com/250/1e3c72/ffffff?text=SIGSA" 
        alt="SIGSA Logo"
        class="welcome-logo"
      >
      <h1>Bienvenido a SIGSA</h1>
      <p class="subtitle">Sistemas de Información Geográfica</p>
      <p class="description">
        Sistema integral para la gestión y visualización de información geográfica.
        Utiliza el menú superior para acceder a las diferentes secciones del sistema.
      </p>
      
      <div class="features">
        <div class="feature-card">
          <div class="feature-icon">🔒</div>
          <h3>Seguridad</h3>
          <p>Control de usuarios, roles y permisos del sistema</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">⚙️</div>
          <h3>Configuración</h3>
          <p>Administra los módulos y secciones del sistema</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🗺️</div>
          <h3>Mapas GIS</h3>
          <p>Visualización y análisis de datos geoespaciales</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WelcomePage'
}
</script>

<style scoped>
.welcome-container {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.welcome-card {
  background: white;
  border-radius: 8px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.welcome-logo {
  width: 250px;
  height: auto;
  margin-bottom: 2rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.welcome-card h1 {
  font-size: 2.5rem;
  color: #1e3c72;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.3rem;
  color: #2a5298;
  font-weight: 600;
  margin-bottom: 1rem;
}

.description {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 3rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  padding: 2rem;
  border-radius: 8px;
  background: #f8f9fa;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-color: #1e3c72;
}

.feature-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #1e3c72;
  margin-bottom: 0.75rem;
  font-size: 1.3rem;
}

.feature-card p {
  color: #666;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .welcome-card {
    padding: 2rem 1rem;
  }
  
  .welcome-card h1 {
    font-size: 2rem;
  }
  
  .features {
    grid-template-columns: 1fr;
  }
}
</style>