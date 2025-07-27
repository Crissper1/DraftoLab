document.addEventListener("DOMContentLoaded", () => {
    const chatbot = document.querySelector(".chatbot");
    const chatbotToggler = document.querySelector(".chatbot-header");
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.getElementById("send-btn");
    const chatbox = document.querySelector(".chatbox");

    // --- LÓGICA PARA ABRIR Y CERRAR EL CHAT ---
    // Este es el código clave que soluciona el problema.
    // Busca el chatbot y su cabecera, y si los encuentra,
    // les añade la funcionalidad de "toggle" (alternar).
    if (chatbot && chatbotToggler) {
        chatbotToggler.addEventListener("click", () => {
            chatbot.classList.toggle("show-chatbot");
        });
    } else {
        console.error("Error: No se encontraron los elementos del chatbot en el HTML.");
    }
    // --- FIN DE LA LÓGICA PARA ABRIR/CERRAR ---

    // URL de tu webhook de n8n. ¡Asegúrate de cambiarla por la tuya!
    // NOTA: Esta es una URL de PRUEBA. Cuando actives tu workflow en n8n, usa la URL de PRODUCCIÓN.
    const N8N_WEBHOOK_URL = "https://8n8-n8nupdate.vertwo.easypanel.host/webhook/botDraftoLab   ";
    
    // Proxy CORS para desarrollo local (opcional)
    const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
    
    // Configuración para intentar n8n primero, luego fallback local
    // Cambia a false para usar solo respuestas locales durante desarrollo
    const TRY_N8N_FIRST = true; // ✅ Activado para usar n8n
    const USE_CORS_PROXY = false; // Cambia a true si quieres intentar con proxy CORS
    
    // Configuración del método HTTP para n8n (POST recomendado, GET como alternativa)
    const N8N_HTTP_METHOD = "POST"; // Cambia a "GET" si necesitas probar
    
    // Configuración del timeout para n8n (en milisegundos)
    const N8N_TIMEOUT = 15000; // 15 segundos - ajusta según necesidad
    
    // Estado del modo de respuesta (controlado por el usuario)
    let responseMode = 'auto'; // 'auto', 'local', 'n8n'

    let userMessage;

    // Guía local de respuestas rápidas (expandida)
    const localResponses = {
        "hola": "¡Hola! ¿En qué puedo ayudarte hoy?",
        "hi": "¡Hello! ¿En qué puedo ayudarte hoy?",
        "adios": "¡Hasta luego! Si necesitas algo más, aquí estaré.",
        "bye": "¡Hasta luego! Si necesitas algo más, aquí estaré.",
        "gracias": "¡De nada! Estoy para servirte.",
        "thanks": "¡De nada! Estoy para servirte.",
        "que es draftolab": "DraftoLab es un juego de mesa digital inspirado en Draftosaurus. Los jugadores gestionan ADN de dinosaurios para crear las mejores evoluciones genéticas.",
        "como se juega": "Seleccionas tubos de ADN, y según un dado, los colocas en tu incubadora para sumar puntos. ¡Es rápido y divertido!",
        "como jugar": "Seleccionas tubos de ADN, y según un dado, los colocas en tu incubadora para sumar puntos. ¡Es rápido y divertido!",
        "ayuda": "Puedes preguntarme sobre las reglas, cómo jugar, o qué es DraftoLab. ¡Estoy aquí para ayudarte!",
        "help": "Puedes preguntarme sobre las reglas, cómo jugar, o qué es DraftoLab. ¡Estoy aquí para ayudarte!",
        "reglas": "En DraftoLab, cada jugador tiene una incubadora donde colocar tubos de ADN. El dado determina dónde puedes colocar cada tubo. ¡El objetivo es maximizar tus puntos!",
        "rules": "En DraftoLab, cada jugador tiene una incubadora donde colocar tubos de ADN. El dado determina dónde puedes colocar cada tubo. ¡El objetivo es maximizar tus puntos!",
        "puntos": "Los puntos se obtienen colocando tubos de ADN estratégicamente en tu incubadora. Diferentes combinaciones dan diferentes puntuaciones.",
        "dinosaurios": "¡Los dinosaurios son el corazón de DraftoLab! Gestionas su ADN para crear las mejores evoluciones genéticas.",
        "tutorial": "Para aprender a jugar, te recomiendo empezar con una partida de práctica. ¡Es la mejor forma de entender las mecánicas!",
        "adn": "En DraftoLab trabajas con tubos de ADN de diferentes dinosaurios. Cada tubo tiene características únicas que afectan tu puntuación.",
        "dado": "El dado es clave en DraftoLab. Su resultado determina en qué sección de tu incubadora puedes colocar los tubos de ADN.",
        "incubadora": "La incubadora es tu tablero personal donde colocas los tubos de ADN para crear combinaciones que te den puntos.",
        "objetivo": "El objetivo es obtener la mayor cantidad de puntos colocando estratégicamente los tubos de ADN en tu incubadora.",
        "estrategia": "La estrategia en DraftoLab involucra planificar dónde colocar cada tubo según el resultado del dado y las combinaciones posibles.",
        // Comandos especiales para cambiar modo
        "modo local": "🏠 Modo cambiado a LOCAL. Ahora usaré solo respuestas rápidas predefinidas.",
        "modo n8n": "🤖 Modo cambiado a N8N. Ahora usaré inteligencia artificial avanzada.",
        "modo auto": "⚡ Modo cambiado a AUTO. Intentaré n8n primero, local como respaldo.",
        "modo": "🔧 Modos disponibles:\n• 'modo auto' - Intenta n8n, local como respaldo\n• 'modo local' - Solo respuestas rápidas\n• 'modo n8n' - Solo inteligencia artificial",
        "ayuda modo": "🔧 Modos disponibles:\n• 'modo auto' - Intenta n8n, local como respaldo\n• 'modo local' - Solo respuestas rápidas\n• 'modo n8n' - Solo inteligencia artificial",
        "default": "🤖 Hmm, no tengo una respuesta específica para eso. ¿Podrías preguntar sobre las reglas del juego, cómo jugar, o qué es DraftoLab?\n\n💡 Tip: Escribe 'modo' para ver las opciones de respuesta disponibles."
    };

    // Función helper para hacer peticiones a n8n
    const makeN8nRequest = async (userMessage) => {
        const requestData = {
            message: userMessage,
            timestamp: new Date().toISOString(),
            source: 'draftolab-chatbot',
            query: userMessage
        };

        const finalURL = USE_CORS_PROXY ? CORS_PROXY + N8N_WEBHOOK_URL : N8N_WEBHOOK_URL;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), N8N_TIMEOUT);

        const headers = {
            "Content-Type": "application/json"
        };

        if (!USE_CORS_PROXY) {
            headers["Accept"] = "application/json";
        }

        let fetchOptions = {
            method: N8N_HTTP_METHOD,
            headers: headers,
            signal: controller.signal,
            mode: 'cors'
        };

        // Configurar según el método HTTP
        if (N8N_HTTP_METHOD === "POST") {
            fetchOptions.body = JSON.stringify(requestData);
        } else if (N8N_HTTP_METHOD === "GET") {
            // Para GET, agregar parámetros a la URL
            const params = new URLSearchParams({
                message: userMessage,
                timestamp: requestData.timestamp,
                source: requestData.source,
                query: userMessage
            });
            fetchOptions.url = `${finalURL}?${params.toString()}`;
        }

        const response = await fetch(N8N_HTTP_METHOD === "GET" ? fetchOptions.url : finalURL, fetchOptions);
        clearTimeout(timeoutId);

        return response;
    };

    // Función para obtener respuesta local
    const getLocalResponse = (message) => {
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
            key !== "default" && !key.startsWith("modo") && (lowerCaseMessage.includes(key) || key.includes(lowerCaseMessage))
        );
        
        if (partialMatch) {
            return localResponses[partialMatch];
        }
        
        // Respuesta por defecto
        return localResponses["default"];
    };

    const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat");
        
        // Agregar las clases individualmente si className contiene espacios
        if (className) {
            const classes = className.split(' ');
            classes.forEach(cls => {
                if (cls.trim()) {
                    chatLi.classList.add(cls.trim());
                }
            });
        }
        
        let chatContent = `<p>${message}</p>`;
        chatLi.innerHTML = chatContent;
        return chatLi;
    }

    const showThinking = () => {
        const thinkingLi = createChatLi("Pensando...", "incoming thinking");
        chatbox.appendChild(thinkingLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        return thinkingLi;
    }

    const removeThinking = (thinkingLi) => {
        if (thinkingLi && thinkingLi.parentNode) {
            thinkingLi.parentNode.removeChild(thinkingLi);
        }
    }

    const generateResponse = async (incomingChatLi) => {
        const messageElement = incomingChatLi.querySelector("p");
        
        // Mostrar "Pensando..." mientras procesamos
        messageElement.textContent = "Pensando...";
        incomingChatLi.classList.add("thinking");

        // Verificar si es un comando de cambio de modo
        const lowerCaseMessage = userMessage.toLowerCase().trim();
        if (lowerCaseMessage.startsWith("modo")) {
            const localResponse = getLocalResponse(userMessage);
            setTimeout(() => {
                messageElement.textContent = localResponse;
                incomingChatLi.classList.remove("thinking");
                chatbox.scrollTo(0, chatbox.scrollHeight);
            }, 400);
            return;
        }

        // Determinar qué hacer según el modo seleccionado
        if (responseMode === 'local') {
            // Solo respuesta local
            const localResponse = getLocalResponse(userMessage);
            setTimeout(() => {
                messageElement.textContent = `🏠 LOCAL: ${localResponse}`;
                incomingChatLi.classList.remove("thinking");
                chatbox.scrollTo(0, chatbox.scrollHeight);
            }, 400);
            return;
        }

        if (responseMode === 'n8n') {
            // Solo n8n, sin fallback
            try {
                const response = await makeN8nRequest(userMessage);

                if (response.ok) {
                    const data = await response.json();
                    console.log('📥 Respuesta completa de n8n:', data);
                    
                    // Buscar la respuesta en diferentes campos posibles
                    const agentResponse = data.answer || data.response || data.message || data.text || data.reply || data.status;
                    
                    if (agentResponse && agentResponse.trim()) {
                        console.log(`✅ Respuesta recibida de n8n via ${N8N_HTTP_METHOD} (modo n8n)`);
                        setTimeout(() => {
                            messageElement.textContent = `🤖 N8N: ${agentResponse}`;
                            incomingChatLi.classList.remove("thinking");
                            chatbox.scrollTo(0, chatbox.scrollHeight);
                        }, 400);
                        return;
                    } else {
                        console.log('⚠️ n8n respondió pero sin campo de respuesta válido:', data);
                    }
                }

                // Si n8n falla en modo n8n, mostrar error
                setTimeout(() => {
                    messageElement.textContent = `❌ No pude conectar con la IA avanzada (${N8N_HTTP_METHOD}). Prueba 'modo auto' o 'modo local'.`;
                    incomingChatLi.classList.remove("thinking");
                    chatbox.scrollTo(0, chatbox.scrollHeight);
                }, 400);
                return;

            } catch (error) {
                setTimeout(() => {
                    messageElement.textContent = `❌ Error de conexión con n8n (${N8N_HTTP_METHOD}). Prueba 'modo auto' o 'modo local'.`;
                    incomingChatLi.classList.remove("thinking");
                    chatbox.scrollTo(0, chatbox.scrollHeight);
                }, 400);
                return;
            }
        }

        // Modo AUTO (comportamiento original)
        if (TRY_N8N_FIRST) {
            try {
                const response = await makeN8nRequest(userMessage);

                if (response.ok) {
                    const data = await response.json();
                    console.log('📥 Respuesta completa de n8n:', data);
                    
                    // Buscar la respuesta en diferentes campos posibles
                    const agentResponse = data.answer || data.response || data.message || data.text || data.reply || data.status;
                    
                    if (agentResponse && agentResponse.trim()) {
                        console.log(`✅ Respuesta recibida de n8n via ${N8N_HTTP_METHOD} (modo auto)`);
                        setTimeout(() => {
                            messageElement.textContent = `🤖 IA: ${agentResponse}`;
                            incomingChatLi.classList.remove("thinking");
                            chatbox.scrollTo(0, chatbox.scrollHeight);
                        }, 400);
                        return;
                    } else {
                        console.log('⚠️ n8n respondió pero sin campo de respuesta válido:', data);
                    }
                } else {
                    console.log(`⚠️ n8n respondió con código ${response.status} (${N8N_HTTP_METHOD})`);
                }
            } catch (error) {
                console.log(`🔄 n8n no disponible via ${N8N_HTTP_METHOD}, usando respuesta local`);
            }
        }

        // Fallback a respuesta local en modo AUTO
        const localResponse = getLocalResponse(userMessage);
        setTimeout(() => {
            messageElement.textContent = `🏠 LOCAL: ${localResponse}`;
            incomingChatLi.classList.remove("thinking");
            chatbox.scrollTo(0, chatbox.scrollHeight);
        }, 400);
    }

    const handleChat = () => {
        userMessage = chatInput.value.trim();
        if (!userMessage) return;

        chatInput.value = "";
        chatInput.style.height = "auto";

        // Añadir mensaje del usuario al chatbox
        chatbox.appendChild(createChatLi(userMessage, "outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);

        // Generar respuesta del bot
        setTimeout(() => {
            const incomingChatLi = createChatLi("...", "incoming thinking");
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
            generateResponse(incomingChatLi);
        }, 600);
    }

    // Evento para el botón de enviar
    sendChatBtn.addEventListener("click", handleChat);

    // Evento para la tecla Enter
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleChat();
        }
    });

    // Ajustar altura del textarea
    chatInput.addEventListener("input", () => {
        chatInput.style.height = "auto";
        chatInput.style.height = `${chatInput.scrollHeight}px`;
    });
});