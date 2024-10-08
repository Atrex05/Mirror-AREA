<script setup>
import { ref } from 'vue';

const user = ref('');
const pass = ref('');
const email = ref('');
const phone = ref('');
const text = ref('');

const socialProviders = [
  { name: 'Google', icon: 'google', color: 'red' },
  { name: 'Facebook', icon: 'facebook', color:  'blue'},
  { name: 'GitHub', icon: 'github', color:  'rgba(51, 51, 51, 0.8)'},
  { name: 'SSO', icon: 'key', color: 'rgba(0, 0, 0, 0.8)' },
];

const boutonClass = ref('login');

async function created_user(username, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username, password: password })
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
  <div class="login-page">
    <div class="login-section">
      <div class="form-container">
          <div class="title_login">
            <router-link to="/Home" style="text-decoration:none">
              <v-btn icon="mdi-arrow-left" color="white"></v-btn>
            </router-link>
            Register
          </div>
          <input v-model="user" placeholder="Username" class="input-field" />
          <input v-model="pass" placeholder="Password" type="password" class="input-field" />
          <input v-model="email" placeholder="Email" class="input-field" />
          <input v-model="phone" placeholder="Phone Number" class="input-field" />
        <div class="button-login">
        <v-btn block variant="outlined">Create user</v-btn>
        </div>
        <div class="social-login">
          <template v-for="todo in socialProviders">
            <li>
              <button :style="{ backgroundColor: todo.color }" class="btn">
                Log in with {{ todo.name }}
              </button>
            </li>
          </template>
        </div>
        <a href="#" class="forgot-password">Lost password</a>
      </div>
    </div>

    <div class="promo-section">
      <h2>Workflow Optimization</h2>
      <h3>#withAREA</h3>
      <p>Transform your tasks and processes into powerful applications and systems. Create and automate everything on an innovative visual platform. | Free forever</p>
    </div>
  </div>
</template>

<style scoped>

.center_text {
  display: flex;
  justify-content: center; /* centrer un bail*/
  width: 100%;
  margin-bottom: 10px;
}

.title_login {
  font-size: 2.125rem;
  font-weight: 500;
  line-height: 1.175;
  letter-spacing: 0.0073529412em;
  color: #000;
  margin-bottom: 15px;
}

.login-page {
  display: flex;
  height: 100vh;
}

.button-login {
  margin-bottom: 8px;
  color: #0a0874;
  display: flex;
  justify-content: center; /* centrer un bail*/
  width: 100%;
}

.form-container {
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px; /* Changer la tailler des bars*/
}

h2 {
  font-size: 24px;
  margin-bottom: 16px;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #000;
}

.login-section {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
}

.input-field {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn {
  background-color: rgb(255, 255, 255);
  color: rgb(255, 255, 255);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Ombre */
}

.btn-login, .social-login button {
  width: 100%;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 12px;
}

.create-account, .forgot-password, .resend-verification {
  margin-top: 8px;
  color: #666;
}

.promo-section {
  width: 60%;
  background: linear-gradient(90deg, #2b1dee 0%, #06114e 100%);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 50px;
}

.promo-section h2 {
  font-size: 36px;
}

.promo-section h3 {
  font-size: 28px;
  color: #ffffff;
}

.promo-section p {
  font-size: 16px;
  margin-top: 20px;
  line-height: 1.5;
}

</style>
