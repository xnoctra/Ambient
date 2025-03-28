function getGreeting(name) {
  const currentHour = new Date().getHours();
  let greetingMessage = '';
  let icon = '';

  if (currentHour >= 5 && currentHour < 12) {
    greetingMessage = `Good morning, ${name}!`;
    icon = 'haze';
  } else if (currentHour >= 12 && currentHour < 20) {
    greetingMessage = `Good evening, ${name}!`;
    icon = 'sun-medium';
  } else {
    greetingMessage = `Good night, ${name}!`;
    icon = 'moon-star';
  }

  return { greetingMessage, icon };
}

const name = 'User';
const { greetingMessage, icon } = getGreeting(name);
document.getElementById('greeting').innerHTML = `<i data-lucide="${icon}"></i><span>${greetingMessage}</span>`;
lucide.create();
