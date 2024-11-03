// animação mocego

document.getElementById('registerButton').addEventListener('click', function(event) {
    for (let i = 0; i < 10; i++) {
      let bat = document.createElement('div');
      bat.classList.add('bat');
      bat.style.setProperty('--x', `${Math.random() * 200 - 100}px`);
      bat.style.setProperty('--y', `${Math.random() * 200 - 100}px`);
      bat.style.left = `${event.clientX}px`;
      bat.style.top = `${event.clientY}px`;
      document.body.appendChild(bat);
      setTimeout(() => bat.remove(), 1500);
    }
  });






