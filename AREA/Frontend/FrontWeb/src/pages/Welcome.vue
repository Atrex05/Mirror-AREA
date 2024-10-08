<script setup>
import { ref } from 'vue';

const user = ref('');
const pass = ref('');
const email = ref('');
const phone = ref('');
const text = ref('');

const socialProviders = [
  { name: 'Google', url: 'https://cdn.iconscout.com/icon/free/png-256/free-google-160-189824.png?f=webp', color: 'red' },
  { name: 'Facebook', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg', color: 'blue' },
  { name: 'GitHub', url: 'https://cdn-icons-png.flaticon.com/512/25/25231.png', color: 'rgba(51, 51, 51, 0.8)' },
  { name: 'SSO', url: 'https://zammad.com/media/pages/product/features/sso/e416ed60eb-1698589015/sso-256x.png', color: 'rgba(0, 0, 0, 0.8)' },
  { name: 'Instagram', url: 'https://static.vecteezy.com/system/resources/thumbnails/042/387/654/small_2x/instagram-button-icon-set-instagram-screen-social-media-and-social-network-interface-template-stories-user-button-symbol-sign-logo-stories-liked-editorial-free-png.png', color: 'rgba(225, 48, 108, 1)' },
  { name: 'Spotify', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/768px-Spotify_logo_without_text.svg.png', color: 'green' },
  { name: 'Twitter', url: 'https://cdn.icon-icons.com/icons2/4029/PNG/512/twitter_x_new_logo_x_rounded_icon_256078.png', color: 'rgba(29, 161, 242, 1)' },
  { name: 'LinkedIn', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/LinkedIn_icon_circle.svg/1200px-LinkedIn_icon_circle.svg.png', color: 'rgba(0, 119, 181, 1)' },
  { name: 'Reddit', url: 'https://www.iconpacks.net/icons/2/free-reddit-logo-icon-2436-thumb.png', color: 'rgba(255, 69, 0, 1)' },
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
    <h2>Workflow Optimization</h2>
    <h3>#withAREA</h3>
    <p>Transform your tasks and processes into powerful applications and systems. Create and automate everything on an innovative visual platform. | Free forever</p>
    <p><v-btn variant="outlined"><router-link to="/create-account" style="text-decoration:none">Get started now!</router-link></v-btn></p>
    <p><v-btn variant="outlined"><router-link to="/login" style="text-decoration:none">Sign in</router-link></v-btn></p>

    <div class="bubble-container">
      <template v-for="provider in socialProviders" :key="provider.name">
        <div class="bubble">
          <img :src="provider.url" :alt="provider.name" />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.promo-section {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #2b1dee 0%, #06114e 100%);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px;
  position: relative;
  text-align: center;
}

.promo-section h2, .promo-section p {
  position: relative;
  margin-bottom: 8px;
  z-index: 1;
}

.promo-section h3 {
  position: relative;
  z-index: 1;
  font-size: 6rem;
  font-weight: 300;
  line-height: 1;
  letter-spacing: -0.015625em;
}

.bubble-container {
  position: absolute;
  width: 900px;
  height: 900px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  pointer-events: none;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  animation: float 10s infinite ease-in-out;
  opacity: 0.7;
}

.bubble img {
  max-width: 65%;
  max-height: 80%;
  object-fit: contain;
}

@keyframes float {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(10px, -20px);
  }
  100% {
    transform: translate(0, 0);
  }
}

.bubble:nth-child(1) {
  top: 0%;
  left: 65%;
  transform: translate(-50%, -50%);
  width: 140px;
  height: 140px;
}

.bubble:nth-child(2) {
  top: 15%;
  left: 100%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
}

.bubble:nth-child(3) {
  top: 50%;
  left: 100%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
}

.bubble:nth-child(4) {
  top: 80%;
  left: 80%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
}

.bubble:nth-child(5) {
  top: 90%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 110px;
  height: 110px;
}

.bubble:nth-child(6) {
  top: 80%;
  left: 15%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 150px;
}

.bubble:nth-child(7) {
  top: 50%;
  left: 0%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
}

.bubble:nth-child(8) {
  top: 20%;
  left: 0%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
}

.bubble:nth-child(9) {
  top: 0%;
  left: 20%;
  transform: translate(-50%, -50%);
  width: 190px;
  height: 190px;
}
</style>
