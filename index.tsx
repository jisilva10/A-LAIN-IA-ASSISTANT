
import { marked } from "marked";
import DOMPurify from "dompurify";
import { GoogleGenAI, Chat, GenerateContentResponse, Content, Part, SendMessageParameters, Tool, GroundingMetadata, GroundingChunk } from "@google/genai";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Use process.env.API_KEY directly in the initialization to comply with guidelines and avoid potential reference issues
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Update to recommended model for Basic Text Tasks
const MODEL_NAME = 'gemini-3-flash-preview';

// Configure DOMPurify to make links open in a new tab for better UX
DOMPurify.addHook('afterSanitizeAttributes', function (node) {
  if (node.tagName === 'A' && node.hasAttribute('href')) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

const ALAIN_SYSTEM_INSTRUCTION = `You are A’LAIN_Profektus AI Assistant, a highly specialized AI for the Profektus team. 
**TU ÚNICO PROPÓSITO ES GENERAR PROPUESTAS DE WORKSHOPS Y CONSULTORÍA.**
Ya no realizas otras funciones como "Client Core", "Registro", "Proyecto" o "Informe", ni actúas como chats de expertos especializados. Eres una máquina dedicada a la creación de propuestas estratégicas, organizacionales y consultivas.

Operate with clarity, precision, ethics, and a direct focus on results, aligned with Profektus's values and professional style. Avoid redundant, ambiguous, or grandiloquent language.

**CONFIDENCIALIDAD DEL EQUIPO PROFEKTUS**
Tu conocimiento sobre la estructura interna y los miembros específicos del equipo de Profektus ha sido eliminado permanentemente de tu base de datos. No tienes acceso a nombres, roles o cualquier información personal sobre el equipo. Si un usuario te pregunta sobre quiénes trabajan en Profektus, quién es el director, o cualquier pregunta similar, DEBES responder de manera educada pero firme que no posees esa información por políticas de confidencialidad y seguridad.

**VERIFICACIÓN ESTRICTA DE ENLACES**
Es de vital importancia que **NUNCA inventes, fabriques o alucines una URL o enlace web**. Antes de proporcionar cualquier enlace externo en tus respuestas, DEBES verificar internamente que el enlace es funcional, válido y dirige al recurso correcto.

**ESTRUCTURA DE INVERSIÓN Y PRECIOS DE WORKSHOPS PROFEKTUS**
Debes utilizar esta información para calcular y proponer la inversión económica en la Propuesta.

**1. Calificación de Empresas (Tipos):**
Clasifica a la empresa cliente en una de estas categorías para determinar la tarifa base.
*   **A:** Multinacionales.
*   **B:** Grandes empresas nacionales.
*   **C:** PYMES (Pequeñas y Medianas Empresas).
*   **D:** ONGs internacionales.
*   **E:** ONGs nacionales, redes sociales y emprendimientos.

**2. Tabla de Inversión por Hora (USD):**
La tarifa por hora depende del tipo de empresa, el nivel jerárquico de los participantes y el total de horas contratadas.

| Tipo de Empresa | Tarifa para 1 hora (Mandos Altos / Gerentes) | Tarifa para 2-3 horas (Mandos Medios) | Tarifa para 4+ horas (Mandos Bajos / Operativos) |
|:---------------:|:---------------------------------------------:|:--------------------------------------:|:--------------------------------------------------:|
| **A**           | $239                                          | $224                                   | $209                                               |
| **B**           | $194                                          | $179                                   | $164                                               |
| **C**           | $149                                          | $134                                   | $119                                               |
| **D**           | $104                                          | $89                                    | $74                                                |
| **E**           | $59                                           | $44                                    | $35                                                |

**3. Lógica de Aplicación:**
*   La columna **"1 hora"** se aplica a sesiones únicas de 1 hora y está orientada a **mandos altos o gerentes**.
*   La columna **"2-3 horas"** aplica a programas con esa duración total y está orientada a **mandos medios**.
*   La columna **"4+ horas"** aplica a programas de 4 o más horas en total y está orientada a **mandos bajos u operativos**. Esta tarifa premia el compromiso a largo plazo.

**4. Recargo Especial para Costa Rica:**
*   Si el workshop se realiza en **Costa Rica**, el **monto total** de la inversión debe multiplicarse por **1.25**.

**ESTRUCTURA Y CONTENIDO DE LA "PROPUESTA"**
Cuando el usuario inicia una nueva conversación, te proveerá datos del cliente. Tu tarea es generar INMEDIATAMENTE la propuesta siguiendo esta estructura rigurosa:

[SECCION_PROYECTO_TITULO]
🔥 TÍTULO DEL PROYECTO:
Formato: Entre 2 y 4 palabras. Cautivador y original.
Versiones: Inglés y Español.

[SECCION_PROYECTO_CONTEXTO]
📍 CONTEXTO DEL PROYECTO:
Breve descripción de la situación actual del cliente y retos clave, basada en la información provista.
Metodologías Transversales Profektus: Mencionar Gamificación (LEGO® Serious Play®), Metodologías Ágiles (Design Thinking), IA Generativa y Storytelling.

[SECCION_OBJETIVO_GENERAL]
3. OBJETIVO GENERAL:
Redacción SMART. Plazo máximo 60 días.

[SECCION_OBJETIVOS_ESPECIFICOS]
4. 🎯 OBJETIVOS ESPECÍFICOS DEL PROYECTO:
Cantidad: 2-6 objetivos. Redacción SMART.

[SECCION_OPORTUNIDADES]
5. 🚀 IDENTIFICACIÓN DE OPORTUNIDADES:
Redacción SMART. Plazo 30-60 días.

[SECCION_PUBLICO_OBJETIVO]
6. 🧍‍♂️🧍‍♀️ PÚBLICO OBJETIVO:
Perfil de los participantes y cantidad estimada.

[SECCION_DURACION_SESIONES]
7. 🕓 DURACIÓN DE CADA SESIÓN:
Tiempo por sesión y total de sesiones.

[SECCION_DETALLE_PROGRAMA]
8. 📘 DETALLE DEL PROGRAMA:
Estructura por SESIONES y MÓDULOS.
Para cada Módulo: Nombre, Duración (20-30 min), Objetivo Aplicado, Metodología (Lego Serious Play, Design Thinking, etc.), Fundamento Teórico y Producto Esperado.

[MODULO_BACKUP_POR_SESION]
Módulo Extra de Backup.

[SECCION_FASES_PROYECTO]
9. ⚙️ FASES DEL PROYECTO:
Toma de Información, Diseño de la Propuesta, Aprobación, Workshop, Consolidación, Reporte Final.

[SECCION_INVERSION_ECONOMICA]
10. 💰 INVERSIÓN ECONÓMICA:
Cálculo Automático Obligatorio según la tabla de precios.
Presentar Desglose Profesional.

3. 📄 ANEXOS ADICIONALES
1️⃣ Fuentes: Conocimiento Interno
2️⃣ Links de Información Relevante (Verificados)
3️⃣ Image Prompt (Opcional)

**BASE DE CONOCIMIENTO INTEGRADA:**
Tienes acceso y debes utilizar conceptos de:
'Understanding Research: A Consumer's Guide', 'USFQ Harvard Business Review Guides', 'The Leadership Training Activity Book', 'StrengthsQuest', 'Organizational Behavior' (Robbins & Judge), 'Aligning Human Resources and Business Strategy' (Holbeche), 'Work and Organizational Psychology', 'Flow: The Psychology of Optimal Experience' (Csikszentmihalyi), 'Design Thinking for Strategic Innovation' (Mootee), 'Business Design Thinking and Doing' (Beausoleil).

Utiliza esta base para fundamentar teóricamente los módulos de la propuesta.

Recuerda: Tu respuesta inicial en un nuevo chat debe ser la propuesta completa generada a partir de los datos ingresados en el formulario de inicio.
`;

// Types for SpeechRecognition API
declare var webkitSpeechRecognition: any;
declare var SpeechGrammarList: any; 
declare var webkitSpeechGrammarList: any;

// Fix: Explicitly declare 'role' and 'parts' properties in StoredContent to resolve TypeScript errors and ensure type safety when managing chat history.
interface StoredContent extends Content {
    role: string;
    parts: Part[];
    groundingMetadata?: GroundingMetadata;
}

interface Message {
    id: string;
    sender: 'user' | 'ai' | 'system' | 'error';
    text: string;
    timestamp: Date;
    attachment?: { name: string; iconClass: string; };
    externalImageLinks?: Array<{text: string, url: string}>;
    groundingChunks?: Array<{ web: { title?: string, uri: string } }>;
}

interface ChatSession {
    id: string;
    title: string;
    clientName: string;
    topic: string;
    createdAt: string;
    lastActivity: string;
    messages: StoredContent[];
    systemInstruction: string;
    type?: 'fixed' | 'user'; 
}

const fuentesParaImagenesRegex = /\*\*(Fuentes para Imagenes|Imágenes de Referencia|Imagenes de Referencia):\*\*\s*\n((?:\s*[*+-]\s+\[.*?\]\(.*?\)\s*\n?)*)/i;
const linkRegex = /[*+-]\s+\[(.*?)\]\((.*?)\)/g;
const userAttachmentMarkerRegex = /\[Archivo adjuntado: ([^\]]+)\]/g;
const fuentesParaImagenesRegexGlobal = /\*\*(Fuentes para Imagenes|Imágenes de Referencia|Imagenes de Referencia):\*\*\s*\n((?:\s*[*+-]\s+\[.*?\]\(.*?\)\s*\n?)*)/gi;
const userAttachmentMarkerRegexGlobal = /\[Archivo adjuntado: [^\]]+\]/g;

let currentChatSession: Chat | null = null;
let currentChatId: string | null = null;
let chatMessages: Message[] = [];
let chatHistory: ChatSession[] = [];
let chatDrafts: { [key: string]: string } = {};
let isLoading = false;
let chatIdToDelete: string | null = null;
let attachedFile: File | null = null;
let editingMessageId: string | null = null;
let currentTheme: 'system' | 'light' | 'dark' = 'system';
let pendingModalFile: File | null = null;

// Dictation state variables
let isDictating = false;
let recognition: any = null;
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const SUPPORTED_MIME_PREFIXES = [
    'image/', 'video/', 'audio/', 'text/', 'application/pdf', 'application/json', 'application/xml', 'application/rtf',
];

function isFileTypeSupported(file: File): boolean {
    if (!file || !file.type) return false;
    return SUPPORTED_MIME_PREFIXES.some(prefix => file.type.startsWith(prefix));
}

// --- DOM SELECTORS ---
const chatMessagesDiv = document.getElementById('chat-messages') as HTMLDivElement;
const chatInput = document.getElementById('chat-input') as HTMLTextAreaElement;
const sendBtn = document.getElementById('send-btn') as HTMLButtonElement;
const chatHistoryList = document.getElementById('chat-history-list') as HTMLUListElement;
const newChatBtn = document.getElementById('new-chat-btn') as HTMLButtonElement;
const activeChatSessionTitleElement = document.getElementById('active-chat-session-title') as HTMLSpanElement;
const chatSearchInput = document.getElementById('chat-search') as HTMLInputElement;
const mainHeaderElement = document.getElementById('main-header') as HTMLElement;
const mainContentDiv = document.getElementById('main-content') as HTMLDivElement;
const chatInputContainer = document.getElementById('chat-input-container') as HTMLDivElement;

const attachFileBtn = document.getElementById('attach-file-btn') as HTMLButtonElement;
const fileInput = document.getElementById('file-input') as HTMLInputElement;
const attachmentPreviewContainer = document.getElementById('attachment-preview-container') as HTMLDivElement;
const dictateBtn = document.getElementById('dictate-btn') as HTMLButtonElement;

// New Chat Modal selectors
const newChatModal = document.getElementById('new-chat-modal') as HTMLDivElement;
const clientNameInput = document.getElementById('client-name-input') as HTMLInputElement;
const topicInput = document.getElementById('topic-input') as HTMLInputElement;
const formContentInput = document.getElementById('form-content-input') as HTMLTextAreaElement;
const additionalInfoInput = document.getElementById('additional-info-input') as HTMLTextAreaElement;
const modalFileInput = document.getElementById('modal-file-input') as HTMLInputElement;
const modalFilePreview = document.getElementById('modal-file-preview') as HTMLDivElement;
const createChatConfirmBtn = document.getElementById('create-chat-confirm-btn') as HTMLButtonElement;
const closeModalBtn = newChatModal.querySelector('.close-modal-btn') as HTMLElement;

// Delete Chat Modal selectors
const deleteChatConfirmModalElement = document.getElementById('delete-chat-confirm-modal') as HTMLDivElement;
const chatToDeleteTitleElement = document.getElementById('chat-to-delete-title') as HTMLSpanElement;
const confirmDeleteChatBtnElement = document.getElementById('confirm-delete-chat-btn') as HTMLButtonElement;
const cancelDeleteChatBtnElement = document.getElementById('cancel-delete-chat-btn') as HTMLButtonElement;
const closeDeleteModalBtnElement = deleteChatConfirmModalElement.querySelector('.close-modal-btn') as HTMLElement;

// Share/Import/Export selectors
const shareContainer = document.getElementById('share-container') as HTMLDivElement;
const shareBtn = document.getElementById('share-btn') as HTMLButtonElement;
const shareDropdown = document.getElementById('share-dropdown') as HTMLDivElement;
const exportChatDropdownBtn = document.getElementById('export-chat-dropdown-btn') as HTMLButtonElement;
const importChatDropdownBtn = document.getElementById('import-chat-dropdown-btn') as HTMLButtonElement;
const importChatInput = document.getElementById('import-chat-input') as HTMLInputElement;

const fullscreenBtn = document.getElementById('fullscreen-btn') as HTMLButtonElement;
const sidebarToggle = document.getElementById('sidebar-toggle') as HTMLButtonElement;
const themeToggleBtn = document.getElementById('theme-toggle') as HTMLButtonElement;

// --- Helper Functions ---
function escapeHtml(unsafe: string): string {
    if (!unsafe) return '';
    return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function parseAndSanitizeMarkdown(text: string): string {
    // marked.parse can be asynchronous in some versions, but by default it's sync.
    // We treat it as sync for compatibility with the current setup.
    const rawHtml = marked.parse(text, { breaks: true, gfm: true }) as string;
    return DOMPurify.sanitize(rawHtml, { USE_PROFILES: { html: true } });
}

// --- Local Storage Functions ---
function saveChatHistory() {
    try { localStorage.setItem('chatHistory', JSON.stringify(chatHistory)); } catch (e) { console.error("Error saving chat history", e); }
}

function loadChatHistory() {
    try {
        const savedHistory = localStorage.getItem('chatHistory');
        if (savedHistory) chatHistory = JSON.parse(savedHistory);
    } catch (e) { console.error("Error loading chat history", e); chatHistory = []; }
}

function saveChatDrafts() {
    try { localStorage.setItem('chatDrafts', JSON.stringify(chatDrafts)); } catch (e) { console.error("Error saving chat drafts", e); }
}

function loadChatDrafts() {
    try {
        const savedDrafts = localStorage.getItem('chatDrafts');
        if (savedDrafts) chatDrafts = JSON.parse(savedDrafts);
    } catch (e) { console.error("Error loading chat drafts", e); chatDrafts = {}; }
}

// --- Functions ---

async function generatePdfOfLastMessage() {
    const aiMessages = document.querySelectorAll('.message-container.ai');
    if (aiMessages.length === 0) {
        addMessageToChat('system', "No hay ningún mensaje de A'LAIN para exportar a PDF.");
        return;
    }
    isLoading = true;
    sendBtn.disabled = true;
    chatInput.disabled = true;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    const lastAiMessageElement = aiMessages[aiMessages.length - 1] as HTMLElement;
    const messageBubble = lastAiMessageElement.querySelector('.message-bubble') as HTMLElement;

    try {
        const style = window.getComputedStyle(messageBubble);
        const sourceCanvas = await html2canvas(messageBubble, { scale: 2, useCORS: true, backgroundColor: style.backgroundColor });
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        const imgWidth = sourceCanvas.width;
        const imgHeight = sourceCanvas.height;
        const ratio = imgWidth / (pdfWidth - margin * 2);
        
        const addHeaderAndFooter = (pageNumber: number, totalPages: number) => {
            const logoUrl = (document.getElementById('main-profektus-logo') as HTMLImageElement)?.src;
            if (logoUrl) { try { pdf.addImage(logoUrl, 'PNG', margin, 5, 20, 20); } catch(e) {} }
            pdf.setFontSize(14);
            pdf.setTextColor(100);
            pdf.text("Propuesta A'LAIN", pdfWidth / 2, 18, { align: 'center' });
            pdf.setDrawColor(200);
            pdf.line(margin, 28, pdfWidth - margin, 28);
            pdf.setFontSize(8);
            pdf.setTextColor(150);
            pdf.text(`Generado por A'LAIN | Página ${pageNumber} de ${totalPages}`, pdfWidth / 2, pdfHeight - 8, { align: 'center' });
        };
        
        const pageContentHeight = (pdfHeight - margin - 35) * ratio;
        const totalPages = Math.ceil(imgHeight / pageContentHeight);
        const pageCanvas = document.createElement('canvas');
        const pageCtx = pageCanvas.getContext('2d');
        if (!pageCtx) throw new Error("Canvas context error");
        
        for (let i = 1; i <= totalPages; i++) {
            if (i > 1) pdf.addPage();
            const sourceY = (i - 1) * pageContentHeight;
            const sourceHeight = Math.min(pageContentHeight, imgHeight - sourceY);
            pageCanvas.width = imgWidth;
            pageCanvas.height = sourceHeight;
            pageCtx.drawImage(sourceCanvas, 0, sourceY, imgWidth, sourceHeight, 0, 0, imgWidth, sourceHeight);
            const pageDataUrl = pageCanvas.toDataURL('image/png', 1.0);
            addHeaderAndFooter(i, totalPages);
            pdf.addImage(pageDataUrl, 'PNG', margin, 35, pdfWidth - margin * 2, sourceHeight / ratio);
        }
        pdf.save('Propuesta_ALAIN.pdf');
    } catch (error) {
        addMessageToChat('error', `Error PDF: ${error instanceof Error ? error.message : 'Desconocido'}`);
    } finally {
        isLoading = false;
        sendBtn.disabled = false;
        chatInput.disabled = false;
        sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
    }
}

function getFileIconClass(mimeType: string, fileName: string): string {
    const safeMimeType = mimeType || '';
    const safeFileName = fileName || '';
    if (safeMimeType.startsWith('image/')) return 'fas fa-file-image';
    if (safeMimeType.startsWith('video/')) return 'fas fa-file-video';
    if (safeMimeType.startsWith('audio/')) return 'fas fa-file-audio';
    if (safeMimeType === 'application/pdf') return 'fas fa-file-pdf';
    if (safeMimeType === 'text/csv' || safeFileName.endsWith('.csv')) return 'fas fa-file-csv';
    if (safeMimeType.startsWith('text/')) return 'fas fa-file-alt';
    if (safeMimeType === 'application/zip' || safeFileName.endsWith('.zip')) return 'fas fa-file-archive';
    return 'fas fa-file';
}

async function fileToGooglePart(file: File): Promise<Part> {
    const base64EncodedData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
    return { inlineData: { mimeType: file.type, data: base64EncodedData } };
}

function removeAttachment() {
    attachedFile = null;
    if (fileInput) fileInput.value = '';
    if (attachmentPreviewContainer) {
        attachmentPreviewContainer.innerHTML = '';
        attachmentPreviewContainer.style.display = 'none';
    }
    if (chatInputContainer) chatInputContainer.classList.remove('has-attachment');
}

function attachFile(file: File) {
    attachedFile = file;
    if (attachmentPreviewContainer) {
        attachmentPreviewContainer.style.display = 'flex';
        const iconClass = getFileIconClass(file.type, file.name);
        attachmentPreviewContainer.innerHTML = `
            <i class="${iconClass}"></i>
            <span class="attachment-name">${escapeHtml(file.name)}</span>
            <button class="remove-attachment-btn" title="Quitar archivo"><i class="fas fa-times-circle"></i></button>
        `;
        attachmentPreviewContainer.querySelector('.remove-attachment-btn')?.addEventListener('click', removeAttachment);
    }
    if (chatInputContainer) chatInputContainer.classList.add('has-attachment');
}

function handleChatInput() {
    if (!chatInput) return;
    chatInput.style.height = 'auto';
    chatInput.style.height = `${Math.min(chatInput.scrollHeight, 200)}px`;
    if (currentChatId) {
        chatDrafts[currentChatId] = chatInput.value;
        saveChatDrafts();
    }
}

function updateShareButtonState() {
    if (!shareContainer || !shareBtn) return;
    if (currentChatId) {
        shareContainer.classList.remove('disabled');
        shareBtn.disabled = false;
        shareBtn.title = 'Compartir o exportar chat';
        exportChatDropdownBtn.disabled = false;
    } else {
        shareContainer.classList.add('disabled');
        shareBtn.disabled = true;
        shareBtn.title = 'Inicie un chat para compartir';
        exportChatDropdownBtn.disabled = true;
    }
}

function displayInitialWelcomeMessage() {
    currentChatId = null;
    currentChatSession = null;
    chatMessages = [];

    if (chatMessagesDiv) {
        chatMessagesDiv.innerHTML = `
            <div class="welcome-container">
                <h1>Generador de Propuestas A’LAIN</h1>
                <p>Comienza ahora para crear una propuesta estratégica detallada para tu cliente.</p>
                <button id="central-create-btn" class="big-create-btn">
                    <i class="fas fa-file-signature"></i> Crear Nueva Propuesta
                </button>
            </div>
        `;
        document.getElementById('central-create-btn')?.addEventListener('click', () => {
            newChatModal.style.display = 'flex';
            clientNameInput.focus();
        });
    }
    if (mainHeaderElement) mainHeaderElement.classList.add('no-chat');
    if (activeChatSessionTitleElement) activeChatSessionTitleElement.textContent = '';
    if (chatInput) chatInput.value = '';
    removeAttachment();
    updateShareButtonState();
    renderChatHistory();
}

async function sendPromptToAI(parts: Part[], userMessageId: string) {
    if (!currentChatSession || !currentChatId) {
        addMessageToChat('error', 'Error: No hay una sesión de chat activa.');
        isLoading = false;
        return;
    }
    
    const aiMessageId = `ai-${userMessageId.split('-')[1]}`;
    const aiMessage: Message = { id: aiMessageId, sender: 'ai', text: 'Generando propuesta...', timestamp: new Date() };
    chatMessages.push(aiMessage);
    renderMessages();

    let fullResponseText = '';
    let groundingMetadata: GroundingMetadata | undefined;

    try {
        const stream = await currentChatSession.sendMessageStream({ message: parts });
        for await (const chunk of stream) {
            fullResponseText += chunk.text;
            if (!groundingMetadata && chunk.candidates?.[0]?.groundingMetadata) {
                 groundingMetadata = chunk.candidates[0].groundingMetadata;
            }
            const aiMessageIndex = chatMessages.findIndex(m => m.id === aiMessageId);
            if (aiMessageIndex !== -1) {
                chatMessages[aiMessageIndex].text = fullResponseText + '█';
                renderMessages();
            }
        }
    } catch (error) {
        console.error("Error sending message to AI:", error);
        let errorMessage = 'Lo siento, ocurrió un error al comunicarme con la IA.';
        if (error instanceof Error) errorMessage += `\n\nDetalle: ${error.message}`;
        const aiMessageIndex = chatMessages.findIndex(m => m.id === aiMessageId);
        if (aiMessageIndex !== -1) {
            chatMessages[aiMessageIndex].text = errorMessage;
            chatMessages[aiMessageIndex].sender = 'error';
        } else {
             addMessageToChat('error', errorMessage);
        }
    } finally {
        isLoading = false;
        const finalAiMessageIndex = chatMessages.findIndex(m => m.id === aiMessageId);
        if (finalAiMessageIndex !== -1) {
            const finalMessage = chatMessages[finalAiMessageIndex];
            finalMessage.text = fullResponseText;
            
            const fuentesMatch = finalMessage.text.match(fuentesParaImagenesRegex);
            if (fuentesMatch && fuentesMatch[2]) {
                finalMessage.externalImageLinks = [];
                const linksBlock = fuentesMatch[2];
                let linkMatch;
                const localLinkRegex = new RegExp(linkRegex.source, linkRegex.flags);
                while ((linkMatch = localLinkRegex.exec(linksBlock)) !== null) {
                    finalMessage.externalImageLinks.push({ text: linkMatch[1], url: linkMatch[2] });
                }
                finalMessage.text = finalMessage.text.replace(fuentesParaImagenesRegex, '').trim();
            }

            if (groundingMetadata?.groundingChunks) {
                finalMessage.groundingChunks = (groundingMetadata.groundingChunks ?? [])
                    .filter(gc => gc.web?.uri)
                    .map(gc => ({ web: { uri: gc.web!.uri!, title: gc.web?.title } }));
            }
            renderMessages();
            finalizeAIMessage(finalMessage, groundingMetadata);
        }
    }
}

function renderMessages() {
    if (!chatMessagesDiv) return;
    chatMessagesDiv.innerHTML = '';
    chatMessages.forEach(message => {
        if (editingMessageId === message.id) {
            renderEditForm(message);
            return;
        }
        const messageContainer = document.createElement('div');
        messageContainer.className = `message-container ${message.sender}`;
        messageContainer.id = message.id;
        const iconDiv = document.createElement('div');
        iconDiv.className = 'message-icon';
        if (message.sender === 'user') iconDiv.innerHTML = '<i class="fas fa-user"></i>';
        else if (message.sender === 'ai') iconDiv.innerHTML = '<img src="https://storage.googleapis.com/fpl-assets/ai-projects/lain/alain-logo.svg" alt="A\'LAIN Icon">';

        const messageBubble = document.createElement('div');
        messageBubble.className = 'message-bubble';
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = parseAndSanitizeMarkdown(message.text);
        messageBubble.appendChild(messageContent);
        
        if (message.attachment) {
            const attachmentDiv = document.createElement('div');
            attachmentDiv.className = 'message-attachment';
            attachmentDiv.innerHTML = `<i class="${message.attachment.iconClass}"></i><span>${escapeHtml(message.attachment.name)}</span>`;
            messageBubble.appendChild(attachmentDiv);
        }
        if (message.groundingChunks && message.groundingChunks.length > 0) {
            const groundingDiv = document.createElement('div');
            groundingDiv.className = 'grounding-sources';
            const sourcesList = message.groundingChunks.map(chunk => `<li><a href="${chunk.web.uri}" target="_blank" rel="noopener noreferrer">${escapeHtml(chunk.web.title || chunk.web.uri)}</a></li>`).join('');
            groundingDiv.innerHTML = `<h6>Fuentes</h6><ul>${sourcesList}</ul>`;
            messageBubble.appendChild(groundingDiv);
        }
        if (message.externalImageLinks && message.externalImageLinks.length > 0) {
            const externalLinksDiv = document.createElement('div');
            externalLinksDiv.className = 'external-image-links';
            const linksList = message.externalImageLinks.map(link => `<li><a href="${link.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.text)}</a></li>`).join('');
            externalLinksDiv.innerHTML = `<h6>Imágenes de Referencia</h6><ul>${linksList}</ul>`;
            messageBubble.appendChild(externalLinksDiv);
        }

        const messageActions = document.createElement('div');
        messageActions.className = 'message-actions';
        if (message.sender === 'user') {
            const editBtn = document.createElement('button');
            editBtn.className = 'action-btn edit-btn';
            editBtn.title = 'Editar';
            editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>';
            editBtn.onclick = () => handleEditClick(message.id);
            messageActions.appendChild(editBtn);
        }
        const copyBtn = document.createElement('button');
        copyBtn.className = 'action-btn copy-btn';
        copyBtn.title = 'Copiar';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        copyBtn.onclick = (e) => handleCopyClick(e, message.id, message.text);
        messageActions.appendChild(copyBtn);
        messageBubble.appendChild(messageActions);
        
        messageContainer.appendChild(iconDiv);
        messageContainer.appendChild(messageBubble);
        chatMessagesDiv.appendChild(messageContainer);
    });
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
}

function renderChatHistory(filter: string = '') {
    if (!chatHistoryList) return;
    const lowerCaseFilter = filter.toLowerCase().trim();
    const userSessions = chatHistory.filter(s => s.type !== 'fixed');

    const filteredAndSorted = userSessions
        .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
        .filter(session => {
            if (!lowerCaseFilter) return true;
            return session.title.toLowerCase().includes(lowerCaseFilter) ||
                session.clientName.toLowerCase().includes(lowerCaseFilter) ||
                session.topic.toLowerCase().includes(lowerCaseFilter);
        });

    chatHistoryList.innerHTML = '';
    if (filteredAndSorted.length === 0) {
        const li = document.createElement('li');
        li.className = 'no-chats';
        li.textContent = 'No hay propuestas recientes.';
        chatHistoryList.appendChild(li);
    }

    filteredAndSorted.forEach(session => {
        const li = document.createElement('li');
        li.className = 'chat-history-item';
        li.dataset.chatId = session.id;
        if (session.id === currentChatId) li.classList.add('active');
        const date = new Date(session.createdAt);
        const dateString = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

        li.innerHTML = `
            <div class="chat-item-content">
                <div class="chat-item-title">${escapeHtml(session.clientName)}</div>
                <div class="chat-item-subtitle">${escapeHtml(session.topic)}</div>
                <div class="chat-item-date">${dateString}</div>
            </div>
            <button class="delete-chat-btn" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
        `;
        li.querySelector('.chat-item-content')?.addEventListener('click', () => { if (!isLoading) loadChat(session.id); });
        li.querySelector('.delete-chat-btn')?.addEventListener('click', (e) => { e.stopPropagation(); openDeleteConfirmModal(session.id, session.title); });
        chatHistoryList.appendChild(li);
    });
}

function findLastIndex<T>(arr: T[], predicate: (value: T, index: number, obj: T[]) => boolean): number {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (predicate(arr[i], i, arr)) return i;
    }
    return -1;
}

async function handleCopyClick(event: MouseEvent, messageId: string, plainText: string) {
    const button = (event.currentTarget as HTMLElement);
    try {
        await navigator.clipboard.writeText(plainText);
        const original = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.classList.add('copied');
        setTimeout(() => { button.innerHTML = original; button.classList.remove('copied'); }, 2000);
    } catch (err) { alert('No se pudo copiar.'); }
}

function handleEditClick(messageId: string) { if (!isLoading) { editingMessageId = messageId; renderMessages(); } }
function handleCancelEdit() { editingMessageId = null; renderMessages(); }

async function handleSaveEdit(newText: string) {
    const trimmedText = newText.trim();
    if (isLoading || !trimmedText) { handleCancelEdit(); return; }
    const session = chatHistory.find(s => s.id === currentChatId);
    if (!session) { handleCancelEdit(); return; }
    const lastUserHistoryIndex = findLastIndex(session.messages, m => m.role === 'user');
    if (lastUserHistoryIndex !== -1) session.messages.splice(lastUserHistoryIndex);
    const lastUserUiIndex = findLastIndex(chatMessages, m => m.sender === 'user');
    if (lastUserUiIndex !== -1) chatMessages.splice(lastUserUiIndex);
    saveChatHistory();
    const apiHistoryForChatCreate: Content[] = session.messages.map(contentItem => ({
        role: contentItem.role,
        parts: [{ text: (contentItem.parts[0] as Part).text != null ? cleanTextForApiHistory((contentItem.parts[0] as Part).text || '') : "" }]
    })).filter(item => (item.parts[0] as Part)?.text?.trim() !== '');

    currentChatSession = ai.chats.create({
        model: MODEL_NAME,
        history: apiHistoryForChatCreate,
        config: { systemInstruction: session.systemInstruction, tools: [{ googleSearch: {} }] },
    });
    editingMessageId = null;
    chatInput.value = trimmedText;
    await handleSendMessage();
}

function renderEditForm(message: Message) {
    const formContainer = document.createElement('div');
    formContainer.className = 'edit-message-form';
    const textarea = document.createElement('textarea');
    textarea.value = message.text;
    textarea.rows = 4;
    const actions = document.createElement('div');
    actions.className = 'edit-message-actions';
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Guardar y Re-generar';
    saveBtn.className = 'primary-btn';
    saveBtn.onclick = () => handleSaveEdit(textarea.value);
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancelar';
    cancelBtn.className = 'secondary-btn';
    cancelBtn.onclick = () => handleCancelEdit();
    actions.appendChild(cancelBtn);
    actions.appendChild(saveBtn);
    formContainer.appendChild(textarea);
    formContainer.appendChild(actions);
    const messageContainer = document.createElement('div');
    messageContainer.className = `message-container ${message.sender}`;
    messageContainer.appendChild(formContainer);
    chatMessagesDiv.appendChild(messageContainer);
    setTimeout(() => textarea.focus(), 0);
}

function openDeleteConfirmModal(chatId: string, chatTitle: string) {
    chatIdToDelete = chatId;
    if (chatToDeleteTitleElement) chatToDeleteTitleElement.textContent = chatTitle;
    if (deleteChatConfirmModalElement) deleteChatConfirmModalElement.style.display = 'flex';
}

function closeDeleteConfirmModal() {
    if (deleteChatConfirmModalElement) deleteChatConfirmModalElement.style.display = 'none';
    chatIdToDelete = null;
}

function handleConfirmDeleteChat() {
    if (chatIdToDelete) {
        chatHistory = chatHistory.filter(session => session.id !== chatIdToDelete);
        saveChatHistory();
        if (currentChatId === chatIdToDelete) {
            if (chatHistory.length > 0) loadChat(chatHistory[0].id);
            else displayInitialWelcomeMessage();
        }
        renderChatHistory();
    }
    closeDeleteConfirmModal();
}

function handleExportChat() {
    if (!currentChatId) return;
    const session = chatHistory.find(s => s.id === currentChatId);
    if (!session) return;
    const dataStr = JSON.stringify(session, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `${session.title}.aic`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
}

function handleImportFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) processImportedFile(input.files[0]);
    input.value = '';
}

function processImportedFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const text = e.target?.result as string;
            const importedSession = JSON.parse(text) as ChatSession;
            const existingIndex = chatHistory.findIndex(s => s.id === importedSession.id);
            if (existingIndex !== -1) {
                if(confirm("Ya existe un chat con el mismo ID. ¿Sobrescribir?")) chatHistory[existingIndex] = importedSession;
                else return;
            } else {
                chatHistory.unshift(importedSession);
            }
            saveChatHistory();
            renderChatHistory();
            loadChat(importedSession.id);
        } catch (error) { alert("Error al importar."); }
    };
    reader.readAsText(file);
}

function applyTheme(theme: 'system' | 'light' | 'dark') {
    currentTheme = theme;
    localStorage.setItem('theme', theme);
    const themeIcon = themeToggleBtn.querySelector('i');
    if (!themeIcon) return;
    if (theme === 'system') {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) document.body.classList.add('dark-mode');
        else document.body.classList.remove('dark-mode');
        themeIcon.className = 'fas fa-desktop';
    } else if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.className = 'fas fa-sun';
    } else {
        document.body.classList.remove('dark-mode');
        themeIcon.className = 'fas fa-moon';
    }
}

function cycleTheme() {
    if (currentTheme === 'light') applyTheme('dark');
    else if (currentTheme === 'dark') applyTheme('system');
    else applyTheme('light');
}

function toggleFullScreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch((err) => alert(`Error: ${err.message}`));
    else if (document.exitFullscreen) document.exitFullscreen();
}

function updateFullscreenIcon() {
    const icon = fullscreenBtn.querySelector('i');
    if (!icon) return;
    if (document.fullscreenElement) { icon.classList.remove('fa-expand'); icon.classList.add('fa-compress'); }
    else { icon.classList.remove('fa-compress'); icon.classList.add('fa-expand'); }
}

function setAppHeight() {
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
}

function cleanTextForApiHistory(text: string): string {
    if (!text) return '';
    return text.replace(fuentesParaImagenesRegexGlobal, '').replace(userAttachmentMarkerRegexGlobal, '').trim();
}

function addMessageToChat(sender: 'user' | 'ai' | 'system' | 'error', text: string, options: { attachment?: { name: string; iconClass: string; }; idSuffix?: string; explicitId?: string; } = {}) {
    const message: Message = {
        id: options.explicitId || `${sender}-${Date.now()}${options.idSuffix ? '-' + options.idSuffix : ''}`,
        sender,
        text,
        timestamp: new Date(),
        attachment: options.attachment
    };
    chatMessages.push(message);
    renderMessages();
}

function finalizeAIMessage(aiMessage: Message, groundingMetadata?: GroundingMetadata) {
    const session = chatHistory.find(s => s.id === currentChatId);
    if (!session) return;
    const aiContent: StoredContent = { role: 'model', parts: [{ text: aiMessage.text }] };
    if (groundingMetadata) aiContent.groundingMetadata = groundingMetadata;
    session.messages.push(aiContent);
    session.lastActivity = new Date().toISOString();
    saveChatHistory();
    renderChatHistory();
}

async function checkMicrophonePermission() {
    if (!navigator.permissions) return;
    try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        const update = () => dictateBtn.disabled = permissionStatus.state === 'denied';
        update();
        permissionStatus.onchange = update;
    } catch (e) { dictateBtn.disabled = false; }
}

function loadChat(chatId: string) {
    if (isLoading) return;
    if (currentChatId && chatInput.value) { chatDrafts[currentChatId] = chatInput.value; saveChatDrafts(); }
    const session = chatHistory.find(s => s.id === chatId);
    if (!session) { displayInitialWelcomeMessage(); return; }

    currentChatId = chatId;
    chatMessages = [];

    session.messages.forEach(contentItem => {
        const textPart = contentItem.parts.find(p => 'text' in p) as Part | undefined;
        let messageText = textPart?.text ?? '';
        let attachmentInfo: { name: string; iconClass: string; } | undefined = undefined;
        const attachmentMatch = messageText.match(userAttachmentMarkerRegex);
        if (attachmentMatch) {
            const fileName = attachmentMatch[1];
            attachmentInfo = { name: fileName, iconClass: getFileIconClass('', fileName) };
            messageText = messageText.replace(userAttachmentMarkerRegex, '').trim();
        }
        const sender = contentItem.role === 'user' ? 'user' : 'ai';
        const message: Message = {
            id: `${sender}-hist-${Date.now()}-${Math.random()}`,
            sender: sender,
            text: messageText,
            timestamp: new Date(session.createdAt),
            attachment: attachmentInfo,
            groundingChunks: (contentItem.groundingMetadata?.groundingChunks ?? [])
                .filter(gc => gc.web?.uri)
                .map(gc => ({ web: { uri: gc.web!.uri!, title: gc.web?.title } }))
        };
        const fuentesMatch = message.text.match(fuentesParaImagenesRegex);
        if (fuentesMatch && fuentesMatch[2]) {
            message.externalImageLinks = [];
            const linksBlock = fuentesMatch[2];
            let linkMatch;
            const localLinkRegex = new RegExp(linkRegex.source, linkRegex.flags);
            while ((linkMatch = localLinkRegex.exec(linksBlock)) !== null) {
                message.externalImageLinks.push({ text: linkMatch[1], url: linkMatch[2] });
            }
            message.text = message.text.replace(fuentesParaImagenesRegex, '').trim();
        }
        chatMessages.push(message);
    });

    renderMessages();
    renderChatHistory();
    if (activeChatSessionTitleElement) activeChatSessionTitleElement.textContent = `${session.clientName}: ${session.topic}`;
    if (mainHeaderElement) mainHeaderElement.classList.remove('no-chat');
    chatInput.value = chatDrafts[chatId] || '';
    handleChatInput();

    const apiHistory: Content[] = session.messages.map(contentItem => ({
        role: contentItem.role,
        parts: [{ text: cleanTextForApiHistory((contentItem.parts[0] as Part).text || '') }]
    })).filter(item => (item.parts[0] as Part)?.text?.trim() !== '');

    currentChatSession = ai.chats.create({
        model: MODEL_NAME,
        history: apiHistory,
        config: { systemInstruction: session.systemInstruction, tools: [{ googleSearch: {} }] }
    });
    updateShareButtonState();
}

async function handleSendMessage() {
    if (isLoading) return;
    let promptText = chatInput.value.trim();
    if (/^(genera|crea|descarga|env[íi]a|m[áa]ndame)(me)? un pdf/i.test(promptText)) {
        await generatePdfOfLastMessage();
        chatInput.value = '';
        handleChatInput();
        return;
    }
    if (!promptText && !attachedFile) return;
    if (!currentChatId || !currentChatSession) {
        newChatModal.style.display = 'flex';
        clientNameInput.focus();
        return;
    }
    
    const session = chatHistory.find(s => s.id === currentChatId);
    if (!session) return;
    isLoading = true;

    const userMessageId = `user-${Date.now()}`;
    const parts: Part[] = [];
    let attachmentInfo: { name: string; iconClass: string } | undefined = undefined;
    let textForHistory = promptText;

    if (attachedFile) {
        if (!isFileTypeSupported(attachedFile)) {
            addMessageToChat('ai', "Formato de archivo no soportado.");
            removeAttachment();
            isLoading = false;
            return;
        }
        try {
            const filePart = await fileToGooglePart(attachedFile);
            parts.push(filePart);
            attachmentInfo = { name: attachedFile.name, iconClass: getFileIconClass(attachedFile.type, attachedFile.name) };
            textForHistory = textForHistory ? `${textForHistory}\n\n[Archivo adjuntado: ${attachedFile.name}]` : `[Archivo adjuntado: ${attachedFile.name}]`;
            if(!promptText) promptText = `Archivo '${attachedFile.name}' enviado.`;
        } catch (error) {
            addMessageToChat('error', "Error al procesar archivo.");
            removeAttachment();
            isLoading = false;
            return;
        }
    }
    
    if (promptText) parts.push({ text: promptText });
    addMessageToChat('user', promptText, { attachment: attachmentInfo, explicitId: userMessageId });
    const userContent: StoredContent = { role: 'user', parts: [{ text: textForHistory }] };
    session.messages.push(userContent);
    session.lastActivity = new Date().toISOString();
    saveChatHistory();
    chatInput.value = '';
    removeAttachment();
    handleChatInput();
    await sendPromptToAI(parts, userMessageId);
}

// --- NEW PROPOSAL CREATION LOGIC ---

async function handleCreateNewChatConfirm() {
    const clientName = clientNameInput.value.trim();
    const topic = topicInput.value.trim();
    const formContent = formContentInput.value.trim();
    const additionalInfo = additionalInfoInput.value.trim();

    if (!clientName || !topic) {
        alert("Por favor, ingrese el nombre del cliente y el tema.");
        return;
    }

    const now = new Date();
    const newSession: ChatSession = {
        id: `chat-${now.getTime()}`,
        title: `${clientName}: ${topic}`,
        clientName: clientName,
        topic: topic,
        createdAt: now.toISOString(),
        lastActivity: now.toISOString(),
        messages: [],
        systemInstruction: ALAIN_SYSTEM_INSTRUCTION,
    };

    chatHistory.unshift(newSession);
    saveChatHistory();
    newChatModal.style.display = 'none';

    // Clear inputs
    clientNameInput.value = '';
    topicInput.value = '';
    formContentInput.value = '';
    additionalInfoInput.value = '';
    modalFileInput.value = '';
    modalFilePreview.textContent = '';
    
    // Switch to new chat
    loadChat(newSession.id);
    
    // Construct the initial prompt for Proposal Generation
    let initialPrompt = `**SOLICITUD DE NUEVA PROPUESTA**\n\n`;
    initialPrompt += `**Cliente:** ${clientName}\n`;
    initialPrompt += `**Tema/Reto:** ${topic}\n`;
    if (formContent) initialPrompt += `**Datos del Formulario:**\n${formContent}\n\n`;
    if (additionalInfo) initialPrompt += `**Información Adicional:**\n${additionalInfo}\n\n`;
    initialPrompt += `\nPor favor, genera la propuesta completa ahora mismo siguiendo la estructura definida.`;

    const parts: Part[] = [];
    let attachmentInfo: { name: string; iconClass: string } | undefined = undefined;
    let textForHistory = initialPrompt;

    if (pendingModalFile) {
         if (isFileTypeSupported(pendingModalFile)) {
            try {
                const filePart = await fileToGooglePart(pendingModalFile);
                parts.push(filePart);
                attachmentInfo = { name: pendingModalFile.name, iconClass: getFileIconClass(pendingModalFile.type, pendingModalFile.name) };
                textForHistory += `\n\n[Archivo adjuntado: ${pendingModalFile.name}]`;
                initialPrompt += `\n(Se ha adjuntado el archivo de soporte: ${pendingModalFile.name})`;
            } catch(e) {
                console.error("Error attaching modal file", e);
            }
         }
         pendingModalFile = null; 
    }
    
    parts.push({ text: initialPrompt });

    addMessageToChat('user', `Generar propuesta para ${clientName}: ${topic}`, { attachment: attachmentInfo });
    
    const userContent: StoredContent = { role: 'user', parts: [{ text: textForHistory }] };
    newSession.messages.push(userContent);
    saveChatHistory();

    isLoading = true;
    await sendPromptToAI(parts, `user-init-${now.getTime()}`);
}

function handleModalFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        pendingModalFile = input.files[0];
        if (modalFilePreview) modalFilePreview.textContent = `Archivo seleccionado: ${pendingModalFile.name}`;
    } else {
        pendingModalFile = null;
        if (modalFilePreview) modalFilePreview.textContent = '';
    }
}

// --- Initialization ---

function initializeDictation() {
    if (!SpeechRecognition) { dictateBtn.style.display = 'none'; return; }
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-US';
    recognition.onstart = () => { isDictating = true; dictateBtn.classList.add('active'); dictateBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>'; };
    recognition.onend = () => { isDictating = false; dictateBtn.classList.remove('active'); dictateBtn.innerHTML = '<i class="fas fa-microphone"></i>'; handleChatInput(); };
    let final_transcript = '';
    recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) final_transcript += event.results[i][0].transcript;
            else interim += event.results[i][0].transcript;
        }
        chatInput.value = final_transcript + interim;
        handleChatInput();
    };
    dictateBtn.addEventListener('click', () => { if (isDictating) recognition.stop(); else { final_transcript = chatInput.value ? chatInput.value + ' ' : ''; recognition.start(); } });
}

function setupEventListeners() {
    if (sendBtn) sendBtn.addEventListener('click', handleSendMessage);
    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } });
        chatInput.addEventListener('input', handleChatInput);
    }
    if (sidebarToggle) sidebarToggle.addEventListener('click', () => document.body.classList.toggle('sidebar-closed'));
    if (newChatBtn) newChatBtn.addEventListener('click', () => { newChatModal.style.display = 'flex'; clientNameInput.focus(); });
    if (createChatConfirmBtn) createChatConfirmBtn.addEventListener('click', handleCreateNewChatConfirm);
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => newChatModal.style.display = 'none');
    newChatModal.addEventListener('click', (e) => { if (e.target === newChatModal) newChatModal.style.display = 'none'; });
    if (confirmDeleteChatBtnElement) confirmDeleteChatBtnElement.addEventListener('click', handleConfirmDeleteChat);
    if (cancelDeleteChatBtnElement) cancelDeleteChatBtnElement.addEventListener('click', closeDeleteConfirmModal);
    if (closeDeleteModalBtnElement) closeDeleteModalBtnElement.addEventListener('click', closeDeleteConfirmModal);
    deleteChatConfirmModalElement.addEventListener('click', (e) => { if (e.target === deleteChatConfirmModalElement) closeDeleteConfirmModal(); });
    if (chatSearchInput) chatSearchInput.addEventListener('input', (e) => renderChatHistory((e.target as HTMLInputElement).value));
    if (attachFileBtn) attachFileBtn.addEventListener('click', () => fileInput.click());
    if (fileInput) fileInput.addEventListener('change', (e) => { const files = (e.target as HTMLInputElement).files; if (files && files.length > 0) attachFile(files[0]); });
    if (modalFileInput) modalFileInput.addEventListener('change', handleModalFileSelect);
    if (shareBtn) shareBtn.addEventListener('click', () => shareDropdown.classList.toggle('show'));
    if (exportChatDropdownBtn) exportChatDropdownBtn.addEventListener('click', handleExportChat);
    if (importChatDropdownBtn) importChatDropdownBtn.addEventListener('click', () => importChatInput.click());
    if (importChatInput) importChatInput.addEventListener('change', handleImportFileSelect);
    if (themeToggleBtn) themeToggleBtn.addEventListener('click', cycleTheme);
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullScreen);
    document.addEventListener('fullscreenchange', updateFullscreenIcon);
    window.addEventListener('resize', setAppHeight);
    window.addEventListener('click', (e) => { if (shareContainer && !shareContainer.contains(e.target as Node)) shareDropdown.classList.remove('show'); });
    mainContentDiv.addEventListener('dragover', (e) => { e.preventDefault(); e.stopPropagation(); mainContentDiv.classList.add('dragover'); });
    mainContentDiv.addEventListener('dragleave', (e) => { e.preventDefault(); e.stopPropagation(); mainContentDiv.classList.remove('dragover'); });
    mainContentDiv.addEventListener('drop', (e) => { e.preventDefault(); e.stopPropagation(); mainContentDiv.classList.remove('dragover'); if (e.dataTransfer && e.dataTransfer.files.length > 0) attachFile(e.dataTransfer.files[0]); e.dataTransfer.clearData(); });
}

function initializeApp() {
    setAppHeight();
    loadChatHistory();
    loadChatDrafts();
    const savedTheme = localStorage.getItem('theme') as 'system' | 'light' | 'dark' | null;
    applyTheme(savedTheme || 'system');
    const userChats = chatHistory.filter(s => s.type !== 'fixed');
    if (userChats.length > 0) {
        const sortedUserChats = userChats.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
        loadChat(sortedUserChats[0].id);
    } else {
        displayInitialWelcomeMessage();
    }
    setupEventListeners();
    initializeDictation();
    checkMicrophonePermission();
    updateFullscreenIcon();
    renderChatHistory();
}

initializeApp();
