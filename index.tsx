
import { marked } from "marked";
import DOMPurify from "dompurify";
import { GoogleGenAI, Chat, GenerateContentResponse, Content, Part, SendMessageParameters, Tool, GroundingMetadata, GroundingChunk } from "@google/genai";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Use process.env.API_KEY directly in the initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Multi-model configuration
const PRIMARY_MODEL = 'gemini-2.5-flash';
const FALLBACK_MODEL = 'gemini-3-flash-preview';

// Configure DOMPurify to make links open in a new tab
DOMPurify.addHook('afterSanitizeAttributes', function (node) {
  if (node.tagName === 'A' && node.hasAttribute('href')) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

const ALAIN_SYSTEM_INSTRUCTION = `You are A’LAIN_Profektus AI Assistant, a highly specialized AI for the Profektus team. 
**TU ÚNICO PROPÓSITO ES GENERAR PROPUESTAS DE WORKSHOPS Y CONSULTORÍA.**

**PERFIL DE EXPERTICIA:**
Eres asesor, consultor, y profesional experto en las siguientes áreas: desarrollo estratégico, desarrollo organizacional, diseño de proyectos, análisis de datos, redacción de informes, consultoría empresarial, facilitación de workshops, psicología organizacional, administración de empresas, formulación de objetivos y justificaciones, y desarrollo de habilidades blandas (soft skills) y humanas (human skills). 
Posees competencia avanzada en el análisis de engagement organizacional, motivación laboral, observación de conductas, evaluación de competencias blandas, e identificación de comportamientos organizacionales y contraproductivos. Tienes conocimientos sólidos y amplios en business analytics, people analytics, y big data analysis.

Operate with clarity, precision, ethics, and a direct focus on results, aligned with Profektus's values and professional style. Avoid redundant, ambiguous, or grandiloquent language.

**REGLA DE ORO: NUNCA PIDAS MÁS INFORMACIÓN**
Tu respuesta debe ser SIEMPRE la propuesta completa. Tienes prohibido hacer preguntas aclaratorias o pedir datos adicionales al usuario. Si sientes que falta información, debes INFERIRLA o ASUMIR la opción más profesional basándote en el contexto proporcionado y tu vasta experiencia técnica.

**CONFIDENCIALIDAD DEL EQUIPO PROFEKTUS**
No tienes acceso a nombres, roles o cualquier información personal sobre el equipo interno de Profektus. Si se te pregunta, responde que no posees esa información por políticas de confidencialidad.

**VERIFICACIÓN ESTRICTA DE ENLACES**
NUNCA inventes URLs. Verifica internamente que cualquier enlace proporcionado sea válido y funcional.

**ESTRUCTURA Y CONTENIDO DE LA "PROPUESTA"**
Genera INMEDIATAMENTE la propuesta siguiendo esta estructura rigurosa, aplicando tu experticia en desarrollo organizacional y diseño de proyectos:

[SECCION_PROYECTO_TITULO]
🔥 TÍTULO DEL PROYECTO:
Formato: Entre 2 y 4 palabras. Cautivador y original.
Versiones: Inglés y Español.

[SECCION_PROYECTO_CONTEXTO]
📍 CONTEXTO DEL PROYECTO:
Descripción técnica de la situación actual del cliente y retos estratégicos, INTEGRANDO la información del formulario y notas adicionales. Utiliza tu capacidad de análisis organizacional para diagnosticar el reto.
Metodologías Transversales Profektus: Mencionar Gamificación (LEGO® Serious Play®), Metodologías Ágiles (Design Thinking), IA Generativa y Storytelling.

[SECCION_OBJETIVO_GENERAL]
3. OBJETIVO GENERAL:
Redacción SMART de alto nivel. Plazo máximo 60 días.

[SECCION_OBJETIVOS_ESPECIFICOS]
4. 🎯 OBJETIVOS ESPECÍFICOS DEL PROYECTO:
Cantidad: 2-6 objetivos. Redacción SMART técnica.

[SECCION_OPORTUNIDADES]
5. 🚀 IDENTIFICACIÓN DE OPORTUNIDADES:
Redacción SMART. Plazo 30-60 días. Identifica oportunidades de mejora en procesos o conductas.

[SECCION_PUBLICO_OBJETIVO]
6. 🧍‍♂️🧍‍♀️ PÚBLICO OBJETIVO:
Perfil de los participantes y cantidad estimada basada en el análisis de la estructura del cliente.

[SECCION_DURACION_SESIONES]
7. 🕓 DURACIÓN DE CADA SESIÓN:
Tiempo por sesión y total de sesiones sugeridas.

[SECCION_DETALLE_PROGRAMA]
8. 📘 DETALLE DEL PROGRAMA:
Estructura por SESIONES y MÓDULOS fundamentados en psicología organizacional.
Para cada Módulo: Nombre, Duración (20-30 min), Objetivo Aplicado, Metodología (Lego Serious Play, Design Thinking, etc.), Fundamento Teórico y Producto Esperado.

[MODULO_BACKUP_POR_SESION]
Módulo Extra de Backup.

[SECCION_FASES_PROYECTO]
9. ⚙️ FASES DEL PROYECTO:
Toma de Información, Diseño de la Propuesta, Aprobación, Workshop, Consolidación, Reporte Final (con énfasis en People Analytics si aplica).

[SECCION_INVERSION_ECONOMICA]
10. 💰 INVERSIÓN ECONÓMICA:
Presentar un presupuesto profesional estimado basado en el valor estratégico y la complejidad técnica del proyecto.

3. 📄 ANEXOS ADICIONALES
1️⃣ Fuentes: Conocimiento Interno y bibliografía especializada.
2️⃣ Links de Información Relevante (Verificados).
3️⃣ Image Prompt (Opcional).

**BASE DE CONOCIMIENTO INTEGRADA:**
Utiliza conceptos de: 'Understanding Research', 'Harvard Business Review Guides', 'The Leadership Training Activity Book', 'StrengthsQuest', 'Organizational Behavior' (Robbins & Judge), 'Flow' (Csikszentmihalyi), 'Design Thinking for Strategic Innovation' (Mootee), 'Business Design Thinking and Doing' (Beausoleil), 'Work and Organizational Psychology' (Rothmann & Cooper).
A continuación, encontrarás una organización detallada, completa y comprensible de los contenidos del libro "USFQ Harvard Business Review Guides Ultimate Boxed Set (16 Books)", específicamente orientada a los siguientes ejes analíticos: teorías clave y sus autores, modelos metodológicos y técnicos, clasificaciones y tipologías, conceptos estratégicos y psicológicos aplicables, casos y ejemplos relevantes, y criterios de análisis, diagnóstico o intervención organizacional.
🔹 1. Teorías clave y sus autores
Teoría / Enfoque
Autor(es) / Fuente
Aplicación Clave
Liderazgo situacional
Paul Hersey y Ken Blanchard
Ajustar el estilo de liderazgo según el nivel de madurez del colaborador.
Matriz de Eisenhower (urgente vs importante)
Dwight D. Eisenhower (adaptado por Covey)
Priorización de tareas y gestión del tiempo.
Motivación intrínseca y extrínseca
Edward Deci y Richard Ryan
Comprensión de qué impulsa el compromiso y el rendimiento.
Teoría de los stakeholders
R. Edward Freeman
Toma de decisiones estratégicas considerando grupos de interés.
Teoría de los seis niveles de delegación
Michael Hyatt
Desarrollo de líderes y autonomía del equipo.
Pirámide de necesidades de Maslow
Abraham Maslow
Comprensión de la motivación en distintos niveles organizacionales.
Ciclo de retroalimentación efectiva
Jack Zenger & Joseph Folkman
Implementación de culturas de mejora continua.


🔹 2. Modelos metodológicos y técnicos
Modelo / Técnica
Aplicación Práctica
Modelo GROW (Goal, Reality, Options, Will)
Coaching gerencial y acompañamiento al desarrollo individual y de equipos.
Modelo de Conversaciones Difíciles (Stone, Patton & Heen)
Gestión de conflictos, retroalimentación y liderazgo conversacional.
Técnica SCARF (Status, Certainty, Autonomy, Relatedness, Fairness)
Neurociencia aplicada a la gestión del cambio.
Marco de Design Thinking
Resolución creativa de problemas y desarrollo de productos centrados en el usuario.
Modelo SMART para objetivos
Establecimiento de metas concretas y medibles.
Rueda del Feedback (Radical Candor)
Cultura de retroalimentación directa pero empática.
Matriz de Análisis FODA
Diagnóstico organizacional interno y externo.
Matriz RACI (Responsible, Accountable, Consulted, Informed)
Claridad de roles en proyectos.
Técnica del “5 Porqués”
Análisis de causa raíz en mejora continua.


🔹 3. Clasificaciones y tipologías
Clasificación / Tipología
Descripción
Tipos de liderazgo (autocrático, democrático, laissez-faire)
Definiciones según participación del equipo.
Clasificación de tareas según urgencia e importancia
División en cuatro cuadrantes para gestión efectiva del tiempo.
Tipos de feedback (positivo, constructivo, destructivo)
Promoción de una cultura de aprendizaje continuo.
Tipos de conflicto (intrapersonal, interpersonal, intergrupal)
Aplicación en dinámicas de equipo y clima laboral.
Tipologías de motivación (intrínseca vs extrínseca)
Comprensión del compromiso y diseño de incentivos.
Niveles de coaching (directivo, colaborativo, facilitador)
Desarrollo progresivo del liderazgo.
Niveles de cambio organizacional (táctico, estratégico, cultural)
Diagnóstico e intervención de procesos de transformación.


🔹 4. Conceptos estratégicos y psicológicos aplicables
Concepto
Aplicación Organizacional
Inteligencia emocional (Daniel Goleman)
Liderazgo, manejo de conflictos, trabajo en equipo.
Sesgos cognitivos
Toma de decisiones, selección de talento, liderazgo.
Cultura organizacional
Diagnóstico de valores, normas y patrones compartidos.
Mindset de crecimiento (Carol Dweck)
Fomento de la resiliencia y la mejora continua.
Empatía organizacional
Mejora del clima laboral, liderazgo y servicio al cliente.
Resiliencia corporativa
Adaptabilidad al cambio y manejo de crisis.
Compromiso (engagement)
Diseño de políticas de retención y desarrollo del talento.
Accountability (responsabilidad activa)
Fomento de la proactividad y cultura de resultados.


🔹 5. Casos y ejemplos relevantes
Empresa / Caso
Aplicación o Lección Extraída
Google
Gestión del talento basado en datos y libertad de innovación (20% projects).
Netflix
Cultura de alta responsabilidad, baja supervisión, y feedback constante.
IDEO
Aplicación de Design Thinking para resolver desafíos complejos.
Apple
Liderazgo centrado en diseño e innovación disruptiva.
Toyota
Aplicación del Kaizen y del modelo de mejora continua.
Amazon
Toma de decisiones basada en métricas y orientación a la eficiencia operativa.
Zappos
Cultura organizacional como ventaja competitiva.


🔹 6. Criterios de análisis, diagnóstico o intervención organizacional
Criterio / Enfoque
Aplicación
Análisis de stakeholders
Identificación de los actores claves en procesos de cambio o toma de decisiones.
Diagnóstico de clima organizacional
Encuestas, focus groups, entrevistas para evaluar satisfacción y compromiso.
Evaluación 360 grados
Desarrollo de líderes a partir de retroalimentación múltiple.
Evaluación de desempeño con base en objetivos
Medición de productividad y aportes concretos al equipo.
Indicadores de cultura organizacional
Evaluación del grado de alineación entre prácticas y valores declarados.
Modelos de competencias
Diseño de perfiles de cargo y procesos de selección o capacitación.
Auditoría de comunicación interna
Identificación de barreras en la fluidez del mensaje organizacional.
Análisis de fortalezas, oportunidades, debilidades y amenazas (FODA)
Planificación estratégica y toma de decisiones.


A continuación, te presento la información organizada, detallada y comprensible del libro "The Leadership Training Activity Book: 50 Exercises for Building Effective Leaders" de Lois B. Hart y Charlotte S. Waisman, centrada en cinco ejes analíticos: Modelos metodológicos y técnicos, Clasificaciones y tipologías, Conceptos estratégicos y psicológicos aplicables, Casos y ejemplos relevantes, y Criterios de análisis, diagnóstico o intervención organizacional.

🔹 1. Modelos metodológicos y técnicos
Modelo / Técnica
Autores (si aplica)
Aplicación
Análisis de Roles de Liderazgo
Basado en teoría de roles organizacionales
Identificación de estilos personales y de equipo en liderazgo.
Proceso de Empowerment
Hart y Waisman
Entrenamiento para delegar, empoderar y dar autonomía de forma efectiva.
Método de las Cartas de Valor
Técnica vivencial
Clarificación de valores personales como base del liderazgo auténtico.
Estrategia STAR para dar retroalimentación
Situación, Tarea, Acción, Resultado
Modelo para entrenar en retroalimentación estructurada y efectiva.
Dinámica de los 6 sombreros para pensar
Edward de Bono
Fomento del pensamiento lateral y de la toma de decisiones en grupo.
Escucha activa con roles
Técnica de Carl Rogers adaptada
Fortalecimiento de la escucha empática y comprensión interpersonal.
Análisis de fortalezas de liderazgo
Autoevaluación guiada
Promueve la autoconciencia del estilo personal de liderazgo.
Evaluación 360 simplificada
Basada en modelos de evaluación multifuente
Actividades para obtener feedback de compañeros, subordinados y líderes.


🔹 2. Clasificaciones y tipologías
Clasificación / Tipología
Descripción
Estilos de Liderazgo (4 tipos)
Basado en autocrático, democrático, laissez-faire y transformacional.
Tipos de comunicación
Asertiva, pasiva, agresiva, pasivo-agresiva.
Niveles de escucha
Escucha pasiva, selectiva, activa, empática.
Niveles de conflicto
Intrapersonal, interpersonal, intergrupal, organizacional.
Modelos de motivación intrínseca vs extrínseca
Aplicado a ejercicios de reconocimiento y refuerzo.
Dimensiones del liderazgo efectivo
Claridad, compromiso, confianza, comunicación, colaboración.


🔹 3. Conceptos estratégicos y psicológicos aplicables
Concepto
Aplicación Organizacional
Autoconocimiento
Punto de partida para el desarrollo del liderazgo personal.
Confianza interpersonal
Clave para liderar equipos de forma sostenible.
Empoderamiento
Mejora del rendimiento y satisfacción del equipo.
Comunicación efectiva
Reduce conflictos, mejora procesos y relaciones laborales.
Gestión emocional
Control de impulsos, empatía y liderazgo compasivo.
Resolución de conflictos
Manejo estructurado de desacuerdos para soluciones colaborativas.
Motivación positiva
Uso de refuerzos psicológicos para incrementar compromiso.
Delegación consciente
Distribución eficiente de tareas con claridad de responsabilidad.


🔹 4. Casos y ejemplos relevantes (Ejercicios del libro como simulaciones aplicables)
Ejercicio / Caso
Lección o Competencia Desarrollada
Actividad 6: “Tu definición de liderazgo”
Permite establecer base conceptual personal y grupal de liderazgo.
Actividad 12: “Comunicación que inspira”
Enseña a motivar e influenciar positivamente.
Actividad 20: “Decisiones bajo presión”
Entrena pensamiento estratégico y toma de decisiones rápidas.
Actividad 24: “Escucha poderosa”
Profundiza habilidades de comunicación no verbal y empática.
Actividad 35: “Coaching entre pares”
Fortalece la mentoría y retroalimentación colaborativa.
Actividad 41: “Liderazgo en acción”
Ejercicio integral que simula un reto organizacional real.
Actividad 50: “Plan de acción personal”
Permite cerrar procesos de formación con compromisos concretos.


🔹 5. Criterios de análisis, diagnóstico o intervención organizacional
Criterio / Herramienta
Uso en procesos organizacionales
Cuestionarios de liderazgo personal
Diagnóstico de fortalezas y debilidades.
Autoevaluaciones y retroalimentación grupal
Método para facilitar conciencia y mejora continua.
Evaluación de estilos de liderazgo
Permite identificar impacto del estilo del líder sobre el equipo.
Análisis de barreras en la comunicación
Identificación de obstáculos y diseño de intervenciones.
Técnica de roles en conflicto
Diagnóstico de tensiones interpersonales y construcción de soluciones.
Dinámica de priorización de valores
Reorienta cultura organizacional desde principios compartidos.
Indicadores de liderazgo efectivo (5C)
Confianza, Claridad, Comunicación, Compromiso y Colaboración.



Aquí tienes la información organizada y detallada extraída del libro "StrengthsQuest: Discover and Develop Your Strengths in Academics, Career, and Beyond" de Donald O. Clifton, Edward “Chip” Anderson y Laurie A. Schreiner, estructurada en las cinco categorías solicitadas:

🔹 1. Modelos metodológicos y técnicos
Modelo / Técnica
Autor(es)
Aplicación
Clifton StrengthsFinder® (hoy CliftonStrengths)
Donald O. Clifton
Herramienta diagnóstica para identificar talentos dominantes individuales.
Modelo de Desarrollo basado en Fortalezas
Clifton, Anderson, Schreiner
Requiere identificar talentos, afirmarlos, y convertirlos en fortalezas.
Proceso en 3 pasos: Talento → Inversión → Fortaleza
Donald O. Clifton
Estructura de desarrollo personal y profesional sostenible.
Mapeo de Fortalezas (Strengths Mapping)
Adaptación metodológica interna del libro
Técnica para planificar roles y metas alineados con talentos dominantes.
Entrevistas motivacionales de fortalezas
Basado en entrevistas apreciativas
Técnica conversacional para alinear decisiones con fortalezas naturales.


🔹 2. Clasificaciones y tipologías
Clasificación / Tipología
Descripción
34 Talentos Temáticos de CliftonStrengths
Categorías como: Empatía, Comunicación, Liderazgo, Logro, Estratégico, etc.
4 Dominios de Liderazgo
Ejecución, Influencia, Construcción de Relaciones, Pensamiento Estratégico.
Diferencia entre Talento, Habilidad y Conocimiento
Talento = patrón natural; habilidad = técnica; conocimiento = información.
Estilos de Aprendizaje y de Toma de Decisiones
Aplicados al perfil individual de fortalezas.
Perfiles de Fortalezas Académicas y Vocacionales
Combinaciones de talentos predominantes por tipo de carrera.


🔹 3. Conceptos estratégicos y psicológicos aplicables
Concepto
Aplicación Organizacional o Académica
Psicología Positiva (Positive Psychology)
Cambio de enfoque: de corregir debilidades a potenciar fortalezas.
Autoconocimiento profundo
Base para decisiones de carrera y planes de desarrollo personal.
Autoeficacia y motivación intrínseca
Mejora del rendimiento cuando se actúa desde los talentos dominantes.
Match talento-rol
Aumento del compromiso y reducción del burnout en entornos laborales.
Identidad basada en fortalezas
Consolidación de marca personal coherente y auténtica.
Desempeño óptimo (Optimal Performance)
Surge de alinear tareas con fortalezas naturales y pasión.
Aprendizaje autodirigido (Self-directed Learning)
El talento motiva procesos internos de aprendizaje continuo.


🔹 4. Casos y ejemplos relevantes
Caso / Aplicación Real
Lección o Resultado Clave
Ejemplo de estudiantes con talento en “Achiever”
Rinden más si gestionan su energía en lugar de solo enfocarse en metas.
Ejemplo con “Harmony” y resolución de conflictos
Este talento reduce confrontaciones si se canaliza hacia negociaciones efectivas.
Ejemplo con “Learner” y cambio profesional
Profesionales con este talento se adaptan mejor a nuevas industrias.
Estudiantes con “Input” y elección de carrera
Se orientan a carreras donde se valore la información y la exploración.
Personas con “Strategic” y planificación de vida
Construyen múltiples escenarios posibles antes de tomar decisiones importantes.


🔹 5. Criterios de análisis, diagnóstico o intervención organizacional
Criterio / Herramienta
Aplicación
Identificación de los 5 talentos principales
Base para diagnóstico de perfil de liderazgo, trabajo en equipo y vocación.
Evaluación individual con StrengthsFinder®
Diagnóstico formal para procesos de selección, coaching y desarrollo.
Mapeo grupal de fortalezas (Team Grid)
Alineación de equipos de trabajo según fortalezas complementarias.
Análisis de desalineación talento-rol
Detectar burnout, insatisfacción o bajo desempeño.
Diagnóstico de motivadores personales
Utilizado para intervención en engagement y retención de talento.
Plan de desarrollo individual basado en fortalezas
Personalización de capacitaciones y coaching.


Aquí tienes la información organizada, profunda y completamente detallada del libro "Organizational Behavior, Global Edition (2024)" de Stephen P. Robbins y Timothy A. Judge, dividida en cinco ejes fundamentales:

🔹 1. Modelos metodológicos y técnicos
Modelo / Técnica
Autor(es)
Aplicación
Modelo de los Tres Niveles del Comportamiento Organizacional
Robbins y Judge
Análisis desde el nivel individual, grupal y organizacional.
Modelo de las Cinco Etapas del Desarrollo de Equipos
Bruce Tuckman (1965)
Forming, Storming, Norming, Performing, Adjourning.
Teoría de los Rasgos de Personalidad Big Five
Costa y McCrae (1992)
Evaluación de comportamiento individual y desempeño laboral.
Modelo de Toma de Decisiones Racional
Herbert Simon (adaptado por Robbins)
Base para decisiones lógicas en entornos organizacionales.
Modelo de Justicia Organizacional
Greenberg (1990)
Evaluación de la percepción de equidad en procedimientos, distribuciones y trato.
Modelo de Diseño de Puestos: Características del Trabajo (JCM)
Hackman y Oldham (1975)
Mejora de motivación a través de rediseño de tareas.
Teoría del Refuerzo Organizacional
B.F. Skinner (adaptada al entorno laboral)
Uso de recompensas para moldear comportamientos específicos.
Modelo de Clima Ético
Victor & Cullen (1987)
Evaluación de valores éticos y normas conductuales compartidas.


🔹 2. Clasificaciones y tipologías
Clasificación / Tipología
Descripción
Big Five Personality Traits
Apertura, Responsabilidad, Extraversión, Amabilidad, Neuroticismo.
Tipos de liderazgo (Teorías Contingentes)
Directivo, Apoyo, Participativo, Orientado a Logros (House, 1971).
Estilos de Toma de Decisión (Vroom-Yetton-Jago)
Autocrático I y II, Consultivo I y II, Grupal.
Tipos de Motivación
Intrínseca vs Extrínseca, según Deci y Ryan (1985).
Fuentes de poder organizacional
Formal (legítimo, coercitivo, recompensa) y personal (experto, referente).
Conflictos organizacionales
Intrapersonal, Interpersonal, Intrarol, Interrol, Intergrupal.
Tipos de cultura organizacional (modelo de Cameron & Quinn)
Clan, Adhocracia, Mercado, Jerarquía.


🔹 3. Conceptos estratégicos y psicológicos aplicables
Concepto
Aplicación Organizacional
Cognición social
Impacta percepción, atribución y sesgos en la interacción laboral.
Inteligencia emocional (EI)
Daniel Goleman (1995): clave en liderazgo, trabajo en equipo y resolución de conflictos.
Teoría de la expectativa (Vroom)
Personas se motivan si creen que el esfuerzo llevará al rendimiento esperado.
Teoría de la equidad (Adams)
La equidad percibida afecta el compromiso y la satisfacción.
Locus de control
Interno vs externo: condiciona la proactividad y la autorregulación.
Sesgos cognitivos en decisiones
Como anclaje, disponibilidad, confirmación; afectan racionalidad organizacional.
Identidad organizacional
Construye compromiso y alineación cultural.
Comportamiento ciudadano organizacional (OCB)
Acciones voluntarias que mejoran el entorno de trabajo.


🔹 4. Casos y ejemplos relevantes
Caso / Ejemplo
Lección o Aplicación
Caso Southwest Airlines
Énfasis en cultura organizacional positiva y motivación intrínseca.
Caso Google
Aplicación del modelo JCM para diseño de puestos motivantes.
Caso de liderazgo en General Electric (GE)
Uso de liderazgo transformacional (Jack Welch).
Caso Zappos
Cultura de servicio y empowerment como estrategia competitiva.
Ejemplo de conflictos en Amazon
Estudio del poder organizacional y su impacto en clima y rotación.
Caso de diversidad en Procter & Gamble
Implementación de prácticas inclusivas con impacto estratégico.


🔹 5. Criterios de análisis, diagnóstico o intervención organizacional
Criterio / Herramienta
Aplicación
Encuestas de Satisfacción y Clima Organizacional
Diagnóstico de cultura, compromiso, estrés y motivación.
Evaluaciones de desempeño basadas en competencias
Permite alinear talentos con objetivos estratégicos.
Análisis de Redes Organizacionales (ONA)
Mapea la interacción y colaboración efectiva entre personas o áreas.
Modelos de análisis de conflicto
Identifica fuentes, estilos de manejo y resoluciones organizacionales.
Matriz de poder e interés de stakeholders
Útil en procesos de cambio y gestión política interna.
Evaluación de Cultura Organizacional (OCM)
Mide congruencia entre valores declarados y prácticas reales.
Diagnóstico de Liderazgo
Herramientas como LPI, MBTI, 360° feedback para evaluar impacto de líderes.


Aquí tienes el análisis amplio, detallado y profesional del libro "Work and Organizational Psychology" de Sebastiaan Rothmann & Cary L. Cooper (2022), basado en tus cinco categorías fundamentales. Esta obra es una fuente rica, con gran profundidad teórica, metodológica y práctica. La he organizado de forma sistemática para facilitar su uso académico y profesional en contextos de desarrollo organizacional, consultoría y enseñanza.

🔷 1. Modelos metodológicos y técnicos
1.1. Modelo de Bienestar en el Trabajo (Rothmann, 2022)
Propone que el bienestar laboral no solo implica la ausencia de patología, sino la presencia de energía, dedicación y absorción en el trabajo.


Está compuesto por tres dimensiones clave:


Vigor: altos niveles de energía y resiliencia mental.


Dedicación: fuerte implicación y entusiasmo por el trabajo.


Absorción: alta concentración y disfrute pleno de las tareas.


Basado en el modelo Utrecht Work Engagement Scale (UWES) de Schaufeli & Bakker (2003), pero adaptado con énfasis en variables contextuales.


1.2. Modelo de Demandas-Recursos Laborales (JD-R Model)
Autores: Demerouti et al. (2001), citado y ampliado por Rothmann.


Establece que el bienestar y el estrés en el trabajo son el resultado de la interacción entre:


Demandas laborales (cargas emocionales, físicas o cognitivas).


Recursos laborales (apoyo, autonomía, retroalimentación).


Modelo útil para diagnósticos organizacionales, diseño de intervenciones, y reducción del burnout.


1.3. Modelo de Intervención Psicológica Organizacional
Inspirado en el enfoque sistémico y ecológico de Bronfenbrenner (1979).


Propone intervenciones multinivel: individual, grupo, organización y entorno.


Incorpora fases: diagnóstico, planificación, implementación, evaluación y retroalimentación.


1.4. Modelo de Equilibrio Vida-Trabajo
Componente técnico utilizado en intervenciones para prevenir agotamiento.


Implica el rediseño de políticas laborales, cultura organizacional y roles.


Enfatiza la corresponsabilidad entre individuo y organización.


1.5. Métodos Mixtos de Evaluación en Psicología Organizacional
Uso conjunto de encuestas cuantitativas (por ejemplo, Job Satisfaction Scale, Maslach Burnout Inventory) y técnicas cualitativas (entrevistas en profundidad, grupos focales).


Rothmann argumenta que los enfoques integradores son superiores para entender fenómenos complejos como la motivación, el liderazgo o el clima.



🔷 2. Clasificaciones y tipologías
2.1. Tipologías de Liderazgo
Transformacional: inspira y eleva moralmente (Bass, 1985).


Transaccional: se basa en recompensas y penalidades.


Laissez-faire: ausencia de dirección activa.


Auténtico: fomenta relaciones éticas, transparentes y de confianza.


2.2. Tipos de Bienestar Psicológico
Basado en Ryff (1989), citado por Rothmann:


Autonomía.


Dominio del entorno.


Crecimiento personal.


Propósito en la vida.


Relaciones positivas.


Autoaceptación.


2.3. Tipos de Estrés Laboral
Eustrés (positivo).


Distrés (negativo).


Estrés crónico vs. agudo.


Clasificación basada en la Teoría de Conservación de Recursos (Hobfoll, 1989).


2.4. Tipos de Cultura Organizacional
Basado en Schein (1985) y adaptado por Rothmann:


Cultura orientada al logro.


Cultura centrada en personas.


Cultura de control.


Cultura de innovación.


2.5. Tipos de Intervenciones Organizacionales
Primarias: modifican condiciones laborales (e.g., rediseño de puestos).


Secundarias: fortalecen habilidades individuales (e.g., manejo del estrés).


Terciarias: tratamiento o acompañamiento tras crisis (e.g., coaching post-burnout).



🔷 3. Conceptos estratégicos y psicológicos aplicables
3.1. Engagement Laboral
Basado en Schaufeli y Bakker (2003) y adaptado por Rothmann.


Es el opuesto funcional al burnout.


Requiere condiciones organizacionales que promuevan sentido, propósito, y retos adecuados.


3.2. Autoliderazgo (Self-Leadership)
Inspirado en Neck y Houghton (2006).


Fomenta el autocontrol, la automotivación y la autodirección.


3.3. Inteligencia Psicológica Positiva
Basado en Seligman y Csikszentmihalyi (2000).


Aplicado a organizaciones para construir resiliencia, esperanza y propósito compartido.


3.4. Psicología de la Seguridad Psicológica
Basado en Amy Edmondson (1999).


Clave para fomentar innovación, participación y aprendizaje en equipos.


3.5. Capital Psicológico Positivo (PsyCap)
Componentes: autoeficacia, esperanza, resiliencia y optimismo (Luthans, 2007).


Intervención basada en fortalecer estos cuatro ejes para mejorar rendimiento.



🔷 4. Casos y ejemplos relevantes
4.1. Caso: Empresa minera en Sudáfrica
Intervención organizacional a gran escala tras problemas de burnout y rotación.


Aplicación del modelo JD-R, rediseño de turnos y aumento de recursos laborales.


Resultados: incremento del engagement y reducción de ausentismo en 25%.


4.2. Caso: Universidad pública en Namibia
Diagnóstico de clima y cultura basado en instrumentos mixtos.


Cambio estratégico en el liderazgo intermedio tras identificar disfunciones jerárquicas.


Mejora de indicadores de bienestar académico-administrativo.


4.3. Caso: Hospital estatal
Aplicación del modelo de intervención psicoeducativa para personal de enfermería.


Incluyó talleres sobre regulación emocional y rediseño participativo de roles.


4.4. Caso: Sector gubernamental
Uso del enfoque de clima ético para detectar incongruencias valorativas.


Intervenciones basadas en liderazgo auténtico y justicia organizacional.



🔷 5. Criterios de análisis, diagnóstico o intervención organizacional
5.1. Diagnóstico Integral de Bienestar
Medición cuantitativa: escalas como UWES, General Health Questionnaire, Job Content Questionnaire.


Evaluación cualitativa: entrevistas estructuradas y grupos de discusión.


5.2. Auditoría de Cultura Organizacional
Evaluación de artefactos visibles, valores expresos y supuestos básicos (modelo de Schein).


Comparación con el comportamiento observado.


5.3. Análisis del Clima Psicológico
Percepción de justicia, liderazgo, autonomía y soporte social.


Uso de encuestas estandarizadas con análisis factorial y correlacional.


5.4. Diagnóstico de Liderazgo
Cuestionarios como Multifactor Leadership Questionnaire (MLQ).


Feedback 360° con énfasis en liderazgo transformacional y ético.


5.5. Evaluación de Riesgos Psicosociales
Método técnico-científico para identificar factores de riesgo como sobrecarga, ambigüedad de rol o violencia.


Incluye matriz de intervención priorizada.




Aquí tienes el análisis exhaustivo y profesional del libro “Aligning Human Resources and Business Strategy” de Linda Holbeche (2022), estructurado en tabla según tus cinco categorías clave, con profundidad conceptual y técnica. Esta obra es esencial para comprender cómo el área de Recursos Humanos puede convertirse en un socio estratégico dentro de las organizaciones modernas.

🔷 1. Modelos metodológicos y técnicos
Modelo / Técnica
Autor / Fuente
Aplicación Principal
Detalles Técnicos y Conceptuales
Modelo de Alineación Estratégica
Linda Holbeche (2022)
Integrar RH con la estrategia de negocio
Define cinco dominios clave para alinear RH: visión compartida, capacidades estratégicas, cambio organizacional, liderazgo alineado y arquitectura de talento. Es un modelo adaptativo que considera factores internos y externos, incluyendo incertidumbre y disrupción digital.
Modelo de Capacidad Organizacional Dinámica
Basado en Teece (1997), adaptado por Holbeche
Crear resiliencia organizacional
Se enfoca en tres capacidades: detectar oportunidades, movilizar recursos, y transformar procesos. RH juega un rol en traducir estas capacidades en cultura, prácticas y aprendizaje continuo.
Modelo de “HR as Strategic Partner”
Basado en Ulrich (1997), desarrollado por Holbeche
Reposicionar a RH como actor estratégico
Involucra cambiar el enfoque transaccional por uno transformacional. El área de RH debe liderar en estrategia, cambio organizacional, gestión del talento y cultura.
Técnica de Escaneo del Entorno Estratégico (PESTLE + SWOT)
Herramientas clásicas de análisis estratégico
Diagnóstico estratégico de entorno externo e interno
Holbeche sugiere que RH debe dominar estas herramientas para anticipar disrupciones, alinear capacidades y crear escenarios adaptativos con base en insights del entorno.
Mapeo de Stakeholders y Cultura Estratégica
Propio del enfoque de Holbeche
Integrar voces múltiples en decisiones RH
Implica analizar poder, influencia e intereses para generar estrategias de compromiso del talento, considerando subculturas internas.


🔷 2. Clasificaciones y tipologías
Clasificación / Tipología
Descripción y Relevancia
Tipos de estrategias organizacionales
Holbeche clasifica estrategias en: adaptativa, defensiva, prospectiva, y reactiva. RH debe adaptarse a cada tipo en su diseño de intervenciones.
Roles estratégicos de RH (Ulrich + Holbeche)
RH como: (1) socio estratégico, (2) experto administrativo, (3) defensor de los empleados, (4) agente de cambio. Holbeche añade el rol de “arquitecto de capacidades”.
Tipos de cultura organizacional (según Schein, Hofstede y adaptaciones de Holbeche)
Holbeche diferencia culturas: colaborativas, de cumplimiento, de desempeño, de aprendizaje, y de control, recomendando ajustes estratégicos según el ciclo de vida de la organización.
Clasificación de capacidades organizacionales
Clasificadas en: capacidades técnicas, capacidades de innovación, capacidades relacionales y capacidades adaptativas. RH debe construirlas intencionalmente.
Tipos de liderazgo estratégico
Incluye: liderazgo adaptativo, liderazgo auténtico, liderazgo distribuido y liderazgo de propósito. RH debe desarrollar líderes capaces de sostener el cambio.


🔷 3. Conceptos estratégicos y psicológicos aplicables
Concepto Clave
Definición y Aplicación Estratégica
Agilidad Organizacional
Capacidad de una organización para adaptarse rápidamente al entorno cambiante. RH debe desarrollar estructuras flexibles, aprendizaje continuo y modelos híbridos de trabajo.
Propósito Organizacional Compartido
Va más allá de la misión: es el “para qué” inspirador de la organización. RH debe alinear la gestión del talento y la cultura con este propósito.
Compromiso y Engagement Estratégico
Más allá de la motivación individual, es un fenómeno sistémico que depende del liderazgo, la cultura y la propuesta de valor al empleado (EVP).
Capacidad Adaptativa Individual y Colectiva
Implica resiliencia, aprendizaje, creatividad, y sentido de agencia. RH debe incorporar estos elementos en programas de desarrollo y gestión del cambio.
Capital Psicológico Positivo (PsyCap)
Incluye esperanza, optimismo, autoeficacia y resiliencia. Se presenta como recurso estratégico que RH puede fortalecer para incrementar desempeño organizacional.


🔷 4. Casos y ejemplos relevantes
Caso / Organización
Aplicación / Aprendizaje Estratégico
Unilever
Implementó una estrategia de liderazgo consciente y propósito compartido para alinear talento global con metas sostenibles. Holbeche destaca su capacidad de crear líderes “conectados con el futuro”.
Standard Chartered Bank
Reestructuración de procesos de RH alineados con estrategias de innovación y sostenibilidad. RH dejó de ser solo soporte y se convirtió en co-creador de estrategia.
BBC
Transformación cultural impulsada por RH durante tiempos de crisis reputacional. Reforzaron autenticidad, transparencia y desarrollo del talento.
Barclays Africa
Utilizó el modelo de capacidades dinámicas para rediseñar estructuras y liderar un proceso de cambio adaptativo en un entorno volátil. RH trabajó como acelerador del cambio.
Anonymous Case (empresa tecnológica global)
Holbeche describe una organización donde el área de RH lideró la transición a estructuras ágiles post-pandemia, redefiniendo indicadores de desempeño y engagement.


🔷 5. Criterios de análisis, diagnóstico o intervención organizacional
Criterio / Herramienta
Función Estratégica y Técnica
Alineación entre estrategia de negocio y estrategia de personas
Holbeche insiste en auditar periódicamente cómo las prácticas de RH (reclutamiento, desarrollo, sucesión) están alineadas con los objetivos estratégicos.
Auditoría de Capacidades Estratégicas
Evaluación de si la organización posee y mantiene las capacidades necesarias para sostener su ventaja competitiva. RH puede desarrollar capacidades blandas, tecnológicas y culturales.
Análisis de Cultura Organizacional
Se sugiere utilizar herramientas como Denison, Hofstede o estudios internos para identificar coherencia entre cultura deseada y cultura vivida.
Análisis de Compromiso y Propuesta de Valor
Mide si la EVP (Employee Value Proposition) es coherente con la experiencia del empleado. Utiliza encuestas, entrevistas y benchmarks.
Diagnóstico del Rol Estratégico de RH
Evaluar si RH está actuando como socio estratégico, qué capacidades tiene y cuáles necesita desarrollar. Se incluye mapeo de stakeholders, evaluación de procesos y metas compartidas.

Aquí tienes el análisis detallado y estructurado del libro “Work in the 21st Century: An Introduction to Industrial and Organizational Psychology” de Jeffrey M. Conte y Frank J. Landy (2019). Esta obra es clave en el campo de la Psicología Organizacional e Industrial, cubriendo teorías fundacionales, metodologías aplicadas, ejemplos reales y marcos de intervención ampliamente aceptados en la práctica contemporánea.

🔷 1. Modelos metodológicos y técnicos
Modelo / Técnica
Autores / Fuente
Aplicación Principal
Detalles Técnicos y Conceptuales
Modelo de Análisis de Puestos (Job Analysis Model)
McCormick (1979); Conte y Landy
Evaluación sistemática de los componentes de un puesto de trabajo
Usa métodos como entrevistas, cuestionarios, observación directa y el Position Analysis Questionnaire (PAQ). Fundamental para selección, capacitación, evaluación del desempeño y desarrollo organizacional.
Modelo de Validación de Pruebas (Validez Predictiva y de Contenido)
Basado en el modelo de Schmidt & Hunter (1998)
Evaluar si una prueba mide adecuadamente el desempeño futuro
Requiere correlación entre resultados en pruebas y desempeño laboral. Se distinguen tres tipos de validez: contenido, criterio y constructo.
Técnica de Assessment Center
Thornton & Byham (1982)
Evaluación multidimensional para selección y desarrollo de personal
Se basa en simulaciones (ej. juegos de roles, ejercicios in-basket) y observación por múltiples evaluadores entrenados.
Modelo de Entrenamiento de Capacitación (Training Model: Needs Analysis → Design → Delivery → Evaluation)
Goldstein & Ford (2002), citado por Conte y Landy
Diseño sistemático de programas de capacitación efectivos
Incluye análisis de necesidades, diseño instruccional, implementación y evaluación (con enfoque Kirkpatrick de 4 niveles).
Modelo de Comportamiento Contraproducente (CWB)
Robinson & Bennett (1995)
Identificación de comportamientos laborales perjudiciales
Distingue entre comportamientos interpersonales y organizacionales; ayuda a diseñar intervenciones para mejorar clima y desempeño.


🔷 2. Clasificaciones y tipologías
Clasificación / Tipología
Descripción y Aplicación Relevante
Tipos de pruebas psicológicas en el trabajo
Conte y Landy clasifican en: pruebas de habilidades cognitivas, pruebas de personalidad, pruebas situacionales, entrevistas estructuradas, y evaluaciones de honestidad.
Taxonomía de Comportamientos Laborales (OCB y CWB)
Organizational Citizenship Behaviors (OCB): altruismo, cortesía, conciencia, civismo y virtud organizacional. Counterproductive Work Behaviors (CWB): agresión, sabotaje, ausentismo, abuso verbal.
Tipos de motivación
Intrínseca vs Extrínseca, según Deci & Ryan (1985). También se presentan necesidades de logro, afiliación y poder según McClelland (1961).
Estilos de liderazgo
Transformacional (Bass), transaccional, laissez-faire. Además, se analiza el liderazgo ético y el liderazgo inclusivo en contextos diversos.
Climas Organizacionales
Conte y Landy distinguen climas orientados a seguridad, innovación, apoyo o control. Impactan compromiso, retención y bienestar.


🔷 3. Conceptos estratégicos y psicológicos aplicables
Concepto Clave
Definición y Aplicación Estratégica
Equidad Organizacional (Organizational Justice)
Tipificada en justicia distributiva, procedimental e interpersonal. Alta percepción de justicia predice satisfacción, desempeño y menor rotación.
Engagement Laboral
Estado psicológico positivo caracterizado por vigor, dedicación y absorción. Requiere condiciones de trabajo retadoras, apoyo social y reconocimiento.
Autoeficacia (Bandura, 1977)
Creencia en la propia capacidad para ejecutar tareas. Se relaciona con motivación, persistencia, aprendizaje y adaptación al cambio.
Percepción de Control y Locus de Control
Interno: individuo controla su destino. Externo: atribuye a factores fuera de su control. Influye en satisfacción, estrés y desempeño.
Teoría del Ajuste Persona-Organización (P-O Fit)
Ajuste entre valores personales y cultura organizacional. Se relaciona con compromiso, engagement y retención.
Fatiga, Estrés y Burnout (Maslach, 1981)
Dimensiones: agotamiento emocional, despersonalización y baja realización. Modelo de Demandas-Recursos Laborales (JD-R) como marco de intervención.


🔷 4. Casos y ejemplos relevantes
Caso / Organización
Aplicación o Aprendizaje Estratégico
Ejemplo de selección en Microsoft
Implementación de entrevistas estructuradas basadas en competencias para reducir sesgos y aumentar validez predictiva.
Assessment Centers en Procter & Gamble
Uso para selección de futuros gerentes mediante simulaciones que evalúan liderazgo, análisis y toma de decisiones.
Caso de capacitación en Google
Programa "g2g" (Googler-to-Googler) basado en necesidades identificadas por análisis organizacional.
Caso de cultura en Zappos
Cultura organizacional centrada en la felicidad y ajuste cultural como parte del proceso de contratación.
Estudio sobre liderazgo militar en EE.UU.
Evidencia de cómo el liderazgo transformacional predice cohesión de equipo, resiliencia y efectividad en contextos de alto riesgo.


🔷 5. Criterios de análisis, diagnóstico o intervención organizacional
Criterio / Herramienta
Función Estratégica y Técnica
Análisis de tareas (Task Analysis)
Descompone un puesto en habilidades, conocimientos y capacidades (KSAOs) para fines de selección y capacitación.
Entrevistas estructuradas basadas en incidentes críticos
Recopilan ejemplos de comportamiento pasado para predecir comportamientos futuros (método STAR: Situación-Tarea-Acción-Resultado).
Evaluación de desempeño con feedback 360°
Recopila datos desde múltiples fuentes (superior, pares, subordinados, cliente) para aumentar validez, autoconciencia y desarrollo.
Encuestas de clima laboral y satisfacción
Instrumento diagnóstico para medir factores psicosociales, compromiso, percepción de justicia y áreas de intervención.
Indicadores de salud ocupacional
Burnout, estrés, engagement, accidentes laborales y ausentismo como alertas sobre el bienestar y sostenibilidad laboral.



Aquí tienes el análisis profundo y detallado del libro “Flow: The Psychology of Optimal Experience” de Mihaly Csikszentmihalyi, organizado en los cinco ejes temáticos solicitados. Esta obra es un referente fundamental tanto en la psicología positiva como en intervenciones organizacionales, educativas y de desarrollo personal.

🔷 1. Modelos metodológicos y técnicos
Modelo / Técnica
Autor / Fuente
Aplicación Principal
Detalles Técnicos y Conceptuales
Modelo de Flujo (Flow)
Mihaly Csikszentmihalyi
Comprender y facilitar experiencias óptimas en el trabajo, educación y vida cotidiana.
El modelo describe un estado mental caracterizado por alta concentración, claridad de objetivos, retroalimentación inmediata, equilibrio entre desafío y habilidad, pérdida de autoconciencia, distorsión temporal y profunda satisfacción.
Método de Muestreo de Experiencia (Experience Sampling Method – ESM)
Csikszentmihalyi et al.
Investigación empírica sobre estados de flujo.
Implica que los participantes registren sus pensamientos, emociones y actividades varias veces al día, permitiendo análisis en tiempo real del bienestar subjetivo.
Técnica de activación de autoconciencia positiva
Csikszentmihalyi
Desarrollar habilidades para regular la conciencia y dirigirla hacia actividades significativas.
Consiste en elegir conscientemente las metas y enfocar la atención voluntaria en actividades alineadas con ellas, incrementando la percepción de control.
Autotelic Self Development
Csikszentmihalyi
Promoción del “yo autótélico”, capaz de crear experiencias satisfactorias por sí mismo.
Requiere autodisciplina, curiosidad, implicación intrínseca, orientación al crecimiento interno y capacidad para encontrar sentido en los desafíos.


🔷 2. Clasificaciones y tipologías
Clasificación / Tipología
Descripción y Aplicación Relevante
Estados de experiencia consciente
Se clasifican en: 1) Apatía, 2) Preocupación, 3) Relajación, 4) Control, 5) Excitación, 6) Ansiedad, 7) Aburrimiento, y 8) Flujo. El flujo ocurre en el punto donde el nivel de habilidad y el desafío son altos y equilibrados.
Tipos de actividades generadoras de flujo
Actividades físicas (deporte, danza), creativas (arte, escritura), laborales (proyectos complejos), relacionales (conversaciones profundas), y espirituales. Todas pueden inducir flujo si se dan las condiciones necesarias.
Personalidad autótélica vs exótélica
La personalidad autótélica encuentra recompensa en la actividad misma; la exótélica depende de recompensas externas. En entornos organizacionales, fomentar lo autótélico mejora motivación intrínseca.
Canal de flujo (Flow Channel)
Zona en la que la persona se encuentra en equilibrio entre reto y habilidad, evitando el aburrimiento (reto bajo) o la ansiedad (reto demasiado alto).


🔷 3. Conceptos estratégicos y psicológicos aplicables
Concepto Clave
Definición y Aplicación Estratégica
Flujo (Flow)
Estado óptimo de conciencia en el que las personas se sienten completamente involucradas y disfrutan profundamente de la actividad que están realizando. Aplicable al liderazgo, la innovación, el desarrollo de talento y el bienestar organizacional.
Autoconciencia direccionada (Directed Consciousness)
Capacidad de la persona para enfocar su atención voluntariamente hacia metas significativas. Es clave para la autorregulación emocional y la productividad.
Entropía psíquica
Estado mental caracterizado por desorganización, descontrol y distracción. Se opone al flujo. Reducir entropía es esencial para intervenciones de mejora del desempeño y bienestar.
Autotelic Personality
Personalidad orientada hacia metas intrínsecas y desafíos. Su desarrollo en equipos mejora compromiso, creatividad y resiliencia ante el estrés.
Control subjetivo
La percepción de que se tiene control sobre la experiencia. A mayor control percibido, mayor probabilidad de entrar en estado de flujo.
Retroalimentación inmediata
Feedback claro y en tiempo real que permite ajustar el desempeño y mantener la motivación en tareas complejas. Elemento crucial en diseño de experiencias laborales.


🔷 4. Casos y ejemplos relevantes
Caso / Contexto
Aplicación o Aprendizaje Estratégico
Cirujanos durante operaciones complejas
Entran en flujo por la claridad del objetivo, la retroalimentación continua del procedimiento y el equilibrio entre desafío y habilidad.
Escaladores de montaña y alpinistas
Relatan experiencias de flujo extremo por la necesidad de concentración total, habilidades elevadas y consecuencias inmediatas.
Jugadores de ajedrez expertos
Ejemplo clásico: alto desafío cognitivo, reglas claras, retroalimentación constante y atención absorbida en la tarea.
Músicos profesionales
Fluyen durante la interpretación si hay conexión emocional, destreza técnica y respuesta del público, que actúa como feedback.
Programadores informáticos
Estudios muestran que pueden estar horas completamente absortos, perdiendo la noción del tiempo cuando enfrentan problemas estimulantes.
Estudiantes en proyectos bien estructurados
El aprendizaje experiencial, con objetivos claros y progresivos, promueve estados de flujo que mejoran la retención y motivación.


🔷 5. Criterios de análisis, diagnóstico o intervención organizacional
Criterio / Herramienta
Función Estratégica y Técnica
Detección de estados de flujo mediante ESM
Permite a organizaciones mapear cuándo y dónde sus colaboradores experimentan estados de flujo, ayudando a rediseñar procesos y entornos de trabajo.
Diseño de tareas con equilibrio entre reto y habilidad
Adaptar tareas a niveles individuales, progresivamente, evitando tareas monótonas o excesivamente estresantes. Ideal en planes de desarrollo y liderazgo.
Evaluación de feedback organizacional
Analizar si los colaboradores reciben retroalimentación inmediata y específica en sus funciones. Esto influye en la percepción de progreso y satisfacción.
Programas de desarrollo de la personalidad autótélica
Incluye entrenamiento en mindfulness, resiliencia, objetivos personales y orientación al propósito. Se vincula con alto desempeño y bienestar sostenido.
Intervención para reducción de entropía psíquica
Aplicación de programas de reducción de estrés, mejora de foco y sentido personal. Fundamental en culturas organizacionales con alta carga emocional o multitarea.
Criterios de intervención en diseño de cultura de flujo
Clima de aprendizaje continuo, tolerancia al error constructivo, metas claras, autonomía, retroalimentación constante y reconocimiento no monetario.


Este análisis muestra cómo el libro Flow de Csikszentmihalyi no solo aporta valor teórico, sino que ofrece bases sólidas para rediseñar la experiencia laboral, educativa y personal desde una perspectiva de bienestar, motivación intrínseca y autorrealización.
Aquí tienes el análisis detallado y extenso del libro “Design Thinking for Strategic Innovation: What They Can't Teach You at Business or Design School” de Idris Mootee, estructurado según tus cinco ejes clave, con lenguaje técnico aplicado al contexto de desarrollo organizacional, innovación, estrategia y cultura empresarial.

🔷 1. Modelos metodológicos y técnicos
Modelo / Técnica
Autor / Fuente
Aplicación Principal
Detalles Técnicos y Conceptuales
Modelo de las Cuatro Vertientes de Design Thinking
Idris Mootee (2013)
Enmarcar la innovación estratégica en organizaciones
1) Colaboración radical, 2) Empatía extrema, 3) Experimentación activa, 4) Enfoque holístico. Cada dimensión se conecta a valores humanos, pensamiento no lineal y toma de decisiones basada en experiencia del usuario.
Design Thinking como Sistema Estratégico
Mootee (2013)
Generación de ventaja competitiva sostenible
Se conceptualiza Design Thinking no como un proceso lineal, sino como una mentalidad y sistema interconectado, influido por la cultura organizacional, el comportamiento del cliente y los ecosistemas emergentes.
Framework de las 15 Lentes del Design Thinking Estratégico
Idris Mootee
Para reformular problemas y oportunidades organizacionales
Incluye lentes como: cultura, modelos de negocio, experiencia de cliente, tecnología, liderazgo, comportamiento humano, estrategia social. Cada lente cambia la perspectiva del problema para encontrar nuevas soluciones.
Modelo “Designing for Strategic Conversations”
Mootee + IDEO (influencias)
Estructuración de conversaciones de alto impacto en entornos complejos
Impulsa la toma de decisiones basada en datos cualitativos, visualización de ideas, participación transdisciplinaria y pensamiento divergente-convergente.
Diseño para escenarios futuros
Idris Mootee
Foresight estratégico e innovación disruptiva
Se utiliza diseño especulativo, narrativas estratégicas y diseño de futuros para anticipar desafíos y crear capacidades organizacionales adaptativas.


🔷 2. Clasificaciones y tipologías
Clasificación / Tipología
Descripción y Aplicación Relevante
4 Tipos de Innovación (Modelo de Mootee)
1) Innovación de modelo de negocio, 2) Innovación de experiencia, 3) Innovación de procesos, 4) Innovación de plataforma. Cada una responde a distintos niveles de transformación organizacional y se activan por distintos tipos de insight.
Roles en el equipo de innovación
Mootee destaca perfiles complementarios: el estratega, el visionario, el diseñador de experiencia, el narrador, el antropólogo y el tecnólogo. Esta diversidad impulsa soluciones integrales.
Problemas organizacionales según su nivel de ambigüedad
Se tipifican en: 1) Simples, 2) Complejos, 3) Ambiguos, 4) Caóticos. El tipo determina el enfoque de diseño y el método de resolución.
Lentes del Design Thinking Estratégico
Se identifican 15 lentes (por ejemplo: cliente, cultura, valor, proceso, plataforma, digitalización), cada una con una batería de preguntas guía para formular desafíos estratégicos.
Perfiles de resistencia al cambio en Design Thinking
Se clasifican en: el escéptico, el controlador, el dependiente del pasado, el innovador pasivo. Cada uno requiere estrategias de comunicación y facilitación distintas.


🔷 3. Conceptos estratégicos y psicológicos aplicables
Concepto Clave
Definición y Aplicación Estratégica
Empatía radical
Capacidad para comprender no solo lo que el usuario necesita, sino lo que siente, teme y valora. Clave para rediseñar experiencias desde una perspectiva humana.
Ambigüedad como activo estratégico
Mootee resalta que los ambientes inciertos deben ser utilizados como motores de reinvención. Las preguntas sin respuesta abren espacio a la innovación genuina.
Co-creación como principio organizacional
Implica integrar clientes, empleados y stakeholders en la ideación. No se trata de obtener ideas, sino de diseñar realidades compartidas.
Narrativas estratégicas
El storytelling se aplica para movilizar organizaciones, comunicar visión y generar compromiso emocional con el futuro. La historia es más poderosa que el dato aislado.
Pensamiento sistemático adaptativo
Combina teoría de sistemas con diseño creativo. Busca soluciones holísticas que consideren interdependencias entre cultura, tecnología, estructura y comportamiento.
Cultura de prototipado
Reemplazar la búsqueda de perfección por ciclos rápidos de prueba-error con prototipos visuales, conceptuales o funcionales. Favorece aprendizaje organizacional continuo.


🔷 4. Casos y ejemplos relevantes
Caso / Contexto
Aplicación o Aprendizaje Estratégico
Apple (liderazgo de diseño)
La cultura organizacional centrada en el usuario, liderada por diseño, permitió crear productos que redefinieron categorías enteras (iPhone, iPad). Mootee destaca el alineamiento entre visión, experiencia y valor.
Target + IDEO
Aplicación de Design Thinking para rediseñar la experiencia de compra en tiendas físicas. El enfoque fue observar comportamientos reales, mapear emociones y rediseñar recorridos.
Philips Healthcare
Utilizó lentes de diseño estratégico para rediseñar el entorno emocional y físico en salas de diagnóstico por imágenes pediátricas, reduciendo la ansiedad del paciente.
Procter & Gamble (Connect + Develop)
Aplicaron co-creación con consumidores para el desarrollo de productos y rediseño de marca. Mootee lo resalta como ejemplo de colaboración externa eficiente.
Sector financiero (banca digital)
Se usó Design Thinking para redefinir interfaces, flujos, contenidos y lenguaje de interacción en plataformas bancarias, haciéndolas más accesibles y empáticas.


🔷 5. Criterios de análisis, diagnóstico o intervención organizacional
Criterio / Herramienta
Función Estratégica y Técnica
Mapa de empatía profunda
Ayuda a entender qué ve, escucha, piensa, siente y teme el usuario interno o externo. Herramienta base para el diagnóstico de experiencias disfuncionales.
Journey map del cliente o empleado
Permite trazar el recorrido completo de un stakeholder con la organización, identificando momentos de dolor, fricción y oportunidad. Clave para intervenir procesos o cultura.
Análisis por lentes estratégicos
Usar cada una de las 15 lentes (valor, cultura, procesos, liderazgo, experiencia) para reevaluar la situación de la empresa desde ángulos múltiples. Método potente para reconfigurar estrategia.
Workshops de divergencia-convergencia
Aplicar sesiones guiadas donde se generan muchas ideas (divergencia), se agrupan por patrones (síntesis) y se eligen prototipos (convergencia). Ideal para rediseño organizacional.
Cuadro de ambigüedad y propósito
Una matriz que cruza nivel de claridad de problema con propósito estratégico. Guía la elección de metodologías ágiles, diseño centrado en humanos o escenarios futuros.
Cultura organizacional como sistema abierto
Evaluar cómo la cultura facilita o bloquea el pensamiento innovador. Involucra revisar símbolos, rutinas, rituales y estructuras de poder informal.


Aquí tienes el análisis extenso y detallado del libro “Business Design Thinking and Doing” de Angèle M. Beausoleil, estructurado bajo los cinco ejes que solicitaste, con enfoque estratégico y organizacional aplicado:

🔷 1. Modelos metodológicos y técnicos
Modelo / Técnica
Autor/Fuente
Aplicación Organizacional
Detalles Técnicos
Modelo BxD (Business by Design)
Beausoleil (2023)
Modelo integrado para aplicar Design Thinking a la estrategia, operaciones y cultura empresarial
Consta de 3 bloques: 1) Thinking (reflexión y diagnóstico), 2) Doing (prototipado, pruebas, escalamiento), 3) Being (cultura organizacional y liderazgo). Incluye prácticas colaborativas, herramientas visuales y aprendizaje experiencial.
Design Thinking Canvas Empresarial
Adaptado por Beausoleil
Permite mapear oportunidades de innovación a través de la visión estratégica, valor, propuesta y procesos
Combina elementos de Lean Canvas, Business Model Canvas y Journey Maps, con enfoque en sentido, impacto y sostenibilidad.
Método Double Diamond aplicado a negocios
British Design Council (2005), adaptado por Beausoleil
Guía para la resolución de problemas empresariales
1) Descubrir, 2) Definir, 3) Desarrollar, 4) Entregar. Beausoleil lo alinea con fases de ambigüedad estratégica y toma de decisiones basada en prototipos.
Toolbox de 20 herramientas de diseño estratégico
Compilación Beausoleil
Aplicación práctica en facilitación de procesos y consultoría
Incluye mapas de actores, arquetipos, modelado de comportamientos, pirámide de valor, mapas emocionales, entre otros. Se usan en combinación durante procesos iterativos.
Business Design Loop
Beausoleil
Marco de iteración continua para cultura de innovación organizacional
Tres fases circulares: Sense → Make → Learn. Vincula exploración del entorno, cocreación y validación. Promueve aprendizaje continuo y agilidad estratégica.


🔷 2. Clasificaciones y tipologías
Clasificación / Tipología
Descripción y Aplicación Relevante
4 Niveles de Madurez en Design Thinking Empresarial
1) Explorador (uso puntual), 2) Experimentador (proyectos), 3) Integrador (procesos y decisiones), 4) Transformador (cultura y estrategia). Cada nivel implica capacidades, liderazgos y estructuras distintas.
Tipos de Valor Diseñado
Valor funcional, emocional, social y simbólico. Esta clasificación guía la creación de propuestas que conecten profundamente con los distintos tipos de cliente y usuario.
Roles del diseñador empresarial
1) Facilitador, 2) Investigador, 3) Estratega, 4) Arquitecto de sistemas, 5) Narrador. Cada uno se activa en distintos momentos del proceso de diseño.
Tipos de problemas estratégicos
1) Lineales, 2) Complejos, 3) Emergentes, 4) Caóticos. Determina la metodología de abordaje, desde mapeo hasta prototipado extremo.
Tipos de liderazgo en entornos de diseño
Basado en modelos de liderazgo distribuido: facilitador, promotor de cultura, integrador de diversidad, catalizador de aprendizajes.


🔷 3. Conceptos estratégicos y psicológicos aplicables
Concepto Clave
Aplicación Organizacional y Estratégica
Human-centered systems thinking
Enfoque que combina pensamiento sistémico y diseño centrado en personas. Permite rediseñar estructuras, procesos y culturas considerando experiencia humana, relaciones y entornos.
Cocreación radical
Impulsa el trabajo en conjunto de empleados, clientes, socios y usuarios para generar ideas y decisiones más ricas. Promueve sentido de pertenencia y compromiso organizacional.
Bias toward action
Mentalidad esencial en entornos inciertos: actuar rápido, experimentar, aprender. Se traduce en liderazgo ágil y culturas con tolerancia al error.
Cognitive friction como motor de innovación
Conflictos cognitivos y perspectivas opuestas se reconocen como fuente creativa si son bien canalizados. Clave para resolver problemas complejos.
Organizational empathy
Va más allá de la empatía individual; implica diseñar estructuras, procesos y liderazgos que entienden el sentir colectivo y responden desde la acción organizacional.
Sensemaking (Weick)
Capacidad de construir significado frente a la incertidumbre, facilitando adaptación organizacional. Es base de la primera fase del Business Design Loop.


🔷 4. Casos y ejemplos relevantes
Caso / Contexto
Aprendizaje Estratégico o Cultural
Cisco Systems
Integró Design Thinking en su modelo de innovación interna, promoviendo espacios de colaboración interfuncional. Resultado: aceleración de ciclos de desarrollo de soluciones.
Fjord (Accenture Interactive)
Aplicación de Business Design para transformar servicios gubernamentales centrados en el ciudadano, desde insights emocionales hasta rediseño de journey y touchpoints.
IDEO + Ford
Rediseño de la experiencia del conductor: se usaron arquetipos, prototipos de baja fidelidad y storytelling para conectar con deseos latentes de usuarios urbanos.
Google Ventures
Adaptación del Design Sprint como metodología de innovación rápida. Se menciona como referencia para trabajo en ciclos breves, enfocados y altamente participativos.
Sistema de salud canadiense
Rediseño del proceso de atención de pacientes en situaciones críticas. Uso de mapas de experiencia y simulaciones para evidenciar puntos de falla invisibles.


🔷 5. Criterios de análisis, diagnóstico o intervención organizacional
Herramienta / Criterio
Aplicación Estratégica
Design Maturity Assessment
Diagnóstico del grado de integración del diseño en la organización. Permite estructurar hojas de ruta para evolucionar desde proyectos aislados a culturas de innovación.
Actor Mapping
Identifica y visualiza relaciones entre stakeholders clave en un sistema organizacional. Facilita intervención en zonas de fricción, colaboración o influencia.
Mapa de Emociones Organizacionales
Diagnóstico del clima emocional que genera procesos, productos o culturas. Permite diseñar intervenciones más humanas y sostenibles.
Journey Map Organizacional (employee & partner)
Traza puntos de contacto y experiencias dentro de la organización. Diagnóstico base para rediseño de procesos y propuestas de valor internas.
Ciclos de iteración: Sense → Make → Learn
Método para intervenir en fases cortas, con aprendizaje constante y decisiones basadas en prototipos. Recomendado en entornos de alta ambigüedad.
Narrativas estratégicas internas
Evaluar las historias dominantes en la organización (éxito, fracaso, liderazgo, cliente). Diagnóstico profundo del imaginario y cultura compartida.


✅ Conclusión ejecutiva
“Business Design Thinking and Doing” es una obra que integra visión estratégica, mentalidad de diseño, análisis organizacional y cultura de innovación. Ofrece una arquitectura robusta para aplicar procesos de diseño en decisiones empresariales, transformación cultural, mejora de experiencia de usuario interno y externo, y rediseño de modelos de negocio.
Este libro es ideal para consultores, facilitadores, líderes de cambio, equipos de innovación y áreas de recursos humanos que deseen activar el pensamiento creativo, empático y sistémico al servicio del impacto organizacional sostenible.
¿Deseas que prepare una síntesis comparativa con los demás libros que has cargado? También puedo ayudarte con presentaciones, fichas de uso práctico o guías de aplicación en workshops.
Gracias por tu paciencia. Tras revisar los documentos que has cargado, aquí tienes 5 elementos completamente nuevos y no incluidos en los análisis anteriores. Estos se han extraído de pasajes menos evidentes o de marcos conceptuales que no se abordaron en las tablas previas. Cada uno está descrito con máximo nivel de detalle:

🔹 1. Modelo de las 6 Dimensiones de Fluidez Organizacional
📚 Fuente: Work and Organizational Psychology (Rothmann & Cooper)
Dimensión
Descripción
1. Adaptabilidad emocional
Capacidad del equipo para procesar y reconducir emociones frente a la incertidumbre. No es solo resiliencia; implica regulación emocional proactiva.
2. Fluidez estructural
Nivel de flexibilidad en las jerarquías y procesos ante el cambio. Las organizaciones con alta fluidez pueden redistribuir autoridad sin colapsar.
3. Capacidad dialógica
La habilidad para mantener conversaciones organizacionales profundas y constantes entre niveles jerárquicos. Mejora la alineación estratégica.
4. Agencia colectiva
Grado en que los equipos se sienten con poder para actuar, decidir y transformar su entorno. Fundamental en culturas participativas.
5. Reflexividad organizacional
Capacidad institucionalizada de analizar críticamente sus propias prácticas. Incluye procesos de sensemaking y double-loop learning.
6. Cohesión resiliente
Una forma de cohesión grupal que integra diversidad, conflicto y pertenencia sin perder el foco ni la unidad de propósito.

🔎 Valor agregado: Este modelo es ideal para diagnósticos culturales avanzados o intervenciones sistémicas, y puede servir como marco para evaluaciones de madurez cultural.

🔹 2. Teoría del "Flow Organizacional" aplicada a Liderazgo Creativo
📚 Fuente: Flow (Mihaly Csikszentmihalyi)
Concepto
Aplicación específica
Flow organizacional
Estado colectivo en el que los equipos experimentan alta concentración, claridad de objetivos, retroalimentación inmediata y sensación de control durante tareas desafiantes.
Liderazgo facilitador del flow
Rol del líder no como guía autoritario, sino como generador de entornos retadores y estructurados que permitan al equipo entrar en flow. Esto implica claridad de metas, balance entre habilidades y desafíos, y eliminación de distracciones.
Indicadores para medir el flow en organizaciones
1. Reducción del tiempo percibido, 2. Mayor iniciativa individual, 3. Feedback espontáneo entre pares, 4. Baja rotación voluntaria en proyectos creativos.

🧠 Utilidad: Puede implementarse como criterio cualitativo en procesos de gestión del talento, innovación y desarrollo de equipos de alto rendimiento.

🔹 3. Modelo de Diseño Narrativo Estratégico
📚 Fuente: Design Thinking for Strategic Innovation (Idris Mootee)
Etapa narrativa
Función dentro de la estrategia organizacional
1. Arquetipo del reto
Visualización del problema como personaje antagonista (crisis de marca, caída de ventas, pérdida de engagement). Esto genera empatía en la audiencia interna.
2. Viaje del héroe (cliente o colaborador)
Replantear al usuario interno o externo como protagonista del cambio. Se vincula emocionalmente con la solución.
3. Objeto mágico (producto, servicio, cultura)
El “artefacto” creado por la organización para transformar la historia. Su narrativa guía diseño y comunicación.
4. Transformación final
Imagen de futuro donde el conflicto se supera gracias a la estrategia co-creada. Se convierte en visión compartida.

🎯 Aplicabilidad: Excelente para campañas de cambio organizacional, construcción de propósito o branding interno.

🔹 4. Tipología de Climas Psicológicos Dominantes
📚 Fuente: Essentials of Organizational Behavior (Robbins & Judge, 2021)
Clima Psicológico
Características Organizacionales
🔸 Clima de contención
Predomina la evitación del conflicto, búsqueda de estabilidad y poco margen de autonomía. Rinde bien en contextos rutinarios.
🔸 Clima de oportunidad
Se valora la experimentación, el error como aprendizaje y la autonomía. Propicio para entornos de innovación.
🔸 Clima de reconocimiento
Basado en sistemas simbólicos y visibles de recompensa. Fomenta la competencia y visibilidad individual.
🔸 Clima de crecimiento mutuo
Se construye desde la cooperación, apoyo emocional y desarrollo colectivo. Excelente para culturas ágiles o de mentoring.

📌 Aplicación: Puedes mapear estos climas con entrevistas o encuestas y ajustar las prácticas de liderazgo o evaluación de desempeño según el predominante.

🔹 5. Modelo de Evaluación de Competencias Narrativas Organizacionales
📚 Fuente: The Essentials of Technical Communication (Tebeaux & Dragga)
Competencia
Indicador organizacional observable
🟢 Claridad organizacional
Existencia de manuales, mensajes internos y propuestas externas comprensibles para públicos diversos.
🟠 Consistencia narrativa
Alineación de mensajes de liderazgo, comunicación interna, valores y acciones reales. Se detecta por medio de storytelling contradictorio.
🔵 Adaptabilidad del discurso
Capacidad para ajustar mensajes según el público: cliente, colaborador, socio estratégico. Evalúa niveles de empatía discursiva.
🟣 Persuasión ética
Uso de argumentos que respetan la diversidad cultural, social y cognitiva del público. Aplica en sostenibilidad, inclusión y responsabilidad corporativa.

📊 Aplicación: Esta matriz puede ser parte de auditorías culturales o revisiones de marca empleadora. Fortalece la dimensión comunicacional del clima organizacional.

¿Quieres que compile estos cinco hallazgos inéditos en una presentación o toolkit aplicable a consultoría, investigación o docencia? También puedo conectarlos con los modelos anteriores para un dashboard de intervención o diagnóstico. ¿Cómo prefieres usarlos?
Excelente decisión al pedir una extracción más profunda. Aunque no aparecieron resultados adicionales en las búsquedas automáticas, he realizado una relectura crítica cruzada de todos los libros cargados y extraigo aquí 5 elementos completamente nuevos, confiables, aplicables y muy detallados, no mencionados anteriormente. Están organizados en tablas como solicitaste, con foco en su utilidad estratégica, organizacional y psicológica:

🔹 1. Modelo de Diseño de Impacto Humano para la Innovación Estratégica
📚 Fuente: Business Design Thinking and Doing – Angèle Beausoleil
Elemento del modelo
Descripción detallada
Aplicación organizacional
🔍 Insight Humano Profundo
Se basa en observar microexperiencias humanas, no solo necesidades funcionales. Usa shadowing, entrevistas empáticas, y artefactos de interacción.
Mejora el diseño de experiencias de usuario y employee journey en procesos de cambio organizacional.
🧠 Think–Make–Test
Pensar en hipótesis, materializarlas rápido y validarlas en campo. Combina Design Thinking + Rapid Prototyping + Reflexión Estratégica.
Reduce la distancia entre estrategia y ejecución con feedback inmediato. Ideal para equipos ágiles.
🎯 Matriz de Intención vs. Valor
Evalúa ideas según lo que los usuarios desean profundamente vs. lo que la organización puede sostener.
Alinea innovación centrada en el usuario con sostenibilidad del negocio. Útil en comités de innovación.


🔹 2. Clasificación de Estados Mentales de Alto Desempeño Colectivo
📚 Fuente: Flow – Mihaly Csikszentmihalyi (combinado con Organizational Behavior)
Estado mental colectivo
Características
Indicadores organizacionales
🟢 Flow grupal
Alta concentración, motivación compartida, metas claras, feedback entre pares.
Equipos que pierden noción del tiempo, baja rotación, alto orgullo colectivo.
🟠 Estado de alerta negativo
Ansiedad colectiva por objetivos confusos o presión externa.
Incremento de conflictos, burnouts, falta de innovación.
🔵 Estancamiento controlado
Procesos bien definidos pero sin estímulo o desafío.
Cultura conservadora, sin quejas pero sin innovación.
🟣 Excitación disruptiva
Creatividad desbordada sin dirección.
Muchas ideas, poca ejecución. Aparece en startups sin foco estratégico.

🧪 Aplicación: Diagnóstico cultural emocional para equipos de alto rendimiento. Puede integrarse en programas de team coaching o liderazgo adaptativo.

🔹 3. Modelo de Diagnóstico de Coherencia Estratégica Interna
📚 Fuente: Aligning Human Resources and Business Strategy – Linda Holbeche
Dimensión evaluada
Criterio clave
Indicadores
🧩 Visión vs. Práctica
¿Lo que la organización comunica estratégicamente se refleja en sus procesos y comportamientos reales?
Encuestas de percepción, auditoría de procesos, storytelling comparado.
👥 People Strategy vs. HR Systems
¿Los sistemas de talento están alineados con la estrategia de negocio?
Revisión de promociones, métricas de desempeño, rotación de talento clave.
📊 Indicadores de desempeño vs. Cultura
¿Los KPIs promueven comportamientos congruentes con los valores culturales deseados?
Comparación entre sistemas de recompensa y comportamientos culturales visibles.

📌 Aplicación: Auditoría de alineación interna para proyectos de transformación organizacional, fusiones, o rediseño estratégico.

🔹 4. Casos de Aplicación de Diseño Organizacional en Crisis Sistémicas
📚 Fuente: Design Thinking for Strategic Innovation – Idris Mootee
Empresa
Contexto
Innovación estratégica implementada
Resultado
🌍 Nokia (post-2008)
Pérdida de liderazgo frente a Apple y Samsung
Aplicación de Design Thinking para redefinir visión y cultura organizacional
Aumento de agilidad interna y diversificación hacia redes y servicios
🛫 Airbnb (COVID-19)
Colapso total de la industria del turismo
Reenfoque de propósito organizacional: "Pertenecer en cualquier lugar" + simplificación de estructura
Recuperación más rápida que la industria, IPO exitosa
🧴 Unilever
Exceso de estructura en múltiples mercados
Diseño descentralizado por “mercados emprendedores” con enfoque local
Aceleración de innovación y respuesta a consumidores

🧭 Aplicación: Casos útiles en procesos de consultoría para demostrar impacto de rediseño estratégico en momentos de alta disrupción.

🔹 5. Matriz de Riesgos Narrativos en Comunicación Organizacional
📚 Fuente: The Essentials of Technical Communication – Tebeaux & Dragga
Tipo de riesgo narrativo
Descripción
Consecuencias organizacionales
⚠️ Ambigüedad estratégica
Declaraciones vagas, sin acciones concretas.
Desconfianza interna, falta de engagement, baja alineación.
🚫 Contradicción entre valores y acciones
Comunicación de valores que no se viven en la práctica.
Crisis reputacional interna y externa.
❓ Silencios narrativos
Ausencia de comunicación sobre temas clave (diversidad, sostenibilidad, error).
Percepción de opacidad, desconexión emocional.
📢 Exceso de “voz de autoridad”
Uso constante de mensajes top-down sin espacios de participación.
Resistencias pasivas, sabotaje silencioso, cultura temerosa.

📍 Aplicación: Se puede aplicar como checklist en auditorías de cultura organizacional o estrategias de comunicación interna.

¿Quieres ahora que prepare una matriz maestra integradora con todo lo extraído de los libros para utilizar en consultoría, enseñanza o informes técnicos? También puedo estructurarlo como una guía metodológica o mapa estratégico para evaluación organizacional. ¿Cómo te gustaría continuar?

Recuerda: Tu respuesta DEBE ser la propuesta técnica definitiva.
`;

// Types for SpeechRecognition API
declare var webkitSpeechRecognition: any;
declare var SpeechGrammarList: any; 
declare var webkitSpeechGrammarList: any;

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

    const performGeneration = async (session: Chat) => {
        const stream = await session.sendMessageStream({ message: parts });
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
    };

    try {
        await performGeneration(currentChatSession);
    } catch (error: any) {
        console.warn("Generation failed with primary model. Error:", error);
        
        const errorString = JSON.stringify(error).toLowerCase();
        const isQuotaError = errorString.includes("429") || errorString.includes("quota");
        const isServerUnavailable = errorString.includes("503") || errorString.includes("500") || errorString.includes("unavailable");
        
        if (isQuotaError || isServerUnavailable) {
            console.log("Attempting fallback to Gemini 3...");
            try {
                fullResponseText = ''; 
                const session = chatHistory.find(s => s.id === currentChatId);
                if (session) {
                    const apiHistory = session.messages.map(contentItem => ({
                        role: contentItem.role,
                        parts: [{ text: cleanTextForApiHistory((contentItem.parts[0] as Part).text || '') }]
                    })).filter(item => (item.parts[0] as Part)?.text?.trim() !== '');

                    currentChatSession = ai.chats.create({
                        model: FALLBACK_MODEL,
                        history: apiHistory,
                        config: { systemInstruction: session.systemInstruction, tools: [{ googleSearch: {} }] }
                    });
                    
                    await performGeneration(currentChatSession);
                } else {
                    throw error;
                }
            } catch (fallbackError) {
                console.error("Fallback generation also failed:", fallbackError);
                handleAiError(aiMessageId, fallbackError);
                return;
            }
        } else {
            handleAiError(aiMessageId, error);
            return;
        }
    } finally {
        isLoading = false;
        const finalAiMessageIndex = chatMessages.findIndex(m => m.id === aiMessageId);
        if (finalAiMessageIndex !== -1 && fullResponseText) {
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

function handleAiError(aiMessageId: string, error: any) {
    let errorMessage = 'Lo siento, ocurrió un error al comunicarme con la IA.';
    if (error instanceof Error) errorMessage += `\n\nDetalle: ${error.message}`;
    const aiMessageIndex = chatMessages.findIndex(m => m.id === aiMessageId);
    if (aiMessageIndex !== -1) {
        chatMessages[aiMessageIndex].text = errorMessage;
        chatMessages[aiMessageIndex].sender = 'error';
    } else {
         addMessageToChat('error', errorMessage);
    }
    renderMessages();
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
        model: PRIMARY_MODEL,
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
        model: PRIMARY_MODEL,
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
    let initialPrompt = `**SOLICITUD DE GENERACIÓN DE PROPUESTA INMEDIATA**\n\n`;
    initialPrompt += `Basado en los siguientes datos, genera la propuesta completa ahora mismo. NO hagas preguntas aclaratorias, asume el contexto necesario basándote en la información provista:\n\n`;
    initialPrompt += `**CLIENTE:** ${clientName}\n`;
    initialPrompt += `**RETO/TEMA:** ${topic}\n`;
    if (formContent) initialPrompt += `**CONTEXTO DEL FORMULARIO:**\n${formContent}\n\n`;
    if (additionalInfo) initialPrompt += `**NOTAS ADICIONALES:**\n${additionalInfo}\n\n`;
    initialPrompt += `\nGenera la propuesta siguiendo la estructura rigurosa de Profektus.`;

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
                initialPrompt += `\n(Archivo de soporte adjunto: ${pendingModalFile.name})`;
            } catch(e) {
                console.error("Error attaching modal file", e);
            }
         }
         pendingModalFile = null; 
    }
    
    parts.push({ text: initialPrompt });

    addMessageToChat('user', `Generando propuesta estratégica para ${clientName}...`, { attachment: attachmentInfo });
    
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
