const loginButton = document.getElementById('login-btn');
const depositButton = document.getElementById('deposit-btn');
const loginSection = document.getElementById('login');
const jogoSection = document.getElementById('jogo');
const saldoField = document.getElementById('saldo');
const valorInput = document.getElementById('valor');
const copiaInput = document.getElementById('copiaecola');
const msg = document.getElementById('msg');

const token = '36481ebb-ebba-47d6-bcf6-a55c23a9cf7a';
let currentUserId = '';

loginButton.addEventListener('click', async () => {
  const userId = document.getElementById('userId').value.trim();
  if (!userId) {
    msg.textContent = 'Informe um ID de usuário.';
    msg.classList.remove('hidden');
    return;
  }

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, token })
  });
  const data = await res.json();

  if (!res.ok) {
    msg.textContent = data.erro || 'Falha no login.';
    msg.classList.remove('hidden');
    return;
  }

  currentUserId = userId;
  saldoField.textContent = Number(data.saldo).toFixed(2);
  loginSection.style.display = 'none';
  jogoSection.style.display = 'flex';
  msg.classList.add('hidden');
});

depositButton.addEventListener('click', async () => {
  const valor = parseFloat(valorInput.value);
  if (!Number.isFinite(valor) || valor <= 0) {
    msg.textContent = 'Informe um valor válido.';
    msg.classList.remove('hidden');
    return;
  }

  const res = await fetch('/api/depositar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: currentUserId, valor, token })
  });
  const data = await res.json();

  if (!res.ok || !data.sucesso) {
    msg.textContent = data.erro || 'Falha ao depositar.';
    msg.classList.remove('hidden');
    return;
  }

  copyInput.value = data.pix;
  try {
    await navigator.clipboard.writeText(data.pix);
  } catch (error) {
    console.warn('Não foi possível copiar automaticamente:', error);
  }

  msg.textContent = data.mensagem || 'Pix copiado! Confirme no seu banco.';
  msg.classList.remove('hidden');
  saldoField.textContent = (Number(saldoField.textContent) + valor).toFixed(2);
});
