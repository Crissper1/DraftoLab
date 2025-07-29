document.addEventListener("DOMContentLoaded", () => {
    // ========================================
    // ELEMENTOS DEL DOM
    // ========================================
    const chatbot = document.querySelector(".chatbot");
    const chatbotToggler = document.querySelector(".chatbot-header");
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.getElementById("send-btn");
    const chatbox = document.querySelector(".chatbox");

    // ========================================
    // CONFIGURACIÓN
    // ========================================
    const CONFIG = {
        N8N_WEBHOOK_URL: "https://8n8-n8nupdate.vertwo.easypanel.host/webhook/botDraftoLab",
        CORS_PROXY: "https://cors-anywhere.herokuapp.com/",
        TRY_N8N_FIRST: true,
        USE_CORS_PROXY: false,
        N8N_HTTP_METHOD: "POST",
        N8N_TIMEOUT: 15000
    };

    // ========================================
    // ESTADO DE LA APLICACIÓN
    // ========================================
    let responseMode = 'auto'; // 'auto', 'local', 'n8n'
    let userMessage = '';

    // ========================================
    // RESPUESTAS LOCALES PREDEFINIDAS
    // ========================================
    const localResponses = {
        // Saludos y despedidas
        "hola": "¡Hola! ¿En qué puedo ayudarte hoy?",
        "hi": "¡Hello! ¿En qué puedo ayudarte hoy?",
        "adios": "¡Hasta luego! Si necesitas algo más, aquí estaré.",
        "bye": "¡Hasta luego! Si necesitas algo más, aquí estaré.",
        "gracias": "¡De nada! Estoy para servirte.",
        "thanks": "¡De nada! Estoy para servirte.",

        // Información del juego
        "que es draftolab": "DraftoLab es un juego de mesa digital inspirado en Draftosaurus. Los jugadores gestionan ADN de dinosaurios para crear las mejores evoluciones genéticas.",
        "como se juega": "Seleccionas tubos de ADN, y según un dado, los colocas en tu incubadora para sumar puntos. ¡Es rápido y divertido!",
        "como jugar": "Seleccionas tubos de ADN, y según un dado, los colocas en tu incubadora para sumar puntos. ¡Es rápido y divertido!",
        "reglas": "En DraftoLab, cada jugador tiene una incubadora donde colocar tubos de ADN. El dado determina dónde puedes colocar cada tubo. ¡El objetivo es maximizar tus puntos!",
        "rules": "En DraftoLab, cada jugador tiene una incubadora donde colocar tubos de ADN. El dado determina dónde puedes colocar cada tubo. ¡El objetivo es maximizar tus puntos!",

        // Mecánicas del juego
        "puntos": "Los puntos se obtienen colocando tubos de ADN estratégicamente en tu incubadora. Diferentes combinaciones dan diferentes puntuaciones.",
        "dinosaurios": "¡Los dinosaurios son el corazón de DraftoLab! Gestionas su ADN para crear las mejores evoluciones genéticas.",
        "adn": "En DraftoLab trabajas con tubos de ADN de diferentes dinosaurios. Cada tubo tiene características únicas que afectan tu puntuación.",
        "dado": "El dado es clave en DraftoLab. Su resultado determina en qué sección de tu incubadora puedes colocar los tubos de ADN.",
        "incubadora": "La incubadora es tu tablero personal donde colocas los tubos de ADN para crear combinaciones que te den puntos.",
        "objetivo": "El objetivo es obtener la mayor cantidad de puntos colocando estratégicamente los tubos de ADN en tu incubadora.",
        "estrategia": "La estrategia en DraftoLab involucra planificar dónde colocar cada tubo según el resultado del dado y las combinaciones posibles.",

        // Ayuda y tutorial
        "ayuda": "Puedes preguntarme sobre las reglas, cómo jugar, o qué es DraftoLab. ¡Estoy aquí para ayudarte!",
        "help": "Puedes preguntarme sobre las reglas, cómo jugar, o qué es DraftoLab. ¡Estoy aquí para ayudarte!",
        "tutorial": "Para aprender a jugar, te recomiendo empezar con una partida de práctica. ¡Es la mejor forma de entender las mecánicas!",

        // Comandos de modo
        "modo local": "🏠 Modo cambiado a LOCAL. Ahora usaré solo respuestas rápidas predefinidas.",
        "modo n8n": "🤖 Modo cambiado a N8N. Ahora usaré inteligencia artificial avanzada.",
        "modo auto": "⚡ Modo cambiado a AUTO. Intentaré n8n primero, local como respaldo.",
        "modo": "🔧 Modos disponibles:\n• 'modo auto' - Intenta n8n, local como respaldo\n• 'modo local' - Solo respuestas rápidas\n• 'modo n8n' - Solo inteligencia artificial",
        "ayuda modo": "🔧 Modos disponibles:\n• 'modo auto' - Intenta n8n, local como respaldo\n• 'modo local' - Solo respuestas rápidas\n• 'modo n8n' - Solo inteligencia artificial",

        // Respuesta por defecto
        "default": "🤖 Hmm, no tengo una respuesta específica para eso. ¿Podrías preguntar sobre las reglas del juego, cómo jugar, o qué es DraftoLab?\n\n💡 Tip: Escribe 'modo' para ver las opciones de respuesta disponibles."
    };

    // ========================================
    // INICIALIZACIÓN
    // ========================================
    function initializeChatbot() {
        if (chatbot && chatbotToggler) {
            chatbotToggler.addEventListener("click", toggleChatbot);
        } else {
            console.error("Error: No se encontraron los elementos del chatbot en el HTML.");
        }
    }

    // ========================================
    // FUNCIONES DE INTERFAZ
    // ========================================
    function toggleChatbot() {
        chatbot.classList.toggle("show-chatbot");
    }

    function createChatLi(message, className) {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat");
        
        if (className) {
            const classes = className.split(' ');
            classes.forEach(cls => {
                if (cls.trim()) {
                    chatLi.classList.add(cls.trim());
                }
            });
        }
        
        chatLi.innerHTML = `<p>${message}</p>`;
        return chatLi;
    }

    function scrollToBottom() {
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }

    // ========================================
    // FUNCIONES DE RESPUESTA
    // ========================================
    function getLocalResponse(message) {
        const lowerCaseMessage = message.toLowerCase().trim();
        
        // Verificar comandos de cambio de modo
        if (lowerCaseMessage === "modo local") {
            responseMode = 'local';
            return localResponses["modo local"];
        }
        if (lowerCaseMessage === "modo n8n") {
            responseMode = 'n8n';
            return localResponses["modo n8n"];
        }
        if (lowerCaseMessage === "modo auto") {
            responseMode = 'auto';
            return localResponses["modo auto"];
        }
        
        // Búsqueda exacta
        if (localResponses[lowerCaseMessage]) {
            return localResponses[lowerCaseMessage];
        }
        
        // Búsqueda parcial (palabras clave)
        const partialMatch = Object.keys(localResponses).find(key => 
            key !== "default" && 
            !key.startsWith("modo") && 
            (lowerCaseMessage.includes(key) || key.includes(lowerCaseMessage))
        );
        
        return partialMatch ? localResponses[partialMatch] : localResponses["default"];
    }

    async function makeN8nRequest(userMessage) {
        const requestData = {
            message: userMessage,
            timestamp: new Date().toISOString(),
            source: 'draftolab-chatbot',
            query: userMessage
        };

        const finalURL = CONFIG.USE_CORS_PROXY ? 
            CONFIG.CORS_PROXY + CONFIG.N8N_WEBHOOK_URL : 
            CONFIG.N8N_WEBHOOK_URL;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.N8N_TIMEOUT);

        const headers = {
            "Content-Type": "application/json"
        };

        if (!CONFIG.USE_CORS_PROXY) {
            headers["Accept"] = "application/json";
        }

        let fetchOptions = {
            method: CONFIG.N8N_HTTP_METHOD,
            headers: headers,
            signal: controller.signal,
            mode: 'cors'
        };

        // Configurar según el método HTTP
        if (CONFIG.N8N_HTTP_METHOD === "POST") {
            fetchOptions.body = JSON.stringify(requestData);
        } else if (CONFIG.N8N_HTTP_METHOD === "GET") {
            const params = new URLSearchParams({
                message: userMessage,
                timestamp: requestData.timestamp,
                source: requestData.source,
                query: userMessage
            });
            fetchOptions.url = `${finalURL}?${params.toString()}`;
        }

        try {
            const response = await fetch(
                CONFIG.N8N_HTTP_METHOD === "GET" ? fetchOptions.url : finalURL, 
                fetchOptions
            );
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    function displayMessage(messageElement, text, isThinking = false) {
        setTimeout(() => {
            messageElement.textContent = text;
            if (isThinking) {
                messageElement.parentElement.classList.remove("thinking");
            }
            scrollToBottom();
        }, 400);
    }

    async function generateResponse(incomingChatLi) {
        const messageElement = incomingChatLi.querySelector("p");
        
        // Mostrar estado de pensando
        messageElement.textContent = "Pensando...";
        incomingChatLi.classList.add("thinking");

        // Verificar comandos de modo
        const lowerCaseMessage = userMessage.toLowerCase().trim();
        if (lowerCaseMessage.startsWith("modo")) {
            const localResponse = getLocalResponse(userMessage);
            displayMessage(messageElement, localResponse, true);
            return;
        }

        // Modo LOCAL
        if (responseMode === 'local') {
            const localResponse = getLocalResponse(userMessage);
            displayMessage(messageElement, `🏠 LOCAL: ${localResponse}`, true);
            return;
        }

        // Modo N8N
        if (responseMode === 'n8n') {
            try {
                const response = await makeN8nRequest(userMessage);
                if (await handleN8nResponse(response, messageElement, 'n8n')) return;
                
                displayMessage(messageElement, 
                    `❌ No pude conectar con la IA avanzada (${CONFIG.N8N_HTTP_METHOD}). Prueba 'modo auto' o 'modo local'.`, 
                    true
                );
            } catch (error) {
                displayMessage(messageElement, 
                    `❌ Error de conexión con n8n (${CONFIG.N8N_HTTP_METHOD}). Prueba 'modo auto' o 'modo local'.`, 
                    true
                );
            }
            return;
        }

        // Modo AUTO
        if (CONFIG.TRY_N8N_FIRST) {
            try {
                const response = await makeN8nRequest(userMessage);
                if (await handleN8nResponse(response, messageElement, 'auto')) return;
            } catch (error) {
                console.log(`🔄 n8n no disponible via ${CONFIG.N8N_HTTP_METHOD}, usando respuesta local`);
            }
        }

        // Fallback a respuesta local
        const localResponse = getLocalResponse(userMessage);
        displayMessage(messageElement, `🏠 LOCAL: ${localResponse}`, true);
    }

    async function handleN8nResponse(response, messageElement, mode) {
        if (response.ok) {
            const data = await response.json();
            console.log('📥 Respuesta completa de n8n:', data);
            
            const agentResponse = data.answer || data.response || data.message || 
                                data.text || data.reply || data.status;
            
            if (agentResponse && agentResponse.trim()) {
                const modeEmoji = mode === 'n8n' ? '🤖 N8N:' : '🤖 IA:';
                console.log(`✅ Respuesta recibida de n8n via ${CONFIG.N8N_HTTP_METHOD} (modo ${mode})`);
                displayMessage(messageElement, `${modeEmoji} ${agentResponse}`, true);
                return true;
            } else {
                console.log('⚠️ n8n respondió pero sin campo de respuesta válido:', data);
            }
        } else {
            console.log(`⚠️ n8n respondió con código ${response.status} (${CONFIG.N8N_HTTP_METHOD})`);
        }
        return false;
    }

    // ========================================
    // MANEJO DE EVENTOS
    // ========================================
    function handleChat() {
        userMessage = chatInput.value.trim();
        if (!userMessage) return;

        // Limpiar input
        chatInput.value = "";
        chatInput.style.height = "auto";

        // Añadir mensaje del usuario
        chatbox.appendChild(createChatLi(userMessage, "outgoing"));
        scrollToBottom();

        // Generar respuesta del bot
        setTimeout(() => {
            const incomingChatLi = createChatLi("...", "incoming thinking");
            chatbox.appendChild(incomingChatLi);
            scrollToBottom();
            generateResponse(incomingChatLi);
        }, 600);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleChat();
        }
    }

    function handleTextareaInput() {
        chatInput.style.height = "auto";
        chatInput.style.height = `${chatInput.scrollHeight}px`;
    }

    // ========================================
    // REGISTRO DE EVENTOS
    // ========================================
    function registerEventListeners() {
        sendChatBtn.addEventListener("click", handleChat);
        chatInput.addEventListener("keydown", handleKeyDown);
        chatInput.addEventListener("input", handleTextareaInput);
    }

    // ========================================
    // INICIALIZACIÓN PRINCIPAL
    // ========================================
    initializeChatbot();
    registerEventListeners();
});