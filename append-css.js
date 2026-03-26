const fs = require('fs');
const path = require('path');

const cssFile = path.join(__dirname, 'dashboard', 'style.css');

const responsiveCSS = `

/* ==========================================================================
   RESPONSIVENESS (MOBILE & TABLET UPGRADES)
   ========================================================================== */

/* --- MOBILE MENU BUTTON & OVERLAY --- */
.mobile-menu-btn {
  display: none;
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.mobile-menu-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 998;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sidebar-overlay.show {
  display: block;
  opacity: 1;
}

/* --- LARGE SCREENS (Laptops) --- */
@media (max-width: 1200px) {
  .kanban-board {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* --- MEDIUM SCREENS (Tablets ~ 1024px) --- */
@media (max-width: 1024px) {
  .dashboard-strip-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  .dash-add {
    margin: 0 20px 60px;
  }
  .add-form {
    grid-template-columns: repeat(2, 1fr);
  }
  .primary-btn {
    grid-column: span 2;
  }
}

/* --- TABLETS / SMALL LAPTOPS (Max 850px) --- */
@media (max-width: 850px) {
  /* Sidebar into Drawer */
  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .topbar {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: -280px;
    height: 100vh;
    width: 260px;
    z-index: 999;
    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 4px 0 24px rgba(0,0,0,0.5);
  }

  .sidebar.show-sidebar {
    left: 0;
  }

  .kanban-board {
    grid-template-columns: 1fr;
  }

  /* Profile Adjustments */
  .profile-goals {
    grid-template-columns: 1fr 1fr;
  }
  
  .dashboard-strip-cards {
    grid-template-columns: 1fr;
  }
  
  .dashboard-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* --- MOBILE PHONES (Max 600px) --- */
@media (max-width: 600px) {
  /* Dashboard Main */
  .content-area {
    padding: 20px 16px;
  }
  
  .dashboard-quote h1 {
    font-size: 26px;
  }
  
  .topbar h2 {
    font-size: 20px;
  }
  .topbar .user-name {
    font-size: 20px;
  }
  
  /* Stats Box */
  .dashboard-stats {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  /* Strip Cards */
  .strip-card {
    padding: 18px;
    min-height: auto;
  }
  
  /* Control Panel */
  .control-panel {
    padding: 16px;
  }
  .stats-row {
    flex-direction: column;
    gap: 10px;
  }
  .status-filter {
    width: 100%;
    margin-top: 10px;
  }
  
  /* Add form */
  .add-form {
    grid-template-columns: 1fr;
  }
  .primary-btn {
    grid-column: span 1;
  }
  
  /* Kanban card */
  .kanban-column {
    padding: 12px;
  }
  
  /* Profile */
  .profile-identity {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  .profile-goals {
    grid-template-columns: 1fr;
  }
  .profile-save {
    justify-content: center;
  }
  .profile-save button {
    width: 100%;
  }
  
  /* Auth Form Fix */
  .auth-card.premium {
    width: 90%;
    padding: 30px 24px;
    margin: 20px;
  }
  .brand h1 {
    font-size: 24px;
  }
  
  /* Contact grid */
  .contact-grid {
    grid-template-columns: 1fr;
  }
}

/* --- VERY SMALL SCREENS (Max 360px) --- */
@media (max-width: 360px) {
  .dashboard-quote h1 {
    font-size: 22px;
  }
  .stat-box h3 {
    font-size: 26px;
  }
  .stat-box.highlight h3 {
    font-size: 28px;
  }
  .nav-link {
    font-size: 14px;
    padding: 10px 12px;
  }
}
`;

fs.appendFileSync(cssFile, responsiveCSS);
console.log('Responsive CSS appended successfully to style.css!');
