<script setup>
import { ref } from 'vue'

const text = ref('')
const user = ref('')
const pass = ref('')
const boutonClass = ref('login')

async function created(username, password) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username, password: password })
  };

  console.log(username.value)
  console.log(password.value)
  const url = "http://127.0.0.1:8080/login";
  console.log(url);

  try {
    const response = await fetch(url, requestOptions);
    console.log(response)
    if (!response.ok) throw new Error('Failed to login');

    const data = await response.json();
    console.log(data);
    text.value = 'connected';
  } catch (error) {
    console.error(error);
    text.value = 'failed to connect';
  }
}
</script>

<template>
  <input v-model="user" placeholder="Username">
  <input v-model="pass" placeholder="Password" type="password">
  <button :class="boutonClass" @click="created(user, pass)">Login</button>
  <p>Status = {{ text }}</p>
</template>

<style>
  .login {
    margin-left: 15px;
    padding: 15px;
    height: 40px;
    width: 80px;
  }
</style>
