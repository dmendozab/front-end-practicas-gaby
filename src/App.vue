<template>
  <div id="app">
    <header class="app-header">
      <div class="header-content">
        <div class="logo-section">
          <img 
            alt="SIGSA Logo" 
            src="sigsa.jpg"
            class="logo"
          >
        </div>
        <div class="user-section">
          <span class="username">SIGSA</span>
        </div>
      </div>
    </header>
    
    <nav class="nav-menu">
      <div class="nav-content">
        <router-link to="/seguridad" class="nav-link">Seguridad</router-link>
        <router-link to="/configuracion" class="nav-link">Configuración</router-link>
      </div>
    </nav>
    
    <main class="main-content">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </main>

    <footer class="app-footer">
      <div class="footer-content">
        <a href="#" class="footer-link">Contacto</a>
        <a href="#" class="footer-link">Acerca de</a>
      </div>
      <p class="footer-company">Pemex Exploración y Producción</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  background: #f5f5f5;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: #1e3c72;
  color: white;
  padding: 0.75rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  height: 40px;
}

.username {
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}

.nav-menu {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.nav-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  gap: 0.5rem;
}

.nav-link {
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  color: #555;
  font-weight: 500;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.nav-link:hover {
  color: #1e3c72;
  background: #f8f9fa;
}

.nav-link.router-link-active {
  color: #1e3c72;
  border-bottom-color: #1e3c72;
  background: #f8f9fa;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.app-footer {
  background: white;
  border-top: 1px solid #e0e0e0;
  padding: 1rem 2rem;
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.footer-link {
  color: #1e3c72;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s;
}

.footer-link:hover {
  color: #2a5298;
  text-decoration: underline;
}

.footer-company {
  text-align: center;
  color: #666;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .header-content,
  .nav-content {
    padding: 0 1rem;
  }
  
  .main-content {
    padding: 1rem;
  }
}
</style>