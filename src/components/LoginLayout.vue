<template>
  <div class="center">
    <div class="card">
      <slot />
    </div>
  </div>
</template>

<style>
.card {
  background-color: rgb(var(--bg-color));
  width: 350px;
  padding: 15px 20px;
  border-radius: var(--border-radius);
}

.login_layout_title {
  font-size: 2.5rem;
  margin-bottom: 30px;
}

.login_layout_input {
  width: 100%;
  font-size: 1.5rem;
  display: block;
  margin-bottom: 20px;
  border-radius: var(--border-radius);
  padding: 10px 10px !important;
}

.login_layout_invalid {
  width: 100%;
  display: block;
  text-align: left;
  font-size: 1.2rem;
  color: rgb(var(--danger-color));
  padding-left: 10px;
  margin-top: -10px;
  margin-bottom: 30px;
}

.login_layout_submit {
  height: auto !important;
  padding: 10px 15px !important;
  margin-right: 10px;
}

.login_layout_button {
  --font-color: var(--accent-color);

  height: auto !important;
  padding: 10px 15px !important;
  margin-right: 10px;
  background-color: transparent !important;
  color: rgb(var(--font-color)) !important;
}
</style>
