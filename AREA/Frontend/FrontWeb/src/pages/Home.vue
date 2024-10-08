<script setup>
import { ref } from 'vue';

const text = ref('');

const services = [
  { name: 'Service 1', description: 'Description of service 1' },
  { name: 'Service 2', description: 'Description of service 2' },
  { name: 'Service 3', description: 'Description of service 3' },
  { name: 'Service 4', description: 'Description of service 4' },
  { name: 'Service 5', description: 'Description of service 5' },
  { name: 'Service 6', description: 'Description of service 6' },
  { name: 'Service 7', description: 'Description of service 7' },
  { name: 'Service 8', description: 'Description of service 8' },
  { name: 'Service 9', description: 'Description of service 9' },
  { name: 'Service 10', description: 'Description of service 10' },
  { name: 'Service 11', description: 'Description of service 11' },
  { name: 'Service 12', description: 'Description of service 12' },
  { name: 'Service 13', description: 'Description of service 13' },
  { name: 'Service 14', description: 'Description of service 14' },
  { name: 'Service 15', description: 'Description of service 15' },
  { name: 'Service 16', description: 'Description of service 16' },
  { name: 'Service 17', description: 'Description of service 17' },
  { name: 'Service 18', description: 'Description of service 18' }
];

async function created_user(username, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  };

  try {
    const response = await fetch('http://127.0.0.1:8080/login', requestOptions);
    if (!response.ok) throw new Error('Failed to login');
    const data = await response.json();
    text.value = 'connected';
  } catch (error) {
    text.value = 'failed to connect';
  }
}
</script>


<template>
  <div class="promo-section">
    <div class="company-name">CompanyName</div>

    <div class="top-buttons">
      <v-btn variant="outlined"><router-link to="/create" style="text-decoration:none">Create</router-link></v-btn>
      <v-btn variant="outlined"><router-link to="/saves" style="text-decoration:none">Saves</router-link></v-btn>
    </div>

    <div class="search-bar">
      <v-text-field
        v-model="text"
        label="Search"
        variant="outlined"
        solo
        hide-details
        class="search-input"
      />
    </div>

    <div class="services-area">
      <div v-for="service in services" :key="service.name" class="service-card">
        <v-card class="service-content" elevation="2" rounded>
          <v-card-title>{{ service.name }}</v-card-title>
          <v-card-subtitle>{{ service.description }}</v-card-subtitle>
        </v-card>
      </div>
    </div>

    <div class="account-text">Account</div>
  </div>
</template>

<style scoped>
.promo-section {
  width: 100%;
  height: 100vh;
  background: linear-gradient(90deg, #2b1dee 0%, #06114e 100%);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  text-align: center;
}

.company-name {
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 18px;
  font-weight: bold;
}

.top-buttons {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
}

.account-text {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 18px;
  font-weight: bold;
}

.search-bar {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-input {
  max-width: 500px; 
  width: 100%;
}

.services-area {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 250px));
  margin-top: 40px;
  width: 100%;
  padding: 0 20px;
  gap: 10px;
}

.service-card {
  display: flex;
  justify-content: center;
  margin: 0;
}

.service-content {
  width: 100%;
  max-width: 250px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 12px;
  margin: 0; 
}

.service-content v-card-title,
.service-content v-card-subtitle {
  color: white;
}
</style>
