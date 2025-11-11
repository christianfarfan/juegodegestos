// Aplicación de Validación de Hábitos con Teachable Machine
// Integración con modelo: https://teachablemachine.withgoogle.com/models/PL2IPVGy0/

// ===== CONFIGURACIÓN =====
const MODEL_URL = 'https://teachablemachine.withgoogle.com/models/PL2IPVGy0/';
const CONFIDENCE_THRESHOLD_DEFAULT = 0.6;
const MAX_HISTORY_ITEMS = 10;

// ===== DATOS DE IMÁGENES =====
const IMAGES_DATA = [
  {
    "categoria": "Comida saludable",
    "urls": [
      "https://images.pexels.com/photos/34622256/pexels-photo-34622256.jpeg",
      "https://images.pexels.com/photos/33867268/pexels-photo-33867268.jpeg",
      "https://images.pexels.com/photos/34628046/pexels-photo-34628046.jpeg",
      "https://images.pexels.com/photos/5305435/pexels-photo-5305435.jpeg",
      "https://images.pexels.com/photos/1860204/pexels-photo-1860204.jpeg",
      "https://images.pexels.com/photos/18976992/pexels-photo-18976992.jpeg",
      "https://images.pexels.com/photos/28308001/pexels-photo-28308001.jpeg",
      "https://images.pexels.com/photos/20922952/pexels-photo-20922952.jpeg",
      "https://images.pexels.com/photos/28397635/pexels-photo-28397635.jpeg",
      "https://images.pexels.com/photos/31745184/pexels-photo-31745184.jpeg",
      "https://images.pexels.com/photos/5966441/pexels-photo-5966441.jpeg",
      "https://images.pexels.com/photos/8697526/pexels-photo-8697526.jpeg",
      "https://images.pexels.com/photos/30350312/pexels-photo-30350312.jpeg",
      "https://images.pexels.com/photos/10895785/pexels-photo-10895785.jpeg",
      "https://images.pexels.com/photos/13322664/pexels-photo-13322664.jpeg",
      "https://images.pexels.com/photos/18708077/pexels-photo-18708077.jpeg"
    ]
  },
  {
    "categoria": "Comida no saludable",
    "urls": [
      "https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg",
      "https://images.pexels.com/photos/5903317/pexels-photo-5903317.jpeg",
      "https://images.pexels.com/photos/17778862/pexels-photo-17778862.jpeg",
      "https://images.pexels.com/photos/5848056/pexels-photo-5848056.jpeg",
      "https://images.pexels.com/photos/17628576/pexels-photo-17628576.jpeg",
      "https://images.pexels.com/photos/11710530/pexels-photo-11710530.jpeg",
      "https://images.pexels.com/photos/5737577/pexels-photo-5737577.jpeg",
      "https://images.pexels.com/photos/11413390/pexels-photo-11413390.jpeg",
      "https://images.pexels.com/photos/9001226/pexels-photo-9001226.jpeg",
      "https://images.pexels.com/photos/20645731/pexels-photo-20645731.jpeg",
      "https://images.pexels.com/photos/12599942/pexels-photo-12599942.jpeg",
      "https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg",
      "https://images.pexels.com/photos/2280545/pexels-photo-2280545.jpeg",
      "https://images.pexels.com/photos/14456295/pexels-photo-14456295.jpeg",
      "https://images.pexels.com/photos/5602710/pexels-photo-5602710.jpeg"
    ]
  },
  {
    "categoria": "habitos saludables",
    "urls": [
      "https://images.pexels.com/photos/4325466/pexels-photo-4325466.jpeg",
      "https://images.pexels.com/photos/8034028/pexels-photo-8034028.jpeg",
      "https://images.pexels.com/photos/8034578/pexels-photo-8034578.jpeg",
      "https://images.pexels.com/photos/8617545/pexels-photo-8617545.jpeg",
      "https://images.pexels.com/photos/8617821/pexels-photo-8617821.jpeg",
      "https://images.pexels.com/photos/5621936/pexels-photo-5621936.jpeg",
      "https://images.pexels.com/photos/1231365/pexels-photo-1231365.jpeg",
      "https://images.pexels.com/photos/5693047/pexels-photo-5693047.jpeg"
    ]
  },
  {
    "categoria": "habitos no saludables",
    "urls": [
      "https://www.infobae.com/resizer/v2/PUX3F6CSHFEWLJPJFVRYXD7C7M.jpg?auth=31c49f83af7f34f05f07ad5a31799b5ada523ac6874e3acb24db0103a8efb29f&smart=true&width=992&height=558&quality=85",
      "https://www.lavanguardia.com/files/content_image_desktop_filter/uploads/2021/08/19/611e65766d7fb.jpeg",
      "https://w2a-noticierovenevision-net.s3.amazonaws.com/public/media/images/shutterstock_244022641-1200x900-934b29.jpg",
      "https://s3.eu-west-3.amazonaws.com/com.criarconsentidocomun.media/2022/06/comer-frente-a-una-pantalla-puede-causar-problemas-nutricionales-2-768x488.jpg",
      "https://www.semana.com/resizer/v2/IRSCZ4Y67ZDAZAEUCWD3OFDMUM.jpg?auth=acc52641d06e9db04e49f3373b7a269262c433cee8eaddf0a7db22934d90f4f2&smart=true&quality=75&width=1280&fitfill=false",
      "https://www.clikisalud.net/wp-content/uploads/2020/02/sedentarismo-depresion-adultez.jpg",
      "https://odontologos.com.co/assets/images/news/2024-11-19_073934comporta.jpg"
    ]
  }
];

// ===== ESTADO DE LA APLICACIÓN =====
const appState = {
    model: null,
    webcam: null,
    isPaused: false,
    isDetecting: false,
    currentImageIndex: 0,
    allImages: [],
    aciertos: 0,
    errores: 0,
    confidenceThreshold: CONFIDENCE_THRESHOLD_DEFAULT,
    history: [],
    predictionInterval: null
};

// ===== ELEMENTOS DEL DOM =====
const elements = {
    currentImage: document.getElementById('current-image'),
    questionDisplay: document.getElementById('question-display'),
    cameraOverlay: document.getElementById('camera-overlay'),
    webcam: document.getElementById('webcam'),
    predictionLabel: document.getElementById('prediction-label'),
    confidenceFill: document.getElementById('confidence-fill'),
    confidenceText: document.getElementById('confidence-text'),
    aciertos: document.getElementById('aciertos'),
    errores: document.getElementById('errores'),
    confianza: document.getElementById('confianza'),
    btnSiguiente: document.getElementById('btn-siguiente'),
    btnPausar: document.getElementById('btn-pausar'),
    btnReiniciar: document.getElementById('btn-reiniciar'),
    thresholdSlider: document.getElementById('threshold-slider'),
    thresholdValue: document.getElementById('threshold-value'),
    historyContainer: document.getElementById('history-container'),
    statusMessage: document.getElementById('status-message')
};

// ===== FUNCIONES DE UTILIDAD =====

/**
 * Muestra un mensaje de estado temporal
 */
function showStatusMessage(message, type = 'info') {
    elements.statusMessage.textContent = message;
    elements.statusMessage.className = `status-message ${type} show`;
    
    setTimeout(() => {
        elements.statusMessage.classList.remove('show');
    }, 3000);
}

/**
 * Obtiene la pregunta contraria según la categoría
 */
function getQuestionForCategory(categoria) {
    const questions = {
        'Comida saludable': '¿Esta es comida no saludable?',
        'Comida no saludable': '¿Esta es comida saludable?',
        'habitos saludables': '¿Estos son habitos no saludable?',
        'habitos no saludables': '¿Estos son habitos saludables?'
    };
    return questions[categoria] || '¿Qué tipo de hábito es este?';
}

/**
 * Obtiene la respuesta correcta esperada según la categoría
 * La respuesta correcta es la etiqueta opuesta a la pregunta
 */
function getCorrectAnswer(categoria) {
    const answers = {
        'Comida saludable': 'HABITO SALUDABLE',
        'Comida no saludable': 'HABITO NO SALUDABLE',
        'habitos saludables': 'HABITO SALUDABLE',
        'habitos no saludables': 'HABITO NO SALUDABLE'
    };
    return answers[categoria] || 'HABITO SALUDABLE';
}

/**
 * Prepara el array de todas las imágenes con sus categorías
 */
function prepareImagesArray() {
    const allImages = [];
    IMAGES_DATA.forEach(categoryData => {
        categoryData.urls.forEach(url => {
            allImages.push({
                url: url,
                categoria: categoryData.categoria
            });
        });
    });
    // Mezclar aleatoriamente
    return allImages.sort(() => Math.random() - 0.5);
}

/**
 * Actualiza los contadores en la UI
 */
function updateCounters() {
    elements.aciertos.textContent = appState.aciertos;
    elements.errores.textContent = appState.errores;
}

/**
 * Actualiza la visualización de confianza
 */
function updateConfidenceDisplay(confidence) {
    const percentage = Math.round(confidence * 100);
    elements.confianza.textContent = `${percentage}%`;
    elements.confidenceFill.style.width = `${percentage}%`;
    elements.confidenceText.textContent = `${percentage}%`;
}

// ===== CARGA DEL MODELO DE TEACHABLE MACHINE =====

/**
 * Carga el modelo de Teachable Machine
 */
async function loadModel() {
    try {
        showStatusMessage('Cargando modelo de Teachable Machine...', 'info');
        
        // Obtener la referencia correcta a tmImage
        const tmImageLib = getTmImage();
        
        // Asegurar que la URL termine con /
        const baseURL = MODEL_URL.endsWith('/') ? MODEL_URL : MODEL_URL + '/';
        const modelURL = baseURL + 'model.json';
        const metadataURL = baseURL + 'metadata.json';
        
        // Cargar el modelo usando la API correcta
        appState.model = await tmImageLib.load(modelURL, metadataURL);
        
        // Verificar que el modelo se cargó correctamente
        if (!appState.model) {
            throw new Error('El modelo no se cargó correctamente');
        }
        
        showStatusMessage('Modelo cargado exitosamente', 'success');
        return true;
    } catch (error) {
        console.error('Error al cargar el modelo:', error);
        showStatusMessage('Error al cargar el modelo. Verifica tu conexión y la URL del modelo.', 'error');
        return false;
    }
}

// ===== MANEJO DE LA CÁMARA =====

/**
 * Inicializa la cámara web
 */
async function initWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 }
        });
        
        elements.webcam.srcObject = stream;
        elements.cameraOverlay.classList.add('active');
        appState.webcam = stream;
        
        showStatusMessage('Cámara activada', 'success');
        return true;
    } catch (error) {
        console.error('Error al acceder a la cámara:', error);
        showStatusMessage('No se pudo acceder a la cámara. Verifica los permisos.', 'error');
        return false;
    }
}

/**
 * Detiene la cámara
 */
function stopWebcam() {
    if (appState.webcam) {
        appState.webcam.getTracks().forEach(track => track.stop());
        appState.webcam = null;
        elements.cameraOverlay.classList.remove('active');
    }
}

// ===== DETECCIÓN Y PREDICCIÓN =====

/**
 * Realiza una predicción con el modelo
 */
async function predict() {
    if (!appState.model || !elements.webcam || appState.isPaused || appState.isDetecting) {
        return;
    }

    appState.isDetecting = true;

    try {
        const prediction = await appState.model.predict(elements.webcam);
        
        // Encontrar la predicción con mayor confianza
        let maxConfidence = 0;
        let predictedClass = '';
        
        prediction.forEach((pred, index) => {
            if (pred.probability > maxConfidence) {
                maxConfidence = pred.probability;
                predictedClass = pred.className;
            }
        });

        // Normalizar etiquetas del modelo (por si vienen en diferentes formatos)
        // Mapear posibles variaciones de etiquetas a las esperadas
        const labelMap = {
            'HABITO SALUDABLE': 'HABITO SALUDABLE',
            'HABITO NO SALUDABLE': 'HABITO NO SALUDABLE',
            'habito saludable': 'HABITO SALUDABLE',
            'habito no saludable': 'HABITO NO SALUDABLE',
            'Habito Saludable': 'HABITO SALUDABLE',
            'Habito No Saludable': 'HABITO NO SALUDABLE'
        };
        
        // Normalizar la etiqueta predicha
        predictedClass = labelMap[predictedClass] || predictedClass;

        // Actualizar UI con la predicción
        elements.predictionLabel.textContent = predictedClass || 'Sin detección';
        updateConfidenceDisplay(maxConfidence);

        // Validar si la confianza supera el umbral
        if (maxConfidence >= appState.confidenceThreshold) {
            // Validar la respuesta
            const currentImage = appState.allImages[appState.currentImageIndex];
            if (currentImage) {
                const correctAnswer = getCorrectAnswer(currentImage.categoria);
                const isCorrect = predictedClass === correctAnswer;

                // Solo procesar si no se ha validado esta imagen
                if (!currentImage.validated) {
                    currentImage.validated = true;
                    
                    if (isCorrect) {
                        appState.aciertos++;
                        showStatusMessage('¡Correcto!', 'success');
                    } else {
                        appState.errores++;
                        showStatusMessage('Incorrecto', 'error');
                    }

                    updateCounters();

                    // Agregar al historial
                    addToHistory(currentImage, correctAnswer, predictedClass, maxConfidence, isCorrect);
                }
            }
        } else {
            // Confianza baja
            const currentImage = appState.allImages[appState.currentImageIndex];
            if (currentImage && !currentImage.lowConfidenceShown) {
                showStatusMessage('Confianza baja — intenta de nuevo', 'warning');
                currentImage.lowConfidenceShown = true;
            }
        }

    } catch (error) {
        console.error('Error en la predicción:', error);
    } finally {
        appState.isDetecting = false;
    }
}

/**
 * Inicia el loop de predicción continua
 */
function startPredictionLoop() {
    if (appState.predictionInterval) {
        clearInterval(appState.predictionInterval);
    }
    
    appState.predictionInterval = setInterval(() => {
        if (!appState.isPaused) {
            predict();
        }
    }, 500); // Predicción cada 500ms
}

/**
 * Detiene el loop de predicción
 */
function stopPredictionLoop() {
    if (appState.predictionInterval) {
        clearInterval(appState.predictionInterval);
        appState.predictionInterval = null;
    }
}

// ===== GESTIÓN DE IMÁGENES =====

/**
 * Carga y muestra la imagen actual
 */
function loadCurrentImage() {
    if (appState.allImages.length === 0) {
        showStatusMessage('No hay imágenes disponibles', 'error');
        return;
    }

    const currentImage = appState.allImages[appState.currentImageIndex];
    if (!currentImage) {
        showStatusMessage('Índice de imagen inválido', 'error');
        return;
    }

    // Resetear estado de validación
    currentImage.validated = false;
    currentImage.lowConfidenceShown = false;

    // Cargar imagen
    elements.currentImage.src = currentImage.url;
    elements.currentImage.alt = `Imagen: ${currentImage.categoria}`;

    // Mostrar pregunta
    const question = getQuestionForCategory(currentImage.categoria);
    elements.questionDisplay.textContent = question;

    // Reiniciar contador de confianza
    updateConfidenceDisplay(0);
    elements.predictionLabel.textContent = 'Esperando detección...';
}

/**
 * Avanza a la siguiente imagen
 */
function nextImage() {
    appState.currentImageIndex = (appState.currentImageIndex + 1) % appState.allImages.length;
    loadCurrentImage();
    showStatusMessage('Siguiente imagen', 'info');
}

// ===== HISTORIAL =====

/**
 * Agrega una entrada al historial
 */
function addToHistory(imageData, correctAnswer, detectedLabel, confidence, isCorrect) {
    const historyItem = {
        imageUrl: imageData.url,
        categoria: imageData.categoria,
        pregunta: getQuestionForCategory(imageData.categoria),
        respuestaCorrecta: correctAnswer,
        etiquetaDetectada: detectedLabel,
        confianza: confidence,
        resultado: isCorrect ? 'correcto' : 'incorrecto',
        timestamp: new Date().toLocaleTimeString()
    };

    appState.history.unshift(historyItem);

    // Limitar a las últimas 10
    if (appState.history.length > MAX_HISTORY_ITEMS) {
        appState.history = appState.history.slice(0, MAX_HISTORY_ITEMS);
    }

    renderHistory();
}

/**
 * Renderiza el historial en la UI
 */
function renderHistory() {
    if (appState.history.length === 0) {
        elements.historyContainer.innerHTML = '<p class="no-history">Aún no hay respuestas registradas</p>';
        return;
    }

    elements.historyContainer.innerHTML = appState.history.map((item, index) => {
        const confidencePercent = Math.round(item.confianza * 100);
        const resultClass = item.resultado === 'correcto' ? 'correct' : 'incorrect';
        const badgeClass = item.resultado === 'correcto' ? 'badge-correct' : 'badge-incorrect';

        return `
            <div class="history-item ${resultClass}">
                <div class="history-item-header">
                    <img src="${item.imageUrl}" alt="${item.categoria}" class="history-image" loading="lazy">
                    <div class="history-details">
                        <div class="history-categoria">${item.categoria}</div>
                        <div class="history-pregunta">${item.pregunta}</div>
                    </div>
                </div>
                <div class="history-resultado">
                    <span class="history-badge ${badgeClass}">${item.resultado === 'correcto' ? '✓ Correcto' : '✗ Incorrecto'}</span>
                    <span class="history-badge badge-confidence">Confianza: ${confidencePercent}%</span>
                    <span class="history-badge" style="background: #E2E8F0; color: #4A5568;">Detectado: ${item.etiquetaDetectada}</span>
                    <span class="history-badge" style="background: #E2E8F0; color: #4A5568;">Esperado: ${item.respuestaCorrecta}</span>
                </div>
            </div>
        `;
    }).join('');
}

// ===== CONTROLES =====

/**
 * Pausa o reanuda la detección
 */
function togglePause() {
    appState.isPaused = !appState.isPaused;
    
    if (appState.isPaused) {
        elements.btnPausar.textContent = 'Reanudar';
        stopPredictionLoop();
        showStatusMessage('Detección pausada', 'info');
    } else {
        elements.btnPausar.textContent = 'Pausar';
        startPredictionLoop();
        showStatusMessage('Detección reanudada', 'success');
    }
}

/**
 * Reinicia la ronda
 */
function resetRound() {
    appState.currentImageIndex = 0;
    appState.aciertos = 0;
    appState.errores = 0;
    appState.history = [];
    appState.isPaused = false;
    
    updateCounters();
    renderHistory();
    loadCurrentImage();
    
    elements.btnPausar.textContent = 'Pausar';
    startPredictionLoop();
    
    showStatusMessage('Ronda reiniciada', 'success');
}

// ===== INICIALIZACIÓN =====

/**
 * Espera a que las librerías estén cargadas
 */
function waitForLibraries() {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 50; // 5 segundos máximo
        
        const checkLibraries = () => {
            attempts++;
            
            // Verificar si tmImage está disponible (puede ser tmImage o tm)
            const tmImageAvailable = typeof tmImage !== 'undefined' || 
                                    (typeof window !== 'undefined' && window.tmImage) ||
                                    (typeof window !== 'undefined' && window.tm);
            
            if (tmImageAvailable) {
                resolve();
            } else if (attempts >= maxAttempts) {
                reject(new Error('Las librerías de Teachable Machine no se cargaron correctamente'));
            } else {
                setTimeout(checkLibraries, 100);
            }
        };
        
        checkLibraries();
    });
}

/**
 * Obtiene la referencia correcta a tmImage
 */
function getTmImage() {
    // Intentar diferentes formas de acceder a la librería
    if (typeof tmImage !== 'undefined') {
        return tmImage;
    } else if (typeof window !== 'undefined' && window.tmImage) {
        return window.tmImage;
    } else if (typeof window !== 'undefined' && window.tm) {
        return window.tm;
    }
    throw new Error('tmImage no está disponible');
}

/**
 * Inicializa la aplicación
 */
async function initApp() {
    try {
        // Esperar a que las librerías se carguen
        await waitForLibraries();
        
        // Preparar imágenes
        appState.allImages = prepareImagesArray();
        
        if (appState.allImages.length === 0) {
            showStatusMessage('No se encontraron imágenes', 'error');
            return;
        }

        // Cargar modelo
        const modelLoaded = await loadModel();
        if (!modelLoaded) {
            return;
        }

        // Inicializar cámara
        const cameraInitialized = await initWebcam();
        if (!cameraInitialized) {
            showStatusMessage('La aplicación funcionará sin cámara', 'warning');
        }

        // Cargar primera imagen
        loadCurrentImage();

        // Iniciar loop de predicción
        if (cameraInitialized) {
            startPredictionLoop();
        }

        // Configurar eventos
        setupEventListeners();

        showStatusMessage('Aplicación lista', 'success');
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        showStatusMessage('Error al inicializar la aplicación: ' + error.message, 'error');
    }
}

/**
 * Configura los event listeners
 */
function setupEventListeners() {
    // Botón siguiente
    elements.btnSiguiente.addEventListener('click', nextImage);

    // Botón pausar
    elements.btnPausar.addEventListener('click', togglePause);

    // Botón reiniciar
    elements.btnReiniciar.addEventListener('click', resetRound);

    // Slider de umbral
    elements.thresholdSlider.addEventListener('input', (e) => {
        appState.confidenceThreshold = parseFloat(e.target.value);
        elements.thresholdValue.textContent = appState.confidenceThreshold.toFixed(2);
    });

    // Manejar errores de carga de imágenes
    elements.currentImage.addEventListener('error', () => {
        showStatusMessage('Error al cargar la imagen', 'error');
    });
}

// ===== INICIO DE LA APLICACIÓN =====
document.addEventListener('DOMContentLoaded', initApp);

// Limpiar recursos al cerrar
window.addEventListener('beforeunload', () => {
    stopWebcam();
    stopPredictionLoop();
});

