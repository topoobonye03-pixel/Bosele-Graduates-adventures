document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     BOSELE WEBSITE — MOBILE NAVIGATION
     ========================================================= */

  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.navlinks');

  if (toggle && menu) {
    const closeMenu = () => {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    };

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');

      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('nav-open', isOpen);
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 820) {
        closeMenu();
      }
    });
  }


  /* =========================================================
     BOSELE AI — CREATE CHAT INTERFACE
     ========================================================= */

  const AI_ENDPOINT =
    'https://bosele-ai-safari-planner.gboseleadventures.workers.dev/';

  const aiShell = document.createElement('div');

  aiShell.innerHTML = `
    <button
      class="bosele-ai-fab"
      id="bosele-ai-fab"
      type="button"
      aria-label="Open Bosele AI Travel Consultant"
    >
      ✨ Plan with Bosele AI
    </button>

    <section
      class="bosele-ai-chat"
      id="bosele-ai-chat"
      aria-label="Bosele AI Travel Consultant"
    >
      <div class="bosele-ai-header">
        <div>
          <strong>Bosele AI Travel Consultant ✨</strong>
          <span>Plan your Botswana journey</span>
        </div>

        <button
          class="bosele-ai-close"
          id="bosele-ai-close"
          type="button"
          aria-label="Close Bosele AI"
        >
          ×
        </button>
      </div>

      <div class="bosele-ai-body">

        <div class="bosele-ai-welcome">
          Hi! 👋 Tell me where you want to go, your budget, dates,
          or the kind of adventure you want. I’ll help you shape
          a Bosele trip.
        </div>

        <div id="bosele-ai-messages"></div>

        <textarea
          id="bosele-ai-input"
          maxlength="2000"
          placeholder="Ask about Khwai, Chobe, Savuti, Xakanaxa, Victoria Falls, Gold Safari, budgets..."
        ></textarea>

        <button id="bosele-ai-send" type="button">
          Ask Bosele AI
        </button>

        <div
          id="bosele-ai-actions"
          class="bosele-ai-actions"
          style="display:none;"
        >
          <a
            class="bosele-ai-action primary"
            href="contact.html"
          >
            Request a Quote
          </a>

          <a
            class="bosele-ai-action"
            href="tel:+26774396369"
          >
            Call Bosele
          </a>

          <button
            type="button"
            class="bosele-ai-action"
            id="bosele-ai-new-trip"
          >
            Start New Trip
          </button>
        </div>

        <small class="bosele-ai-note">
          AI planning assistance. Confirm final prices,
          dates and availability with Bosele.
        </small>

      </div>
    </section>
  `;

  document.body.appendChild(aiShell);


  /* =========================================================
     BOSELE AI — ELEMENTS
     ========================================================= */

  const aiFab =
    document.getElementById('bosele-ai-fab');

  const aiChat =
    document.getElementById('bosele-ai-chat');

  const aiClose =
    document.getElementById('bosele-ai-close');

  const aiSend =
    document.getElementById('bosele-ai-send');

  const aiInput =
    document.getElementById('bosele-ai-input');

  const aiMessages =
    document.getElementById('bosele-ai-messages');

  const aiActions =
    document.getElementById('bosele-ai-actions');

  const newTripButton =
    document.getElementById('bosele-ai-new-trip');

  const heroAIButton =
    document.getElementById('hero-bosele-ai-button');


  /* =========================================================
     BOSELE AI — OPEN / CLOSE
     ========================================================= */

  function openBoseleAI() {
    aiChat.classList.add('open');

    setTimeout(() => {
      aiInput.focus();
    }, 100);
  }

  function closeBoseleAI() {
    aiChat.classList.remove('open');
  }

  aiFab.addEventListener('click', openBoseleAI);
  aiClose.addEventListener('click', closeBoseleAI);

  if (heroAIButton) {
    heroAIButton.addEventListener('click', openBoseleAI);
  }


  /* =========================================================
     BOSELE AI — CONVERSATION MEMORY
     ========================================================= */

  let conversationHistory = [];


  /* =========================================================
     BOSELE AI — MESSAGE HELPERS
     ========================================================= */

  function addMessage(text, type) {
    const message = document.createElement('div');

    message.className =
      type === 'user'
        ? 'bosele-ai-msg user'
        : 'bosele-ai-msg bot';

    message.textContent = text;

    aiMessages.appendChild(message);
    aiMessages.scrollTop = aiMessages.scrollHeight;

    return message;
  }


  /* =========================================================
     BOSELE AI — ASK
     ========================================================= */

  async function askBoseleAI() {

    const message = aiInput.value.trim();

    if (!message || aiSend.disabled) {
      return;
    }

    addMessage(message, 'user');

    aiInput.value = '';

    aiSend.disabled = true;
    aiSend.textContent = 'Planning...';

    /*
      Hide actions while Bosele AI is preparing
      the next answer.
    */
    aiActions.style.display = 'none';

    const thinking =
      addMessage('Bosele AI is thinking...', 'bot');

    try {

      const response = await fetch(AI_ENDPOINT, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          message: message,
          history: conversationHistory
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Bosele AI request failed'
        );
      }

      const reply =
        data.reply ||
        'I could not generate a response right now. Please try again.';

      /*
        IMPORTANT:
        The AI ANSWER is shown first.
      */
      thinking.textContent = reply;
// Force the new AI answer to become visible immediately
requestAnimationFrame(() => {
  aiMessages.scrollTop = aiMessages.scrollHeight;
});

setTimeout(() => {
  aiMessages.scrollTop = aiMessages.scrollHeight;
}, 100);
      /*
        Save conversation so follow-up questions
        can understand earlier answers.
      */
      conversationHistory.push({
        role: 'user',
        content: message
      });

      conversationHistory.push({
        role: 'assistant',
        content: reply
      });

      if (conversationHistory.length > 12) {
        conversationHistory =
          conversationHistory.slice(-12);
      }

      /*
        ONLY AFTER a successful AI answer,
        show the optional customer actions.
      */
      aiActions.style.display = 'flex';

    } catch (error) {

      console.error('Bosele AI error:', error);

      thinking.textContent =
        'Sorry, Bosele AI is temporarily unavailable. Please try again.';

      /*
        If AI fails, do NOT replace the answer
        with Call/Quote buttons.
      */
      aiActions.style.display = 'none';

    } finally {

      aiSend.disabled = false;
      aiSend.textContent = 'Ask Bosele AI';

      aiMessages.scrollTop =
        aiMessages.scrollHeight;
    }
  }


  /* =========================================================
     BOSELE AI — SEND BUTTON
     ========================================================= */

  aiSend.addEventListener('click', askBoseleAI);


  /* =========================================================
     BOSELE AI — ENTER TO SEND
     Shift + Enter = new line
     ========================================================= */

  aiInput.addEventListener('keydown', event => {

    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {
      event.preventDefault();
      askBoseleAI();
    }
  });


  /* =========================================================
     BOSELE AI — START NEW TRIP
     ========================================================= */

  newTripButton.addEventListener('click', () => {

    conversationHistory = [];

    aiMessages.innerHTML = '';

    aiInput.value = '';

    aiActions.style.display = 'none';

    aiSend.disabled = false;
    aiSend.textContent = 'Ask Bosele AI';

    aiInput.focus();
  });

});
